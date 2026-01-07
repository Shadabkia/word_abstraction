# Validation Rules Summary

This document summarizes the rules implemented in `validate-levels.js` and documented in `LEVEL_RULES.md`.

## Validation Checks

### 1. **Unique Tile IDs** ✓
- **Rule**: All tile IDs in `dictionary.tiles` must be unique
- **Type**: Hard Error
- **Log**: "Unique tile IDs"

### 2. **Grid ID References** ✓
- **Rule**: All IDs used in `layout.initial_grid` must exist in dictionary
- **Type**: Hard Error
- **Log**: "Grid ID references"

### 3. **Trigger/Reveal ID References** ✓
- **Rule**: All IDs in group `trigger_ids` and `reveal_ids` must exist in dictionary
- **Type**: Hard Error
- **Log**: "Trigger/Reveal ID references"

### 4. **Grid Dimensions** ✓
- **Rule**: Grid must match declared `rows` × `cols`
- **Type**: Hard Error
- **Log**: "Grid dimensions"

### 5. **Group Structure** ✓
- **Rule**: 
  - Every group must have exactly 4 `trigger_ids`
  - Transform groups must have exactly 4 `reveal_ids`
  - Final groups must have 0 `reveal_ids`
- **Type**: Hard Error
- **Log**: "Group structure"

### 5.1 **Transform Meta-Group Requirement** ✓ NEW
- **Rule**: Transform groups must include exactly ONE `meta_group` tile in `reveal_ids`
- **Type**: Hard Error
- **Log**: "Group structure"
- **Error Message**: "Transform group must have a meta_group tile in reveal_ids (game requirement)"
- **Critical**: Without a meta_group tile, the game code ignores the transform entirely and it behaves like a final group!
- **Fix**: Add a tile with `"type": "meta_group"` to the first position in `reveal_ids`

### 6. **Word Count (Multiple of 4)** ✓ NEW
- **Rule**: Grid size (total cells) must be a multiple of 4
- **Type**: Hard Error
- **Log**: "Word count (multiple of 4)"

### 7. **Word Count (Minimum 12)** ✓ NEW
- **Rule**: Grid size must be at least 12 cells
- **Type**: Hard Error
- **Log**: "Word count (minimum 12)"

### 8. **Unique Words in Grid** ✓ NEW
- **Rule**: Initial grid must contain at least 12 unique words (no duplicates reducing variety)
- **Type**: Hard Error
- **Log**: "Unique words in grid"
- **Reason**: Players expect adequate word variety; duplicates make puzzles feel smaller than advertised

### 9. **Chain Reaction Prevention** ✓
- **Rule**: Transform group reveals must NOT exactly match another group's full trigger set
- **Type**: Hard Error
- **Log**: "Chain reaction prevention"
- **Reason**: Prevents instant auto-matches that remove player agency

### 10. **Reveal Bridges** ⚠️ NEW
- **Rule**: Revealed tiles (not in initial grid) should be reused by other groups
- **Type**: Warning (Design Guideline)
- **Log**: "Reveal bridges"
- **Reason**: Creates multi-step dependencies and better puzzle flow

### 11. **Tile Economy** ✓
- **Rule**: `Available + Produced = Consumed` (no missing tiles, no leftover tiles)
- **Type**: Hard Error
- **Log**: "Tile economy"

### 12. **No Initial Matches** ⚠️
- **Rule**: Initial grid should not contain complete groups ready to match
- **Type**: Warning (Design Guideline)
- **Log**: "No initial matches"
- **Reason**: Players should need to make moves before getting matches

### 13. **Solvability** ✓
- **Rule**: Level must have at least one valid solution path
- **Type**: Hard Error
- **Log**: "Solvability"
- **Method**: BFS state-space search
- **Critical Requirement**: At each step, at least one group must have all 4 trigger tiles available. No deadlock states where no group can be formed.

## Running the Validator

### Basic Usage
```bash
npm run validate-levels
```

### Specific Chapter
```bash
npm run validate-levels -- --chapter=1
```

### Specific Level
```bash
npm run validate-levels -- --level=level4
```

### Verbose Mode (Show All Checks)
```bash
npm run validate-levels -- --verbose
# or
npm run validate-levels -- -v
```

### With Trace (Show Solution Steps)
```bash
npm run validate-levels -- --trace
```

### JSON Output
```bash
npm run validate-levels -- --json
```

## Validation Errors Found

The updated validator now catches:
- ❌ **Chain reactions**: Levels where transform reveals instantly complete another group
- ❌ **Economy issues**: Leftover or missing tiles
- ❌ **Word count issues**: Levels with < 12 words or non-multiple-of-4 counts
- ⚠️ **Design warnings**: Initial matches, non-bridge reveals

## Example Verbose Output

```
Validating: level4.json
  ✓ Unique tile IDs: {"count":20}
  ✓ Grid ID references
  ✓ Trigger/Reveal ID references
  ✓ Grid dimensions: {"rows":4,"cols":4}
  ✓ Group structure: {"groups":5,"group_size":4}
  ✓ Word count (multiple of 4): {"total":16}
  ✓ Word count (minimum 12): {"total":16}
  ✓ Chain reaction prevention: {"transform_groups":1}
  ✓ Reveal bridges: {"transform_groups":1,"bridge_reveals":4}
  ✓ Tile economy: {"available":16,"produced":4,"consumed":20,"balanced":true}
  ✗ No initial matches: {"constraint_set":true,"note":"Design guideline - not enforced as error"}
  ✓ Solvability: {"steps":5,"states_explored":20}
✅ level4.json     [4x4, 20w] Trans: 1, Final: 4, Steps: 5
```

## Status

✅ All documented rules are now validated
✅ Logging added for each check
✅ Verbose mode available
✅ Warnings vs Errors properly distinguished

