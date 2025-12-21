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
A clean, vertical list of levels.

**Level Card Contains:**
- Level Number + Title
- Small preview image/icon
- Completion state:
    - Completed: full color
    - Current: highlighted or pulsing
    - Locked: grey with lock icon
- Optional: difficulty icon (easy/med/hard)

### 3. Level Card Interaction
- Tap → Level Intro Page (like a “mini post”)
- From there → “Start Game” to launch the puzzle session.

## Level Intro Page (Inside the Arcade)

Much simpler than Campaign post view. No comic slides, no narrative carousel.

**Contains:**
- Level Title
- Level Description (1–2 lines)
- Preview image
- “Start Game” button (sticker style)
- Optional: Mode label (e.g., “Timed Mode”), Score from last attempt

No comments, no likes, no NPC reactions — Arcade is purely mechanical.

## Interactions & Navigation

- Back (including the mobile/system back button) returns to the previous Arcade view:
  - From a game’s level selector → back to the game library grid.
  - From an active game session → back to where the player entered the game from.
- From level list → Start game in 2 taps.
- No story progression; everything is self-contained.

## Design Feel

- Simple and friendly, like a “toy shelf.”
- Vibrant icons, warm colors, soft tactile animations.
- Zero cognitive load — straight to playing.

## Final Essence
The Arcade Tab is a clean, scrollable list of all available games. Each game opens to a list of its levels, and each level opens to a simple start screen. No search, no categories — just instant access to quick-play sessions.

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
- All levels are unlocked from the start in Arcade



