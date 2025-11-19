import { Word, LevelData } from '../data/types';

const API_BASE = '/api';

interface DBGroup {
  id: number;
  word1_fa: string;
  word2_fa: string;
  word3_fa: string;
  word4_fa: string;
  word1_en: string;
  word2_en: string;
  word3_en: string;
  word4_en: string;
  word1_finglish: string;
  word2_finglish: string;
  word3_finglish: string;
  word4_finglish: string;
  relation_clean: string;
  relation_clean_en: string;
  difficulty: string;
  icon_enabled: number;
  icon_label?: string;
  icon_emoji?: string;
  icon_name?: string;
}

interface DBLevel {
  id: number;
  name: string;
  name_en?: string;
  difficulty: string;
  status: string;
  group_ids: number[];
  icon_conversions: Record<string, boolean>;
  groups: DBGroup[];
}

/**
 * Fetches a level from the database by ID
 */
export async function loadLevelFromDB(levelId: number): Promise<LevelData | null> {
  try {
    const response = await fetch(`${API_BASE}/levels/${levelId}`);
    if (!response.ok) {
      console.error('Failed to load level:', response.statusText);
      return null;
    }
    
    const dbLevel: DBLevel = await response.json();
    return convertDBLevelToGameFormat(dbLevel);
  } catch (error) {
    console.error('Error loading level:', error);
    return null;
  }
}

/**
 * Fetches all published levels from the database
 */
export async function loadPublishedLevels(): Promise<DBLevel[]> {
  try {
    const response = await fetch(`${API_BASE}/levels`);
    if (!response.ok) {
      return [];
    }
    
    const levels: DBLevel[] = await response.json();
    return levels.filter(level => level.status === 'published');
  } catch (error) {
    console.error('Error loading levels:', error);
    return [];
  }
}

/**
 * Converts a database level to the game's LevelData format
 */
function convertDBLevelToGameFormat(dbLevel: DBLevel): LevelData {
  const words: Word[] = [];
  const categories: Record<string, string> = {};
  
  // Convert each group to words
  dbLevel.groups.forEach((group, groupIndex) => {
    const categoryId = `cat_${group.id}`;
    const shouldConvertToIcon = dbLevel.icon_conversions[group.id];
    
    // Store category name
    categories[categoryId] = group.relation_clean;
    
    // Add the 4 words from this group
    [1, 2, 3, 4].forEach((wordNum) => {
      const wordKey = `word${wordNum}` as const;
      const word: Word = {
        id: `word_${group.id}_${wordNum}`,
        text: group[`${wordKey}_fa`],
        category: categoryId,
        // Store additional metadata if needed
        meta: {
          en: group[`${wordKey}_en`],
          finglish: group[`${wordKey}_finglish`]
        }
      };
      
      // NOTE: Icon metadata should NOT be added to individual words
      // Icons are only added to merged tiles after matching (in handleSubcategoryCompletion)
      // The icon_enabled and icon_* fields are stored for use during merge, not before
      
      words.push(word);
    });
  });
  
  return {
    levelNumber: dbLevel.id,
    words,
    categories,
    totalSteps: dbLevel.groups.length, // Each group completion is a step
    // Hierarchy can be added here if we implement subcategory logic
  };
}

/**
 * Helper to check if database is available
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/levels`, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

