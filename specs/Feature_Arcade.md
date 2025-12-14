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
|   List of Game Cards     |
|   (vertical scroll)      |
----------------------------
```

- No search bar.
- No categories.
- Minimal UI footprint.

## Game List (Main Screen)

A vertical list of Game Cards. Each card represents a single game type in the Pars Ra Pas ecosystem.

**Game Card Contents**
- Game Icon (illustrative, sticker-like)
- Game Title
- Short subtitle (1-line explanation)
- Optional small badges: “NEW”, “Updated”, “Unfinished”
- Small indicator showing: X Levels Available, Progress (e.g., 7/20)

**Interaction**
- Tap → opens Game Detail View.
- Card has subtle bounce on tap (Instagram-like delight).

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

- Back button returns to the game list.
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


