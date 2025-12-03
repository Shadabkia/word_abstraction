import {
  // Animals - حیوانات
  Dog, Cat, Fish, Bird, Rabbit, Squirrel, Bug, Turtle, 
  Snail, Beef, Egg, PawPrint,
  
  // Nature - طبیعت
  TreePine, Flower, Leaf, Sprout, Mountain, Waves, 
  Trees, Palmtree, CloudSun,
  
  // Food & Drinks - غذا و نوشیدنی
  Apple, Carrot, Milk, Coffee, Pizza, Cookie, 
  CakeSlice, IceCream, Grape, Cherry, Salad, Soup,
  
  // Music & Art - موسیقی و هنر
  Music, Guitar, Mic2, Radio, Palette, Paintbrush, 
  Piano, Drum,
  
  // Home & Kitchen - خانه و آشپزخانه
  Home, UtensilsCrossed, Refrigerator, CookingPot, 
  Armchair, Bed, Lamp, DoorOpen, Sofa,
  
  // Electronics - لوازم الکترونیک
  Tv, Laptop, Smartphone, Tablet, Watch, 
  Headphones, Speaker, MonitorSpeaker,
  
  // Weather - آب و هوا
  Sun, Cloud, CloudRain, Wind, Snowflake, 
  CloudDrizzle, Zap, Rainbow,
  
  // Transportation - وسایل نقلیه
  Car, Plane, Ship, Train, Bike, Bus,
  
  // Sports & Activities - ورزش و فعالیت
  Dumbbell, Heart, Award, Trophy, Target,
  
  // Objects & Tools - اشیاء و ابزار
  Book, Pencil, Scissors, Key, Lock, 
  ShoppingBag, Gift, Star, Sparkles, Wrench,
  
  // Body & Health - بدن و سلامت
  Brain, HeartPulse, Eye, Ear, Hand,
  
  // Emotions & Symbols - احساسات و نمادها
  Smile, Laugh, Frown, Heart as HeartSolid, 
  Flame, Droplet, CircleDot, Circle,
  
  // Buildings & Places - ساختمان‌ها و مکان‌ها
  Building, Building2, School, Church, Store,
  Hospital, Factory,
  
  // Nature Elements - عناصر طبیعت
  Moon, CloudMoon, Sunrise, Sunset,
  
  // Abstract Concepts - مفاهیم انتزاعی
  Lightbulb, Crown, Shield, Swords, Shapes, Briefcase, Recycle,

  type LucideIcon
} from 'lucide-react';

/**
 * Icon metadata with descriptive fields
 */
export interface IconMetadata {
  id: string;                    // Kebab-case unique identifier
  type: 'library' | 'emoji';     // Icon type
  libraryIcon?: string;          // Lucide icon name (if type is library)
  emoji?: string;                // Emoji character (if type is emoji)
  label: string;                 // English label
  labelFa: string;               // Persian/Farsi label
  category: string;              // Category grouping
  description: string;           // Description of what it represents
  keywords: string[];            // Search keywords
}

export interface IconOption {
  name: string;
  label: string;
  labelFa: string;
  category: string;
  component: LucideIcon;
}

/**
 * Comprehensive icon metadata registry
 * Maps kebab-case IDs to complete icon information
 */
export const iconRegistry: Record<string, IconMetadata> = {
  // === ANIMALS ===
  'animals-group': {
    id: 'animals-group',
    type: 'emoji',
    emoji: '🐾',
    label: 'Animals',
    labelFa: 'حیوانات',
    category: 'Animals',
    description: 'General animals category',
    keywords: ['animals', 'pets', 'wildlife', 'حیوانات']
  },
  'domestic-animals': {
    id: 'domestic-animals',
    type: 'library',
    libraryIcon: 'Dog',
    label: 'Domestic Animals',
    labelFa: 'حیوانات اهلی',
    category: 'Animals',
    description: 'Pets and farm animals',
    keywords: ['domestic', 'pets', 'farm', 'اهلی']
  },
  'predators-group': {
    id: 'predators-group',
    type: 'emoji',
    emoji: '🦁',
    label: 'Predators',
    labelFa: 'درندگان',
    category: 'Animals',
    description: 'Carnivorous predators',
    keywords: ['predator', 'carnivore', 'wild', 'درندگان']
  },
  'herbivores-group': {
    id: 'herbivores-group',
    type: 'emoji',
    emoji: '🐑',
    label: 'Herbivores',
    labelFa: 'علفخواران',
    category: 'Animals',
    description: 'Plant-eating animals',
    keywords: ['herbivore', 'vegetarian', 'plant-eater', 'علفخواران']
  },
  'birds-group': {
    id: 'birds-group',
    type: 'library',
    libraryIcon: 'Bird',
    label: 'Birds',
    labelFa: 'پرندگان',
    category: 'Animals',
    description: 'Flying birds',
    keywords: ['bird', 'fly', 'wings', 'پرندگان']
  },
  'aquatics-group': {
    id: 'aquatics-group',
    type: 'library',
    libraryIcon: 'Fish',
    label: 'Aquatic Animals',
    labelFa: 'آبزیان',
    category: 'Animals',
    description: 'Water-dwelling creatures',
    keywords: ['fish', 'aquatic', 'water', 'sea', 'آبزیان']
  },
  
  // === LIVING BEINGS ===
  'living-beings': {
    id: 'living-beings',
    type: 'emoji',
    emoji: '🌱',
    label: 'Living Beings',
    labelFa: 'موجودات زنده',
    category: 'Nature',
    description: 'All living organisms',
    keywords: ['life', 'organism', 'living', 'موجودات', 'زنده']
  },
  
  // === AGRICULTURE ===
  'ranch-group': {
    id: 'ranch-group',
    type: 'emoji',
    emoji: '🐄',
    label: 'Livestock',
    labelFa: 'دام',
    category: 'Agriculture',
    description: 'Farm animals for ranching',
    keywords: ['livestock', 'ranch', 'farm', 'دامداری']
  },
  'farming-group': {
    id: 'farming-group',
    type: 'library',
    libraryIcon: 'Sprout',
    label: 'Farming',
    labelFa: 'زراعت',
    category: 'Agriculture',
    description: 'Crop cultivation',
    keywords: ['farming', 'crops', 'agriculture', 'زراعت']
  },
  'tools-group': {
    id: 'tools-group',
    type: 'library',
    libraryIcon: 'Wrench',
    label: 'Tools',
    labelFa: 'ابزار',
    category: 'Agriculture',
    description: 'Farming and work tools',
    keywords: ['tools', 'equipment', 'ابزار']
  },
  'jobs-group': {
    id: 'jobs-group',
    type: 'library',
    libraryIcon: 'Briefcase',
    label: 'Jobs',
    labelFa: 'مشاغل',
    category: 'Professions',
    description: 'Various professions',
    keywords: ['job', 'profession', 'career', 'work', 'مشاغل']
  },
  
  // === NATURE ===
  'nature-group': {
    id: 'nature-group',
    type: 'library',
    libraryIcon: 'TreePine',
    label: 'Nature',
    labelFa: 'طبیعت',
    category: 'Nature',
    description: 'Natural landscapes',
    keywords: ['nature', 'landscape', 'outdoor', 'طبیعت']
  },
  
  // === MUSIC ===
  'music-group': {
    id: 'music-group',
    type: 'library',
    libraryIcon: 'Music',
    label: 'Music',
    labelFa: 'موسیقی',
    category: 'Music',
    description: 'Musical instruments and music',
    keywords: ['music', 'instrument', 'sound', 'موسیقی']
  },
  
  // === FOOD ===
  'fruits-group': {
    id: 'fruits-group',
    type: 'library',
    libraryIcon: 'Apple',
    label: 'Fruits',
    labelFa: 'میوه‌ها',
    category: 'Food',
    description: 'Fresh fruits',
    keywords: ['fruit', 'fresh', 'healthy', 'میوه']
  },
  'vegetables-group': {
    id: 'vegetables-group',
    type: 'library',
    libraryIcon: 'Carrot',
    label: 'Vegetables',
    labelFa: 'سبزیجات',
    category: 'Food',
    description: 'Fresh vegetables',
    keywords: ['vegetable', 'fresh', 'healthy', 'سبزیجات']
  },
  
  // === WEATHER ===
  'weather-group': {
    id: 'weather-group',
    type: 'library',
    libraryIcon: 'CloudSun',
    label: 'Weather',
    labelFa: 'آب و هوا',
    category: 'Weather',
    description: 'Weather conditions',
    keywords: ['weather', 'climate', 'آب', 'هوا']
  },
  
  // === HOME & KITCHEN ===
  'kitchen-group': {
    id: 'kitchen-group',
    type: 'library',
    libraryIcon: 'CookingPot',
    label: 'Kitchen',
    labelFa: 'آشپزخانه',
    category: 'Home',
    description: 'Kitchen items and cookware',
    keywords: ['kitchen', 'cooking', 'آشپزخانه']
  },
  
  // === ELECTRONICS ===
  'electronics-group': {
    id: 'electronics-group',
    type: 'library',
    libraryIcon: 'Tv',
    label: 'Electronics',
    labelFa: 'لوازم الکترونیک',
    category: 'Electronics',
    description: 'Electronic devices',
    keywords: ['electronics', 'device', 'technology', 'الکترونیک']
  },
  
  // === TRANSPORTATION ===
  'vehicles-group': {
    id: 'vehicles-group',
    type: 'library',
    libraryIcon: 'Car',
    label: 'Vehicles',
    labelFa: 'وسایل نقلیه',
    category: 'Transportation',
    description: 'Transportation vehicles',
    keywords: ['vehicle', 'transport', 'نقلیه']
  },
  
  // === SCHOOL ===
  'school-group': {
    id: 'school-group',
    type: 'library',
    libraryIcon: 'Book',
    label: 'School',
    labelFa: 'مدرسه',
    category: 'Education',
    description: 'School supplies and education',
    keywords: ['school', 'education', 'learning', 'مدرسه']
  },
  
  // === SPORTS ===
  'sports-group': {
    id: 'sports-group',
    type: 'library',
    libraryIcon: 'Trophy',
    label: 'Sports',
    labelFa: 'ورزش‌ها',
    category: 'Sports',
    description: 'Sports and athletics',
    keywords: ['sport', 'athletic', 'exercise', 'ورزش']
  },
  
  // === PROFESSIONS ===
  'medical-group': {
    id: 'medical-group',
    type: 'library',
    libraryIcon: 'HeartPulse',
    label: 'Medical',
    labelFa: 'پزشکی',
    category: 'Professions',
    description: 'Medical and healthcare',
    keywords: ['medical', 'health', 'doctor', 'پزشکی']
  },
  
  // === COMMUNICATION ===
  'communication-group': {
    id: 'communication-group',
    type: 'library',
    libraryIcon: 'Smartphone',
    label: 'Communication',
    labelFa: 'ارتباطات',
    category: 'Communication',
    description: 'Communication methods',
    keywords: ['communication', 'message', 'contact', 'ارتباطات']
  },
  
  // === COLORS ===
  'colors-group': {
    id: 'colors-group',
    type: 'library',
    libraryIcon: 'Palette',
    label: 'Colors',
    labelFa: 'رنگ‌ها',
    category: 'Abstract',
    description: 'Color categories',
    keywords: ['color', 'paint', 'رنگ']
  },
  
  // === CLASSIFICATION ===
  'classification-group': {
    id: 'classification-group',
    type: 'emoji',
    emoji: '📊',
    label: 'Classification',
    labelFa: 'دسته‌بندی',
    category: 'Abstract',
    description: 'Category classification',
    keywords: ['classification', 'category', 'group', 'دسته‌بندی']
  },

  // === NEW GROUPS ===
  'trees-group': {
    id: 'trees-group',
    type: 'library',
    libraryIcon: 'Trees',
    label: 'Trees',
    labelFa: 'درختان',
    category: 'Nature',
    description: 'Various types of trees',
    keywords: ['trees', 'forest', 'wood', 'درخت']
  },
  'flowers-group': {
    id: 'flowers-group',
    type: 'library',
    libraryIcon: 'Flower',
    label: 'Flowers',
    labelFa: 'گل‌ها',
    category: 'Nature',
    description: 'Various types of flowers',
    keywords: ['flowers', 'garden', 'bloom', 'گل']
  },
  'sun-group': {
    id: 'sun-group',
    type: 'library',
    libraryIcon: 'Sun',
    label: 'Sun',
    labelFa: 'خورشید',
    category: 'Weather',
    description: 'Sun and solar energy',
    keywords: ['sun', 'solar', 'light', 'خورشید']
  },
  'producers-group': {
    id: 'producers-group',
    type: 'library',
    libraryIcon: 'Leaf',
    label: 'Producers',
    labelFa: 'تولیدکنندگان',
    category: 'Biology',
    description: 'Biological producers (plants)',
    keywords: ['producers', 'plants', 'biology', 'تولیدکننده']
  },
  'consumers-group': {
    id: 'consumers-group',
    type: 'library',
    libraryIcon: 'PawPrint',
    label: 'Consumers',
    labelFa: 'مصرف‌کنندگان',
    category: 'Biology',
    description: 'Biological consumers (animals)',
    keywords: ['consumers', 'animals', 'biology', 'مصرف‌کننده']
  },
  'decomposers-group': {
    id: 'decomposers-group',
    type: 'library',
    libraryIcon: 'Recycle',
    label: 'Decomposers',
    labelFa: 'تجزیه‌کنندگان',
    category: 'Biology',
    description: 'Biological decomposers',
    keywords: ['decomposers', 'recycle', 'biology', 'تجزیه‌کننده']
  },
  'results-group': {
    id: 'results-group',
    type: 'library',
    libraryIcon: 'Sparkles',
    label: 'Results',
    labelFa: 'نتایج',
    category: 'Abstract',
    description: 'Outcomes and results',
    keywords: ['results', 'sparkles', 'outcome', 'نتیجه']
  },
  'mammals-group': {
    id: 'mammals-group',
    type: 'library',
    libraryIcon: 'Dog',
    label: 'Mammals',
    labelFa: 'پستانداران',
    category: 'Animals',
    description: 'Mammals',
    keywords: ['mammals', 'animals', 'dog', 'پستاندار']
  },
  'crustaceans-group': {
    id: 'crustaceans-group',
    type: 'library',
    libraryIcon: 'Turtle',
    label: 'Crustaceans',
    labelFa: 'سخت‌پوستان',
    category: 'Animals',
    description: 'Crustaceans and shelled animals',
    keywords: ['crustaceans', 'shell', 'turtle', 'سخت‌پوست']
  },
  'swim-group': {
    id: 'swim-group',
    type: 'library',
    libraryIcon: 'Waves',
    label: 'Swimming',
    labelFa: 'شنا',
    category: 'Activities',
    description: 'Swimming and water activities',
    keywords: ['swim', 'water', 'waves', 'شنا']
  }
};

// Legacy iconMap for backward compatibility (PascalCase names)
export const iconMap: Record<string, LucideIcon> = {
  // Animals
  'Dog': Dog,
  'Cat': Cat,
  'Fish': Fish,
  'Bird': Bird,
  'Rabbit': Rabbit,
  'Squirrel': Squirrel,
  'Bug': Bug,
  'Turtle': Turtle,
  'Snail': Snail,
  'Beef': Beef,
  'Egg': Egg,
  'PawPrint': PawPrint,
  
  // Nature
  'TreePine': TreePine,
  'Trees': Trees,
  'Flower': Flower,
  'Leaf': Leaf,
  'Sprout': Sprout,
  'Mountain': Mountain,
  'Waves': Waves,
  'Palmtree': Palmtree,
  'CloudSun': CloudSun,
  
  // Food
  'Apple': Apple,
  'Carrot': Carrot,
  'Milk': Milk,
  'Coffee': Coffee,
  'Pizza': Pizza,
  'Cookie': Cookie,
  'CakeSlice': CakeSlice,
  'IceCream': IceCream,
  'Grape': Grape,
  'Cherry': Cherry,
  'Salad': Salad,
  'Soup': Soup,
  
  // Music
  'Music': Music,
  'Guitar': Guitar,
  'Mic2': Mic2,
  'Radio': Radio,
  'Piano': Piano,
  'Drum': Drum,
  
  // Art
  'Palette': Palette,
  'Paintbrush': Paintbrush,
  
  // Home
  'Home': Home,
  'UtensilsCrossed': UtensilsCrossed,
  'Refrigerator': Refrigerator,
  'CookingPot': CookingPot,
  'Armchair': Armchair,
  'Bed': Bed,
  'Lamp': Lamp,
  'DoorOpen': DoorOpen,
  'Sofa': Sofa,
  
  // Electronics
  'Tv': Tv,
  'Laptop': Laptop,
  'Smartphone': Smartphone,
  'Tablet': Tablet,
  'Watch': Watch,
  'Headphones': Headphones,
  'Speaker': Speaker,
  'MonitorSpeaker': MonitorSpeaker,
  
  // Weather
  'Sun': Sun,
  'Cloud': Cloud,
  'CloudRain': CloudRain,
  'Wind': Wind,
  'Snowflake': Snowflake,
  'CloudDrizzle': CloudDrizzle,
  'Zap': Zap,
  'Rainbow': Rainbow,
  'Moon': Moon,
  'CloudMoon': CloudMoon,
  'Sunrise': Sunrise,
  'Sunset': Sunset,
  
  // Transportation
  'Car': Car,
  'Plane': Plane,
  'Ship': Ship,
  'Train': Train,
  'Bike': Bike,
  'Bus': Bus,
  
  // Sports
  'Dumbbell': Dumbbell,
  'Trophy': Trophy,
  'Award': Award,
  'Target': Target,
  
  // Objects
  'Book': Book,
  'Pencil': Pencil,
  'Scissors': Scissors,
  'Key': Key,
  'Lock': Lock,
  'ShoppingBag': ShoppingBag,
  'Gift': Gift,
  'Star': Star,
  'Sparkles': Sparkles,
  'Wrench': Wrench,
  
  // Body
  'Brain': Brain,
  'HeartPulse': HeartPulse,
  'Eye': Eye,
  'Ear': Ear,
  'Hand': Hand,
  
  // Emotions
  'Smile': Smile,
  'Laugh': Laugh,
  'Frown': Frown,
  'HeartSolid': HeartSolid,
  'Heart': HeartSolid,
  'Flame': Flame,
  'Droplet': Droplet,
  
  // Buildings
  'Building': Building,
  'Building2': Building2,
  'School': School,
  'Church': Church,
  'Store': Store,
  'Hospital': Hospital,
  'Factory': Factory,
  
  // Abstract
  'Lightbulb': Lightbulb,
  'Crown': Crown,
  'Shield': Shield,
  'Swords': Swords,
  'Shapes': Shapes,
  'Briefcase': Briefcase,
  'Recycle': Recycle,
  
  // Default
  'CircleDot': CircleDot,
  'Circle': Circle,
};

// Organized icon list for the editor dropdown
export const iconOptions: IconOption[] = [
  // Animals - حیوانات
  { name: 'Dog', label: 'Dog', labelFa: 'سگ', category: 'Animals', component: Dog },
  { name: 'Cat', label: 'Cat', labelFa: 'گربه', category: 'Animals', component: Cat },
  { name: 'Fish', label: 'Fish', labelFa: 'ماهی', category: 'Animals', component: Fish },
  { name: 'Bird', label: 'Bird', labelFa: 'پرنده', category: 'Animals', component: Bird },
  { name: 'Rabbit', label: 'Rabbit', labelFa: 'خرگوش', category: 'Animals', component: Rabbit },
  { name: 'Squirrel', label: 'Squirrel', labelFa: 'سنجاب', category: 'Animals', component: Squirrel },
  { name: 'Bug', label: 'Bug', labelFa: 'حشره', category: 'Animals', component: Bug },
  { name: 'Turtle', label: 'Turtle', labelFa: 'لاک‌پشت', category: 'Animals', component: Turtle },
  { name: 'Snail', label: 'Snail', labelFa: 'حلزون', category: 'Animals', component: Snail },
  { name: 'Beef', label: 'Beef', labelFa: 'گوشت', category: 'Animals', component: Beef },
  { name: 'Egg', label: 'Egg', labelFa: 'تخم‌مرغ', category: 'Animals', component: Egg },
  
  // Nature - طبیعت
  { name: 'TreePine', label: 'Tree (Pine)', labelFa: 'درخت کاج', category: 'Nature', component: TreePine },
  { name: 'Trees', label: 'Trees', labelFa: 'درختان', category: 'Nature', component: Trees },
  { name: 'Flower', label: 'Flower', labelFa: 'گل', category: 'Nature', component: Flower },
  { name: 'Leaf', label: 'Leaf', labelFa: 'برگ', category: 'Nature', component: Leaf },
  { name: 'Sprout', label: 'Sprout', labelFa: 'جوانه', category: 'Nature', component: Sprout },
  { name: 'Mountain', label: 'Mountain', labelFa: 'کوه', category: 'Nature', component: Mountain },
  { name: 'Waves', label: 'Waves', labelFa: 'امواج', category: 'Nature', component: Waves },
  { name: 'Palmtree', label: 'Palm Tree', labelFa: 'درخت خرما', category: 'Nature', component: Palmtree },
  
  // Food - غذا
  { name: 'Apple', label: 'Apple', labelFa: 'سیب', category: 'Food', component: Apple },
  { name: 'Carrot', label: 'Carrot', labelFa: 'هویج', category: 'Food', component: Carrot },
  { name: 'Milk', label: 'Milk', labelFa: 'شیر', category: 'Food', component: Milk },
  { name: 'Coffee', label: 'Coffee', labelFa: 'قهوه', category: 'Food', component: Coffee },
  { name: 'Pizza', label: 'Pizza', labelFa: 'پیتزا', category: 'Food', component: Pizza },
  { name: 'Cookie', label: 'Cookie', labelFa: 'کوکی', category: 'Food', component: Cookie },
  { name: 'CakeSlice', label: 'Cake', labelFa: 'کیک', category: 'Food', component: CakeSlice },
  { name: 'IceCream', label: 'Ice Cream', labelFa: 'بستنی', category: 'Food', component: IceCream },
  { name: 'Grape', label: 'Grape', labelFa: 'انگور', category: 'Food', component: Grape },
  { name: 'Cherry', label: 'Cherry', labelFa: 'گیلاس', category: 'Food', component: Cherry },
  { name: 'Salad', label: 'Salad', labelFa: 'سالاد', category: 'Food', component: Salad },
  { name: 'Soup', label: 'Soup', labelFa: 'سوپ', category: 'Food', component: Soup },
  
  // Music - موسیقی
  { name: 'Music', label: 'Music', labelFa: 'موسیقی', category: 'Music', component: Music },
  { name: 'Guitar', label: 'Guitar', labelFa: 'گیتار', category: 'Music', component: Guitar },
  { name: 'Mic2', label: 'Microphone', labelFa: 'میکروفون', category: 'Music', component: Mic2 },
  { name: 'Radio', label: 'Radio', labelFa: 'رادیو', category: 'Music', component: Radio },
  { name: 'Piano', label: 'Piano', labelFa: 'پیانو', category: 'Music', component: Piano },
  { name: 'Drum', label: 'Drum', labelFa: 'طبل', category: 'Music', component: Drum },
  
  // Art - هنر
  { name: 'Palette', label: 'Palette', labelFa: 'پالت', category: 'Art', component: Palette },
  { name: 'Paintbrush', label: 'Paintbrush', labelFa: 'قلم‌مو', category: 'Art', component: Paintbrush },
  
  // Home - خانه
  { name: 'Home', label: 'Home', labelFa: 'خانه', category: 'Home', component: Home },
  { name: 'UtensilsCrossed', label: 'Utensils', labelFa: 'ظروف', category: 'Home', component: UtensilsCrossed },
  { name: 'Refrigerator', label: 'Refrigerator', labelFa: 'یخچال', category: 'Home', component: Refrigerator },
  { name: 'CookingPot', label: 'Cooking Pot', labelFa: 'قابلمه', category: 'Home', component: CookingPot },
  { name: 'Armchair', label: 'Armchair', labelFa: 'صندلی', category: 'Home', component: Armchair },
  { name: 'Bed', label: 'Bed', labelFa: 'تخت', category: 'Home', component: Bed },
  { name: 'Lamp', label: 'Lamp', labelFa: 'لامپ', category: 'Home', component: Lamp },
  { name: 'DoorOpen', label: 'Door', labelFa: 'در', category: 'Home', component: DoorOpen },
  { name: 'Sofa', label: 'Sofa', labelFa: 'مبل', category: 'Home', component: Sofa },
  
  // Electronics - الکترونیک
  { name: 'Tv', label: 'TV', labelFa: 'تلویزیون', category: 'Electronics', component: Tv },
  { name: 'Laptop', label: 'Laptop', labelFa: 'لپ‌تاپ', category: 'Electronics', component: Laptop },
  { name: 'Smartphone', label: 'Smartphone', labelFa: 'موبایل', category: 'Electronics', component: Smartphone },
  { name: 'Tablet', label: 'Tablet', labelFa: 'تبلت', category: 'Electronics', component: Tablet },
  { name: 'Watch', label: 'Watch', labelFa: 'ساعت', category: 'Electronics', component: Watch },
  { name: 'Headphones', label: 'Headphones', labelFa: 'هدفون', category: 'Electronics', component: Headphones },
  { name: 'Speaker', label: 'Speaker', labelFa: 'بلندگو', category: 'Electronics', component: Speaker },
  
  // Weather - آب و هوا
  { name: 'Sun', label: 'Sun', labelFa: 'آفتاب', category: 'Weather', component: Sun },
  { name: 'Cloud', label: 'Cloud', labelFa: 'ابر', category: 'Weather', component: Cloud },
  { name: 'CloudRain', label: 'Rain', labelFa: 'باران', category: 'Weather', component: CloudRain },
  { name: 'Wind', label: 'Wind', labelFa: 'باد', category: 'Weather', component: Wind },
  { name: 'Snowflake', label: 'Snow', labelFa: 'برف', category: 'Weather', component: Snowflake },
  { name: 'CloudDrizzle', label: 'Drizzle', labelFa: 'نم‌نم باران', category: 'Weather', component: CloudDrizzle },
  { name: 'Zap', label: 'Lightning', labelFa: 'رعد و برق', category: 'Weather', component: Zap },
  { name: 'Rainbow', label: 'Rainbow', labelFa: 'رنگین‌کمان', category: 'Weather', component: Rainbow },
  { name: 'Moon', label: 'Moon', labelFa: 'ماه', category: 'Weather', component: Moon },
  
  // Transportation - حمل و نقل
  { name: 'Car', label: 'Car', labelFa: 'ماشین', category: 'Transportation', component: Car },
  { name: 'Plane', label: 'Plane', labelFa: 'هواپیما', category: 'Transportation', component: Plane },
  { name: 'Ship', label: 'Ship', labelFa: 'کشتی', category: 'Transportation', component: Ship },
  { name: 'Train', label: 'Train', labelFa: 'قطار', category: 'Transportation', component: Train },
  { name: 'Bike', label: 'Bike', labelFa: 'دوچرخه', category: 'Transportation', component: Bike },
  { name: 'Bus', label: 'Bus', labelFa: 'اتوبوس', category: 'Transportation', component: Bus },
  
  // Sports - ورزش
  { name: 'Dumbbell', label: 'Dumbbell', labelFa: 'دمبل', category: 'Sports', component: Dumbbell },
  { name: 'Trophy', label: 'Trophy', labelFa: 'جام', category: 'Sports', component: Trophy },
  { name: 'Award', label: 'Award', labelFa: 'جایزه', category: 'Sports', component: Award },
  { name: 'Target', label: 'Target', labelFa: 'هدف', category: 'Sports', component: Target },
  
  // Objects - اشیاء
  { name: 'Book', label: 'Book', labelFa: 'کتاب', category: 'Objects', component: Book },
  { name: 'Pencil', label: 'Pencil', labelFa: 'مداد', category: 'Objects', component: Pencil },
  { name: 'Scissors', label: 'Scissors', labelFa: 'قیچی', category: 'Objects', component: Scissors },
  { name: 'Key', label: 'Key', labelFa: 'کلید', category: 'Objects', component: Key },
  { name: 'Lock', label: 'Lock', labelFa: 'قفل', category: 'Objects', component: Lock },
  { name: 'ShoppingBag', label: 'Shopping Bag', labelFa: 'کیف خرید', category: 'Objects', component: ShoppingBag },
  { name: 'Gift', label: 'Gift', labelFa: 'هدیه', category: 'Objects', component: Gift },
  { name: 'Star', label: 'Star', labelFa: 'ستاره', category: 'Objects', component: Star },
  { name: 'Sparkles', label: 'Sparkles', labelFa: 'جرقه', category: 'Objects', component: Sparkles },
  
  // Body - بدن
  { name: 'Brain', label: 'Brain', labelFa: 'مغز', category: 'Body', component: Brain },
  { name: 'HeartPulse', label: 'Heart Pulse', labelFa: 'ضربان قلب', category: 'Body', component: HeartPulse },
  { name: 'Eye', label: 'Eye', labelFa: 'چشم', category: 'Body', component: Eye },
  { name: 'Ear', label: 'Ear', labelFa: 'گوش', category: 'Body', component: Ear },
  { name: 'Hand', label: 'Hand', labelFa: 'دست', category: 'Body', component: Hand },
  
  // Buildings - ساختمان
  { name: 'Building', label: 'Building', labelFa: 'ساختمان', category: 'Buildings', component: Building },
  { name: 'School', label: 'School', labelFa: 'مدرسه', category: 'Buildings', component: School },
  { name: 'Hospital', label: 'Hospital', labelFa: 'بیمارستان', category: 'Buildings', component: Hospital },
  { name: 'Store', label: 'Store', labelFa: 'فروشگاه', category: 'Buildings', component: Store },
  { name: 'Factory', label: 'Factory', labelFa: 'کارخانه', category: 'Buildings', component: Factory },
  
  // Emotions - احساسات
  { name: 'Heart', label: 'Heart', labelFa: 'قلب', category: 'Emotions', component: HeartSolid },
  { name: 'Smile', label: 'Smile', labelFa: 'لبخند', category: 'Emotions', component: Smile },
  { name: 'Flame', label: 'Flame', labelFa: 'شعله', category: 'Emotions', component: Flame },
  { name: 'Droplet', label: 'Droplet', labelFa: 'قطره', category: 'Emotions', component: Droplet },
  
  // Abstract - انتزاعی
  { name: 'Lightbulb', label: 'Lightbulb', labelFa: 'لامپ', category: 'Abstract', component: Lightbulb },
  { name: 'Crown', label: 'Crown', labelFa: 'تاج', category: 'Abstract', component: Crown },
  { name: 'Shield', label: 'Shield', labelFa: 'سپر', category: 'Abstract', component: Shield },
];

/**
 * Get icon metadata by kebab-case ID
 */
export function getIconMetadata(iconId?: string | null): IconMetadata | null {
  if (!iconId) return null;
  return iconRegistry[iconId] || null;
}

/**
 * Get Lucide icon component from icon metadata
 * Returns null if not found or if type is emoji
 */
export function getIconComponent(iconId?: string | null): LucideIcon | null {
  const metadata = getIconMetadata(iconId);
  if (!metadata || metadata.type !== 'library' || !metadata.libraryIcon) {
    return null;
  }
  return iconMap[metadata.libraryIcon] || null;
}

/**
 * Legacy helper: Get icon component by PascalCase name
 * @deprecated Use getIconComponent with kebab-case ID instead
 */
export function getIcon(iconName?: string): LucideIcon | null {
  if (!iconName) return null;
  return iconMap[iconName] || null;
}

/**
 * Get all icon metadata entries
 */
export function getAllIconMetadata(): IconMetadata[] {
  return Object.values(iconRegistry);
}

/**
 * Get icon categories
 */
export function getIconCategories(): string[] {
  const categories = new Set(
    Object.values(iconRegistry).map(icon => icon.category)
  );
  return Array.from(categories).sort();
}

/**
 * Get icons by category
 */
export function getIconsByCategory(category: string): IconMetadata[] {
  return Object.values(iconRegistry).filter(icon => icon.category === category);
}

/**
 * Search icons by keyword
 */
export function searchIcons(query: string): IconMetadata[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(iconRegistry).filter(icon => 
    icon.keywords.some(kw => kw.toLowerCase().includes(lowerQuery)) ||
    icon.label.toLowerCase().includes(lowerQuery) ||
    icon.labelFa.includes(query)
  );
}

// Legacy helper for dropdown (backward compatibility)
export function getIconOptions(): IconOption[] {
  return iconOptions;
}


