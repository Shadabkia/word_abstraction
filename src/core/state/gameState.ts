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
  completedLevels: string[]; // List of level IDs
  unlockedChapters: string[]; // List of chapter IDs
  highScores: Record<string, number>; // levelId -> score
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
  completeLevel: (levelId: string, score: number, stars: number) => void;
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
  completedLevels: [],
  unlockedChapters: ['chapter_1'],
  highScores: {},
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

      completeLevel: (levelId, score, stars) =>
        set((state) => {
          const isNewCompletion = !state.progress.completedLevels.includes(levelId);
          return {
            progress: {
              ...state.progress,
              completedLevels: isNewCompletion
                ? [...state.progress.completedLevels, levelId]
                : state.progress.completedLevels,
              highScores: {
                ...state.progress.highScores,
                [levelId]: Math.max(state.progress.highScores[levelId] || 0, score),
              },
            },
            // Example: Add coins on first completion
            user: isNewCompletion
              ? { ...state.user, coins: state.user.coins + 10 }
              : state.user,
          };
        }),

      unlockChapter: (chapterId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            unlockedChapters: state.progress.unlockedChapters.includes(chapterId)
              ? state.progress.unlockedChapters
              : [...state.progress.unlockedChapters, chapterId],
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
    }
  )
);

