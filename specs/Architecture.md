# Pars Ra Pas — Technical Architecture

**Last Updated:** Dec 9, 2025  
**Status:** Phase 4 Complete

This document defines the technical decisions, patterns, and structure of the platform.

## 1. Tech Stack
-   **Framework:** React (Vite)
-   **Language:** TypeScript
-   **State Management:** Zustand (Global State + persisted Settings), React Context (Language), Forge UI Provider (Theme)
-   **Styling:** Forge UI (single UI source of truth) + Tailwind CSS + Framer Motion (Animations)
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
│   ├── ui/                # Legacy UI components (temporary). New UI must come from forge-ui.
│   └── utils/             # Helpers (iconMapper, etc.)
├── forge-ui/              # UI system + theme registry (single source of truth)
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
-   **State:** { language, soundEnabled, musicEnabled, hapticsEnabled, themeMode, themePalette, themeAlive, themeConfig }

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

### 4.2 Game Launch Reference (Canonical)
All game launches in the app use a structured reference:

```ts
type GameLaunchRef = {
  gameId: string;                  // e.g. "word-connect"
  levelId: string | number;        // game-specific level address (number for Word Connect)
  campaignLevelId?: string;        // set when launched from Campaign so progression updates the correct campaign level
};
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
-   `campaign.json`: Campaign chapter/level index (IDs, mapping to game levels)
-   `campaign/levels/**`: Per-level narrative JSON (“Social Comic Post” content)
-   `public/campaign/images/**`: Comic slide images + silent start screen frames (served as `/campaign/images/**`)

#### Campaign Level → Game Mapping
Each campaign level must specify which game session it launches via a `gameRef`:
- `gameId` (which game module)
- `levelId` (which level inside that game)

This mapping may live in `campaign.json` and can be overridden per-level in `campaign/levels/**` for authoring convenience.

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
-   **Back behavior (mobile-first):**
    -   Back from an in-tab “detail” view (e.g., campaign post) returns to its tab root.
    -   Back from a game returns to the exact previous in-app view (tab root or in-tab detail).
    -   Tab switching does not add to the back stack (back should not “walk tabs”).

## 7. Future Enhancements
-   **Debug Overlay**: Inspect state, unlock all content, jump to levels
-   **Routing**: Deep linking to specific tabs/levels
-   **Animations**: Tab transitions, micro-interactions
-   **Analytics**: Track player progression
