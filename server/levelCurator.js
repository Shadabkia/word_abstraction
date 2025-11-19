import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { EventEmitter } from 'events';

export class LevelCurator extends EventEmitter {
  constructor(db) {
    super();
    this.db = db;
    this.isRunning = false;
    this.apiKey = null;
    this.llm = null;
    this.timeoutId = null;
    this.metrics = {
      currentBatchId: null,
      levelsGenerated: 0,
      levelsProcessed: 0,
      levelsValidated: 0,
      levelsSaved: 0,
      apiCallsGenerate: 0,
      apiCallsValidate: 0,
      batchStartTime: null,
      errors: []
    };
  }

  log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      source: 'level-curator',
      ...data
    };
    console.log(`[CURATOR][${level.toUpperCase()}] ${message}`, data);
    this.emit('log', logEntry);
  }

  emitMetrics() {
    this.emit('metrics', { ...this.metrics });
  }

  resetBatchMetrics() {
    this.metrics = {
      ...this.metrics,
      currentBatchId: null,
      levelsGenerated: 0,
      levelsProcessed: 0,
      levelsValidated: 0,
      levelsSaved: 0,
      batchStartTime: null
    };
    this.emitMetrics();
  }

  start(apiKey) {
    if (this.isRunning) {
      this.log('warning', 'Level Curator already running');
      return;
    }
    
    if (!apiKey) {
      this.log('error', 'No API key provided to levelCurator.start()');
      throw new Error('API key is required to start the level curator');
    }
    
    this.apiKey = apiKey;
    this.log('info', 'Initializing Level Curator LLM', { 
      keyPrefix: apiKey.substring(0, 7) + '...',
      keyLength: apiKey.length 
    });
    
    // GPT-5 only supports temperature: 1 (default), so we don't specify it
    this.llm = new ChatOpenAI({ 
      apiKey: apiKey,
      modelName: "gpt-5" // Latest and most advanced model
    });
    
    this.isRunning = true;
    this.db.prepare('UPDATE curator_state SET is_running = 1 WHERE id = 1').run();
    this.log('info', '🎮 Level Curator started successfully');
    this.emitMetrics();
    this.loop();
  }

  stop() {
    this.isRunning = false;
    this.db.prepare('UPDATE curator_state SET is_running = 0 WHERE id = 1').run();
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.log('info', '🛑 Level Curator stopped');
    this.emitMetrics();
  }

  async loop() {
    if (!this.isRunning) return;

    try {
      await this.runBatch();
    } catch (error) {
      this.log('error', 'Batch failed', { error: error.message, stack: error.stack });
      this.metrics.errors.push({ timestamp: new Date().toISOString(), message: error.message });
      if (this.metrics.errors.length > 10) this.metrics.errors.shift();
      this.emitMetrics();
    }

    // Wait before next batch
    if (this.isRunning) {
      this.log('info', '⏳ Waiting 10 seconds before next batch...');
      this.timeoutId = setTimeout(() => this.loop(), 10000);
    }
  }

  async runBatch() {
    this.resetBatchMetrics();
    this.metrics.batchStartTime = Date.now();
    
    this.log('info', '═══════════════════════════════════════════════════');
    this.log('info', '🎮 Starting new Level Curation batch...');
    this.log('info', '═══════════════════════════════════════════════════');
    const config = JSON.parse(this.db.prepare('SELECT config FROM curator_state WHERE id = 1').get().config);
    const levelsPerBatch = config.levels_per_batch || 3;
    const groupsPerLevel = config.groups_per_level || 4;
    
    this.log('info', '⚙️  Level Curator configuration loaded', { 
      levelsPerBatch, 
      groupsPerLevel,
      minPlayabilityScore: config.min_playability_score,
      totalWordsPerLevel: groupsPerLevel * 4,
      timestamp: new Date().toLocaleString()
    });

    // 1. Fetch approved word groups to use in levels
    this.log('info', '📚 Step 1: Fetching approved word groups from database...');
    const allGroups = this.db.prepare(`
      SELECT * FROM groups 
      WHERE status = 'approved' 
      ORDER BY quality_score DESC
    `).all();
    
    if (allGroups.length < groupsPerLevel) {
      this.log('error', `❌ Insufficient approved groups!`, {
        found: allGroups.length,
        required: groupsPerLevel,
        message: `Need at least ${groupsPerLevel} approved word groups to create a level`
      });
      return;
    }
    
    this.log('info', `✅ Found ${allGroups.length} approved word groups available for level creation`, {
      totalGroups: allGroups.length,
      requiredPerLevel: groupsPerLevel,
      maxPossibleLevels: Math.floor(allGroups.length / groupsPerLevel),
      status: allGroups.length >= groupsPerLevel * 10 ? 'excellent' : 'sufficient'
    });

    // 2. Fetch existing levels for context
    this.log('info', '📖 Step 2: Fetching existing levels to avoid duplicates...');
    const existingLevels = this.db.prepare(`
      SELECT name, name_en, difficulty, group_ids 
      FROM levels 
      WHERE status = 'published'
      ORDER BY created_at DESC 
      LIMIT 10
    `).all();
    
    this.log('info', `✅ Found ${existingLevels.length} existing published levels for context`, {
      count: existingLevels.length,
      purpose: 'LLM will avoid creating similar levels'
    });

    // Prepare context for LLM
    const groupsContext = allGroups.slice(0, 50).map(g => ({
      id: g.id,
      words_fa: [g.word1_fa, g.word2_fa, g.word3_fa, g.word4_fa],
      words_en: [g.word1_en, g.word2_en, g.word3_en, g.word4_en],
      relation_fa: g.relation_clean,
      relation_en: g.relation_clean_en,
      difficulty: g.difficulty
    }));

    const existingLevelsText = existingLevels.map(l => 
      `Level: ${l.name} (${l.name_en}) - ${l.difficulty} - Groups: ${JSON.parse(l.group_ids).join(',')}`
    ).join('\n');

    // 3. Prompt #1 - Generate Level Proposals
    const prompt1 = `
You are designing levels for a Persian word association game.
Each level contains ${groupsPerLevel} groups of 4 words that players must categorize correctly.

GAME RULES:
- Players see 16 words (4 groups × 4 words)
- Words are shuffled randomly
- Players must identify which 4 words belong to each group
- The level is "finishable" if all words can be correctly categorized
- Groups should be distinct enough that there's minimal ambiguity
- Groups should be fun and interesting to solve

AVAILABLE WORD GROUPS (top 50 by quality):
${JSON.stringify(groupsContext, null, 2)}

EXISTING LEVELS (avoid duplicating these):
${existingLevelsText}

Generate ${levelsPerBatch} NEW level proposals. For each level:
1. Select ${groupsPerLevel} groups that work well together (not too similar, not too different)
2. Ensure the combination is solvable and unambiguous
3. Choose a creative level name in Persian and English
4. Assign a difficulty based on word complexity and potential ambiguity

Output format: JSON array of levels
[
  {
    "name": "Persian level name",
    "name_en": "English level name",
    "difficulty": "easy|medium|hard",
    "group_ids": [id1, id2, id3, id4],
    "reasoning": "Why these groups work well together",
    "ambiguity_notes": "Any potential confusion points"
  }
]

IMPORTANT: Only use group IDs from the available groups list above.
    `;

    this.log('info', '🤖 Step 3: Calling LLM to generate level proposals...');
    this.log('info', `📊 Requesting ${levelsPerBatch} creative level designs from GPT-5`);
    this.metrics.apiCallsGenerate++;
    this.emitMetrics();
    
    const genStartTime = Date.now();
    const response1 = await this.llm.invoke([
      new SystemMessage("You are an expert game level designer for Persian word puzzles."),
      new HumanMessage(prompt1)
    ]);
    const genElapsed = ((Date.now() - genStartTime) / 1000).toFixed(2);

    // Parse the response
    const jsonStr = response1.content.replace(/```json/g, '').replace(/```/g, '').trim();
    let levelProposals;
    try {
      levelProposals = JSON.parse(jsonStr);
      if (!Array.isArray(levelProposals)) {
        throw new Error('Response is not an array');
      }
    } catch (e) {
      this.log('error', '❌ Failed to parse level proposals JSON', { 
        error: e.message, 
        responseLength: jsonStr.length,
        responsePreview: jsonStr.substring(0, 200) 
      });
      throw new Error('Invalid JSON response from LLM');
    }

    this.metrics.levelsGenerated = levelProposals.length;
    this.log('info', `✅ LLM generated ${levelProposals.length} level proposals in ${genElapsed}s`, {
      count: levelProposals.length,
      requested: levelsPerBatch,
      elapsedSeconds: genElapsed,
      successRate: `${((levelProposals.length / levelsPerBatch) * 100).toFixed(0)}%`
    });
    this.emitMetrics();

    // Record Batch
    const batchRes = this.db.prepare('INSERT INTO curator_batches (level_count) VALUES (?)').run(levelProposals.length);
    const batchId = batchRes.lastInsertRowid;
    this.metrics.currentBatchId = batchId;
    this.log('info', `📝 Created curator batch record in database`, { 
      batchId, 
      timestamp: new Date().toISOString() 
    });
    this.emitMetrics();

    // 4. Validate each level
    this.log('info', '═══════════════════════════════════════════════════');
    this.log('info', `🔍 Step 4: Starting validation phase for ${levelProposals.length} level proposals...`);
    this.log('info', `⚡ Each level will be validated for playability and clarity by LLM`);
    this.log('info', '═══════════════════════════════════════════════════');
    let savedCount = 0;
    
    for (let i = 0; i < levelProposals.length; i++) {
      const proposal = levelProposals[i];
      
      if (!this.isRunning) {
        this.log('warning', 'Level Curator stopped during validation');
        break;
      }

      this.metrics.levelsProcessed++;
      this.emitMetrics();
      
      this.log('debug', `🎮 [${i + 1}/${levelProposals.length}] Processing: "${proposal.name}" (${proposal.name_en})`, { 
        name: proposal.name,
        difficulty: proposal.difficulty,
        groupCount: proposal.group_ids?.length,
        progress: `${((i / levelProposals.length) * 100).toFixed(0)}%`
      });

      // Basic validation
      if (!proposal.group_ids || proposal.group_ids.length !== groupsPerLevel) {
        this.log('warning', `Invalid level proposal ${i + 1}: incorrect number of groups`, {
          expected: groupsPerLevel,
          got: proposal.group_ids?.length
        });
        continue;
      }

      // Check if all group IDs exist
      const groups = proposal.group_ids.map(id => 
        this.db.prepare('SELECT * FROM groups WHERE id = ?').get(id)
      );

      if (groups.some(g => !g)) {
        this.log('warning', `Invalid level proposal ${i + 1}: some group IDs don't exist`, {
          groupIds: proposal.group_ids
        });
        continue;
      }

      // Check for duplicates
      const existingLevel = this.db.prepare(`
        SELECT COUNT(*) as c FROM levels 
        WHERE group_ids = ?
      `).get(JSON.stringify(proposal.group_ids)).c;

      if (existingLevel > 0) {
        this.log('debug', `Skipping duplicate level ${i + 1}`);
        continue;
      }

      // Prompt #2 - Validate the level design
      const wordsForValidation = groups.map(g => ({
        persian: [g.word1_fa, g.word2_fa, g.word3_fa, g.word4_fa],
        english: [g.word1_en, g.word2_en, g.word3_en, g.word4_en],
        relation_fa: g.relation_clean,
        relation_en: g.relation_clean_en
      }));

      const prompt2 = `
Validate this level design for a Persian word puzzle game:

LEVEL: ${proposal.name} (${proposal.name_en})
DIFFICULTY: ${proposal.difficulty}

GROUPS IN THIS LEVEL:
${JSON.stringify(wordsForValidation, null, 2)}

VALIDATION CRITERIA:
1. Are all 16 words (4 groups × 4 words) clearly categorizable?
2. Is there minimal ambiguity between groups?
3. Could a player reasonably solve this without frustration?
4. Are the groups distinct enough?
5. Are any words too similar across different groups?
6. Is the level name appropriate and engaging?

Respond in JSON ONLY:
{
  "valid": true/false,
  "playability_score": 1-10,
  "ambiguity_issues": "description of any problems or 'none'",
  "suggested_improvements": "recommendations or 'none'",
  "final_difficulty": "easy|medium|hard"
}
      `;

      try {
        this.log('debug', `🔍 Validating level ${i + 1}: ${proposal.name}`);
        this.metrics.apiCallsValidate++;
        this.emitMetrics();
        
        const res2 = await this.llm.invoke([
          new SystemMessage("You are a strict game level validator. Output JSON only."),
          new HumanMessage(prompt2)
        ]);
        
        const validationJsonStr = res2.content.replace(/```json/g, '').replace(/```/g, '').trim();
        const validation = JSON.parse(validationJsonStr);

        this.metrics.levelsValidated++;
        
        this.log('debug', `✅ [${i + 1}] Validation passed`, {
          valid: validation.valid,
          playability: `${validation.playability_score}/10`,
          difficulty: validation.final_difficulty,
          ambiguity: validation.ambiguity_issues === 'none' ? 'clean' : 'has issues'
        });

        if (validation.valid && validation.playability_score >= config.min_playability_score) {
          // Save the level
          const result = this.db.prepare(`
            INSERT INTO levels (
              name, name_en, difficulty, group_ids, 
              status, playability_score, ambiguity_notes, 
              manual_notes, tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            proposal.name,
            proposal.name_en,
            validation.final_difficulty,
            JSON.stringify(proposal.group_ids),
            'draft', // New levels start as draft
            validation.playability_score,
            validation.ambiguity_issues,
            JSON.stringify({
              ai_reasoning: proposal.reasoning,
              ai_suggestions: validation.suggested_improvements,
              source_batch_id: batchId
            }),
            JSON.stringify([])
          );

          savedCount++;
          this.metrics.levelsSaved++;
          
          this.log('info', `✅ Saved level ${i + 1}: "${proposal.name}"`, {
            levelId: result.lastInsertRowid,
            playability: validation.playability_score,
            difficulty: validation.final_difficulty,
            groups: proposal.group_ids.length
          });
        } else {
          this.log('debug', `Level ${i + 1} rejected: ${validation.valid ? 'low playability' : 'invalid'}`, {
            playability: validation.playability_score,
            minRequired: config.min_playability_score,
            issues: validation.ambiguity_issues
          });
        }
        
        this.emitMetrics();
      } catch (e) {
        this.log('error', `Validation error for level ${i + 1}`, { 
          error: e.message,
          levelName: proposal.name
        });
        this.metrics.errors.push({ 
          timestamp: new Date().toISOString(), 
          message: `Validation error: ${e.message}`,
          level: i + 1
        });
        if (this.metrics.errors.length > 10) this.metrics.errors.shift();
        this.emitMetrics();
      }
    }

    const elapsed = ((Date.now() - this.metrics.batchStartTime) / 1000).toFixed(1);
    this.db.prepare('UPDATE curator_batches SET saved_count = ?, finished_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(savedCount, batchId);
    
    this.log('info', '═══════════════════════════════════════════════════');
    this.log('info', `🎉 Level Curator batch ${batchId} COMPLETED!`, { 
      saved: savedCount,
      generated: levelProposals.length,
      processed: this.metrics.levelsProcessed,
      validated: this.metrics.levelsValidated,
      elapsedSeconds: elapsed
    });
    this.log('info', `📊 Success Rate: ${savedCount}/${levelProposals.length} (${((savedCount / levelProposals.length) * 100).toFixed(1)}%)`);
    this.log('info', `⏱️  Total Time: ${elapsed}s | Avg: ${(elapsed / levelProposals.length).toFixed(2)}s per level`);
    this.log('info', `💾 ${savedCount} playable levels saved to database (status: draft)`);
    this.log('info', '═══════════════════════════════════════════════════');
    this.emitMetrics();
  }
}

