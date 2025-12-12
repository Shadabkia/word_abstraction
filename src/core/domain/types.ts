// Common interfaces for the game platform

// --- Game Engine ---

export interface GameConfig {
  id: string;
  type: string; // 'word-connect' | 'word-search' | etc.
  difficulty?: number;
  seed?: string;
  // Dynamic config specific to each game type
  [key: string]: any;
}

export interface GameSessionResult {
  score: number;
  stars: number;
  completed: boolean;
  timeElapsed?: number;
  moves?: number;
}

export interface GameModuleProps {
  levelId: string | number; // The level to load
  onComplete: (result: GameSessionResult) => void;
  onExit: () => void;
  // Optional settings passed from platform
  settings?: {
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };
}

// --- Campaign & Story ---

export interface Chapter {
  id: string;
  index: number;
  title: string;
  description: string;
  city: string; // The location context
  coverImage?: string;
  requiredLevelId?: string; // Prerequisite to unlock
}

export interface Level {
  id: string;
  chapterId: string;
  gameType: string; // Which game engine to use
  levelNumber: number;
  title?: string;
  config: GameConfig; // Configuration passed to the game engine
  isLocked?: boolean;
  isCompleted?: boolean;
  score?: number;
  stars?: number;
}

// --- Social Feed ---

export interface NPC {
  id: string;
  name: string;
  handle: string; // @username
  avatar: string;
  bio?: string;
}

export interface Comment {
  id: string;
  authorId: string; // NPC id
  text: string;
  likes: number;
  timestamp: number; // Relative time or timestamp
}

export interface StoryPost {
  id: string;
  authorId: string;
  image?: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: number;
  unlockCondition?: {
    type: 'level_complete' | 'chapter_unlock';
    targetId: string;
  };
}

// --- Messages ---

export interface Message {
  id: string;
  senderId: string; // NPC id or 'player'
  text: string;
  image?: string;
  timestamp: number;
  isRead: boolean;
  type: 'text' | 'image' | 'quest' | 'system';
  actionLink?: string; // e.g., "goto:level:5"
  unlockCondition?: {
    type: 'level_complete' | 'chapter_unlock';
    targetId: string;
  };
}

export interface MessageThread {
  id: string;
  participantId: string; // NPC id
  messages: Message[];
  lastMessagePreview: string;
  lastMessageTime: number;
  unreadCount: number;
}
