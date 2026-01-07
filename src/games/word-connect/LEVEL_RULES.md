# Word Connect — Level Rules

This document defines the **rules and constraints** for Word Connect level JSONs.

It is grounded in:
- Levels `chapter1/level0.json` through `chapter1/level5.json`
- The validator: `validate-levels.js`

If you change level structure or gameplay behavior, **update this document and the validator together**.

---

## Core Concepts

### Tiles
- Levels define tiles in `dictionary.tiles`.
- Tiles are referenced by **ID** everywhere else (`layout.initial_grid`, group `trigger_ids`, group `reveal_ids`).
- All tile IDs must be **unique**.

### Groups (Rules)
Groups live in `mechanics.groups` and represent the only valid matches.

- **Group size**: Each group must have **exactly 4 trigger tiles**.
- **Group behaviors**:
  - **final**: consumes 4 triggers; **no reveals**
  - **transform**: consumes 4 triggers; reveals **exactly 4 tiles**

---

## Rule Set (Must-Haves)

### 1) Word count and board size
- **Total tiles on the starting board** must equal `rows × cols`.
- **Grid size** (total cells) must be a **multiple of 4**.
- **Minimum grid size**: **12 cells (3×4)**.
- **Unique words** (what player sees): should be **at least 12** to provide adequate variety.

> **Important**: While the grid can have duplicate tiles (same word appearing multiple times), levels should start with at least 12 **unique words** visible to the player. Duplicates are allowed for thematic reasons but reduce puzzle variety.

> Note: the validator uses `layout.cols` as the target group size; the game currently assumes **4-wide rows**.

### 2) Every tile must be used by the group system (Economy)
The level must have **no missing ingredients** and **no leftover/orphan tiles**.

In validator terms:
- **Available**: tiles on the initial grid
- **Produced**: all `reveal_ids` from transform groups
- **Consumed**: all `trigger_ids` from all groups

Constraint:
- `Available + Produced == Consumed`

This implies:
- Every tile in the initial grid must be consumed by some group at some point.
- Every revealed tile must be consumed by some group at some point.

### 3) Group size is always 4

- Every group **must** have exactly 4 `requirements.trigger_ids`.
- If a group has `behavior: "transform"`, it **must** have exactly 4 `outcomes.reveal_ids`.
- If a group has `behavior: "final"`, it **must not** have any `outcomes.reveal_ids`.

**Playability requirement**: At each step of solving the level, there must be at least one group whose 4 trigger tiles are all available on the board. A level where no group can be formed at any step is unplayable.

### 3.1) Transform groups MUST include a meta_group tile

**Critical requirement for transform groups**:
- **Every transform group** must include **exactly ONE** tile with `"type": "meta_group"` in its `outcomes.reveal_ids`.
- The meta_group tile represents the "icon" or "merged concept" that appears after the transformation.
- The other 3 reveal_ids should be regular `"type": "word"` tiles.

**Example (correct):**
```json
{
  "behavior": "transform",
  "requirements": {
    "trigger_ids": ["t_green_tea", "t_black_tea", "t_cinnamon_tea", "t_saffron_tea"]
  },
  "outcomes": {
    "reveal_ids": ["t_tea_icon", "t_tea_glass", "t_saucer", "t_sugar_cube"]
  }
}
```

Where `t_tea_icon` is defined as:
```json
{ 
  "id": "t_tea_icon", 
  "text": "★ چای", 
  "type": "meta_group",  ← REQUIRED!
  "visuals": { 
    "icon_enabled": true, 
    "icon_id": "tea-group", 
    "color_hex": "#CD853F" 
  } 
}
```

**Why this is required:**
- The game code (`levelLoader.ts`) searches for a `meta_group` tile in the reveals
- If no meta_group is found, the transform is **completely ignored** and behaves like a final group
- This causes the bug where revealed tiles don't appear and the level becomes unplayable

### 4) Static integrity (IDs must exist)
- Every ID in `layout.initial_grid` must exist in `dictionary.tiles`.
- Every ID in every group’s `trigger_ids` must exist in `dictionary.tiles`.
- Every ID in every group’s `reveal_ids` must exist in `dictionary.tiles`.

### 5) No initial matches (start state must not already contain a solved group)
All shipped levels set:
- `meta.constraints.no_initial_matches: true`

Design intent:
- At the start, the board should **not already contain** any complete group ready to lock/transform.

Implementation reality:
- The validator currently logs this as a **warning** during simulation (“Initial state contains match for …”) rather than failing validation.

### 6) Chain reaction prevention (transform reveals must not instantly auto-complete another group)

Constraint (enforced by the validator):
- A transform group’s `reveal_ids` must **not** be **exactly** the full trigger set of any other group.

Why:
- Prevents “instant auto-match” after a transform, which removes player agency and breaks pacing.

### 7) Reveal tiles should be “bridges”, not dead-ends
Design rule (observed in levels 3–5):
- Revealed tiles should be **re-used** by other groups (often by being part of a future `final` group).

Practical interpretation:
- A revealed tile should belong to **at least one other group’s** `trigger_ids`.
- Put differently: reveals are usually meant to create **new goals** / dependencies.

> Note: This is a **design rule**, not currently an explicit validator failure (economy + solvability indirectly enforce much of it).

### 8) Solvability (no deadlocks)
The level must be solvable: there must exist a sequence of valid group matches that clears the board.

Validator behavior:
- Runs a state-space search (BFS) over "bag states" to ensure a solution exists.
- Fails with `UNSOLVABLE_DEADLOCK` if no solution path is found.

**Critical requirement**: At every step in the solution, at least one group must have all 4 of its required tiles available. If at any point no group can be formed (because tiles are missing), the level becomes unplayable and is considered unsolvable.

---

## Initial Layout Guidelines (Recommended)

### A) Avoid “four-in-a-row” for any group at the start
If `no_initial_matches` is true, ensure no row already contains all 4 members of any group.

Common technique used in existing levels:
- **Intruder pattern**: 3 tiles from a group + 1 tile from another group in each row.

### B) Avoid obvious clustering of all 4 members (visual scan)
Even if they aren’t in the same row, avoid placing the 4 members of a group in a tight cluster that reads as an instant answer.

---

## Validator Alignment Notes

The validator (`validate-levels.js`) enforces:
- **Schema / references**: IDs exist, grid dimensions match, group sizes match
- **Behavior constraints**: transform must reveal 4; final must reveal 0
- **Chain reaction prevention**: transform reveals must not fully satisfy another group’s trigger set
- **Economy**: no missing / no leftovers when accounting for transforms
- **Solvability**: simulation must find a clear path

It currently treats “initial matches” as:
- A **warning**, not an error (even when `meta.constraints.no_initial_matches` is true)


