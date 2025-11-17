import { LevelData } from '../types';

const level2: LevelData = {
  levelNumber: 2,
  totalSteps: 6,
  words: [
    // میوه‌ها (Fruits)
    { id: '1', text: 'سیب', category: 'میوه‌ها' },
    { id: '2', text: 'موز', category: 'میوه‌ها' },
    { id: '3', text: 'پرتقال', category: 'میوه‌ها' },
    { id: '4', text: 'انگور', category: 'میوه‌ها' },
    
    // سبزیجات (Vegetables)
    { id: '5', text: 'گوجه', category: 'سبزیجات' },
    { id: '6', text: 'خیار', category: 'سبزیجات' },
    { id: '7', text: 'هویج', category: 'سبزیجات' },
    { id: '8', text: 'کاهو', category: 'سبزیجات' },
    
    // ورزش‌ها (Sports)
    { id: '9', text: 'فوتبال', category: 'ورزش‌ها' },
    { id: '10', text: 'بسکتبال', category: 'ورزش‌ها' },
    { id: '11', text: 'شنا', category: 'ورزش‌ها' },
    { id: '12', text: 'والیبال', category: 'ورزش‌ها' },
    
    // آب و هوا (Weather)
    { id: '13', text: 'باران', category: 'آب_و_هوا' },
    { id: '14', text: 'برف', category: 'آب_و_هوا' },
    { id: '15', text: 'آفتاب', category: 'آب_و_هوا' },
    { id: '16', text: 'ابر', category: 'آب_و_هوا' },
    
    // وسایل نقلیه (Vehicles)
    { id: '17', text: 'ماشین', category: 'وسایل_نقلیه' },
    { id: '18', text: 'اتوبوس', category: 'وسایل_نقلیه' },
    { id: '19', text: 'هواپیما', category: 'وسایل_نقلیه' },
    { id: '20', text: 'دوچرخه', category: 'وسایل_نقلیه' },
    
    // مدرسه (School)
    { id: '21', text: 'کتاب', category: 'مدرسه' },
    { id: '22', text: 'دفتر', category: 'مدرسه' },
    { id: '23', text: 'مداد', category: 'مدرسه' },
    { id: '24', text: 'خودکار', category: 'مدرسه' },
  ],
  categories: {
    'میوه‌ها': 'میوه‌ها',
    'سبزیجات': 'سبزیجات',
    'ورزش‌ها': 'ورزش‌ها',
    'آب_و_هوا': 'آب و هوا',
    'وسایل_نقلیه': 'وسایل نقلیه',
    'مدرسه': 'مدرسه',
  },
};

export default level2;

