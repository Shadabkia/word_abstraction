# Content Manager

Manages all narrative content (posts, messages, chapters) for the platform.

## Purpose
Provides a centralized API to access story content based on player progression. Implements unlock logic so content appears dynamically as players complete levels.

## Usage

```typescript
import { contentManager } from '@/core/services/contentManager';

// Get unlocked posts
const posts = contentManager.getUnlockedPosts(completedLevels);

// Get unlocked message threads
const threads = contentManager.getUnlockedThreads(completedLevels);

// Get chapters
const chapters = contentManager.getChapters();
```

## Content Files
- `src/assets/content/npcs.json`: Character data
- `src/assets/content/posts.json`: Social feed posts
- `src/assets/content/messages.json`: Message threads
- `src/assets/content/chapters.json`: Campaign chapters

