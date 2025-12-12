import chapter1Meta from './chapter1/meta.json';
import chapter2Meta from './chapter2/meta.json';
import chapter3Meta from './chapter3/meta.json';
import chapter4Meta from './chapter4/meta.json';
import chapter5Meta from './chapter5/meta.json';
import chapter6Meta from './chapter6/meta.json';
import chapter7Meta from './chapter7/meta.json';
import chapter8Meta from './chapter8/meta.json';
import chapter9Meta from './chapter9/meta.json';
import chapter10Meta from './chapter10/meta.json';

export interface LevelMetadata {
  number: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  chapter: string;
  fileName: string;
}

/**
 * Get all available levels for Word Connect game
 * Returns a flat list of all levels across all chapters
 */
export function getAllWordConnectLevels(): LevelMetadata[] {
  const chapters = [
    { meta: chapter1Meta, folder: 'chapter1', startLevel: 1 },
    { meta: chapter2Meta, folder: 'chapter2', startLevel: 6 },
    { meta: chapter3Meta, folder: 'chapter3', startLevel: 11 },
    { meta: chapter4Meta, folder: 'chapter4', startLevel: 16 },
    { meta: chapter5Meta, folder: 'chapter5', startLevel: 21 },
    { meta: chapter6Meta, folder: 'chapter6', startLevel: 26 },
    { meta: chapter7Meta, folder: 'chapter7', startLevel: 31 },
    { meta: chapter8Meta, folder: 'chapter8', startLevel: 36 },
    { meta: chapter9Meta, folder: 'chapter9', startLevel: 41 },
    { meta: chapter10Meta, folder: 'chapter10', startLevel: 46 },
  ];

  const allLevels: LevelMetadata[] = [];

  chapters.forEach((chapter, chapterIndex) => {
    chapter.meta.levels.forEach((levelFile, levelIndex) => {
      const levelNumber = chapter.startLevel + levelIndex;
      
      // Determine difficulty based on level number
      let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
      if (levelNumber > 30) difficulty = 'hard';
      else if (levelNumber > 15) difficulty = 'medium';

      allLevels.push({
        number: levelNumber,
        name: chapter.meta.name,
        difficulty,
        chapter: chapter.folder,
        fileName: levelFile,
      });
    });
  });

  return allLevels;
}

/**
 * Get level metadata by level number
 */
export function getLevelMetadata(levelNumber: number): LevelMetadata | undefined {
  const allLevels = getAllWordConnectLevels();
  return allLevels.find(level => level.number === levelNumber);
}

