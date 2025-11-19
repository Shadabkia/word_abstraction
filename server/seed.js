import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'game_data.db');
const db = new Database(dbPath);

const seedGroups = [
  // Easy / Common Categories
  { w: ["Apple", "Banana", "Cherry", "Date"], r: "Fruits", d: "easy" },
  { w: ["Red", "Blue", "Green", "Yellow"], r: "Primary/Standard Colors", d: "easy" },
  { w: ["Car", "Bus", "Bike", "Train"], r: "Modes of Transport", d: "easy" },
  { w: ["Piano", "Guitar", "Drums", "Violin"], r: "Musical Instruments", d: "easy" },
  { w: ["Lion", "Tiger", "Bear", "Wolf"], r: "Wild Animals", d: "easy" },
  { w: ["Shirt", "Pants", "Socks", "Hat"], r: "Clothing Items", d: "easy" },
  { w: ["Mars", "Venus", "Jupiter", "Saturn"], r: "Planets", d: "easy" },
  { w: ["Rose", "Tulip", "Daisy", "Sunflower"], r: "Flowers", d: "easy" },
  { w: ["Football", "Tennis", "Golf", "Hockey"], r: "Sports", d: "easy" },
  { w: ["Chair", "Table", "Sofa", "Bed"], r: "Furniture", d: "easy" },
  
  // Medium - Homophones, compound words, shared characteristics
  { w: ["Bass", "Fluke", "Perch", "Sole"], r: "Types of Fish", d: "medium" },
  { w: ["Date", "Palm", "Sole", "Ball"], r: "Words with Multiple Meanings", d: "medium" },
  { w: ["Star", "Bucks", "Play", "Boy"], r: "Words following 'Super'", d: "medium" },
  { w: ["Key", "Mouse", "Monitor", "Screen"], r: "Computer Parts", d: "easy" },
  { w: ["Diamond", "Heart", "Club", "Spade"], r: "Card Suits", d: "easy" },
  { w: ["Spring", "Summer", "Fall", "Winter"], r: "Seasons", d: "easy" },
  { w: ["North", "South", "East", "West"], r: "Cardinal Directions", d: "easy" },
  { w: ["Gold", "Silver", "Bronze", "Platinum"], r: "Precious Metals", d: "easy" },
  { w: ["Rock", "Paper", "Scissors", "Shoot"], r: "Hand Game Moves", d: "easy" },
  { w: ["King", "Queen", "Jack", "Ace"], r: "Face Cards", d: "easy" },

  // Pop Culture
  { w: ["Iron Man", "Hulk", "Thor", "Captain America"], r: "Avengers", d: "medium" },
  { w: ["Harry", "Hermione", "Ron", "Draco"], r: "Harry Potter Characters", d: "medium" },
  { w: ["Luke", "Leia", "Han", "Chewbacca"], r: "Star Wars Rebels", d: "medium" },
  { w: ["Rachel", "Monica", "Phoebe", "Joey"], r: "Friends Characters", d: "medium" },
  { w: ["John", "Paul", "George", "Ringo"], r: "The Beatles", d: "medium" },

  // Wordplay & Tricky
  { w: ["Band", "Grand", "Up", "Mother"], r: "Words before 'Stand'", d: "hard" },
  { w: ["Hot", "Cross", "Bun", "Buns"], r: "Nursery Rhyme Words", d: "hard" },
  { w: ["Phone", "Book", "Fire", "Wall"], r: "Compound words ending in common nouns", d: "hard" },
  { w: ["Tooth", "Hair", "Paint", "Sage"], r: "Types of Brushes", d: "hard" },
  { w: ["Bat", "Ball", "Base", "Glove"], r: "Baseball Equipment", d: "easy" },

  // Nature & Science
  { w: ["Root", "Stem", "Leaf", "Flower"], r: "Parts of a Plant", d: "easy" },
  { w: ["Solid", "Liquid", "Gas", "Plasma"], r: "States of Matter", d: "medium" },
  { w: ["Igneous", "Sedimentary", "Metamorphic", "Magma"], r: "Rock Cycle", d: "medium" },
  { w: ["Electron", "Proton", "Neutron", "Nucleus"], r: "Atom Parts", d: "medium" },
  { w: ["Femur", "Tibia", "Fibula", "Humerus"], r: "Bones", d: "hard" },

  // Food & Drink
  { w: ["Latte", "Cappuccino", "Espresso", "Mocha"], r: "Coffee Drinks", d: "easy" },
  { w: ["Chardonnay", "Merlot", "Pinot", "Cabernet"], r: "Wine Varietals", d: "medium" },
  { w: ["Basil", "Oregano", "Thyme", "Rosemary"], r: "Herbs", d: "medium" },
  { w: ["Cheddar", "Brie", "Gouda", "Swiss"], r: "Cheeses", d: "easy" },
  { w: ["Rare", "Medium", "Well", "Blue"], r: "Steak Doneness", d: "medium" },

  // Geography
  { w: ["Nile", "Amazon", "Yangtze", "Mississippi"], r: "Rivers", d: "medium" },
  { w: ["Everest", "K2", "Kangchenjunga", "Lhotse"], r: "Highest Mountains", d: "hard" },
  { w: ["Tokyo", "Delhi", "Shanghai", "Dhaka"], r: "Populous Cities", d: "hard" },
  { w: ["Pacific", "Atlantic", "Indian", "Arctic"], r: "Oceans", d: "easy" },
  { w: ["Texas", "California", "Florida", "Alaska"], r: "US States", d: "easy" },

  // Objects
  { w: ["Fork", "Knife", "Spoon", "Spork"], r: "Cutlery", d: "easy" },
  { w: ["Hammer", "Screwdriver", "Wrench", "Pliers"], r: "Tools", d: "easy" },
  { w: ["Penny", "Nickel", "Dime", "Quarter"], r: "US Coins", d: "easy" },
  { w: ["Boots", "Sneakers", "Sandals", "Loafers"], r: "Footwear", d: "easy" },
  { w: ["Bowl", "Plate", "Saucer", "Dish"], r: "Dishware", d: "easy" },

  // Abstract / Concepts
  { w: ["Second", "Minute", "Hour", "Day"], r: "Units of Time", d: "easy" },
  { w: ["Inch", "Foot", "Yard", "Mile"], r: "Imperial Lengths", d: "easy" },
  { w: ["Gram", "Ounce", "Pound", "Ton"], r: "Weight Units", d: "medium" },
  { w: ["Alpha", "Beta", "Gamma", "Delta"], r: "Greek Letters", d: "medium" },
  { w: ["One", "Two", "Three", "Four"], r: "Numbers", d: "easy" },

  // "Fill in the Blank" style
  { w: ["Butter", "Dragon", "Fire", "Horse"], r: "Words followed by 'Fly'", d: "hard" },
  { w: ["Water", "Melon", "Ball", "Proof"], r: "Words starting with 'Water'", d: "hard" },
  { w: ["Sun", "Moon", "Star", "Cloud"], r: "Sky Objects", d: "easy" },
  { w: ["Rain", "Snow", "Hail", "Sleet"], r: "Precipitation", d: "easy" },
  { w: ["Walk", "Run", "Jog", "Sprint"], r: "Gaits", d: "medium" },

  // More tricky ones
  { w: ["Pitcher", "Catcher", "Batter", "Umpire"], r: "Baseball Roles", d: "medium" },
  { w: ["Quarter", "Half", "Full", "New"], r: "Moon Phases (Partial)", d: "hard" },
  { w: ["Heart", "Liver", "Lung", "Kidney"], r: "Organs", d: "medium" },
  { w: ["A", "B", "AB", "O"], r: "Blood Types", d: "medium" },
  { w: ["Visa", "Mastercard", "Amex", "Discover"], r: "Credit Cards", d: "medium" },

  // Colors as non-colors
  { w: ["Orange", "Lime", "Lemon", "Tangerine"], r: "Citrus Fruits", d: "medium" },
  { w: ["Violet", "Lily", "Rose", "Iris"], r: "Flower Names that are also Names", d: "medium" },
  { w: ["Amber", "Jade", "Ruby", "Pearl"], r: "Gemstones / Names", d: "medium" },
  { w: ["Raven", "Crow", "Jay", "Magpie"], r: "Corvids", d: "hard" },
  { w: ["Dove", "Soap", "Irish", "Spring"], r: "Soap Brands", d: "hard" },

  // Tech
  { w: ["Java", "Python", "Ruby", "Go"], r: "Programming Languages", d: "medium" },
  { w: ["Windows", "MacOS", "Linux", "Android"], r: "Operating Systems", d: "medium" },
  { w: ["Word", "Excel", "PowerPoint", "Outlook"], r: "Microsoft Office Apps", d: "medium" },
  { w: ["Chrome", "Firefox", "Safari", "Edge"], r: "Web Browsers", d: "medium" },
  { w: ["Mouse", "Keyboard", "Mic", "Cam"], r: "Input Devices", d: "medium" },

  // Miscellaneous
  { w: ["Ace", "King", "Queen", "Jack"], r: "Playing Cards Ranks", d: "easy" },
  { w: ["Pawn", "Rook", "Knight", "Bishop"], r: "Chess Pieces", d: "medium" },
  { w: ["Forward", "Backward", "Stop", "Play"], r: "Media Controls", d: "medium" },
  { w: ["Up", "Down", "Left", "Right"], r: "Directions", d: "easy" },
  { w: ["Head", "Shoulders", "Knees", "Toes"], r: "Body Parts Song", d: "easy" },

  // Final Batch
  { w: ["Drill", "Hammer", "Saw", "Level"], r: "Carpentry Tools", d: "medium" },
  { w: ["Pen", "Pencil", "Marker", "Crayon"], r: "Writing Instruments", d: "easy" },
  { w: ["Box", "Package", "Crate", "Carton"], r: "Containers", d: "medium" },
  { w: ["Bagel", "Donut", "Tire", "Ring"], r: "Torus Shaped Objects", d: "hard" },
  { w: ["Cone", "Cube", "Sphere", "Prism"], r: "3D Shapes", d: "medium" },
  { w: ["Line", "Ray", "Segment", "Point"], r: "Geometry Terms", d: "medium" },
  { w: ["Add", "Subtract", "Multiply", "Divide"], r: "Math Operations", d: "easy" },
  { w: ["Noun", "Verb", "Adjective", "Adverb"], r: "Parts of Speech", d: "medium" },
  { w: ["Comma", "Period", "Colon", "Dash"], r: "Punctuation", d: "medium" },
  { w: ["Bold", "Italic", "Underline", "Strike"], r: "Text Formatting", d: "medium" },
  { w: ["Cut", "Copy", "Paste", "Undo"], r: "Edit Commands", d: "easy" },
  { w: ["Save", "Open", "New", "Print"], r: "File Menu Items", d: "easy" },
  { w: ["Tab", "Enter", "Shift", "Ctrl"], r: "Keyboard Keys", d: "easy" },
  { w: ["Click", "Scroll", "Drag", "Drop"], r: "Mouse Actions", d: "easy" },
  { w: ["Login", "Logout", "Signup", "Reset"], r: "Auth Actions", d: "medium" },
  { w: ["Home", "About", "Contact", "Blog"], r: "Website Links", d: "easy" },
  { w: ["Header", "Footer", "Sidebar", "Main"], r: "Page Layout Sections", d: "medium" },
  { w: ["Red", "Green", "Blue", "Alpha"], r: "RGBA Components", d: "hard" },
  { w: ["Hue", "Saturation", "Value", "Lightness"], r: "Color Properties", d: "hard" },
  { w: ["Pixel", "Vector", "Raster", "Voxel"], r: "Digital Image Terms", d: "hard" }
];

console.log(`Seeding ${seedGroups.length} groups...`);

const insertStmt = db.prepare(`
  INSERT INTO groups (
    word1, word2, word3, word4, 
    relation_clean, difficulty, 
    status, quality_score, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, 'approved', 10, CURRENT_TIMESTAMP)
`);

const checkStmt = db.prepare('SELECT COUNT(*) as count FROM groups WHERE word1 = ? AND word2 = ?');

db.transaction(() => {
  let added = 0;
  for (const g of seedGroups) {
    const exists = checkStmt.get(g.w[0], g.w[1]).count > 0;
    if (!exists) {
      insertStmt.run(g.w[0], g.w[1], g.w[2], g.w[3], g.r, g.d);
      added++;
    }
  }
  console.log(`Added ${added} new groups.`);
})();

