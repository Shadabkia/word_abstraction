import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'game_data.db');
const db = new Database(dbPath);

// Fetch all approved groups
const groups = db.prepare("SELECT * FROM groups WHERE status = 'approved' ORDER BY difficulty, id").all();

console.log(`Found ${groups.length} approved groups`);

if (groups.length < 16) {
  console.log('Not enough groups to create even 4 levels (need at least 16 groups)');
  process.exit(0);
}

// Calculate how many levels we can create (4-6 groups per level)
// We'll create levels with varying group counts for variety
const maxLevels = Math.min(Math.floor(groups.length / 4), 10);
console.log(`Will create up to ${maxLevels} levels from ${groups.length} groups`);

// Define 10 levels with hand-picked group combinations
const levels = [
  {
    name: "مرحله ۱ - شروع آسان",
    name_en: "Level 1 - Easy Start",
    difficulty: "easy",
    description: "شروع بازی با دسته‌های ساده",
    status: "published"
  },
  {
    name: "مرحله ۲ - میوه و رنگ",
    name_en: "Level 2 - Fruits & Colors",
    difficulty: "easy",
    description: "ترکیبی از میوه‌ها و رنگ‌ها",
    status: "published"
  },
  {
    name: "مرحله ۳ - حیوانات و طبیعت",
    name_en: "Level 3 - Animals & Nature",
    difficulty: "easy",
    description: "حیوانات و عناصر طبیعی",
    status: "published"
  },
  {
    name: "مرحله ۴ - موسیقی و ورزش",
    name_en: "Level 4 - Music & Sports",
    difficulty: "medium",
    description: "سازها و ورزش‌های مختلف",
    status: "published"
  },
  {
    name: "مرحله ۵ - فرهنگ ایرانی",
    name_en: "Level 5 - Iranian Culture",
    difficulty: "medium",
    description: "شهرها و غذاهای ایرانی",
    status: "published"
  },
  {
    name: "مرحله ۶ - ترکیبی متوسط",
    name_en: "Level 6 - Mixed Medium",
    difficulty: "medium",
    description: "ترکیبی از دسته‌های مختلف",
    status: "draft"
  },
  {
    name: "مرحله ۷ - چالش بدن و علم",
    name_en: "Level 7 - Body & Science",
    difficulty: "hard",
    description: "اعضای بدن و مفاهیم علمی",
    status: "draft"
  },
  {
    name: "مرحله ۸ - ادبیات فارسی",
    name_en: "Level 8 - Persian Literature",
    difficulty: "hard",
    description: "شاعران و آثار ادبی",
    status: "draft"
  },
  {
    name: "مرحله ۹ - تاریخ و میراث",
    name_en: "Level 9 - History & Heritage",
    difficulty: "hard",
    description: "بناهای تاریخی و جشن‌ها",
    status: "draft"
  },
  {
    name: "مرحله ۱۰ - چالش نهایی",
    name_en: "Level 10 - Ultimate Challenge",
    difficulty: "hard",
    description: "سخت‌ترین ترکیب‌ها",
    status: "draft"
  }
];

// Organize groups by difficulty and keywords
const easyGroups = groups.filter(g => g.difficulty === 'easy');
const mediumGroups = groups.filter(g => g.difficulty === 'medium');
const hardGroups = groups.filter(g => g.difficulty === 'hard');

console.log(`Easy: ${easyGroups.length}, Medium: ${mediumGroups.length}, Hard: ${hardGroups.length}`);

// Helper to find groups by relation keywords
function findGroupsByKeyword(groupList, keyword) {
  return groupList.filter(g => 
    g.relation_clean?.includes(keyword) || 
    g.relation_clean_en?.toLowerCase().includes(keyword.toLowerCase())
  );
}

// Create level configurations - distribute groups with varying counts
const levelConfigs = [];
let groupIndex = 0;

// Group count pattern: 4, 4, 5, 6, 4, 5, 6, 7, 5, 6
const groupCounts = [4, 4, 5, 6, 4, 5, 6, 7, 5, 6];

for (let i = 0; i < maxLevels && groupIndex < groups.length; i++) {
  const levelGroups = [];
  const iconIndices = [];
  const targetCount = groupCounts[i] || 4;
  
  // Take groups for this level
  for (let j = 0; j < targetCount && groupIndex < groups.length; j++) {
    levelGroups.push(groups[groupIndex]);
    // Enable icon for icon-capable groups (first 2-3 in each level)
    if (j < Math.min(3, Math.floor(targetCount / 2)) && groups[groupIndex].icon_enabled) {
      iconIndices.push(j);
    }
    groupIndex++;
  }
  
  if (levelGroups.length >= 4) {
    levelConfigs.push({
      ...levels[i],
      groups: levelGroups,
      icons: iconIndices
    });
  }
}

// Insert levels into database
const insertStmt = db.prepare(`
  INSERT INTO levels (name, name_en, description, difficulty, status, group_ids, icon_conversions)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const checkExisting = db.prepare('SELECT COUNT(*) as count FROM levels').get();
if (checkExisting.count > 0) {
  console.log(`Database already has ${checkExisting.count} levels. Clearing old levels...`);
  db.prepare('DELETE FROM levels').run();
}

db.transaction(() => {
  let created = 0;
  let usedGroupIds = new Set();
  
  for (const config of levelConfigs.slice(0, maxLevels)) {
    // Filter out null/undefined groups
    const validGroups = config.groups.filter(g => g && g.id);
    
    if (validGroups.length < 4) {
      console.log(`Skipping ${config.name} - not enough valid groups (${validGroups.length}, need min 4)`);
      continue;
    }
    
    const groupIds = validGroups.map(g => g.id);
    
    // Create icon_conversions object
    const iconConversions = {};
    if (config.icons && config.icons.length > 0) {
      for (const idx of config.icons) {
        const group = validGroups[idx];
        if (group && group.icon_enabled) {
          iconConversions[group.id] = true;
        }
      }
    }
    
    insertStmt.run(
      config.name,
      config.name_en,
      config.description,
      config.difficulty,
      config.status,
      JSON.stringify(groupIds),
      JSON.stringify(iconConversions)
    );
    
    created++;
    console.log(`✓ Created: ${config.name} (${validGroups.length} groups, ${Object.keys(iconConversions).length} icons)`);
  }
  
  console.log(`\n✅ Successfully created ${created} levels!`);
})();

console.log('\nLevels created successfully! You can now:');
console.log('1. View them in the editor at http://localhost:3009/util.html');
console.log('2. Load them in the game (published levels will be available)');

