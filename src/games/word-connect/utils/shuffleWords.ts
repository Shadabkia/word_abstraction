import { Word } from '../data/types';

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Check if a row has 4 words from the same category
 */
function hasCompleteCategory(row: Word[]): boolean {
  if (row.length !== 4) return false;
  
  const categoryCount: Record<string, number> = {};
  for (const word of row) {
    categoryCount[word.category] = (categoryCount[word.category] || 0) + 1;
    if (categoryCount[word.category] === 4) {
      return true;
    }
  }
  return false;
}

/**
 * Check if any row in the grid has 4 words from the same category
 */
function hasAnyCompleteRow(words: Word[]): boolean {
  const rowSize = 4;
  for (let i = 0; i < words.length; i += rowSize) {
    const row = words.slice(i, i + rowSize);
    if (hasCompleteCategory(row)) {
      return true;
    }
  }
  return false;
}

/**
 * Shuffle words ensuring no row has 4 words from the same category
 * @param words - Array of words to shuffle
 * @param maxAttempts - Maximum number of shuffle attempts (default: 100)
 * @returns Shuffled array where no row contains a complete category
 */
export function shuffleWordsWithConstraint(words: Word[], maxAttempts: number = 100): Word[] {
  let attempts = 0;
  let shuffled = shuffleArray(words);
  
  // Keep shuffling until we find a valid arrangement or reach max attempts
  while (hasAnyCompleteRow(shuffled) && attempts < maxAttempts) {
    shuffled = shuffleArray(words);
    attempts++;
  }
  
  // If we couldn't find a valid arrangement after max attempts,
  // try a smarter approach: distribute categories evenly
  if (hasAnyCompleteRow(shuffled)) {
    shuffled = distributeCategories(words);
  }
  
  return shuffled;
}

/**
 * Smart distribution: Place words so categories are spread across rows
 */
function distributeCategories(words: Word[]): Word[] {
  // Group words by category
  const categoryGroups: Record<string, Word[]> = {};
  for (const word of words) {
    if (!categoryGroups[word.category]) {
      categoryGroups[word.category] = [];
    }
    categoryGroups[word.category].push(word);
  }
  
  // Shuffle each category group
  const categories = Object.keys(categoryGroups);
  for (const category of categories) {
    categoryGroups[category] = shuffleArray(categoryGroups[category]);
  }
  
  // Distribute words by taking one from each category in rotation
  const result: Word[] = [];
  const rowSize = 4;
  const totalWords = words.length;
  
  let categoryIndex = 0;
  while (result.length < totalWords) {
    const category = categories[categoryIndex % categories.length];
    if (categoryGroups[category].length > 0) {
      result.push(categoryGroups[category].shift()!);
    }
    categoryIndex++;
  }
  
  // Final shuffle with constraint check
  let finalArrangement = result;
  let attempts = 0;
  while (hasAnyCompleteRow(finalArrangement) && attempts < 50) {
    // Swap random positions to break any complete rows
    const i = Math.floor(Math.random() * finalArrangement.length);
    const j = Math.floor(Math.random() * finalArrangement.length);
    [finalArrangement[i], finalArrangement[j]] = [finalArrangement[j], finalArrangement[i]];
    attempts++;
  }
  
  return finalArrangement;
}

