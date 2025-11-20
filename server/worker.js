import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { EventEmitter } from 'events';

export class Worker extends EventEmitter {
  constructor(db) {
    super();
    this.db = db;
    this.isRunning = false;
    this.apiKey = null;
    this.llm = null;
    this.timeoutId = null;
    this.metrics = {
      currentBatchId: null,
      candidatesGenerated: 0,
      candidatesProcessed: 0,
      candidatesValidated: 0,
      candidatesSaved: 0,
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
      source: 'word-generator',
      ...data
    };
    console.log(`[WORD-GEN][${level.toUpperCase()}] ${message}`, data);
    this.emit('log', logEntry);
  }

  emitMetrics() {
    this.emit('metrics', { ...this.metrics });
  }

  resetBatchMetrics() {
    this.metrics = {
      ...this.metrics,
      currentBatchId: null,
      candidatesGenerated: 0,
      candidatesProcessed: 0,
      candidatesValidated: 0,
      candidatesSaved: 0,
      batchStartTime: null
    };
    this.emitMetrics();
  }

  start(apiKey) {
    if (this.isRunning) {
      this.log('warning', 'Worker already running');
      return;
    }
    
    if (!apiKey) {
      this.log('error', 'No API key provided to worker.start()');
      throw new Error('API key is required to start the worker');
    }
    
    this.apiKey = apiKey;
    this.log('info', 'Initializing LLM with API key', { 
      keyPrefix: apiKey.substring(0, 7) + '...',
      keyLength: apiKey.length 
    });
    
    // Initialize ChatOpenAI - the parameter name is just 'apiKey' in newer versions
    // GPT-5 only supports temperature: 1 (default), so we don't specify it
    this.llm = new ChatOpenAI({ 
      apiKey: apiKey,
      modelName: "gpt-5" // Latest and most advanced model
    });
    
    this.isRunning = true;
    this.db.prepare('UPDATE process_state SET is_running = 1 WHERE id = 1').run();
    this.log('info', 'Worker started successfully');
    this.emitMetrics();
    this.loop();
  }

  stop() {
    this.isRunning = false;
    this.db.prepare('UPDATE process_state SET is_running = 0 WHERE id = 1').run();
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.log('info', 'Worker stopped');
    this.emitMetrics();
  }

  async loop() {
    if (!this.isRunning) return;

    try {
      await this.runBatch();
    } catch (error) {
      this.log('error', 'Batch failed', { error: error.message, stack: error.stack });
      this.metrics.errors.push({ timestamp: new Date().toISOString(), message: error.message });
      if (this.metrics.errors.length > 10) this.metrics.errors.shift(); // Keep last 10 errors
      this.emitMetrics();
    }

    // Wait a bit before next batch to avoid rate limits and busy loop
    if (this.isRunning) {
      this.log('info', 'Waiting 5 seconds before next batch...');
      this.timeoutId = setTimeout(() => this.loop(), 5000);
    }
  }

  async runBatch() {
    this.resetBatchMetrics();
    this.metrics.batchStartTime = Date.now();
    
    this.log('info', '═══════════════════════════════════════════════════');
    this.log('info', '🚀 Starting new Word Generation batch...');
    this.log('info', '═══════════════════════════════════════════════════');
    const config = JSON.parse(this.db.prepare('SELECT config FROM process_state WHERE id = 1').get().config);
    const batchSize = config.batch_size || 20;
    this.log('info', '⚙️  Configuration loaded', { 
      batchSize, 
      minQuality: config.min_quality_score,
      timestamp: new Date().toLocaleString()
    });

    // 1. Fetch examples
    this.log('info', '📚 Step 1: Fetching approved examples for LLM context...');
    const examples = this.db.prepare(`
      SELECT word1_fa, word2_fa, word3_fa, word4_fa, relation_clean 
      FROM groups 
      WHERE status = 'approved' 
      ORDER BY RANDOM() LIMIT 10
    `).all();
    this.log('info', `✅ Found ${examples.length} high-quality example groups to guide generation`, { 
      exampleCount: examples.length,
      status: examples.length >= 5 ? 'sufficient' : 'limited'
    });

    const exampleText = examples.map(g => 
      `${g.word1_fa}, ${g.word2_fa}, ${g.word3_fa}, ${g.word4_fa} -> ${g.relation_clean}`
    ).join('\n');

    // 2. Prompt #1 - Generate
    const prompt1 = `
You are helping design a Persian word association game (بازی ترکیب کلمات فارسی).
Each puzzle uses groups of 4 Persian words that share a meaningful relation.
A relation should be something that can be expressed in 1–3 Persian words.

Examples of accepted groups (DO NOT repeat these):
${exampleText}

Generate ${batchSize} NEW candidate groups of 4 distinct Persian words each.
Constraints:
* Each group must be coherent and culturally relevant to Persian/Iranian context
* Mix relation types: semantic, functional, conceptual, abstract
* Avoid obscure words - use common Persian vocabulary
* For EACH word, provide: Persian text, English translation, and Finglish (Persian written in Latin script)

Output format: CSV, one group per line with this structure:
word1_fa, word1_en, word1_finglish, word2_fa, word2_en, word2_finglish, word3_fa, word3_en, word3_finglish, word4_fa, word4_en, word4_finglish, relation_fa, relation_en, difficulty_raw, notes_raw

Example line:
سیب, Apple, sib, موز, Banana, moz, پرتقال, Orange, porteqal, انگور, Grape, angur, میوه‌ها, Fruits, easy, Common fruits

Do not output headers.
    `;

    this.log('info', '🤖 Step 2: Calling LLM to generate word group candidates...');
    this.log('info', `📊 Requesting ${batchSize} new word groups from GPT-5`);
    this.metrics.apiCallsGenerate++;
    this.emitMetrics();
    
    const genStartTime = Date.now();
    const response1 = await this.llm.invoke([
      new SystemMessage("You are a creative Persian puzzle designer."),
      new HumanMessage(prompt1)
    ]);
    const genElapsed = ((Date.now() - genStartTime) / 1000).toFixed(2);

    const candidates = response1.content.trim().split('\n')
      .map(line => line.split(',').map(s => s.trim()))
      .filter(row => row.length >= 14); // Need at least 14 fields for Persian format

    this.metrics.candidatesGenerated = candidates.length;
    this.log('info', `✅ LLM generated ${candidates.length} word group candidates in ${genElapsed}s`, { 
      count: candidates.length,
      requested: batchSize,
      elapsedSeconds: genElapsed,
      successRate: `${((candidates.length / batchSize) * 100).toFixed(0)}%`
    });
    this.emitMetrics();

    // Record Batch
    const batchRes = this.db.prepare('INSERT INTO batches (candidate_count) VALUES (?)').run(candidates.length);
    const batchId = batchRes.lastInsertRowid;
    this.metrics.currentBatchId = batchId;
    this.log('info', `📝 Created batch record in database`, { batchId, timestamp: new Date().toISOString() });
    this.emitMetrics();

    // 3. Validate Loop
    this.log('info', '═══════════════════════════════════════════════════');
    this.log('info', `🔍 Step 3: Starting validation phase for ${candidates.length} candidates...`);
    this.log('info', `⚡ Each candidate will be validated by LLM for quality and correctness`);
    this.log('info', '═══════════════════════════════════════════════════');
    let savedCount = 0;
    for (let i = 0; i < candidates.length; i++) {
      const row = candidates[i];
      if (!this.isRunning) {
        this.log('warning', 'Worker stopped during validation');
        break;
      }
      if (row.length < 14) {
        this.log('warning', `Skipping malformed candidate ${i + 1}`, { fields: row.length });
        continue;
      }
      
      this.metrics.candidatesProcessed++;
      this.emitMetrics();
      
      // Parse new format: w1_fa, w1_en, w1_finglish, w2_fa, w2_en, w2_finglish, ...
      const [
        w1_fa, w1_en, w1_finglish,
        w2_fa, w2_en, w2_finglish,
        w3_fa, w3_en, w3_finglish,
        w4_fa, w4_en, w4_finglish,
        relRaw, relEn, diffRaw, notes
      ] = row;
      
      this.log('debug', `🔎 [${i + 1}/${candidates.length}] Processing: ${w1_fa}, ${w2_fa}, ${w3_fa}, ${w4_fa}`, { 
        words: `${w1_fa}, ${w2_fa}, ${w3_fa}, ${w4_fa}`,
        relation: relRaw,
        progress: `${((i / candidates.length) * 100).toFixed(0)}%`
      });
      
      // Check dupes roughly
      const exists = this.db.prepare(`
        SELECT COUNT(*) as c FROM groups 
        WHERE (word1_fa=? AND word2_fa=?) OR (word1_fa=? AND word2_fa=?)
      `).get(w1_fa, w2_fa, w3_fa, w4_fa).c > 0; // Simplistic dupe check
      
      if (exists) {
        this.log('debug', `Skipping duplicate candidate ${i + 1}`);
        continue;
      }

      // Prompt #2 - Validate
      const prompt2 = `
Validate this Persian word group (گروه کلمات فارسی):
Words (Persian): ${w1_fa}, ${w2_fa}, ${w3_fa}, ${w4_fa}
Words (English): ${w1_en}, ${w2_en}, ${w3_en}, ${w4_en}
Proposed Relation (Persian): ${relRaw}
Proposed Relation (English): ${relEn}

1. Decide if these 4 Persian words share a single clear, non-ambiguous relation
2. Verify the English translations are accurate
3. Verify the Finglish transcriptions (${w1_finglish}, ${w2_finglish}, ${w3_finglish}, ${w4_finglish}) are reasonable
4. Normalize relation to 1-2 Persian words if needed
5. Rate clarity (1-5) and interest (1-5)

Respond in JSON ONLY:
{
  "valid": true/false,
  "relation_clean": "normalized Persian relation",
  "relation_clean_en": "English translation of relation",
  "difficulty": "easy|medium|hard",
  "clarity_score": 1-5,
  "interest_score": 1-5,
  "notes_refined": "brief explanation"
}
      `;

      try {
        this.metrics.apiCallsValidate++;
        this.emitMetrics();
        
        const res2 = await this.llm.invoke([
           new SystemMessage("You are a strict validator for Persian word puzzles. Output JSON only."),
           new HumanMessage(prompt2)
        ]);
        
        // Cleanup JSON (sometimes LLMs add markdown blocks)
        const jsonStr = res2.content.replace(/```json/g, '').replace(/```/g, '').trim();
        const validation = JSON.parse(jsonStr);

        this.metrics.candidatesValidated++;
        
        if (validation.valid) {
          const quality = validation.clarity_score + validation.interest_score;
          this.log('debug', `✅ [${i + 1}] Validation passed`, { 
            valid: true, 
            quality: `${quality}/10`,
            clarity: validation.clarity_score,
            interest: validation.interest_score,
            difficulty: validation.difficulty,
            minRequired: config.min_quality_score
          });
          
          if (quality >= config.min_quality_score) {
            this.db.prepare(`
              INSERT INTO groups (
                word1_fa, word2_fa, word3_fa, word4_fa,
                word1_en, word2_en, word3_en, word4_en,
                word1_finglish, word2_finglish, word3_finglish, word4_finglish,
                relation_raw, relation_clean, relation_clean_en,
                difficulty_raw, difficulty,
                clarity_score, interest_score, quality_score,
                status, source_batch_id, manual_notes,
                icon_enabled, icon_name
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
              w1_fa, w2_fa, w3_fa, w4_fa,
              w1_en, w2_en, w3_en, w4_en,
              w1_finglish, w2_finglish, w3_finglish, w4_finglish,
              relRaw || '', validation.relation_clean, validation.relation_clean_en || relEn,
              diffRaw || '', validation.difficulty,
              validation.clarity_score, validation.interest_score, quality,
              'generated', batchId, validation.notes_refined,
              0, // icon_enabled defaults to false for generated groups
              null // icon_name defaults to null for generated groups
            );
            savedCount++;
            this.metrics.candidatesSaved++;
            this.log('info', `✅ Saved candidate ${i + 1}`, { 
              words: `${w1_fa}, ${w2_fa}, ${w3_fa}, ${w4_fa}`,
              relation: validation.relation_clean,
              quality
            });
          } else {
            this.log('debug', `Candidate ${i + 1} quality too low (${quality} < ${config.min_quality_score})`);
          }
        } else {
          this.log('debug', `Candidate ${i + 1} marked invalid by validator`);
        }
        this.emitMetrics();
      } catch (e) {
        this.log('error', `Validation error for candidate ${i + 1}`, { 
          error: e.message,
          words: `${w1_fa}, ${w2_fa}, ${w3_fa}, ${w4_fa}`
        });
        this.metrics.errors.push({ 
          timestamp: new Date().toISOString(), 
          message: `Validation error: ${e.message}`,
          candidate: i + 1
        });
        if (this.metrics.errors.length > 10) this.metrics.errors.shift();
        this.emitMetrics();
      }
    }

    const elapsed = ((Date.now() - this.metrics.batchStartTime) / 1000).toFixed(1);
    this.db.prepare('UPDATE batches SET saved_count = ?, finished_at = CURRENT_TIMESTAMP WHERE id = ?').run(savedCount, batchId);
    
    this.log('info', '═══════════════════════════════════════════════════');
    this.log('info', `🎉 Batch ${batchId} COMPLETED!`, { 
      saved: savedCount,
      generated: candidates.length,
      processed: this.metrics.candidatesProcessed,
      validated: this.metrics.candidatesValidated,
      elapsedSeconds: elapsed
    });
    this.log('info', `📊 Success Rate: ${savedCount}/${candidates.length} (${((savedCount / candidates.length) * 100).toFixed(1)}%)`);
    this.log('info', `⏱️  Total Time: ${elapsed}s | Avg: ${(elapsed / candidates.length).toFixed(2)}s per candidate`);
    this.log('info', `💾 ${savedCount} high-quality word groups saved to database`);
    this.log('info', '═══════════════════════════════════════════════════');
    this.emitMetrics();
  }
}

