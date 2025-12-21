import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  id: string;
  name: string;
  avatar: string;
  coins: number;
  vibes: number; // Soft currency / XP
  badges: string[]; // List of owned badge IDs
  streak: number;
  followers: number;
  following: number;
}

interface ProgressState {
  // Career mode progress (story campaign)
  career: {
    completedLevels: string[]; // List of campaign level IDs
    unlockedChapters: string[]; // List of chapter IDs
    highScores: Record<string, number>; // levelId -> score
  };
  // Arcade mode progress (standalone play)
  arcade: {
    completedLevels: string[]; // List of arcade level IDs
    highScores: Record<string, number>; // levelId -> score
  };
}

interface FeedState {
  seenPosts: string[]; // IDs of posts the user has scrolled past
  unlockedStories: string[]; // IDs of daily stories available
}

interface InboxState {
  readMessages: string[]; // IDs of messages read
  activeThreads: string[]; // IDs of threads that are visible
}

interface GameState {
  user: UserState;
  progress: ProgressState;
  feed: FeedState;
  inbox: InboxState;

  // Actions
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addVibes: (amount: number) => void;
  spendVibes: (amount: number) => boolean;
  addBadge: (badgeId: string) => void;
  completeLevel: (levelId: string, score: number, stars: number, mode: 'career' | 'arcade') => void;
  unlockChapter: (chapterId: string) => void;
  markMessageRead: (messageId: string) => void;
  resetProgress: () => void;
}

// Initial state values
const initialUser: UserState = {
  id: 'player_1',
  name: 'Kian',
  avatar: 'default_avatar',
  coins: 100,
  vibes: 100,
  badges: [],
  streak: 0,
  followers: 42,
  following: 12,
};

const initialProgress: ProgressState = {
  career: {
    completedLevels: [],
    unlockedChapters: ['chapter_1'],
    highScores: {},
  },
  arcade: {
    completedLevels: [],
    highScores: {},
  },
};

// Helper to ensure progress has the correct structure
const ensureProgressStructure = (progress: any): ProgressState => {
  // If progress already has the new structure, return it
  if (progress?.career && progress?.arcade) {
    return progress as ProgressState;
  }
  
  // If progress has the old structure, migrate it
  if (progress?.completedLevels) {
    console.log('Auto-migrating old progress structure...');
    return {
      career: {
        completedLevels: progress.completedLevels || [],
        unlockedChapters: progress.unlockedChapters || ['chapter_1'],
        highScores: progress.highScores || {},
      },
      arcade: {
        completedLevels: [],
        highScores: {},
      },
    };
  }
  
  // Fallback to initial state
  return initialProgress;
};

export const useGameState = create<GameState>()(
  persist(
    (set, get) => ({
      user: initialUser,
      progress: initialProgress,
      feed: { seenPosts: [], unlockedStories: [] },
      inbox: { readMessages: [], activeThreads: [] },

      addCoins: (amount) =>
        set((state) => ({
          user: { ...state.user, coins: state.user.coins + amount },
        })),

      spendCoins: (amount) => {
        const { user } = get();
        if (user.coins < amount) return false;
        set({ user: { ...user, coins: user.coins - amount } });
        return true;
      },

      addVibes: (amount) =>
        set((state) => ({
          user: { ...state.user, vibes: Math.min(state.user.vibes + amount, 100) }, // Cap at 100? Or unlimited? Spec implies meter, so maybe 100.
        })),

      spendVibes: (amount) => {
        const { user } = get();
        if (user.vibes < amount) return false;
        set({ user: { ...user, vibes: user.vibes - amount } });
        return true;
      },

      addBadge: (badgeId) =>
        set((state) => ({
          user: {
            ...state.user,
            badges: state.user.badges.includes(badgeId)
              ? state.user.badges
              : [...state.user.badges, badgeId],
          },
        })),

      completeLevel: (levelId, score, stars, mode) =>
        set((state) => {
          const modeProgress = state.progress[mode];
          const isNewCompletion = !modeProgress.completedLevels.includes(levelId);
          
          console.log('[GameState] completeLevel called:', {
            levelId,
            mode,
            isNewCompletion,
            currentCareerLevels: state.progress.career.completedLevels,
            currentArcadeLevels: state.progress.arcade.completedLevels,
          });
          
          const newState = {
            progress: {
              ...state.progress,
              [mode]: {
                ...modeProgress,
                completedLevels: isNewCompletion
                  ? [...modeProgress.completedLevels, levelId]
                  : modeProgress.completedLevels,
                highScores: {
                  ...modeProgress.highScores,
                  [levelId]: Math.max(modeProgress.highScores[levelId] || 0, score),
                },
              },
            },
            // Add coins only on first career completion (not arcade)
            user: isNewCompletion && mode === 'career'
              ? { ...state.user, coins: state.user.coins + 10 }
              : state.user,
          };
          
          console.log('[GameState] After completion:', {
            careerLevels: newState.progress.career.completedLevels,
            arcadeLevels: newState.progress.arcade.completedLevels,
          });
          
          return newState;
        }),

      unlockChapter: (chapterId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            career: {
              ...state.progress.career,
              unlockedChapters: state.progress.career.unlockedChapters.includes(chapterId)
                ? state.progress.career.unlockedChapters
                : [...state.progress.career.unlockedChapters, chapterId],
            },
          },
        })),

      markMessageRead: (messageId) =>
        set((state) => ({
          inbox: {
            ...state.inbox,
            readMessages: state.inbox.readMessages.includes(messageId)
              ? state.inbox.readMessages
              : [...state.inbox.readMessages, messageId],
          },
        })),

      resetProgress: () =>
        set({
          user: initialUser,
          progress: initialProgress,
          feed: { seenPosts: [], unlockedStories: [] },
          inbox: { readMessages: [], activeThreads: [] },
        }),
    }),
    {
      name: 'pars-ra-pas-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      version: 1, // Increment this when making breaking changes
      migrate: (persistedState: any, version: number) => {
        try {
          // Migration from old structure to new structure
          if (persistedState?.state?.progress) {
            const oldProgress = persistedState.state.progress;
            
            // Ensure progress has the correct structure
            persistedState.state.progress = ensureProgressStructure(oldProgress);
          }
          
          return persistedState;
        } catch (error) {
          console.error('Migration failed, resetting to initial state:', error);
          // Return a clean state if migration fails
          return {
            state: {
              user: initialUser,
              progress: initialProgress,
              feed: { seenPosts: [], unlockedStories: [] },
              inbox: { readMessages: [], activeThreads: [] },
            },
            version: 1,
          };
        }
      },
      // Add error handling for storage operations
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('Failed to rehydrate state:', error);
          } else if (state) {
            // Ensure progress structure is correct after rehydration
            state.progress = ensureProgressStructure(state.progress);
          }
        };
      },
    }
  )
);

