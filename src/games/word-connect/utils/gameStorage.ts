import { Preferences } from '@capacitor/preferences';
import { Word, LevelData } from '../data/types';

interface GridRow {
  type: 'words' | 'completed';
  words?: Word[];
  completed?: {
    name: string;
    words: string[];
  };
}

export interface LevelProgress {
  levelNumber: number;
  mergedSubcategoriesCount: number;
  completedCategoriesCount: number;
  gridRows: GridRow[];
  hiddenPool: Word[];
  timestamp: number;
}

export interface GameState {
  currentLevel: number;
  levelProgress: { [levelNumber: number]: LevelProgress };
}

const STORAGE_KEY = 'wordAbstractionGameState';

class GameStorage {
  /**
   * Save the current game state
   */
  async saveGameState(state: GameState): Promise<void> {
    try {
      await Preferences.set({
        key: STORAGE_KEY,
        value: JSON.stringify(state)
      });
      console.log('Game state saved successfully');
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }

  /**
   * Load the saved game state
   */
  async loadGameState(): Promise<GameState | null> {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEY });
      if (value) {
        const state = JSON.parse(value) as GameState;
        console.log('Game state loaded successfully');
        return state;
      }
      return null;
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  }

  /**
   * Save progress for a specific level
   */
  async saveLevelProgress(
    levelNumber: number,
    gridRows: GridRow[],
    hiddenPool: Word[],
    mergedSubcategoriesCount: number,
    completedCategoriesCount: number
  ): Promise<void> {
    try {
      // Load existing state
      const existingState = await this.loadGameState() || {
        currentLevel: levelNumber,
        levelProgress: {}
      };

      // Update level progress
      existingState.levelProgress[levelNumber] = {
        levelNumber,
        mergedSubcategoriesCount,
        completedCategoriesCount,
        gridRows,
        hiddenPool,
        timestamp: Date.now()
      };

      // Save updated state
      await this.saveGameState(existingState);
    } catch (error) {
      console.error('Failed to save level progress:', error);
    }
  }

  /**
   * Get progress for a specific level
   */
  async getLevelProgress(levelNumber: number): Promise<LevelProgress | null> {
    try {
      const state = await this.loadGameState();
      if (state && state.levelProgress[levelNumber]) {
        return state.levelProgress[levelNumber];
      }
      return null;
    } catch (error) {
      console.error('Failed to get level progress:', error);
      return null;
    }
  }

  /**
   * Save the current level number
   */
  async saveCurrentLevel(levelNumber: number): Promise<void> {
    try {
      const existingState = await this.loadGameState() || {
        currentLevel: levelNumber,
        levelProgress: {}
      };

      existingState.currentLevel = levelNumber;
      await this.saveGameState(existingState);
    } catch (error) {
      console.error('Failed to save current level:', error);
    }
  }

  /**
   * Get the last played level number
   */
  async getCurrentLevel(): Promise<number | null> {
    try {
      const state = await this.loadGameState();
      return state?.currentLevel || null;
    } catch (error) {
      console.error('Failed to get current level:', error);
      return null;
    }
  }

  /**
   * Clear progress for a specific level
   */
  async clearLevelProgress(levelNumber: number): Promise<void> {
    try {
      const existingState = await this.loadGameState();
      if (existingState && existingState.levelProgress[levelNumber]) {
        delete existingState.levelProgress[levelNumber];
        await this.saveGameState(existingState);
        console.log(`Level ${levelNumber} progress cleared`);
      }
    } catch (error) {
      console.error('Failed to clear level progress:', error);
    }
  }

  /**
   * Clear all game data (for testing or reset)
   */
  async clearAllData(): Promise<void> {
    try {
      await Preferences.remove({ key: STORAGE_KEY });
      console.log('All game data cleared');
    } catch (error) {
      console.error('Failed to clear game data:', error);
    }
  }

  /**
   * Check if a level is completed (all steps done)
   */
  isLevelCompleted(progress: LevelProgress, totalSteps: number): boolean {
    const completedSteps = progress.mergedSubcategoriesCount + progress.completedCategoriesCount;
    return completedSteps >= totalSteps;
  }
}

export const gameStorage = new GameStorage();

