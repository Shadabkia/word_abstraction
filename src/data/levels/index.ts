import { LevelData } from '../types';
import level1 from './level1';
import level2 from './level2';

// Add more levels here as you create them
// import level3 from './level3';

const levels: Record<number, LevelData> = {
  1: level1,
  2: level2,
  // 3: level3,
};

/**
 * Get level data by level number
 * @param levelNumber - The level number (1, 2, 3, etc.)
 * @returns Level data or undefined if level doesn't exist
 */
export function getLevelData(levelNumber: number): LevelData | undefined {
  return levels[levelNumber];
}

/**
 * Check if a level exists
 * @param levelNumber - The level number to check
 * @returns true if level exists, false otherwise
 */
export function hasLevel(levelNumber: number): boolean {
  return levelNumber in levels;
}

/**
 * Get total number of available levels
 */
export function getTotalLevels(): number {
  return Object.keys(levels).length;
}

export default levels;

