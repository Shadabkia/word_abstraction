# Feature: Arcade Tab

## Purpose

- Provide a clear list of all standalone games available in Pars Ra Pas.
- Allow players to choose a game, then choose a level/session, and play immediately.
- Serve as a non-narrative alternative to the story campaign.
- This tab = “All games in one place.”

## Overall Layout

```
----------------------------
|   Title: Arcade          |
----------------------------
|   Grid of Game Modes     |
|   (2 columns)            |
----------------------------
```

- No search bar.
- No categories.
- Minimal UI footprint.

## Game Grid (Main Screen)

A 2-column grid of large, colorful cards representing different **Game Types**.

**Game Card Contents**
- Game Icon (large, centered)
- Game Title (e.g., "Word Connect", "Word Search")
- Short subtitle (1-line explanation)
- Vibrant gradient background specific to game

**Interaction**
- Tap → opens Game Detail View (Level Selector).
- Card has distinct "press" animation (tactile feel).

## Game Detail View

This is the page shown after tapping a Game Card.

**Structure**
```
-----------------------------------
| Game Icon + Title               |
| Subtitle                        |
| Progress Indicator              |
-----------------------------------
| LIST OF LEVELS                  |
-----------------------------------
```

### 1. Header Area
- Game Icon (larger)
- Game Title
- 1–2 line description of what this game is
- Progress bar or numeric counter (“7 / 20 Levels Completed”)

### 2. Level List
A compact grid of level buttons (4 columns) for quick scanning and selection.

**Level Button Contains:**
- Level Number (prominent)
- Level Name (small, truncated if long)
- Star indicators (if completed)
- Completion state:
    - Completed: full color with stars
    - Available: vibrant gradient based on difficulty
    - Locked: grey with lock icon
- Difficulty indicator: subtle badge in corner

### 3. Level Button Interaction
- Tap → Directly launches game session
- Compact grid layout (4 columns) allows quick scanning of many levels
- Each button provides immediate visual feedback on tap

## Level Launch

Arcade mode prioritizes speed and simplicity:
- Tapping a level button directly launches the game session
- No intro page or intermediate steps
- Players can immediately start playing

No comments, no likes, no NPC reactions — Arcade is purely mechanical.

## Interactions & Navigation

- Back (including the mobile/system back button) returns to the previous Arcade view:
  - From a game's level selector → back to the game library grid.
  - From an active game session → **show an exit confirmation dialog** before leaving. If confirmed, return to where the player entered the game from.
  - **Exception (Win Dialog):** If the player has completed the level and the win dialog is shown, dismissing it (Continue / Close / Back) returns directly to the level selector **without** an exit confirmation.
- From game library → level selector → game session (2 taps total).
- No story progression; everything is self-contained.

## Design Feel

- Simple and friendly, like a “toy shelf.”
- Vibrant icons, warm colors, soft tactile animations.
- Zero cognitive load — straight to playing.

## Final Essence
The Arcade Tab is a clean, scrollable grid of all available games. Each game opens to a compact 4-column grid of level buttons, allowing quick scanning and immediate launch. No search, no categories, no intermediate screens — just instant access to quick-play sessions.

## Launch Contract
Arcade launches games using a `gameRef`:
- `gameId`
- `levelId`
- `mode: 'arcade'`

## Progress Tracking
- Arcade mode maintains **separate** progress tracking from Career mode
- Completing a level in Arcade does not mark it complete in Career
- Arcade progress tracks high scores for replay value
- No coin rewards or narrative unlocks in Arcade mode
- Levels are unlocked **sequentially by row** in Arcade:
  - Each row contains 4 levels.
  - The **first row** (levels 1-4) starts unlocked.
  - Completing **all** levels in a row unlocks the **next** row.
  - Completed levels remain replayable.
  - Unlocking in Arcade does **not** affect Career progression (and vice versa).

## Replay Behavior
- When a player enters a **completed** level in Arcade mode:
  - The level displays in its completed state (all completed rows visible in word connect game for)
  - A **Replay** button appears at the bottom of the game screen (below the tiles, above the bottom dock)
  - Tapping Replay:
    - Clears the level's in-progress state (completed rows vanish, tiles reset)
    - Starts the level fresh (tiles animate in as if starting new)
    - The level **remains marked as completed** in Arcade progress
    - High score is preserved (can be improved on replay)
- If the player leaves and re-enters a completed level:
  - They see the completed state again with the Replay button
  - The level does **not** save again as completed (already marked)
- Replay is **only available in Arcade mode** (not Career mode)



