# Architectural Principles

## 1. Overall Architectural Goal

Build a modular, content-driven game platform where:

- Content (chapters, levels, posts, messages, daily challenges, etc.) lives in DSL/JSON.
- Logic & UI are reusable and stable across many different game types and story content.
- Tabs, sections, and individual games can be launched in isolation for development, testing, and debugging.
- Game state (progress, feed, dashboard, messages, achievements) is explicit, inspectable, and debuggable.

The architecture should be:
- **Extensible**: easy to add new game types, chapters, posts, and modes.
- **Composable**: same systems can be reused across campaign and arcade.
- **Inspectable**: easy to see “what’s going on” at runtime.

## 2. Core Architectural Principles

### Mobile-First "Phone Booth" Architecture
The application is designed exclusively for mobile viewports.
- **Mobile First:** All UI components are built assuming a mobile screen width. No complex responsive overrides (sm/md/lg) are used.
- **Desktop Simulator:** On desktop, the app runs inside a constrained "Phone Booth" container that mimics a physical device (e.g., iPhone 14 Pro).
- **Zero Desktop Logic:** We do not write separate desktop layouts. The desktop experience is a high-fidelity simulation of the mobile experience.

### Content-driven, not hard-coded
- Everything that “happens” in the game (levels, feed posts, messages, chapter unlocks, daily challenges) should be describable in a JSON DSL.
- The app reads this DSL and instantiates screens and game sessions.
- Code focuses on interpreting the DSL, not baking specific story beats or levels into logic.

### Separation of Concerns
- **Domain**: concepts like Game, Level, Chapter, StoryPost, MessageThread, PlayerState.
- **Presentation/UI**: tabs, screens, widgets (FeedView, ProfileView, ArcadeList, etc.).
- **Infrastructure/Platform**: persistence, analytics, debugging tools.

### State as a first-class citizen
There is a well-defined GameState object (or tree) that represents:
- Story/campaign progression
- Player progress in each game type
- Feed contents & what’s “new”
- Messages & unread states
- Dashboard recommendations

This GameState is:
- Serializable
- Inspectable
- Overridable in debug mode

### Modularity of Games
Each game type (Word Connect, Word Search, Guessing, Wordscapes, etc.) is a pluggable module with:
- A shared interface (IGameEngine, IGameSession, etc.)
- Its own internal logic, UI, and test harness.
- Campaign and Arcade both use the same game modules but with different GameConfig and context.

### Debuggability by Design
A global debug overlay can:
- Inspect current GameState
- Force unlock chapters/levels
- Override time (for daily content)
- Reload content from JSON
- Jump directly to specific tabs or specific levels.

## 3. High-Level Domain Model (Conceptual)

We don’t define classes yet, just conceptual entities.

### 3.1 Core Entities

**Game**
- Unique id
- Type (WordConnect, WordSearch, Guessing, etc.)
- Supported GameConfig parameters
- List of associated levels (for Arcade) and any references used in campaign levels.

**Level**
- Unique id
- Belongs to:
    - A Game (engine)
    - Optionally a Campaign Chapter
- References LevelConfig in JSON:
    - Puzzle data (words, grids, categories, etc.)
    - Difficulty, rewards, tags
    - UI skin variants (if any)

**Chapter**
- Metadata (name, city, index)
- Ordered list of campaign Level ids
- Unlock conditions

**StoryPost**
- NPC author
- Image(s)
- Caption text
- Comments (NPC-only)
- Trigger conditions (e.g., after level X is completed, day N, etc.)

**MessageThread**
- NPC identity
- List of message events
- Each event can:
    - Display text
    - Attach an image
    - Unlock/save a level, quest, or mode

**DailyChallenge**
- Reference to a Game
- Daily LevelConfig or level generator seed
- Validity window (24h)
- Rewards & difficulty.

## 4. JSON / DSL Content System Requirements

### Goals
- All campaign content, feed posts, messages, achievements, and level configs must be data-driven.
- Designers can add/edit new chapters, levels, NPC posts, messages, and daily challenge definitions without touching code.

### DSL Should Represent:
- **Structure**: Chapters → Levels, NPCs → Posts & Messages, Game types → Allowed configs
- **Triggers**: `onLevelCompleted(levelId) → unlock(chapterId)`, `onChapterCompleted(chapterId) → enqueueStoryPost(postId)`, `onFirstLoginOfDay → setDailyChallenge(challengeId)`
- **View Binding**: Which content appears in Feed, Dashboard, Messages, Profile.

## 5. State & Debugging Requirements

### 5.1 Game State Model
The global GameState should track:
- **Player Progress**: Completed levels, Current chapter & level pointers, Arcade progress per game
- **Story State**: Unlocked chapters, Which posts are visible in feed, Which messages have been “delivered”
- **UI State**: Dashboard recommendation type, Unread counts for Feed & Messages, Daily challenge state
- **Economy / Meta**: Vibes (currency), Achievements

### 5.2 Debug Mode Requirements
A debug mode & overlay should allow:
- **Setting game state to predefined snapshots**: “Fresh install”, “Mid-journey”, “All chapters unlocked”
- **Forcing triggers**: “Mark Level X as completed”, “Simulate daily refresh”, “Inject message from NPC Y”
- **Toggling debug layers**: Show underlying JSON payload for current screen, Show which triggers fired, View logs of state transitions
- **Launching any tab / section / level directly**: Start app in “Arcade → Game X → Level Y”, Start directly in “Profile → levelId”, Start “Feed” with given test state

## 6. Modular Game Framework Requirements

### Goals
Each game type is both:
- A standalone module (can be run in isolation for dev)
- A pluggable engine that campaign & arcade can use.

### Requirements
- **Standardized Game Session Interface**: API to Initialize with a GameConfig, Start / pause / reset, Emit events (completed, failed, score, etc.)
- **Independent Development & Testing**: Each game module can be launched in a minimal “dev sandbox” UI, load test LevelConfig from local JSON, and run with mock GameState.
- **Campaign vs Arcade Config**: Same game engine, different configs. Campaign: curated narrative levels. Arcade: random or difficulty-based level selection.

## 7. Tab & Screen Isolation Requirements

We must be able to launch each tab/section independently, for both architecting and dev UX.

### Requirements
- **Feature flags or dev launcher** that opens the app with only one tab active.
- **Directly loads**: Feed tab with a specific content script, Messages tab with specific NPC threads, Dashboard with specific recommendations, Profile with a defined chapter/level progression.
- **Modular navigation**: Tabs depend on shared domain models, but not tightly on each other’s UI logic. Ability to run a tab with a mock GameState for tests.

This encourages a clean separation between domain and presentation.

## 8. Future-Proofing & Constraints

### Design for Iteration
Expect that:
- New game types will be added.
- The JSON DSL will evolve.
- State transitions will grow more complex.

So:
- Keep DSL backward compatible when possible.
- Provide versioning for content schemas (schemaVersion).
- Build migration tools or fallback logic for older content.

### Non-Goals (for clarity)
- Not trying to build a full UGC platform (no player-generated posts).
- Not trying to support arbitrary user replies in Messages (read-only by design).
- Not trying to build one massive God-class that knows everything. → We deliberately split domains.

## 9. Summary in One Paragraph

Architect Pars Ra Pas as a content-driven, modular platform: story, posts, messages, chapters, levels, and multiple game types are defined in a JSON DSL, interpreted by a core engine that manages a central GameState. Each tab (Feed, Dashboard, Profile, Messages, Arcade) is a separate presentation layer over this state. Multiple game engines plug into a common interface so campaign and arcade can both invoke them. A robust debug mode and ability to launch any tab/level with specific configs is mandatory for development, allowing us to iterate on content and architecture while keeping the system extensible and future-proof.
