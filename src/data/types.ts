// New JSON-based level format

export interface TileVisuals {
  icon_enabled?: boolean;
  icon_id?: string | null;      // Kebab-case icon ID from iconRegistry
  icon_type?: 'library' | 'emoji' | null;  // Type is inferred from registry, but can be overridden
  color_hex?: string;
  animation_fx?: string;
}

export interface TileMeta {
  category?: string;
  complexity?: number;
  is_hidden_at_start?: boolean;
  en?: string;
  finglish?: string;
}

export interface Tile {
  id: string;
  text: string;
  type: 'word' | 'meta_group';
  visuals?: TileVisuals;
  meta?: TileMeta;
}

export interface Dictionary {
  comment?: string;
  tiles: Tile[];
}

export interface GroupRequirements {
  trigger_ids: string[];
}

export interface GroupOutcomes {
  reveal_ids?: string[];
  sound_fx?: string;
  action?: string;
  visual_feedback?: string;
}

export interface GroupMeta {
  hint_text?: string;
}

export interface Group {
  id: string;
  display_name: string;
  behavior: 'transform' | 'final' | 'standard';
  requirements: GroupRequirements;
  outcomes?: GroupOutcomes;
  meta?: GroupMeta;
}

export interface Mechanics {
  groups: Group[];
}

export interface Layout {
  rows: number;
  cols: number;
  initial_grid: string[][];
}

export interface LevelConstraints {
  time_limit_sec?: number;
  max_moves?: number;
}

export interface LevelMeta {
  id: string;
  version: string;
  title: string;
  description?: string;
  author?: string;
  difficulty: number;
  tags?: string[];
  constraints?: LevelConstraints;
  levelNumber?: number; // Global level number injected at runtime
  chapter?: {
    id: string;
    name: string;
  };
}

export interface ChapterMeta {
  id: string;
  name: string;
  description?: string;
  levels: string[]; // List of filenames relative to chapter folder
}


export interface LevelJSON {
  meta: LevelMeta;
  dictionary: Dictionary;
  mechanics: Mechanics;
  layout: Layout;
}

// Legacy format (for backward compatibility during transition)
export interface Word {
  id: string;
  text: string;
  category: string;
  hidden?: boolean;
  meta?: {
    en?: string;
    finglish?: string;
  };
  icon?: {
    id: string;              // Kebab-case icon ID
    type?: 'library' | 'emoji';  // Icon type
    label?: string;          // Display label
    emoji?: string;          // Emoji character (if type is emoji)
    iconName?: string;       // Lucide icon name (if type is library) - DEPRECATED: use id instead
  };
  isMergedGroup?: boolean;
}

export interface SubcategoryInfo {
  category: string;
  mergesInto: string;
  displayAfterMerge: string;
  wordsToReveal: string[];
  icon?: {
    id: string;
    type?: 'library' | 'emoji';
    label?: string;
    emoji?: string;
    iconName?: string;
  };
}

export interface HierarchyInfo {
  subcategory?: SubcategoryInfo;
  subcategories?: SubcategoryInfo[];
}

export interface LevelData {
  levelNumber: number;
  words: Word[];
  categories: Record<string, string>;
  totalSteps: number;
  hierarchy?: HierarchyInfo;
  chapter?: {
    id: string;
    name: string;
  };
}
