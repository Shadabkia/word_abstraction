import type React from 'react';
import WordConnectGame from '@/games/word-connect/WordConnectGame';

export type GameId = 'word-connect';

export type GameLaunchRef = {
  gameId: GameId;
  levelId: string | number;
  /**
   * The mode this game was launched from.
   * - 'career': Story campaign mode (Dashboard/Profile)
   * - 'arcade': Standalone arcade mode
   */
  mode: 'career' | 'arcade';
  /**
   * When set, completion should mark this campaign level as complete.
   * Example: "level_1"
   * Only used in career mode.
   */
  campaignLevelId?: string;
};

export type GameRegistryEntry = {
  id: GameId;
  Component: React.ComponentType<any>;
  /**
   * Convert the generic launch ref into the props this game expects.
   * Keeps each game module independent of app-wide launch shape.
   */
  buildProps: (ref: GameLaunchRef) => Record<string, unknown>;
};

export const gameRegistry: Record<GameId, GameRegistryEntry> = {
  'word-connect': {
    id: 'word-connect',
    Component: WordConnectGame,
    buildProps: (ref) => ({
      initialLevel: typeof ref.levelId === 'number' ? ref.levelId : Number(ref.levelId),
      gameMode: ref.mode, // Pass the mode to the game
    }),
  },
};


