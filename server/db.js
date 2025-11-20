import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'game_data.db');

const db = new Database(dbPath, { verbose: console.log });

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

export function initDb() {
  // Groups Table - Now with Persian support
  db.exec(`
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      -- Persian words (primary)
      word1_fa TEXT NOT NULL,
      word2_fa TEXT NOT NULL,
      word3_fa TEXT NOT NULL,
      word4_fa TEXT NOT NULL,
      -- English translations
      word1_en TEXT,
      word2_en TEXT,
      word3_en TEXT,
      word4_en TEXT,
      -- Finglish (Persian written in English)
      word1_finglish TEXT,
      word2_finglish TEXT,
      word3_finglish TEXT,
      word4_finglish TEXT,
      -- Relation/Category info
      relation_raw TEXT,
      relation_clean TEXT,
      relation_clean_en TEXT,
      difficulty_raw TEXT,
      difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard', 'unknown')) DEFAULT 'unknown',
      clarity_score INTEGER,
      interest_score INTEGER,
      quality_score REAL,
      status TEXT DEFAULT 'generated' CHECK(status IN ('generated', 'validated', 'rejected', 'approved', 'used_in_level')),
      tags TEXT DEFAULT '[]',
      -- Icon support
      icon_enabled BOOLEAN DEFAULT 0,
      icon_label TEXT,
      icon_emoji TEXT,
      icon_name TEXT,
      source_batch_id INTEGER,
      manual_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Batches Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS batches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      finished_at DATETIME,
      prompt_config_snapshot TEXT,
      candidate_count INTEGER DEFAULT 0,
      saved_count INTEGER DEFAULT 0
    )
  `);

  // Levels Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS levels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      name_en TEXT,
      description TEXT,
      difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
      group_ids TEXT, -- JSON array of IDs
      icon_conversions TEXT DEFAULT '{}', -- JSON object mapping group_id to boolean (should convert to icon)
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      manual_notes TEXT,
      tags TEXT DEFAULT '[]',
      playability_score INTEGER,
      ambiguity_notes TEXT
    )
  `);

  // Process State Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS process_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      is_running BOOLEAN DEFAULT 0,
      last_batch_id INTEGER,
      last_run_at DATETIME,
      config TEXT, -- JSON
      api_key TEXT -- Encrypted/stored API key
    )
  `);

  // Initialize process state if not exists
  const state = db.prepare('SELECT * FROM process_state WHERE id = 1').get();
  if (!state) {
    const defaultConfig = JSON.stringify({
      batch_size: 50,
      min_quality_score: 7,
      max_groups: 10000,
      difficulty_distribution: { easy: 30, medium: 40, hard: 30 }
    });
    db.prepare('INSERT INTO process_state (id, is_running, config) VALUES (1, 0, ?)').run(defaultConfig);
  }

  // Curator Batches Table - for tracking level curation runs
  db.exec(`
    CREATE TABLE IF NOT EXISTS curator_batches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      finished_at DATETIME,
      level_count INTEGER DEFAULT 0,
      saved_count INTEGER DEFAULT 0
    )
  `);

  // Curator State Table - separate state for level curator
  db.exec(`
    CREATE TABLE IF NOT EXISTS curator_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      is_running BOOLEAN DEFAULT 0,
      last_batch_id INTEGER,
      last_run_at DATETIME,
      config TEXT -- JSON
    )
  `);

  // Initialize curator state if not exists
  const curatorState = db.prepare('SELECT * FROM curator_state WHERE id = 1').get();
  if (!curatorState) {
    const defaultCuratorConfig = JSON.stringify({
      levels_per_batch: 3,
      groups_per_level: 4,
      min_playability_score: 7,
      difficulty_distribution: { easy: 30, medium: 40, hard: 30 }
    });
    db.prepare('INSERT INTO curator_state (id, is_running, config) VALUES (1, 0, ?)').run(defaultCuratorConfig);
  }

  // Migration: Add api_key column if it doesn't exist
  try {
    const columns = db.prepare("PRAGMA table_info(process_state)").all();
    const hasApiKey = columns.some(col => col.name === 'api_key');
    if (!hasApiKey) {
      db.exec('ALTER TABLE process_state ADD COLUMN api_key TEXT');
      console.log('Migration: Added api_key column to process_state table');
    }
  } catch (e) {
    console.error('Migration error:', e);
  }
}

export default db;

