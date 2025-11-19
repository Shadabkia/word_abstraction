export interface Word {
  id: string;
  text: string;
  category: string;
  hidden?: boolean; // For words revealed after subcategory merge
  meta?: {
    en?: string;
    finglish?: string;
  };
  // Icon support for merged groups
  icon?: {
    id: string;        // Unique identifier for icon mapping
    label?: string;    // Display name next to icon
    emoji?: string;    // Emoji fallback if icon not available
    iconName?: string; // Icon name from icon library (e.g., 'Dog', 'Cat')
  };
  isMergedGroup?: boolean; // Indicates this is a merged word group
}

export interface SubcategoryInfo {
  category: string;              // Subcategory ID (e.g., 'حیوانات')
  mergesInto: string;            // Parent category ID (e.g., 'موجودات_زنده')
  displayAfterMerge: string;     // Text shown after merge (e.g., 'حیوانات')
  wordsToReveal: string[];       // Words to reveal after merge
  icon?: {                       // Icon metadata for merged group
    id: string;
    label?: string;
    emoji?: string;
    iconName?: string;
  };
}

export interface HierarchyInfo {
  subcategory?: SubcategoryInfo; // Single subcategory that merges
}

export interface LevelData {
  levelNumber: number;
  words: Word[];
  categories: Record<string, string>;
  totalSteps: number;            // Total completion steps
  hierarchy?: HierarchyInfo;     // Optional hierarchical structure
}

