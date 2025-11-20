import { LevelData } from '../types';

/**
 * Level 3: Hierarchical Categories
 * 
 * Structure:
 * ⭐ = Base word (1 star)
 * ⭐⭐ = Subcategory (2 stars) - only حیوانات
 * ⭐⭐⭐ = Main category (3 stars)
 * 
 * Initial: 24 base words visible
 * 
 * Main Category 1: موجودات زنده⭐⭐⭐
 *   - حیوانات⭐⭐ (subcategory)
 *       - سگ⭐، گربه⭐، گاو⭐، گوسفند⭐
 *   - انسان‌ها⭐ (base word, NOT subcategory)
 *   - گیاهان⭐ (base word, NOT subcategory)
 *   - باکتری‌ها⭐ (base word, NOT subcategory)
 * 
 * When حیوانات subcategory completes:
 *   [سگ، گربه، گاو، گوسفند] → [حیوانات، انسان‌ها، گیاهان، باکتری‌ها]
 *   Then these 4 can complete → موجودات زنده
 * 
 * Other categories are regular (no subcategories)
 */

const level3: LevelData = {
  levelNumber: 3,
  totalSteps: 7,
  words: [
    // حیوانات subcategory (will merge) - 4 words
    { id: '1', text: 'سگ', category: 'حیوانات' },
    { id: '2', text: 'گربه', category: 'حیوانات' },
    { id: '3', text: 'گاو', category: 'حیوانات' },
    { id: '4', text: 'گوسفند', category: 'حیوانات' },
    
    // موجودات زنده - other base words (hidden until حیوانات merges) - 3 words
    { id: '5', text: 'انسان‌ها', category: 'موجودات_زنده' },
    { id: '6', text: 'گیاهان', category: 'موجودات_زنده' },
    { id: '7', text: 'باکتری‌ها', category: 'موجودات_زنده' },
    
    // طبیعت - 4 words
    { id: '8', text: 'کوه', category: 'طبیعت' },
    { id: '9', text: 'دریا', category: 'طبیعت' },
    { id: '10', text: 'رودخانه', category: 'طبیعت' },
    { id: '11', text: 'جنگل', category: 'طبیعت' },
    
    // موسیقی - 4 words
    { id: '12', text: 'گیتار', category: 'موسیقی' },
    { id: '13', text: 'ویولن', category: 'موسیقی' },
    { id: '14', text: 'سنتور', category: 'موسیقی' },
    { id: '15', text: 'دهل', category: 'موسیقی' },
    
    // آشپزخانه - 4 words
    { id: '16', text: 'سینک', category: 'آشپزخانه' },
    { id: '17', text: 'گاز', category: 'آشپزخانه' },
    { id: '18', text: 'قوری', category: 'آشپزخانه' },
    { id: '19', text: 'قابلمه', category: 'آشپزخانه' },
    
    // لوازم الکترونیک - 4 words
    { id: '20', text: 'تلویزیون', category: 'لوازم_الکترونیک' },
    { id: '21', text: 'یخچال', category: 'لوازم_الکترونیک' },
    { id: '22', text: 'لباسشویی', category: 'لوازم_الکترونیک' , hidden: true},
    { id: '23', text: 'اتو', category: 'لوازم_الکترونیک' , hidden: true},
    
    // آب و هوا - 4 words
    { id: '24', text: 'آفتاب', category: 'آب_و_هوا' , hidden: true},
    { id: '25', text: 'ابر', category: 'آب_و_هوا' },
    { id: '26', text: 'باران', category: 'آب_و_هوا' },
    { id: '27', text: 'باد', category: 'آب_و_هوا' },
  ],
  categories: {
    'حیوانات': 'حیوانات',
    'موجودات_زنده': 'موجودات زنده',
    'طبیعت': 'طبیعت',
    'موسیقی': 'موسیقی',
    'آشپزخانه': 'آشپزخانه',
    'لوازم_الکترونیک': 'لوازم الکترونیک',
    'آب_و_هوا': 'آب و هوا',
  },
  // Only ONE subcategory: حیوانات merges into موجودات_زنده
  hierarchy: {
    subcategory: {
      category: 'حیوانات',
      mergesInto: 'موجودات_زنده',
      displayAfterMerge: 'حیوانات',
      // These 3 words will fill the empty spaces after merge
      wordsToReveal: ['آفتاب', 'اتو', 'لباسشویی'],
      // Icon metadata for the merged group
      icon: {
        id: 'animals_group',
        label: 'حیوانات',
        emoji: '🐾', // Paw prints emoji as fallback
        iconName: 'Dog' // Lucide icon name
      }
    }
  }
};


export default level3;
