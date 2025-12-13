# Pars Ra Pas — Technical Architecture

**Last Updated:** Dec 9, 2025  
**Status:** Phase 4 Complete

This document defines the technical decisions, patterns, and structure of the platform.

## 1. Tech Stack
-   **Framework:** React (Vite)
-   **Language:** TypeScript
-   **State Management:** Zustand (Global State), React Context (Theme/Language)
-   **Styling:** Tailwind CSS + Framer Motion (Animations)
-   **Icons:** Lucide React
-   **Build Target:** Web / Capacitor (Android/iOS)
-   **Responsiveness:** Mobile-Only (Desktop uses Device Simulator)

## 2. Directory Structure & Modules
We follow a **Feature-Based Architecture**.

```
src/
├── assets/
│   └── content/           # JSON content files (posts, messages, NPCs)
├── core/                  # Business logic, state, domain types (No UI)
│   ├── domain/            # TypeScript interfaces (Entities)
│   ├── state/             # Zustand stores (gameState, settingsStore)
│   └── services/          # Content manager, data loaders
├── features/              # Feature Modules (UI + Logic)
│   ├── dashboard/         # Home tab with hero card
│   ├── feed/              # Social feed with posts & stories
│   ├── arcade/            # Game library
│   ├── messages/          # DM inbox (read-only)
│   └── profile/           # Campaign progression (IG-style)
├── games/                 # Pluggable Game Engines
│   └── word-connect/      # Independent module
├── shared/                # Reusable across features
│   ├── ui/                # Generic UI components (Buttons, Dialogs)
│   └── utils/             # Helpers (iconMapper, etc.)
└── App.tsx                # Main Shell & Router
```

## 3. State Management Strategy
We distinguish between **Session State** and **Persistent State**.

### 3.1 Persistent State (Zustand + LocalStorage)
Tracks long-term progress.
-   **Store:** `useGameState`
-   **Slices:**
    -   `user`: { id, name, avatar, coins, vibes }
    -   `progress`: { completedLevels: [], unlockedChapters: [], highScores: {} }
    -   `feed`: { seenPosts: [], unlockedStories: [] }
    -   `inbox`: { readMessages: [], activeThreads: [] }
-   **Actions:**
    -   `completeLevel(levelId, score, stars)`: Marks level complete, updates scores, adds coins
    -   `unlockChapter(chapterId)`: Unlocks new chapter
    -   `markMessageRead(messageId)`: Marks message as read

### 3.2 Settings State (Zustand + LocalStorage)
Tracks app preferences.
-   **Store:** `useSettingsStore`
-   **State:** { language, soundEnabled, musicEnabled, hapticsEnabled }

### 3.3 Feature/Local State (React `useState`)
UI-only state that resets on navigation.
-   Tab selection
-   Scroll position
-   Animation states

## 4. Game Module Interface
All games (Word Connect, etc.) must implement a standard contract to be hosted in the Arcade or Campaign.

### 4.1 Integration Contract
Games are mounted as React components with specific props:

```typescript
interface GameModuleProps {
  levelId: string | number;        // The level to load
  onComplete: (result: GameSessionResult) => void;
  onExit: () => void;
  settings?: {
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };
}
```

### 4.2 Current Games
-   **Word Connect**: 4x4 grid word categorization puzzle (fully integrated)
-   Future: Word Search, Crossword, Guess The Word, etc.

## 5. Content System (Data-Driven Design)
Content is stored in `src/assets/content` as JSON and managed by `ContentManager`.

### 5.1 Content Files
-   `npcs.json`: Character data (name, handle, bio)
-   `posts.json`: Social feed posts with unlock conditions
-   `messages.json`: Message threads with unlock conditions
-   `chapters.json`: Campaign chapters with prerequisites

### 5.2 Unlock Conditions
Content can have unlock conditions:
```json
{
  "unlockCondition": {
    "type": "level_complete",
    "targetId": "level_5"
  }
}
```

### 5.3 Content Manager API
```typescript
contentManager.getUnlockedPosts(completedLevels)
contentManager.getUnlockedThreads(completedLevels)
contentManager.getUnlockedChapters(completedLevels)
```

### 5.4 Schema Versioning
All JSON files include a `"version": 1` field to allow future migrations.

## 6. Navigation & Game Flow
-   The `App.tsx` shell manages the top-level 5-tab navigation.
-   When a game is active (`activeGame` state is not null), the shell unmounts tabs and renders the game module full-screen.
-   On game completion, `onComplete` callback updates `gameState`, which triggers content unlocks across Feed/Messages/Profile.
-   Exit button returns to the Arcade tab.

## 7. Future Enhancements
-   **Debug Overlay**: Inspect state, unlock all content, jump to levels
-   **Routing**: Deep linking to specific tabs/levels
-   **Animations**: Tab transitions, micro-interactions
-   **Analytics**: Track player progression
