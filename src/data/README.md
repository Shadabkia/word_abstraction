# Game Levels Data Structure

This directory contains all the word data for each level of the game.

## Directory Structure

```
data/
├── types.ts              # TypeScript interfaces for Word and LevelData
├── levels/
│   ├── index.ts         # Central export for all levels
│   ├── level1.ts        # Level 1 words and categories
│   ├── level2.ts        # Level 2 words and categories (add as needed)
│   └── level3.ts        # Level 3 words and categories (add as needed)
└── README.md           # This file
```

## How to Add a New Level

### Step 1: Create a New Level File

Create a new file in `data/levels/` called `level2.ts`:

```typescript
import { LevelData } from '../types';

const level2: LevelData = {
  levelNumber: 2,
  words: [
    { id: '1', text: 'کتاب', category: 'مدرسه' },
    { id: '2', text: 'دفتر', category: 'مدرسه' },
    // Add 24 words total (6 categories × 4 words each)
  ],
  categories: {
    'مدرسه': 'مدرسه',
    'ورزش': 'ورزش',
    // Add all category names
  },
};

export default level2;
```

### Step 2: Register the Level

Edit `data/levels/index.ts` and add your new level:

```typescript
import level1 from './level1';
import level2 from './level2';  // Add this import

const levels: Record<number, LevelData> = {
  1: level1,
  2: level2,  // Add this line
};
```

### Step 3: Update the Game

The game will automatically use the new level! The `App.tsx` component gets level data using:

```typescript
const currentLevelData = getLevelData(levelNumber);
```

## Data Format

### Word Object
```typescript
{
  id: string;       // Unique identifier (e.g., '1', '2', etc.)
  text: string;     // The word text (e.g., 'پیانو')
  category: string; // Category key (e.g., 'آلات_موسیقی')
}
```

### Level Requirements
- **24 words total** (6 rows × 4 columns)
- **6 categories** (each category has 4 words)
- Categories must have exactly 4 words each
- All word IDs must be unique within the level

### Category Names
The `categories` object maps category keys to display names:
```typescript
{
  'آلات_موسیقی': 'آلات موسیقی',  // key: display name
}
```

## Helper Functions

### `getLevelData(levelNumber: number)`
Returns the level data for the given level number, or `undefined` if it doesn't exist.

### `hasLevel(levelNumber: number)`
Returns `true` if the level exists, `false` otherwise.

### `getTotalLevels()`
Returns the total number of available levels.

## Example Usage in Components

```typescript
import { getLevelData } from './data/levels';

function MyComponent() {
  const levelData = getLevelData(1);
  
  if (levelData) {
    console.log(levelData.words);      // Array of words
    console.log(levelData.categories); // Category names
  }
}
```

## Tips

1. **Keep categories balanced**: Each category must have exactly 4 words
2. **Use unique IDs**: Make sure word IDs are unique within each level
3. **Test your level**: After creating a new level, test it in the game
4. **Category keys**: Use underscores in category keys (e.g., `آلات_موسیقی`)
5. **Display names**: Use proper formatting in display names (e.g., `آلات موسیقی`)

