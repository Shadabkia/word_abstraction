export interface Word {
  id: string;
  text: string;
  category: string;
  hidden?: boolean; // For words revealed after subcategory merge
}

export interface SubcategoryInfo {
  category: string;              // Subcategory ID (e.g., 'حیوانات')
  mergesInto: string;            // Parent category ID (e.g., 'موجودات_زنده')
  displayAfterMerge: string;     // Text shown after merge (e.g., 'حیوانات')
  wordsToReveal: string[];       // Words to reveal after merge
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

