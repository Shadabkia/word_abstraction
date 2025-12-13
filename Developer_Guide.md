# Quick Reference — Developer Guide

## Running the App

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
```

## Project Structure (At a Glance)

```
src/
├── App.tsx                    # Main shell (5-tab navigation)
├── assets/content/            # Story content (JSON)
├── core/
│   ├── domain/types.ts        # Platform interfaces
│   ├── state/gameState.ts     # Persistent progress
│   └── services/contentManager.ts  # Content API
├── features/                  # The 5 tabs
│   ├── dashboard/
│   ├── feed/
│   ├── arcade/
│   ├── messages/
│   └── profile/
├── games/word-connect/        # Game engine (modular)
└── shared/ui/                 # Reusable components
```

## Key Concepts

### State Management
```typescript
import { useGameState } from '@/core/state/gameState';

const { user, progress, completeLevel } = useGameState();
// progress.completedLevels → array of level IDs
// completeLevel(levelId, score, stars) → mark complete + unlock content
```

### Content System
```typescript
import { contentManager } from '@/core/services/contentManager';

const posts = contentManager.getUnlockedPosts(completedLevels);
const threads = contentManager.getUnlockedThreads(completedLevels);
```

### Adding a New Game
1. Create `src/games/your-game/YourGame.tsx`
2. Accept props: `{ onExit, onComplete, initialLevel }`
3. Call `onComplete(score)` when level finishes
4. Add to `ArcadeScreen.tsx` with a GameCard

## Debugging Tips

### Reset Save Data
Open browser console:
```javascript
localStorage.removeItem('pars-ra-pas-storage')
location.reload()
```

### Force Unlock Content
```javascript
useGameState.getState().completeLevel('level_5', 1000, 3)
```

### Check What's Unlocked
```javascript
useGameState.getState().progress.completedLevels
```

## Common Tasks

### Add a New Post
Edit `src/assets/content/posts.json`:
```json
{
  "id": "post_new",
  "authorId": "npc_mom",
  "caption": "New content!",
  "unlockCondition": {
    "type": "level_complete",
    "targetId": "level_10"
  }
}
```

### Add a New NPC
Edit `src/assets/content/npcs.json` and add character data.

### Add a New Chapter
Edit `src/assets/content/chapters.json` with unlock requirements.

