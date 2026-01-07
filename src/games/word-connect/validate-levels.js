import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants for error types
const ERROR_MISSING_INGREDIENTS = "MISSING_INGREDIENTS";
const ERROR_LEFTOVER_TILES = "LEFTOVER_TILES";
const ERROR_UNSOLVABLE_DEADLOCK = "UNSOLVABLE_DEADLOCK";
const SUCCESS = "SUCCESS";

class Counter {
    constructor(iterable = []) {
        this.counts = new Map();
        if (iterable) {
            for (const item of iterable) {
                this.add(item);
            }
        }
    }

    add(item, count = 1) {
        this.counts.set(item, (this.counts.get(item) || 0) + count);
    }

    get(item) {
        return this.counts.get(item) || 0;
    }

    update(iterable) {
        for (const item of iterable) {
            this.add(item);
        }
    }

    subtract(otherCounter) {
        for (const [item, count] of otherCounter.counts) {
            this.counts.set(item, (this.counts.get(item) || 0) - count);
        }
    }
    
    diff(otherCounter) {
        const result = new Counter();
        const allKeys = new Set([...this.keys(), ...otherCounter.keys()]);
        for (const key of allKeys) {
            const val = this.get(key) - otherCounter.get(key);
            if (val !== 0) result.counts.set(key, val);
        }
        return result;
    }

    keys() {
        return this.counts.keys();
    }

    entries() {
        return this.counts.entries();
    }

    copy() {
        const newCounter = new Counter();
        newCounter.counts = new Map(this.counts);
        return newCounter;
    }
    
    isSubset(otherCounter) {
         for (const [item, count] of otherCounter.counts) {
             if (this.get(item) < count) return false;
         }
         return true;
    }
    
    elements() {
        const result = [];
        for (const [item, count] of this.counts) {
            for (let i = 0; i < count; i++) {
                result.push(item);
            }
        }
        return result.sort();
    }
}

class LevelValidator {
    constructor(levelPath, options = {}) {
        this.levelPath = levelPath;
        this.data = null;
        this.valid = true;
        this.verbose = options.verbose || false;
        this.report = {
            status: "VALID",
            level_id: "unknown",
            file: path.basename(levelPath),
            stats: {},
            solution_path: [],
            details: {},
            checks: []
        };

        try {
            const fileContent = fs.readFileSync(levelPath, 'utf8');
            this.data = JSON.parse(fileContent);
            if (this.data.meta && this.data.meta.id) {
                this.report.level_id = this.data.meta.id;
            }
        } catch (e) {
            this.valid = false;
            this.report.status = "INVALID";
            this.report.error_layer = "LOAD";
            this.report.message = e.message;
        }
    }

    _log(checkName, status, details = null) {
        const check = { name: checkName, status };
        if (details) check.details = details;
        this.report.checks.push(check);
        
        if (this.verbose) {
            const symbol = status === "PASS" ? "✓" : "✗";
            console.log(`  ${symbol} ${checkName}${details ? `: ${JSON.stringify(details)}` : ""}`);
        }
    }

    validate() {
        if (!this.data) return this.report;

        // Rule 1-4: Static integrity (IDs, grid dimensions, group sizes)
        if (!this._checkStaticIntegrity()) {
            this.report.status = "INVALID";
            this.report.error_layer = "SCHEMA";
            return this.report;
        }
        
        // Rule 5: Word count validation (multiple of 4, minimum count)
        if (!this._checkWordCount()) {
            this.report.status = "INVALID";
            this.report.error_layer = "WORD_COUNT";
            return this.report;
        }
        
        // Rule 6: Chain reaction prevention
        if (!this._checkChainReactions()) {
            this.report.status = "INVALID";
            this.report.error_layer = "CONSTRAINT";
            return this.report;
        }

        // Rule 7: Reveal tiles should be bridges (reused by other groups)
        if (!this._checkRevealBridges()) {
            this.report.status = "INVALID";
            this.report.error_layer = "REVEAL_BRIDGE";
            return this.report;
        }

        // Rule 8: Economy (no missing/leftover tiles)
        const economyResult = this._checkEconomy();
        if (economyResult !== SUCCESS) {
            this.report.status = "INVALID";
            this.report.error_layer = "ECONOMY";
            this.report.message = economyResult;
            return this.report;
        }

        // Rule 9: Solvability simulation
        const [simulationResult, history, stats] = this._simulate();
        if (simulationResult !== SUCCESS) {
            this.report.status = "INVALID";
            this.report.error_layer = "SIMULATION";
            this.report.message = simulationResult;
            return this.report;
        }

        this.report.stats = stats;
        this.report.solution_path = history;
        return this.report;
    }

    _checkStaticIntegrity() {
        const dictionary = this.data.dictionary || {};
        const tiles = dictionary.tiles || [];
        const mechanics = this.data.mechanics || {};
        const groups = mechanics.groups || [];
        const layout = this.data.layout || {};
        
        // Check: Unique tile IDs
        const ids = tiles.map(t => t.id);
        const idSet = new Set(ids);
        if (ids.length !== idSet.size) {
            const counts = new Counter(ids);
            const duplicates = [];
            for (const [id, count] of counts.entries()) {
                if (count > 1) duplicates.push(id);
            }
            this._log("Unique tile IDs", "FAIL", { duplicates });
            this.report.message = "Duplicate IDs in dictionary";
            this.report.details = { duplicates };
            return false;
        }
        this._log("Unique tile IDs", "PASS", { count: ids.length });

        const knownIds = idSet;

        // Check: All grid IDs exist in dictionary
        const grid = layout.initial_grid || [];
        const flatGrid = grid.flat();
        const gridIds = new Set(flatGrid);

        for (const tid of flatGrid) {
            if (tid && !knownIds.has(tid)) {
                this._log("Grid ID references", "FAIL", { unknown_id: tid });
                this.report.message = `Unknown ID in grid: ${tid}`;
                return false;
            }
        }
        this._log("Grid ID references", "PASS");

        // Check: All trigger and reveal IDs exist in dictionary
        for (const group of groups) {
            const triggerIds = group.requirements?.trigger_ids || [];
            for (const tid of triggerIds) {
                if (!knownIds.has(tid)) {
                    this._log("Trigger ID references", "FAIL", { group: group.id, unknown_id: tid });
                    this.report.message = `Unknown ID in triggers: ${tid} (Group: ${group.id})`;
                    return false;
                }
            }

            const revealIds = group.outcomes?.reveal_ids || [];
            for (const tid of revealIds) {
                if (!knownIds.has(tid)) {
                    this._log("Reveal ID references", "FAIL", { group: group.id, unknown_id: tid });
                    this.report.message = `Unknown ID in reveals: ${tid} (Group: ${group.id})`;
                    return false;
                }
            }
        }
        this._log("Trigger/Reveal ID references", "PASS");

        // Check: Grid dimensions match declared rows/cols
        if (grid.length !== layout.rows) {
            this._log("Grid dimensions", "FAIL", { actual_rows: grid.length, expected_rows: layout.rows });
            this.report.message = `Grid rows (${grid.length}) != meta.rows (${layout.rows})`;
            return false;
        }
        
        for (let i = 0; i < grid.length; i++) {
            if (grid[i].length !== layout.cols) {
                this._log("Grid dimensions", "FAIL", { row: i, actual_cols: grid[i].length, expected_cols: layout.cols });
                this.report.message = `Row ${i} length (${grid[i].length}) != meta.cols (${layout.cols})`;
                return false;
            }
        }
        this._log("Grid dimensions", "PASS", { rows: layout.rows, cols: layout.cols });

        // Check: Group structure (trigger/reveal counts)
        const targetSize = layout.cols || 4;
        for (const group of groups) {
            const behavior = group.behavior;
            const revealIds = group.outcomes?.reveal_ids || [];
            const triggerIds = group.requirements?.trigger_ids || [];

            if (behavior === "transform" && revealIds.length === 0) {
                this._log("Group structure", "FAIL", { group: group.id, issue: "transform without reveals" });
                this.report.message = `Transform rule has no reveals: ${group.id}`;
                return false;
            }
            if (behavior === "final" && revealIds.length > 0) {
                this._log("Group structure", "FAIL", { group: group.id, issue: "final with reveals" });
                this.report.message = `Final rule has reveals: ${group.id}`;
                return false;
            }

            if (triggerIds.length !== targetSize) {
                this._log("Group structure", "FAIL", { group: group.id, actual: triggerIds.length, expected: targetSize });
                this.report.message = `Rule members length (${triggerIds.length}) != ${targetSize}: ${group.id}`;
                return false;
            }

            if (behavior === "transform" && revealIds.length !== targetSize) {
                this._log("Group structure", "FAIL", { group: group.id, actual: revealIds.length, expected: targetSize });
                this.report.message = `Rule reveals length (${revealIds.length}) != ${targetSize}: ${group.id}`;
                return false;
            }

            // NEW CHECK: Transform groups must have a meta_group tile
            if (behavior === "transform") {
                const hasMetaGroup = revealIds.some(id => {
                    const tile = tiles.find(t => t.id === id);
                    return tile && tile.type === 'meta_group';
                });
                
                if (!hasMetaGroup) {
                    this._log("Group structure", "FAIL", { 
                        group: group.id, 
                        issue: "transform missing meta_group tile in reveals" 
                    });
                    this.report.message = `Transform group '${group.id}' must have a meta_group tile in reveal_ids (game requirement)`;
                    this.report.details = {
                        group: group.id,
                        reveal_ids: revealIds,
                        issue: "No tile with type='meta_group' found in reveals",
                        fix: "Add one meta_group tile (icon) to the reveal_ids array"
                    };
                    return false;
                }
            }
        }
        this._log("Group structure", "PASS", { groups: groups.length, group_size: targetSize });

        return true;
    }

    _checkWordCount() {
        const grid = this.data.layout.initial_grid;
        const flatGrid = grid.flat();
        const totalWords = flatGrid.length;
        const uniqueWords = new Set(flatGrid).size;

        // Rule: Total word count must be a multiple of 4
        if (totalWords % 4 !== 0) {
            this._log("Word count (multiple of 4)", "FAIL", { total: totalWords, remainder: totalWords % 4 });
            this.report.message = `Total word count (${totalWords}) is not a multiple of 4`;
            this.report.details = { 
                total_words: totalWords,
                expected: "multiple of 4"
            };
            return false;
        }
        this._log("Word count (multiple of 4)", "PASS", { total: totalWords });

        // Rule: Minimum word count should be at least 12
        if (totalWords < 12) {
            this._log("Word count (minimum 12)", "FAIL", { total: totalWords, minimum: 12 });
            this.report.message = `Total word count (${totalWords}) is less than minimum (12)`;
            this.report.details = { 
                total_words: totalWords,
                minimum: 12
            };
            return false;
        }
        this._log("Word count (minimum 12)", "PASS", { total: totalWords });

        // Rule: Unique words in initial grid must be at least 12
        if (uniqueWords < 12) {
            // Find duplicates
            const seen = {};
            flatGrid.forEach(tile => {
                seen[tile] = (seen[tile] || 0) + 1;
            });
            const duplicates = Object.entries(seen)
                .filter(([_, count]) => count > 1)
                .map(([tile, count]) => `${tile} (${count}x)`);
            
            this._log("Unique words in grid", "FAIL", { 
                unique: uniqueWords, 
                total: totalWords,
                duplicates: totalWords - uniqueWords
            });
            
            this.report.message = `Only ${uniqueWords} unique words in initial grid (minimum: 12)`;
            this.report.details = { 
                unique_words: uniqueWords,
                total_cells: totalWords,
                minimum_unique: 12,
                duplicate_tiles: duplicates
            };
            return false;
        }
        this._log("Unique words in grid", "PASS", { unique: uniqueWords });

        return true;
    }

    _checkRevealBridges() {
        const groups = this.data.mechanics.groups;
        const transformGroups = groups.filter(g => g.behavior === "transform");
        
        // Skip check if no transform groups
        if (transformGroups.length === 0) {
            this._log("Reveal bridges", "SKIP", { reason: "no transform groups" });
            return true;
        }

        const grid = this.data.layout.initial_grid;
        const flatGrid = grid.flat();
        const initialTiles = new Set(flatGrid);

        let totalReveals = 0;
        let bridgeReveals = 0;

        for (const tGroup of transformGroups) {
            const revealIds = tGroup.outcomes?.reveal_ids || [];
            
            for (const revealId of revealIds) {
                // Skip if already in initial grid (those are OK)
                if (initialTiles.has(revealId)) {
                    continue;
                }

                totalReveals++;

                // Check if this revealed tile is used by any other group
                let isUsedByOtherGroup = false;
                for (const otherGroup of groups) {
                    if (otherGroup.id === tGroup.id) continue;
                    
                    const triggers = otherGroup.requirements?.trigger_ids || [];
                    if (triggers.includes(revealId)) {
                        isUsedByOtherGroup = true;
                        bridgeReveals++;
                        break;
                    }
                }

                if (!isUsedByOtherGroup) {
                    // Log as warning instead of error (design guideline, not hard requirement)
                    this._log("Reveal bridges", "WARN", { 
                        group: tGroup.id, 
                        orphaned_reveal: revealId,
                        note: "Design guideline - revealed tiles should be reused"
                    });
                    
                    if (!this.report.details.warnings) {
                        this.report.details.warnings = [];
                    }
                    this.report.details.warnings.push(
                        `Revealed tile '${revealId}' from '${tGroup.id}' is not reused (not a bridge)`
                    );
                }
            }
        }

        this._log("Reveal bridges", "PASS", { 
            transform_groups: transformGroups.length, 
            bridge_reveals: bridgeReveals 
        });
        return true;
    }

    _checkChainReactions() {
        const groups = this.data.mechanics.groups;
        const transformGroups = groups.filter(g => g.behavior === "transform");
        
        if (transformGroups.length === 0) {
            this._log("Chain reaction prevention", "SKIP", { reason: "no transform groups" });
            return true;
        }

        for (const tGroup of transformGroups) {
            const revealed = new Set(tGroup.outcomes?.reveal_ids || []);
            if (revealed.size === 0) continue;

            for (const otherGroup of groups) {
                if (tGroup.id === otherGroup.id) continue;
                
                const triggers = new Set(otherGroup.requirements?.trigger_ids || []);
                if (triggers.size === 0) continue;

                // Constraint: Revealed tiles must not form a complete trigger set for another group
                // This prevents instant auto-matches upon transformation
                if ([...triggers].every(id => revealed.has(id))) {
                    this._log("Chain reaction prevention", "FAIL", {
                        source: tGroup.id,
                        target: otherGroup.id
                    });
                    this.report.message = `Constraint Violation: Group '${tGroup.id}' reveals exactly the triggers for '${otherGroup.id}'. This causes an instant auto-match which is bad design.`;
                    this.report.details = {
                        source_group: tGroup.id,
                        target_group: otherGroup.id,
                        problematic_tiles: [...triggers]
                    };
                    return false;
                }
            }
        }
        
        this._log("Chain reaction prevention", "PASS", { transform_groups: transformGroups.length });
        return true;
    }

    _checkEconomy() {
        const grid = this.data.layout.initial_grid;
        const flatGrid = grid.flat();
        const availableTiles = new Counter(flatGrid);

        const producedTiles = new Counter();
        const groups = this.data.mechanics.groups;
        
        for (const group of groups) {
            if (group.behavior === "transform") {
                const reveals = group.outcomes?.reveal_ids || [];
                producedTiles.update(reveals);
            }
        }

        const consumedTiles = new Counter();
        for (const group of groups) {
            const members = group.requirements?.trigger_ids || [];
            consumedTiles.update(members);
        }

        const totalIn = availableTiles.copy();
        totalIn.update(producedTiles.elements());
        
        const balance = totalIn.diff(consumedTiles);
        
        const missing = {};
        const leftover = {};

        for (const [k, v] of balance.entries()) {
            if (v < 0) missing[k] = v;
            else if (v > 0) leftover[k] = v;
        }

        const available = flatGrid.length;
        const produced = producedTiles.elements().length;
        const consumed = consumedTiles.elements().length;

        if (Object.keys(missing).length > 0) {
            this._log("Tile economy", "FAIL", { 
                issue: "missing tiles",
                available, 
                produced, 
                consumed 
            });
            this.report.details = { missing_tiles: Object.entries(missing).map(([k, v]) => `${k} (${v})`) };
            return ERROR_MISSING_INGREDIENTS;
        }

        if (Object.keys(leftover).length > 0) {
            this._log("Tile economy", "FAIL", { 
                issue: "leftover tiles",
                available, 
                produced, 
                consumed 
            });
            this.report.details = { orphaned_tiles: Object.entries(leftover).map(([k, v]) => `${k} (${v})`) };
            return ERROR_LEFTOVER_TILES;
        }

        this._log("Tile economy", "PASS", { available, produced, consumed, balanced: true });
        return SUCCESS;
    }

    _simulate() {
        const grid = this.data.layout.initial_grid;
        const initialBag = grid.flat().sort();
        
        const queue = [{ bag: initialBag, history: [] }];
        const visitedStates = new Set();
        visitedStates.add(JSON.stringify(initialBag));

        const groups = this.data.mechanics.groups;
        const rules = groups.map(group => ({
            id: group.id,
            name: group.display_name || group.id,
            type: group.behavior,
            members: (group.requirements?.trigger_ids || []).sort(),
            reveals: (group.outcomes?.reveal_ids || []).sort()
        }));

        const initialBagCounter = new Counter(initialBag);
        this.report.details.warnings = [];
        
        // Rule: Check for initial matches (warning only, design guideline)
        const noInitialMatchesConstraint = this.data.meta?.constraints?.no_initial_matches;
        let hasInitialMatches = false;
        for (const rule of rules) {
            const ruleCounter = new Counter(rule.members);
            if (initialBagCounter.isSubset(ruleCounter)) {
                const warningMsg = `Initial state contains match for ${rule.name}`;
                this.report.details.warnings.push(warningMsg);
                hasInitialMatches = true;
            }
        }
        
        if (hasInitialMatches && noInitialMatchesConstraint) {
            this._log("No initial matches", "WARN", { 
                constraint_set: true, 
                note: "Design guideline - not enforced as error" 
            });
        } else if (!hasInitialMatches) {
            this._log("No initial matches", "PASS");
        }

        let transformCount = 0;
        let finalCount = 0;
        rules.forEach(r => {
            if (r.type === "transform") transformCount++;
            if (r.type === "final") finalCount++;
        });

        while (queue.length > 0) {
            const { bag, history } = queue.shift();

            if (bag.length === 0) {
                const stats = {
                    grid: `${this.data.layout.rows}x${this.data.layout.cols}`,
                    words: this.data.dictionary.tiles.length,
                    transforms: transformCount,
                    finals: finalCount,
                    complexity: visitedStates.size,
                    min_steps: history.length
                };
                this._log("Solvability", "PASS", { 
                    steps: history.length, 
                    states_explored: visitedStates.size 
                });
                return [SUCCESS, history, stats];
            }

            const currentBagCounter = new Counter(bag);
            const possibleMoves = [];

            for (const rule of rules) {
                const ruleCounter = new Counter(rule.members);
                if (currentBagCounter.isSubset(ruleCounter)) {
                    possibleMoves.push(rule);
                }
            }

            if (possibleMoves.length === 0 && bag.length > 0) {
                continue; 
            }

            for (const move of possibleMoves) {
                const newBagCounter = currentBagCounter.copy();
                newBagCounter.subtract(new Counter(move.members));
                
                if (move.type === "transform") {
                    newBagCounter.update(move.reveals);
                }

                const newBag = newBagCounter.elements();
                const newStateSignature = JSON.stringify(newBag);

                if (!visitedStates.has(newStateSignature)) {
                    visitedStates.add(newStateSignature);
                    const moveName = `${move.type.charAt(0).toUpperCase() + move.type.slice(1)}: ${move.name}`;
                    const moveEntry = { id: move.id, description: moveName };
                    queue.push({ bag: newBag, history: [...history, moveEntry] });
                }
            }
        }

        this._log("Solvability", "FAIL", { 
            issue: "no solution found", 
            states_explored: visitedStates.size 
        });
        return [ERROR_UNSOLVABLE_DEADLOCK, [], {}];
    }

    printTrace(history) {
        console.log(`\nTrace for ${this.report.file}:`);
        const grid = this.data.layout.initial_grid;
        let bag = grid.flat().sort();
        
        const formatBag = (b) => {
            // Format into rows of 4 for readability
            const rows = [];
            for (let i = 0; i < b.length; i += 4) {
                rows.push(b.slice(i, i + 4).join(", "));
            }
            return rows.map(r => `  [ ${r} ]`).join("\n");
        };

        console.log("Initial State:");
        console.log(formatBag(bag));

        const groups = this.data.mechanics.groups;
        const ruleMap = new Map(groups.map(g => [g.id, g]));

        history.forEach((step, index) => {
            const rule = ruleMap.get(step.id);
            console.log(`\nStep ${index + 1}: ${step.description}`);
            console.log(`  Trigger: [${rule.requirements.trigger_ids.join(', ')}]`);
            if (rule.behavior === 'transform') {
                console.log(`  Reveal:  [${rule.outcomes.reveal_ids.join(', ')}]`);
            }

            // Apply move
            const bagCounter = new Counter(bag);
            bagCounter.subtract(new Counter(rule.requirements.trigger_ids));
            if (rule.behavior === 'transform') {
                bagCounter.update(rule.outcomes.reveal_ids);
            }
            bag = bagCounter.elements();

            console.log("State:");
            console.log(formatBag(bag));
        });
        
        if (bag.length === 0) {
            console.log("\nResult: CLEARED");
        } else {
            console.log("\nResult: REMAINING TILES", bag);
        }
    }
}

function validateMeta(metaPath) {
    try {
        const content = fs.readFileSync(metaPath, 'utf8');
        const data = JSON.parse(content);
        
        if (!data.id || !data.name || !Array.isArray(data.levels)) {
            return { valid: false, message: "Missing required fields (id, name, levels array)" };
        }

        // Verify levels exist
        const dir = path.dirname(metaPath);
        const missing = [];
        for (const lvl of data.levels) {
            if (!fs.existsSync(path.join(dir, lvl))) {
                missing.push(lvl);
            }
        }

        if (missing.length > 0) {
            return { valid: false, message: `Missing level files: ${missing.join(', ')}` };
        }

        return { valid: true, levelCount: data.levels.length, name: data.name };
    } catch (e) {
        return { valid: false, message: e.message };
    }
}

function main() {
    const args = process.argv.slice(2);
    const jsonOutput = args.includes('--json');
    const trace = args.includes('--trace');
    const verbose = args.includes('--verbose') || args.includes('-v');
    
    const specificLevel = args.find(arg => arg.startsWith('--level='))?.split('=')[1];
    const specificChapter = args.find(arg => arg.startsWith('--chapter='))?.split('=')[1];

    const levelsDir = path.join(__dirname, 'data/levels');
    
    function findFiles(dir) {
        let results = [];
        if (!fs.existsSync(dir)) return results;
        
        const list = fs.readdirSync(dir);
        for (const file of list) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                results = results.concat(findFiles(filePath));
            } else {
                if (file.endsWith('.json') && !file.includes('index') && !file.includes('types') && !file.includes('meta')) {
                    results.push(filePath);
                }
            }
        }
        return results;
    }

    let files = findFiles(levelsDir).sort();
    
    if (specificLevel) {
        files = files.filter(f => path.basename(f) === `${specificLevel}.json` || path.basename(f) === specificLevel);
    }
    
    let chapterMetaFiles = [];
    if (specificChapter) {
        files = files.filter(f => f.includes(`chapter${specificChapter}`) || f.includes(specificChapter));
        // Find meta for this chapter
        const metaPath = path.join(levelsDir, `chapter${specificChapter}`, 'meta.json');
        if (fs.existsSync(metaPath)) chapterMetaFiles.push(metaPath);
    } else {
        // Validate all meta files found in subdirectories
        const dirs = fs.readdirSync(levelsDir).filter(f => fs.statSync(path.join(levelsDir, f)).isDirectory());
        for (const dir of dirs) {
            const metaPath = path.join(levelsDir, dir, 'meta.json');
            if (fs.existsSync(metaPath)) chapterMetaFiles.push(metaPath);
        }
    }
    
    let allValid = true;
    const reports = [];
    const metaReports = [];

    if (!jsonOutput) {
        if (chapterMetaFiles.length > 0) {
             console.log("\n=== CHAPTERS ===");
             for (const metaPath of chapterMetaFiles) {
                 const res = validateMeta(metaPath);
                 const chapterName = path.basename(path.dirname(metaPath));
                 if (res.valid) {
                     console.log(`📘 ${chapterName}: ${res.name} (${res.levelCount} levels) ✅`);
                 } else {
                     console.log(`📕 ${chapterName}: INVALID - ${res.message} ❌`);
                     allValid = false;
                 }
                 metaReports.push({ file: metaPath, ...res });
             }
        }
        console.log("\n=== LEVELS ===");
    } else {
        // JSON output for meta checks
        for (const metaPath of chapterMetaFiles) {
             const res = validateMeta(metaPath);
             if (!res.valid) allValid = false;
             metaReports.push({ file: metaPath, ...res });
        }
    }

    for (const filePath of files) {
        if (verbose && !jsonOutput) {
            console.log(`\nValidating: ${path.basename(filePath)}`);
        }
        const validator = new LevelValidator(filePath, { verbose: verbose && !jsonOutput });
        const report = validator.validate();
        reports.push(report);

        if (report.status !== "VALID") {
            allValid = false;
        }

        if (!jsonOutput) {
            const name = path.basename(filePath);
            if (report.status === "VALID") {
                const s = report.stats;
                console.log(`✅ ${name.padEnd(15)} [${s.grid}, ${s.words}w] Trans: ${s.transforms}, Final: ${s.finals}, Steps: ${s.min_steps}`);
                if (trace) {
                    validator.printTrace(report.solution_path);
                }
            } else {
                console.log(`❌ ${name}: ${report.message || 'Unknown Error'}`);
                if (report.details && Object.keys(report.details).length > 0) {
                    console.log(`   Details: ${JSON.stringify(report.details)}`);
                }
            }
        }
    }

    if (jsonOutput) {
        console.log(JSON.stringify({ meta: metaReports, levels: reports }, null, 2));
        process.exit(allValid ? 0 : 1);
    }

    console.log("\n" + "=".repeat(30));
    if (allValid) {
        console.log("ALL VALID");
        process.exit(0);
    } else {
        console.log("VALIDATION FAILED");
        process.exit(1);
    }
}

main();