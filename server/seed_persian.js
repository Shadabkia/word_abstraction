import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'game_data.db');
const db = new Database(dbPath);

// Persian seed groups - Persian word abstraction game
const seedGroups = [
  // Easy Categories - آسان
  {
    words: [
      { fa: "سیب", en: "Apple", finglish: "sib" },
      { fa: "موز", en: "Banana", finglish: "moz" },
      { fa: "پرتقال", en: "Orange", finglish: "porteqal" },
      { fa: "انگور", en: "Grape", finglish: "angur" }
    ],
    relation_fa: "میوه‌ها",
    relation_en: "Fruits",
    difficulty: "easy",
    icon_enabled: true,
    icon_label: "میوه",
    icon_emoji: "🍎"
  },
  {
    words: [
      { fa: "قرمز", en: "Red", finglish: "qermez" },
      { fa: "آبی", en: "Blue", finglish: "abi" },
      { fa: "سبز", en: "Green", finglish: "sabz" },
      { fa: "زرد", en: "Yellow", finglish: "zard" }
    ],
    relation_fa: "رنگ‌ها",
    relation_en: "Colors",
    difficulty: "easy",
    icon_enabled: true,
    icon_label: "رنگ",
    icon_emoji: "🎨"
  },
  {
    words: [
      { fa: "ماشین", en: "Car", finglish: "mashin" },
      { fa: "اتوبوس", en: "Bus", finglish: "otobus" },
      { fa: "دوچرخه", en: "Bicycle", finglish: "docharkheh" },
      { fa: "قطار", en: "Train", finglish: "qatar" }
    ],
    relation_fa: "وسایل نقلیه",
    relation_en: "Vehicles",
    difficulty: "easy",
    icon_enabled: true,
    icon_label: "وسیله نقلیه",
    icon_emoji: "🚗"
  },
  {
    words: [
      { fa: "پیانو", en: "Piano", finglish: "piano" },
      { fa: "گیتار", en: "Guitar", finglish: "gitar" },
      { fa: "تار", en: "Tar", finglish: "tar" },
      { fa: "سنتور", en: "Santoor", finglish: "santur" }
    ],
    relation_fa: "سازهای موسیقی",
    relation_en: "Musical Instruments",
    difficulty: "easy",
    icon_enabled: true,
    icon_label: "ساز",
    icon_emoji: "🎵"
  },
  {
    words: [
      { fa: "شیر", en: "Lion", finglish: "shir" },
      { fa: "پلنگ", en: "Leopard", finglish: "palang" },
      { fa: "خرس", en: "Bear", finglish: "khers" },
      { fa: "گرگ", en: "Wolf", finglish: "gorg" }
    ],
    relation_fa: "حیوانات وحشی",
    relation_en: "Wild Animals",
    difficulty: "easy",
    icon_enabled: true,
    icon_label: "حیوان",
    icon_emoji: "🦁"
  },
  {
    words: [
      { fa: "پیراهن", en: "Shirt", finglish: "pirahan" },
      { fa: "شلوار", en: "Pants", finglish: "shalvar" },
      { fa: "جوراب", en: "Socks", finglish: "jurab" },
      { fa: "کلاه", en: "Hat", finglish: "kolah" }
    ],
    relation_fa: "لباس",
    relation_en: "Clothing",
    difficulty: "easy",
    icon_enabled: true,
    icon_label: "لباس",
    icon_emoji: "👕"
  },
  {
    words: [
      { fa: "زمین", en: "Earth", finglish: "zamin" },
      { fa: "مریخ", en: "Mars", finglish: "merrikh" },
      { fa: "مشتری", en: "Jupiter", finglish: "moshtari" },
      { fa: "زهره", en: "Venus", finglish: "zohreh" }
    ],
    relation_fa: "سیارات",
    relation_en: "Planets",
    difficulty: "easy",
    icon_enabled: true,
    icon_label: "سیاره",
    icon_emoji: "🪐"
  },
  {
    words: [
      { fa: "رز", en: "Rose", finglish: "roz" },
      { fa: "لاله", en: "Tulip", finglish: "laleh" },
      { fa: "مریم", en: "Daisy", finglish: "maryam" },
      { fa: "آفتابگردان", en: "Sunflower", finglish: "aftabgardan" }
    ],
    relation_fa: "گل‌ها",
    relation_en: "Flowers",
    difficulty: "easy",
    icon_enabled: true,
    icon_label: "گل",
    icon_emoji: "🌹"
  },
  {
    words: [
      { fa: "فوتبال", en: "Football", finglish: "futbal" },
      { fa: "تنیس", en: "Tennis", finglish: "tenis" },
      { fa: "والیبال", en: "Volleyball", finglish: "valibal" },
      { fa: "بسکتبال", en: "Basketball", finglish: "basketbal" }
    ],
    relation_fa: "ورزش‌ها",
    relation_en: "Sports",
    difficulty: "easy",
    icon_enabled: true,
    icon_label: "ورزش",
    icon_emoji: "⚽"
  },
  {
    words: [
      { fa: "صندلی", en: "Chair", finglish: "sandali" },
      { fa: "میز", en: "Table", finglish: "miz" },
      { fa: "کاناپه", en: "Sofa", finglish: "kanapeh" },
      { fa: "تخت", en: "Bed", finglish: "takht" }
    ],
    relation_fa: "مبلمان",
    relation_en: "Furniture",
    difficulty: "easy",
    icon_enabled: true,
    icon_label: "مبل",
    icon_emoji: "🪑"
  },

  // Medium Categories - متوسط
  {
    words: [
      { fa: "دکتر", en: "Doctor", finglish: "doktor" },
      { fa: "معلم", en: "Teacher", finglish: "moalem" },
      { fa: "مهندس", en: "Engineer", finglish: "mohandes" },
      { fa: "پرستار", en: "Nurse", finglish: "parastar" }
    ],
    relation_fa: "مشاغل",
    relation_en: "Professions",
    difficulty: "medium",
    icon_enabled: false
  },
  {
    words: [
      { fa: "تهران", en: "Tehran", finglish: "tehran" },
      { fa: "شیراز", en: "Shiraz", finglish: "shiraz" },
      { fa: "اصفهان", en: "Isfahan", finglish: "esfahan" },
      { fa: "مشهد", en: "Mashhad", finglish: "mashhad" }
    ],
    relation_fa: "شهرهای ایران",
    relation_en: "Iranian Cities",
    difficulty: "medium",
    icon_enabled: true,
    icon_label: "شهر",
    icon_emoji: "🏙️"
  },
  {
    words: [
      { fa: "کوه", en: "Mountain", finglish: "kuh" },
      { fa: "دریا", en: "Sea", finglish: "darya" },
      { fa: "رودخانه", en: "River", finglish: "rudkhaneh" },
      { fa: "دشت", en: "Plain", finglish: "dasht" }
    ],
    relation_fa: "عوارض طبیعی",
    relation_en: "Natural Features",
    difficulty: "medium",
    icon_enabled: false
  },
  {
    words: [
      { fa: "بهار", en: "Spring", finglish: "bahar" },
      { fa: "تابستان", en: "Summer", finglish: "tabestan" },
      { fa: "پاییز", en: "Autumn", finglish: "paiz" },
      { fa: "زمستان", en: "Winter", finglish: "zemestan" }
    ],
    relation_fa: "فصل‌ها",
    relation_en: "Seasons",
    difficulty: "easy",
    icon_enabled: true,
    icon_label: "فصل",
    icon_emoji: "🍂"
  },
  {
    words: [
      { fa: "شمال", en: "North", finglish: "shomal" },
      { fa: "جنوب", en: "South", finglish: "jonub" },
      { fa: "شرق", en: "East", finglish: "sharq" },
      { fa: "غرب", en: "West", finglish: "gharb" }
    ],
    relation_fa: "جهات اصلی",
    relation_en: "Cardinal Directions",
    difficulty: "easy",
    icon_enabled: false
  },
  {
    words: [
      { fa: "طلا", en: "Gold", finglish: "tala" },
      { fa: "نقره", en: "Silver", finglish: "noqreh" },
      { fa: "برنز", en: "Bronze", finglish: "bronze" },
      { fa: "مس", en: "Copper", finglish: "mes" }
    ],
    relation_fa: "فلزات",
    relation_en: "Metals",
    difficulty: "medium",
    icon_enabled: false
  },
  {
    words: [
      { fa: "قلب", en: "Heart", finglish: "qalb" },
      { fa: "کبد", en: "Liver", finglish: "kabed" },
      { fa: "ریه", en: "Lung", finglish: "riyeh" },
      { fa: "کلیه", en: "Kidney", finglish: "koliyeh" }
    ],
    relation_fa: "اعضای بدن",
    relation_en: "Body Organs",
    difficulty: "medium",
    icon_enabled: false
  },
  {
    words: [
      { fa: "کتاب", en: "Book", finglish: "ketab" },
      { fa: "دفتر", en: "Notebook", finglish: "daftar" },
      { fa: "مداد", en: "Pencil", finglish: "medad" },
      { fa: "خودکار", en: "Pen", finglish: "khodkar" }
    ],
    relation_fa: "لوازم تحریر",
    relation_en: "Stationery",
    difficulty: "easy",
    icon_enabled: true,
    icon_label: "لوازم تحریر",
    icon_emoji: "📝"
  },

  // Hard Categories - سخت
  {
    words: [
      { fa: "فردوسی", en: "Ferdowsi", finglish: "ferdowsi" },
      { fa: "حافظ", en: "Hafez", finglish: "hafez" },
      { fa: "سعدی", en: "Saadi", finglish: "saadi" },
      { fa: "مولوی", en: "Rumi", finglish: "molavi" }
    ],
    relation_fa: "شاعران ایرانی",
    relation_en: "Persian Poets",
    difficulty: "hard",
    icon_enabled: false
  },
  {
    words: [
      { fa: "شاهنامه", en: "Shahnameh", finglish: "shahnameh" },
      { fa: "دیوان", en: "Divan", finglish: "divan" },
      { fa: "گلستان", en: "Golestan", finglish: "golestan" },
      { fa: "مثنوی", en: "Masnavi", finglish: "masnavi" }
    ],
    relation_fa: "آثار ادبی",
    relation_en: "Literary Works",
    difficulty: "hard",
    icon_enabled: false
  },
  {
    words: [
      { fa: "چلوکباب", en: "Chelo Kabab", finglish: "chelokabab" },
      { fa: "قرمه‌سبزی", en: "Ghormeh Sabzi", finglish: "qormehsabzi" },
      { fa: "فسنجان", en: "Fesenjan", finglish: "fesenjan" },
      { fa: "زرشک پلو", en: "Zereshk Polo", finglish: "zereshkpolo" }
    ],
    relation_fa: "غذاهای ایرانی",
    relation_en: "Iranian Dishes",
    difficulty: "medium",
    icon_enabled: true,
    icon_label: "غذا",
    icon_emoji: "🍲"
  },
  {
    words: [
      { fa: "نوروز", en: "Nowruz", finglish: "nowruz" },
      { fa: "یلدا", en: "Yalda", finglish: "yalda" },
      { fa: "چهارشنبه‌سوری", en: "Chaharshanbe Suri", finglish: "chaharshanbehsuri" },
      { fa: "سیزده‌بدر", en: "Sizdah Bedar", finglish: "sizdahbedar" }
    ],
    relation_fa: "جشن‌های ایرانی",
    relation_en: "Iranian Festivals",
    difficulty: "hard",
    icon_enabled: false
  },
  {
    words: [
      { fa: "تخت جمشید", en: "Persepolis", finglish: "takhtejamshid" },
      { fa: "میدان نقش جهان", en: "Naqsh-e Jahan Square", finglish: "meydaneqashejahan" },
      { fa: "برج آزادی", en: "Azadi Tower", finglish: "borjeazadi" },
      { fa: "ارگ بم", en: "Arg-e Bam", finglish: "argebam" }
    ],
    relation_fa: "بناهای تاریخی",
    relation_en: "Historical Sites",
    difficulty: "hard",
    icon_enabled: false
  },
  {
    words: [
      { fa: "سه‌تار", en: "Setar", finglish: "setar" },
      { fa: "دف", en: "Daf", finglish: "daf" },
      { fa: "نی", en: "Ney", finglish: "ney" },
      { fa: "کمانچه", en: "Kamancheh", finglish: "kamancheh" }
    ],
    relation_fa: "سازهای سنتی",
    relation_en: "Traditional Instruments",
    difficulty: "medium",
    icon_enabled: true,
    icon_label: "ساز سنتی",
    icon_emoji: "🎻"
  },
  {
    words: [
      { fa: "یوز", en: "Cheetah", finglish: "yuz" },
      { fa: "پلنگ", en: "Panther", finglish: "palang" },
      { fa: "قوچ", en: "Ram", finglish: "quch" },
      { fa: "آهو", en: "Gazelle", finglish: "ahu" }
    ],
    relation_fa: "حیوانات بومی",
    relation_en: "Native Animals",
    difficulty: "hard",
    icon_enabled: true,
    icon_label: "حیوان بومی",
    icon_emoji: "🐆"
  },
  {
    words: [
      { fa: "پسته", en: "Pistachio", finglish: "pesteh" },
      { fa: "بادام", en: "Almond", finglish: "badam" },
      { fa: "گردو", en: "Walnut", finglish: "gerdu" },
      { fa: "فندق", en: "Hazelnut", finglish: "fenduq" }
    ],
    relation_fa: "آجیل",
    relation_en: "Nuts",
    difficulty: "easy",
    icon_enabled: true,
    icon_label: "آجیل",
    icon_emoji: "🥜"
  }
];

console.log(`Seeding ${seedGroups.length} Persian groups...`);

const insertStmt = db.prepare(`
  INSERT INTO groups (
    word1_fa, word2_fa, word3_fa, word4_fa,
    word1_en, word2_en, word3_en, word4_en,
    word1_finglish, word2_finglish, word3_finglish, word4_finglish,
    relation_clean, relation_clean_en, difficulty,
    icon_enabled, icon_label, icon_emoji,
    status, quality_score, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', 10, CURRENT_TIMESTAMP)
`);

const checkStmt = db.prepare('SELECT COUNT(*) as count FROM groups WHERE word1_fa = ? AND word2_fa = ?');

db.transaction(() => {
  let added = 0;
  for (const g of seedGroups) {
    const exists = checkStmt.get(g.words[0].fa, g.words[1].fa).count > 0;
    if (!exists) {
      insertStmt.run(
        g.words[0].fa, g.words[1].fa, g.words[2].fa, g.words[3].fa,
        g.words[0].en, g.words[1].en, g.words[2].en, g.words[3].en,
        g.words[0].finglish, g.words[1].finglish, g.words[2].finglish, g.words[3].finglish,
        g.relation_fa, g.relation_en, g.difficulty,
        g.icon_enabled ? 1 : 0, g.icon_label || null, g.icon_emoji || null
      );
      added++;
    }
  }
  console.log(`Added ${added} new Persian groups.`);
})();

console.log('Persian seed data complete!');

