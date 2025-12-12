# Campaign Mode Implementation

## 🎉 Overview

Implemented a full Instagram-style campaign/story mode for the Profile tab, including:
- **2 Chapters** (Tehran & Kashan) with **10 levels total**
- **Instagram-like Post View** with swipeable story slides
- **Rich narrative content** with captions, comments from NPCs
- **JSON-based content system** for easy expansion
- **Seamless game integration** - swipe through story → tap "Start Puzzle" → play game

## 📁 New Files

### 1. **`src/assets/content/campaign.json`**
Complete campaign content with:
- **Chapter 1: Tehran - The Great Escape** (Levels 1-5)
  - Level 1: Breakfast Table - Last morning at home
  - Level 2: The Office - Quitting the job
  - Level 3: The Garage - Meeting The Onion van
  - Level 4: Packing - Preparing to leave
  - Level 5: Last Night - Goodbye to Tehran

- **Chapter 2: Kashan - Desert Roads** (Levels 6-10)
  - Level 6: Highway Morning - First sunrise on the road
  - Level 7: The Tea House - Meeting the Darvish  
  - Level 8: The Desert - Finding silence
  - Level 9: Fin Garden - Oasis in the desert
  - Level 10: Kashan Night - Stars over an ancient city

Each level includes:
- Persian & English titles
- 3-4 narrative slides (cover, story, game start)
- Location tags
- Captions (bilingual)
- NPC comments (Mom, Darvish, Ali, Mr. Ghoulian)
- Mapped to Word Connect game levels

### 2. **`src/core/services/campaignManager.ts`**
Centralized campaign content manager:
- `getChapters()`: Get all chapters
- `getLevel(levelId)`: Get level by ID
- `getLevelByNumber(n)`: Get level by number
- `getUnlockedChapters(completed)`: Get unlocked chapters
- `getNextLevel(completed)`: Get next level to play
- `getLevelAsPost(levelId)`: Convert level to Instagram post format

### 3. **`src/features/profile/components/LevelPostView.tsx`**
Full Instagram-style post viewer:
- **Swipeable slides** (tap sides or use arrows)
- **Progress indicators** at top
- **Header** with author info
- **Caption & comments** at bottom
- **Comments sheet** (slide up)
- **Game start screen** on last slide
- Smooth animations with Framer Motion

### 4. **`src/features/profile/ProfileScreen.tsx`** (Updated)
Complete Profile/Campaign screen:
- Instagram-style **profile header** (avatar, name, stats)
- **Chapter selector** as story highlight circles
- **3x3 level grid** (Instagram posts grid)
- Level states: completed ✓, locked 🔒, available
- Click level → opens post view
- Post view integrates with game launch

## 🎮 User Flow

```
1. Player taps Profile tab
   ↓
2. Sees Kian's profile (avatar, bio, stats)
   ↓
3. Chapter selector shows Tehran & Kashan
   ↓
4. 3x3 grid shows 10 levels as "posts"
   ↓
5. Tap a level → Instagram post opens
   ↓
6. Swipe through story slides (2-3 narrative slides)
   ↓
7. Last slide shows "Start Puzzle" button
   ↓
8. Tap → launches Word Connect at that level
   ↓
9. Complete game → level marked complete → new levels unlock
```

## 🎨 Visual Design

### Profile Header
- Circular avatar (gradient)
- Stats row: Levels, Followers, Following
- Bio: "Former office worker. Now driving across Iran..."
- Location indicator

### Chapter Selector
- Horizontal scrollable circles (like IG stories)
- Each shows: City name, progress (3/5)
- Chapter 1 (Tehran): Dark slate gradient
- Chapter 2 (Kashan): Orange/red desert gradient
- Locked chapters: greyed out with 🔒

### Level Grid
- 3 columns, square aspect ratio
- Background gradient matches chapter color
- Level number badge (top-left)
- Completion badge ✓ (top-right if complete)
- Hover shows Persian title
- Locked levels: dark overlay + 🔒

### Post View
- Full-screen black background
- Swipeable slides with progress bar
- Cover slide: Title + subtitle (large typography)
- Story slides: Narrative text (bilingual)
- Game slide: Icon + "Ready to Play?" + big button
- Caption & comments footer (Instagram style)
- Comments sheet slides up from bottom

## 📊 Content Structure

### JSON Schema
```json
{
  "version": "1.0",
  "chapters": [
    {
      "id": "chapter_1",
      "title": "Tehran",
      "subtitle": "The Great Escape",
      "color": "from-slate-600 to-slate-800",
      "levels": [
        {
          "id": "campaign_level_1",
          "levelNumber": 1,
          "wordConnectLevel": 1,
          "title": "سفره صبحانه",
          "titleEn": "Breakfast Table",
          "location": "Tehran • Kian's Apartment",
          "slides": [...],
          "caption": "آخرین صبحانه خونگی...",
          "comments": [...]
        }
      ]
    }
  ]
}
```

## 🔧 Technical Details

### State Management
- `completedLevels`: Array of level IDs (`["level_1", "level_2"]`)
- `currentCampaignLevel`: Next level number to play
- `unlockedChapters`: Array of chapter IDs

### Level Unlocking
- **Level 1**: Always unlocked
- **Subsequent levels**: Unlock after previous level complete
- **Chapter 2**: Unlocks after all Chapter 1 levels complete

### Game Integration
- Campaign levels map to Word Connect levels (1:1)
- Clicking "Start Puzzle" launches game at specific level
- Completing game marks campaign level complete
- Progress syncs automatically

## 🌟 Story Content Highlights

### Narrative Themes
- **Chapter 1 (Tehran)**: Escape from corporate life, preparation, saying goodbye
- **Chapter 2 (Kashan)**: Freedom, desert wisdom, meeting the Darvish

### NPC Personalities
- **Mom**: Worried, overprotective, loving ("Did you pack warm socks?!")
- **Mr. Ghoulian**: Angry boss, demanding, frustrated
- **The Darvish**: Mystical, wise, speaks in riddles
- **Mechanic Ali**: Supportive, practical, technical

### Bilingual Content
- Persian titles and captions (authentic voice)
- English translations (accessible to all)
- Mix of Farsi and English in comments (natural code-switching)

## 🚀 Extensibility

### Adding New Chapters
1. Add chapter object to `campaign.json`
2. Define 5 levels with narrative content
3. Set chapter color gradient
4. Map to Word Connect levels (or future games)

### Adding New Games
Future levels can specify different games:
```json
{
  "gameId": "word-search",
  "gameLevelNumber": 5
}
```

### Content Localization
All text is in JSON - easy to create alternate language files

## 📈 Next Steps (Optional)

- [ ] Add more chapters (Isfahan, Yazd, Shiraz...)
- [ ] Create illustrated covers for each level
- [ ] Add voice-over narration to story slides
- [ ] Implement level star ratings (1-3 stars)
- [ ] Add "replay level" from profile
- [ ] Share completed levels to "feed"

## ✨ User Experience

The campaign mode now feels like:
- **Reading a graphic novel** (story slides)
- **Browsing Instagram** (profile, posts, comments)
- **Playing a puzzle game** (Word Connect levels)
- **Taking a road trip** (journey across Iran)

All seamlessly integrated into one cohesive experience!

---

**Ready to play!** Navigate to Profile → Tap a level → Experience the story!

