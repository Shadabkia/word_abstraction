# Word Connect — Level Rules

This spec defines the **source-of-truth** rules for Word Connect levels.

It focuses on **what** a valid level is and **why** the constraints exist (clarity, fairness, solvability, pacing).

For a designer-facing checklist (including validator alignment), see `src/games/word-connect/LEVEL_RULES.md`.

---

## Level Building Blocks

- **Tiles**: The vocabulary items (and occasional icon tiles) that appear on the board.
- **Groups**: The only valid matches. Each group is a set of 4 tiles that the player can complete.
- **Board**: A grid of tiles. The player’s goal is to clear the board by completing groups.

---

## Hard Constraints (Must Pass)

### 1) Board is consistent and complete
- The board is a rectangle (all rows have the same width).
- The board's tile count matches its declared dimensions.
- The board's **grid size** (total cells) is a **multiple of 4** (because groups are sets of 4).
- The board's **grid size** must be **at least 12 cells** (3×4 minimum).
- The board should have **at least 12 unique words** (duplicates reduce puzzle variety).
- The game's current design assumes **4 tiles per group** and **4 tiles per row**.

### 2) Tiles are referentially valid
- Every referenced tile exists in the level’s tile list.
- Tile identifiers are unique.

### 3) Groups are well-formed
- Every group contains **exactly 4** tiles.
- Groups have two behaviors:
  - **Final group**: completes and locks (no new tiles are introduced)
  - **Transform group**: completes and replaces itself with **exactly 4** tiles
  
**Transform group requirement:**
- Every transform group must include exactly ONE `meta_group` tile in its reveal_ids
- The meta_group represents the merged concept/icon that appears after transformation
- Without a meta_group tile, the game will ignore the transform entirely

### 4) Economy (no orphans, no missing pieces)
Across the whole level:
- Every tile that appears (either initially or via transformation) must be used by the group system.
- The level must not require tiles that can never appear.

Why:
- Prevents “unfinishable” levels and prevents leftover tiles that cannot be grouped.

### 5) Transform reveals must not instantly complete another group
When a transform happens, the tiles it reveals must not immediately form a complete, unavoidable next match by themselves.

Why:
- Preserves player agency and keeps pacing readable (transforms are an “action beat”, not a forced chain).

### 6) Solvability
There must exist at least one sequence of group completions that clears the board.

**Playability**: At every step in the solution path, at least one group must have all 4 of its trigger tiles available. A level is unplayable if at any point no valid group can be formed.

Why:
- Levels should be winnable through reasoning, not luck.

---

## Design Constraints (Strongly Recommended)

### 7) No initial matches (when enabled)
If a level is marked as “no initial matches”, the starting board should not already contain a complete group ready to be completed with zero effort.

Why:
- Prevents accidental “free solves” and keeps early play intentional.

### 8) Reveal tiles should act as bridges
Transform reveals should generally create **new goals** by being relevant to other groups (they are “bridges”, not dead ends).

Why:
- Makes transforms feel meaningful and supports multi-step puzzle structure.


