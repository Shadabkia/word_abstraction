import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'game_data.db');

const db = new Database(dbPath);

console.log('Running migration: Add icon_name column to groups table...');

try {
  // Check if column already exists
  const tableInfo = db.prepare('PRAGMA table_info(groups)').all();
  const hasIconName = tableInfo.some(col => col.name === 'icon_name');
  
  if (hasIconName) {
    console.log('✅ Column icon_name already exists. Skipping migration.');
  } else {
    // Add the column
    db.prepare('ALTER TABLE groups ADD COLUMN icon_name TEXT').run();
    console.log('✅ Successfully added icon_name column to groups table.');
  }
  
  console.log('\nMigration complete!');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
} finally {
  db.close();
}


