export interface Word {
  id: string;
  text: string;
  category: string;
}

export interface LevelData {
  levelNumber: number;
  words: Word[];
  categories: Record<string, string>;
}

