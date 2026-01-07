# Debug Mode Documentation

## Overview

This document describes the debug mode features available in the application for testing and development purposes.

## Arcade Mode - Level Unlocking Debug

### Purpose

In production, arcade levels follow a row-based unlocking system:
- Each row contains 4 levels
- First row (levels 1-4) is always unlocked
- Completing all levels in a row unlocks the next row
- See `specs/Feature_Arcade.md` for full specification

During development and testing, you may need to access all levels immediately without completing previous rows.

### Location

**File**: `src/features/arcade/ArcadeScreen.tsx`  
**Variable**: `DEBUG_MODE` (line ~51)

### How to Enable

1. Open `src/features/arcade/ArcadeScreen.tsx`
2. Find the DEBUG_MODE constant:
   ```typescript
   const DEBUG_MODE = false; // Set to true for testing
   ```
3. Change to:
   ```typescript
   const DEBUG_MODE = true; // Set to true for testing
   ```
4. Save the file (HMR will automatically reload)

### Behavior When Enabled

When `DEBUG_MODE = true`:
- ✅ All arcade levels (1-51) are immediately unlocked
- ✅ No progression requirement - any level can be played
- ✅ Level completion still tracked normally
- ✅ Visual indicators (lock icons) removed from all levels
- ⚠️ Career mode progression is unaffected

### Testing Workflow

1. **Enable Debug Mode**
   - Set `DEBUG_MODE = true` in `ArcadeScreen.tsx`
   - Verify all levels show without lock icons (no need to test)

2. **Revert Changes** (IMPORTANT)
   - Set `DEBUG_MODE = false` before committing
   - Verify locking behavior restored (only first row unlocked)
   - Never commit with DEBUG_MODE enabled

### Verification

**Debug Mode ON (all unlocked)**:
```
Arcade > Word Connect
└── Levels 1-51: All vibrant colors, no lock icons
```

**Debug Mode OFF (normal locking)**:
```
Arcade > Word Connect
├── Levels 1-4: Unlocked (vibrant colors)
└── Levels 5-51: Locked (dark overlay + lock icons)
```

### Visual Indicators

| State | Appearance |
|-------|-----------|
| Unlocked | Vibrant gradient, level name visible, no lock icon |
| Locked | Semi-transparent dark overlay, large lock icon, level number visible but dimmed |

## Important Reminders

⚠️ **Never commit code with DEBUG_MODE = true**  
⚠️ **Always verify locking works after reverting**  
⚠️ **Document any new debug flags added to this file**

## Future Debug Features

As new debug modes are added, document them here following the same structure:
- Purpose
- Location
- How to enable/disable
- Expected behavior
- Testing workflow

