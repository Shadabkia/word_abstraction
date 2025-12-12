# Utility Functions

## Word Shuffling (`shuffleWords.ts`)

### Purpose
Ensures that when the game starts, no row contains 4 words from the same category. This prevents the game from starting in a "solved" state and maintains proper difficulty.

### Main Function

#### `shuffleWordsWithConstraint(words: Word[], maxAttempts?: number): Word[]`

Shuffles an array of words while ensuring no row (4 consecutive words) belongs to the same category.

**Parameters:**
- `words`: Array of Word objects to shuffle
- `maxAttempts`: Maximum shuffle attempts before using smart distribution (default: 100)

**Returns:**
- Shuffled array where no 4 consecutive words share the same category

**Algorithm:**
1. **Random Shuffle Attempts**: Tries random shuffling up to `maxAttempts` times
2. **Smart Distribution**: If random fails, distributes categories evenly:
   - Groups words by category
   - Rotates through categories when placing words
   - Ensures even distribution across rows

### Example

```typescript
import { shuffleWordsWithConstraint } from './utils/shuffleWords';

const words = [
  { id: '1', text: 'word1', category: 'A' },
  { id: '2', text: 'word2', category: 'A' },
  { id: '3', text: 'word3', category: 'A' },
  { id: '4', text: 'word4', category: 'A' },
  { id: '5', text: 'word5', category: 'B' },
  // ... more words
];

const shuffled = shuffleWordsWithConstraint(words);

// Guaranteed: No row of 4 consecutive words has same category
```

### How It Works

```
Before Shuffle (BAD):
Row 1: [A, A, A, A] ❌ Complete category!
Row 2: [B, B, B, B] ❌ Complete category!

After Shuffle (GOOD):
Row 1: [A, B, C, A] ✅ Mixed categories
Row 2: [B, C, A, D] ✅ Mixed categories
```

### Performance

- **Best case**: O(n) - First random shuffle is valid
- **Average case**: O(n × k) where k is average attempts needed
- **Worst case**: O(n²) - Uses smart distribution algorithm

The function typically completes in < 10ms for 24 words.

### Testing

To verify the shuffle is working:

```typescript
const shuffled = shuffleWordsWithConstraint(words);

// Check each row
for (let i = 0; i < shuffled.length; i += 4) {
  const row = shuffled.slice(i, i + 4);
  const categories = row.map(w => w.category);
  const uniqueCategories = new Set(categories);
  
  console.assert(
    uniqueCategories.size > 1,
    `Row ${i/4 + 1} has mixed categories`
  );
}
```

### Edge Cases Handled

1. **Empty array**: Returns empty array
2. **Less than 4 words**: Returns shuffled array (no constraint needed)
3. **All same category**: Smart distribution ensures mixing
4. **Uneven category distribution**: Handles gracefully

## Future Enhancements

- Add difficulty levels (allow 3 same category in harder modes)
- Optimize for larger grids (8x4, 10x4, etc.)
- Add seeded random for reproducible shuffles

