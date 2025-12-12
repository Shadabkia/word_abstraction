# Pars Ra Pas — Implementation Plan

This document outlines the step-by-step roadmap for building the Pars Ra Pas platform. It is a living document and will be updated as progress is made.

## ✅ Phase 1: Core Foundation & State Management (COMPLETED)
**Goal:** Establish the central nervous system of the app.

- [x] **Define Global State (`src/core/state`)**
    - [x] Created `useGameState` (Zustand) to track:
        - [x] User Progress (completed levels, unlocked chapters)
        - [x] Resources (coins/vibes)
        - [x] Unread counters (messages, feed)
    - [x] Created `useSettingsStore` for app-wide settings (language, audio).

- [x] **Define Domain Models (`src/core/domain`)**
    - [x] Defined TypeScript interfaces for:
        - [x] `Chapter`, `Level`, `StoryPost`, `MessageThread`
        - [x] `GameModuleProps` interface (standard API for all mini-games).

- [x] **Data Loading System**
    - [x] Existing level loader from Word Connect game reused.

## ✅ Phase 2: Feature Shells & Navigation (COMPLETED)
**Goal:** Make the 5 tabs functional (UI-wise) and connected to state.

- [x] **Dashboard Feature (`src/features/dashboard`)**
    - [x] Implemented `HeroCard` component (displays current level info).
    - [x] Implemented `QuickAccessCard` row.
    - [x] Connected to `GameState` to show actual progress.

- [x] **Feed Feature (`src/features/feed`)**
    - [x] Created `PostCard` component (Header, Image, Caption, Comments).
    - [x] Implemented `StoryRow` for daily challenges.
    - [x] Connected to content system (unlocks based on progress).

- [x] **Profile Feature (`src/features/profile`)**
    - [x] Implemented `ProfileHeader` (Avatar, Bio, Stats).
    - [x] Implemented `LevelGrid` (The "posts" view of levels).
    - [x] Implemented `ChapterSelector` (Highlight bubbles).
    - [x] Connected to chapter content system.

- [x] **Messages Feature (`src/features/messages`)**
    - [x] Created `ChatList` view.
    - [x] Created `ChatRow` component with unread badges.
    - [x] Connected to message content system.

- [x] **Arcade Feature (`src/features/arcade`)**
    - [x] Created `GameList` view with `GameCard` components.
    - [x] Integrated "Word Connect" as first game.
    - [x] Added placeholder cards for future games.

## ✅ Phase 3: Game Module Standardization (COMPLETED)
**Goal:** Ensure "Word Connect" and future games plug in cleanly.

- [x] **Game Interface Refactor**
    - [x] Defined `GameModuleProps` interface in domain types.
    - [x] Updated `WordConnectGame` to accept `onExit`, `onComplete`, `initialLevel` props.
    - [x] Game now mounts as full-screen module when activated.

- [x] **Game Session Handling**
    - [x] Exit button properly returns to Arcade.
    - [x] Completion triggers state update.
    - [x] App shell handles game mounting/unmounting.

## ✅ Phase 4: Content Injection & Narrative (COMPLETED)
**Goal:** Populate the world with the "Kian" story.

- [x] **Content DSL**
    - [x] Created JSON schema for Story Posts and Messages.
    - [x] Created initial content set (Chapter 1-4, 5 posts, 3 message threads, 5 NPCs).
    - [x] All content files in `src/assets/content/`.

- [x] **Content Manager Service**
    - [x] Built centralized content loader/manager.
    - [x] Implements unlock filtering based on progress.

- [x] **Integration**
    - [x] Feed displays unlocked posts.
    - [x] Messages shows unlocked threads.
    - [x] Profile shows unlocked chapters.
    - [x] Game completion updates state → unlocks content.

## ✅ Phase 5: Polish & Tools (COMPLETED)
**Goal:** Developer experience and user delight.

- [x] **Debug Overlay**
    - [x] Created toggleable debug panel (Ctrl+Shift+D).
    - [x] Inspect current GameState (user, progress).
    - [x] Quick actions: Unlock all, Reset progress, Complete specific levels.
    - [x] JSON state viewer.

- [x] **Visual Polish**
    - [x] Smooth tab transitions with Framer Motion.
    - [x] Fade/slide animations between screens.
    - [x] Unread message badge on Messages tab.

- [x] **Sound System Integration**
    - [x] Connected `soundManager` to `settingsStore`.
    - [x] Settings dialog now toggles sound globally.
    - [x] Sound state persists in localStorage.

---

## 🎉 All Phases Complete!

The Pars Ra Pas platform is **fully functional** with:
- 5-tab Instagram-like interface
- Data-driven content system
- Pluggable game architecture
- Persistent state & settings
- Developer debug tools
- Smooth animations & polish

## Next Steps (Future Enhancements)

### Content Expansion
- [ ] Add more posts, messages, and story beats
- [ ] Create detailed chapter narratives
- [ ] Add daily challenge system

### Game Library
- [ ] Implement Word Search game
- [ ] Implement Crossword game
- [ ] Implement Guess The Word game

### Features
- [ ] Deep linking to specific levels/chapters
- [ ] Message action links (tap message → play level)
- [ ] Achievement system
- [ ] Daily rewards

### Platform
- [ ] Analytics integration
- [ ] Cloud save sync
- [ ] Leaderboards
- [ ] Social sharing

---

**Ready to use!** Run `npm run dev` to see everything in action.
