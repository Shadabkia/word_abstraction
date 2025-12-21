# Career vs Arcade Mode Separation

## Overview

Career and Arcade modes now maintain completely separate progress tracking at both the app level and game level. Completing a level in one mode does not affect the other mode.

## The Problem

Previously, Career and Arcade modes shared storage:
- **App level**: Single `completedLevels` array for both modes
- **Game level**: Same storage key `wordAbstractionGameState` for both modes

This caused:
- Completing Level 1 in Career marked it complete in Arcade
- Merged word tiles in Career appeared in Arcade
- Progress leaked between modes ❌

## The Solution

### Two-Level Separation

#### 1. App-Level Progress (`src/core/state/gameState.ts`)

**Before:**
```typescript
interface ProgressState {
  completedLevels: string[];
  unlockedChapters: string[];
  highScores: Record<string, number>;
}
```

**After:**
```typescript
interface ProgressState {
  career: {
    completedLevels: string[];
    unlockedChapters: string[];
    highScores: Record<string, number>;
  };
  arcade: {
    completedLevels: string[];
    highScores: Record<string, number>;
  };
}
```

**Complete Level Action:**
```typescript
completeLevel: (levelId: string, score: number, stars: number, mode: 'career' | 'arcade') => void
```
- Accepts `mode` parameter
- Coins awarded only in career mode
- Each mode tracks independently

#### 2. Game-Level Storage (`src/games/word-connect/utils/gameStorage.ts`)

**Before:**
```typescript
const STORAGE_KEY = 'wordAbstractionGameState';
// Both modes saved to same key
```

**After:**
```typescript
const STORAGE_KEY_PREFIX = 'wordAbstractionGameState';

class GameStorage {
  private currentMode: 'career' | 'arcade' = 'career';
  
  setMode(mode: 'career' | 'arcade'): void {
    this.currentMode = mode;
  }
  
  private getStorageKey(): string {
    return `${STORAGE_KEY_PREFIX}_${this.currentMode}`;
    // Returns: 'wordAbstractionGameState_career' or 'wordAbstractionGameState_arcade'
  }
}
```

**Storage Keys:**
- Career: `wordAbstractionGameState_career`
- Arcade: `wordAbstractionGameState_arcade`

### Game Launch Context (`src/core/games/gameRegistry.ts`)

```typescript
type GameLaunchRef = {
  gameId: GameId;
  levelId: string | number;
  mode: 'career' | 'arcade';  // ✅ Mode context
  campaignLevelId?: string;
}

// Pass mode to game component
buildProps: (ref) => ({
  initialLevel: ref.levelId,
  gameMode: ref.mode,  // ✅ Game receives mode
})
```

### Game Component (`src/games/word-connect/WordConnectGame.tsx`)

```typescript
interface WordConnectGameProps {
  gameMode?: 'career' | 'arcade';
}

export default function WordConnectGame({ gameMode = 'career', ... }) {
  useEffect(() => {
    gameStorage.setMode(gameMode);  // ✅ Set storage mode
  }, [gameMode]);
}
```

## Behavior

### Career Mode (Dashboard/Profile)
- ✅ Sequential level unlocking
- ✅ Coin rewards on completion
- ✅ Unlocks narrative content (posts, messages, chapters)
- ✅ Tracks high scores
- ✅ Progress shown in Profile grid
- ❌ Does NOT affect Arcade

### Arcade Mode (Arcade Tab)
- ✅ All levels unlocked from start
- ✅ Tracks high scores separately
- ✅ Shows stars for completed levels
- ✅ Can replay any level
- ❌ No coin rewards
- ❌ No narrative unlocks
- ❌ Does NOT affect Career

## Level ID Patterns

### Career Mode
```
level_1, level_2, level_3, ...
```
Set by `campaignLevelId` in launch ref.

### Arcade Mode
```
word-connect_1, word-connect_2, ...
```
Generated as `{gameId}_{levelId}` when no campaignLevelId.

## Testing

### Clear Storage First
```javascript
localStorage.clear()
location.reload()
```

### Test Separation
1. **Play Level 1 in Career**
   - Merge some tiles
   - Exit game
   - Console: `[GameStorage] State saved to wordAbstractionGameState_career`

2. **Play Level 1 in Arcade**
   - Fresh board (no merged tiles) ✅
   - Console: `[GameStorage] State loaded from wordAbstractionGameState_arcade`

3. **Verify Independence**
   - Complete Level 1 in Career
   - Check Arcade: Level 1 not completed ✅
   - Complete Level 1 in Arcade
   - Check Career: unchanged ✅

## Console Output

**Career mode:**
```
[WordConnectGame] Running in career mode
[GameStorage] Mode set to: career
[GameStorage] State loaded from wordAbstractionGameState_career
[App] Game completed: { mode: 'career', levelId: 'level_1', ... }
[GameState] careerLevels: ['level_1']
[GameState] arcadeLevels: []
```

**Arcade mode:**
```
[WordConnectGame] Running in arcade mode
[GameStorage] Mode set to: arcade
[GameStorage] State loaded from wordAbstractionGameState_arcade
[App] Game completed: { mode: 'arcade', levelId: 'word-connect_1', ... }
[GameState] careerLevels: ['level_1']
[GameState] arcadeLevels: ['word-connect_1']
```

## Files Modified

### Core
- `src/core/state/gameState.ts` - Split progress into career/arcade, mode parameter
- `src/core/games/gameRegistry.ts` - Pass gameMode to components
- `src/core/navigation/historyNav.ts` - Mode in URL parsing

### Game
- `src/games/word-connect/utils/gameStorage.ts` - Mode-aware storage keys
- `src/games/word-connect/WordConnectGame.tsx` - Accept and use gameMode prop

### Features
- `src/features/profile/ProfileScreen.tsx` - Launch with `mode: 'career'`
- `src/features/arcade/ArcadeScreen.tsx` - Launch with `mode: 'arcade'`, show arcade progress
- `src/features/dashboard/DashboardScreen.tsx` - Use career progress
- `src/features/feed/FeedScreen.tsx` - Use career progress for unlocks
- `src/features/messages/MessagesScreen.tsx` - Use career progress for unlocks
- `src/features/messages/components/ChatView.tsx` - Use career progress

### App
- `src/App.tsx` - Mode-aware completion handler, error boundary

### Utilities
- `src/shared/components/DebugOverlay.tsx` - Show both modes, specify mode in actions

### Cleanup
- ✅ Removed unused `src/utils/gameStorage.ts` (duplicate file)

## Migration

### Automatic Migration
The app automatically migrates old save data:
- Detects old `progress.completedLevels` structure
- Converts to `progress.career.completedLevels`
- Initializes empty `progress.arcade`
- Handles errors gracefully

### Old Storage Ignored
Old game storage in `wordAbstractionGameState` (without `_career` or `_arcade` suffix) is ignored. Games start fresh in both modes.

## Specs Updated
- ✅ `specs/Architecture.md` - State structure, game launch reference, mode context
- ✅ `specs/Feature_Arcade.md` - Progress tracking, launch contract
- ✅ `specs/Feature_Dashboard.md` - Progress tracking
- ✅ `specs/Feature_Profile.md` - Career mode progress

## Future Games

The solution is fully extensible for future games. See `FUTURE_GAMES_GUIDE.md` for:
- How to add new games with mode separation
- Storage key patterns
- Code templates
- Best practices

**Summary:** Any new game that accepts `gameMode` prop and uses mode-specific storage keys will automatically have proper career/arcade separation.

