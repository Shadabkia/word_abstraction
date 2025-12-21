# Adding New Games: Career/Arcade Separation Guide

## Is the Current Solution Suitable for Future Games?

**YES! ✅** The solution is designed to be extensible and game-agnostic.

## Architecture Overview

The career/arcade separation works at **two independent levels**:

### Level 1: App-Level Progress (Game-Agnostic)
**Location:** `src/core/state/gameState.ts`

```typescript
progress: {
  career: {
    completedLevels: ['level_1', 'level_2'],  // Campaign progress
    unlockedChapters: ['chapter_1'],
    highScores: { 'level_1': 1000 }
  },
  arcade: {
    completedLevels: ['word-connect_1', 'crossword_5'],  // Any game
    highScores: { 'word-connect_1': 1000, 'crossword_5': 850 }
  }
}
```

**Key Points:**
- ✅ Works with any game
- ✅ Level IDs can be any string format
- ✅ No game-specific logic
- ✅ Automatically handles mode separation

### Level 2: Game-Level Storage (Game-Specific)
**Location:** Each game's own storage (e.g., `src/games/word-connect/utils/gameStorage.ts`)

```typescript
// Each game manages its own storage with mode awareness
wordAbstractionGameState_career  // Word Connect career storage
wordAbstractionGameState_arcade  // Word Connect arcade storage
crosswordGameState_career        // Crossword career storage (future)
crosswordGameState_arcade        // Crossword arcade storage (future)
```

**Key Points:**
- ✅ Each game controls its own storage format
- ✅ Mode-aware storage keys prevent cross-contamination
- ✅ Games can have different storage needs

## How to Add a New Game

### Step 1: Create the Game Module

Create your game in `src/games/your-game/`:

```typescript
// src/games/crossword/CrosswordGame.tsx
interface CrosswordGameProps {
  onExit?: () => void;
  onComplete?: (score: number) => void;
  initialLevel?: number;
  gameMode?: 'career' | 'arcade';  // ✅ Accept mode prop
}

export default function CrosswordGame({ 
  onExit, 
  onComplete, 
  initialLevel = 1,
  gameMode = 'career'  // ✅ Default to career
}: CrosswordGameProps) {
  // Your game logic here
  
  // If your game needs persistent storage:
  useEffect(() => {
    gameStorage.setMode(gameMode);  // ✅ Set storage mode
  }, [gameMode]);
  
  // When level is completed:
  const handleLevelComplete = (score: number) => {
    onComplete?.(score);  // ✅ App handles mode-specific tracking
  };
  
  return <div>Your game UI</div>;
}
```

### Step 2: Create Game Storage (If Needed)

If your game needs to save in-progress state:

```typescript
// src/games/crossword/utils/gameStorage.ts
const STORAGE_KEY_PREFIX = 'crosswordGameState';

class CrosswordStorage {
  private currentMode: 'career' | 'arcade' = 'career';
  
  setMode(mode: 'career' | 'arcade'): void {
    this.currentMode = mode;
  }
  
  private getStorageKey(): string {
    return `${STORAGE_KEY_PREFIX}_${this.currentMode}`;
    // Returns: 'crosswordGameState_career' or 'crosswordGameState_arcade'
  }
  
  async saveProgress(levelNumber: number, data: any): Promise<void> {
    const key = this.getStorageKey();
    // Save to mode-specific key
  }
  
  async loadProgress(levelNumber: number): Promise<any> {
    const key = this.getStorageKey();
    // Load from mode-specific key
  }
}

export const crosswordStorage = new CrosswordStorage();
```

### Step 3: Register the Game

Update `src/core/games/gameRegistry.ts`:

```typescript
import WordConnectGame from '@/games/word-connect/WordConnectGame';
import CrosswordGame from '@/games/crossword/CrosswordGame';  // ✅ Import new game

export type GameId = 'word-connect' | 'crossword';  // ✅ Add game ID

export const gameRegistry: Record<GameId, GameRegistryEntry> = {
  'word-connect': {
    id: 'word-connect',
    Component: WordConnectGame,
    buildProps: (ref) => ({
      initialLevel: typeof ref.levelId === 'number' ? ref.levelId : Number(ref.levelId),
      gameMode: ref.mode,  // ✅ Pass mode
    }),
  },
  'crossword': {  // ✅ Register new game
    id: 'crossword',
    Component: CrosswordGame,
    buildProps: (ref) => ({
      initialLevel: typeof ref.levelId === 'number' ? ref.levelId : Number(ref.levelId),
      gameMode: ref.mode,  // ✅ Pass mode
    }),
  },
};
```

### Step 4: Add to Arcade Screen

Update `src/features/arcade/ArcadeScreen.tsx`:

```typescript
// Add game card
<GameCard
  title="Crossword"
  description="Solve clues to fill the board"
  icon="📝"
  color="orange"
  onPlay={() => setUncontrolledSelectedGame('crossword')}
  variant="grid"
/>

// Add level selector
if (selectedGame === 'crossword') {
  const allLevels = getAllCrosswordLevels();  // Your level loader
  
  const levels = allLevels.map(level => {
    const arcadeLevelId = `crossword_${level.number}`;
    const isCompleted = progress.arcade.completedLevels.includes(arcadeLevelId);
    const bestScore = progress.arcade.highScores[arcadeLevelId];
    
    return {
      id: level.number,
      name: level.name,
      difficulty: level.difficulty,
      isLocked: false,
      stars: isCompleted ? 3 : undefined,
      bestScore: bestScore,
    };
  });

  return (
    <LevelSelector
      gameId="crossword"
      gameName="Crossword"
      levels={levels}
      onSelectLevel={(levelNumber) => {
        onPlayGame({ 
          gameId: 'crossword', 
          levelId: levelNumber, 
          mode: 'arcade'  // ✅ Arcade mode
        });
      }}
      onBack={() => setUncontrolledSelectedGame(null)}
    />
  );
}
```

### Step 5: Add to Career (Optional)

If you want the game in career mode, update campaign data:

```json
// src/assets/content/campaign/levels/level_5.json
{
  "id": "level_5",
  "title": "The Crossword Challenge",
  "gameRef": {
    "gameId": "crossword",  // ✅ Use new game
    "levelId": 1
  }
}
```

## What You Get Automatically

When you follow this pattern, you automatically get:

### ✅ Mode Separation
- Career and Arcade track completions independently
- No cross-contamination between modes

### ✅ Progress Tracking
- App-level: `progress.career.completedLevels` and `progress.arcade.completedLevels`
- Game-level: Your game's mode-specific storage

### ✅ Coin Rewards
- Career mode: Coins awarded automatically
- Arcade mode: No coins (handled by app)

### ✅ Narrative Unlocks
- Career mode: Unlocks posts, messages, chapters
- Arcade mode: No narrative impact

### ✅ High Scores
- Both modes track high scores independently
- Stored in `progress.career.highScores` and `progress.arcade.highScores`

## Storage Key Patterns

### Recommended Pattern
```
{gameName}GameState_{mode}
```

Examples:
- `wordAbstractionGameState_career`
- `wordAbstractionGameState_arcade`
- `crosswordGameState_career`
- `crosswordGameState_arcade`
- `wordSearchGameState_career`
- `wordSearchGameState_arcade`

### Why This Pattern?
- ✅ Clear game ownership
- ✅ Mode separation built-in
- ✅ Easy to debug (can see all keys in storage)
- ✅ Easy to clear per-game or per-mode

## Level ID Patterns

### Career Mode
Use campaign-specific IDs:
```
level_1, level_2, level_3, ...
```

These are set by `campaignLevelId` in the launch ref.

### Arcade Mode
Use game-specific IDs:
```
{gameId}_{levelNumber}
```

Examples:
- `word-connect_1`, `word-connect_2`
- `crossword_1`, `crossword_2`
- `word-search_1`, `word-search_2`

This prevents ID collisions between games in arcade mode.

## Common Pitfalls to Avoid

### ❌ DON'T: Share Storage Between Modes
```typescript
// BAD - Same key for both modes
const STORAGE_KEY = 'myGameState';
```

### ✅ DO: Use Mode-Specific Keys
```typescript
// GOOD - Different keys per mode
private getStorageKey(): string {
  return `myGameState_${this.currentMode}`;
}
```

### ❌ DON'T: Ignore the gameMode Prop
```typescript
// BAD - Not using the mode
export default function MyGame({ onComplete, initialLevel }: Props) {
  // Game doesn't know about mode
}
```

### ✅ DO: Accept and Use gameMode
```typescript
// GOOD - Mode-aware game
export default function MyGame({ 
  gameMode = 'career',
  ...props 
}: Props) {
  useEffect(() => {
    myGameStorage.setMode(gameMode);
  }, [gameMode]);
}
```

### ❌ DON'T: Handle Mode Logic in Game
```typescript
// BAD - Game shouldn't decide rewards
const handleComplete = (score: number) => {
  if (gameMode === 'career') {
    addCoins(10);  // Don't do this in game
  }
  onComplete?.(score);
};
```

### ✅ DO: Let App Handle Mode Logic
```typescript
// GOOD - App handles mode-specific behavior
const handleComplete = (score: number) => {
  onComplete?.(score);  // App decides coins, unlocks, etc.
};
```

## Testing Checklist for New Games

When adding a new game, test:

- [ ] Game accepts `gameMode` prop
- [ ] Storage uses mode-specific keys
- [ ] Career completion doesn't affect arcade
- [ ] Arcade completion doesn't affect career
- [ ] Career mode awards coins
- [ ] Arcade mode doesn't award coins
- [ ] Both modes track high scores independently
- [ ] Console logs show correct mode and storage keys
- [ ] Clear storage works for both modes independently

## Example: Minimal Game Template

```typescript
// src/games/my-game/MyGame.tsx
import { useEffect, useState } from 'react';
import { myGameStorage } from './utils/gameStorage';

interface MyGameProps {
  onExit?: () => void;
  onComplete?: (score: number) => void;
  initialLevel?: number;
  gameMode?: 'career' | 'arcade';
}

export default function MyGame({ 
  onExit, 
  onComplete, 
  initialLevel = 1,
  gameMode = 'career'
}: MyGameProps) {
  const [level, setLevel] = useState(initialLevel);
  
  // Set storage mode
  useEffect(() => {
    myGameStorage.setMode(gameMode);
  }, [gameMode]);
  
  // Load level progress
  useEffect(() => {
    myGameStorage.loadProgress(level).then(progress => {
      // Restore game state
    });
  }, [level]);
  
  // Save progress
  const saveProgress = () => {
    myGameStorage.saveProgress(level, {
      // Your game state
    });
  };
  
  // Complete level
  const handleLevelComplete = () => {
    const score = calculateScore();
    onComplete?.(score);  // App handles mode-specific logic
  };
  
  return (
    <div>
      <button onClick={onExit}>Exit</button>
      <button onClick={handleLevelComplete}>Complete</button>
      {/* Your game UI */}
    </div>
  );
}
```

## Summary

**The current solution is fully suitable for future games because:**

1. ✅ **Game-agnostic architecture** - App doesn't care about game internals
2. ✅ **Standardized interface** - All games use same props contract
3. ✅ **Mode awareness built-in** - Mode passed automatically to all games
4. ✅ **Flexible storage** - Each game controls its own storage format
5. ✅ **No cross-contamination** - Mode-specific keys prevent conflicts
6. ✅ **Easy to add** - Just follow the pattern, everything works
7. ✅ **Consistent behavior** - All games get same mode separation benefits

**You can add unlimited games without modifying the core separation logic!**

