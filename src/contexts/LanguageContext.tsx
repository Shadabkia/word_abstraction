import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fa' | 'en';

interface Translations {
  // Settings Dialog
  settings: string;
  language: string;
  sound: string;
  selectLanguage: string;
  
  // Language names
  persian: string;
  english: string;
  
  // Game UI
  level: string;
  category: string;
  categories: string;
  gameInstruction: string;
  
  // Common
  close: string;
  save: string;
  cancel: string;
}

const translations: Record<Language, Translations> = {
  fa: {
    // Settings Dialog
    settings: 'تنظیمات',
    language: 'زبان',
    sound: 'صدا',
    selectLanguage: 'انتخاب زبان',
    
    // Language names
    persian: 'فارسی',
    english: 'English',
    
    // Game UI
    level: 'مرحله',
    category: 'دسته',
    categories: 'دسته‌بندی',
    gameInstruction: 'چهار کلمه از یک دسته را در یک ردیف قرار دهید',
    
    // Common
    close: 'بستن',
    save: 'ذخیره',
    cancel: 'انصراف',
  },
  en: {
    // Settings Dialog
    settings: 'Settings',
    language: 'Language',
    sound: 'Sound',
    selectLanguage: 'Select Language',
    
    // Language names
    persian: 'Persian',
    english: 'English',
    
    // Game UI
    level: 'Level',
    category: 'Category',
    categories: 'Categories',
    gameInstruction: 'Place four words from one category in a row',
    
    // Common
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fa');

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

