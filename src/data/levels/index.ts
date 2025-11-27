import { loadLevel } from '../../utils/levelLoader';
import { LevelData } from '../types';

/**
 * Gets level data by level number
 * Dynamically loads from JSON files
 */
export async function getLevelDataAsync(levelNumber: number): Promise<LevelData | null> {
  return loadLevel(levelNumber);
}

/**
 * Synchronous version for backward compatibility
 * Returns null - use getLevelDataAsync instead
 * @deprecated Use getLevelDataAsync for dynamic level loading
 */
export function getLevelData(levelNumber: number): LevelData | null {
  console.warn('getLevelData is deprecated. Use getLevelDataAsync instead.');
  return null;
}

// Export for convenience
export { loadLevel, loadAllLevels, getAvailableLevels } from '../../utils/levelLoader';
