# Persian Word Abstraction Game

A multilingual word-grouping puzzle game where players find hidden connections between words by dragging and merging them into categories. Inspired by word association games, enhanced with Persian language support, icons, and AI-powered content generation.

## 🎮 The Game

**Concept**: Players are presented with 16 words and must group them into 4 categories of 4 words each. Each correct grouping reveals the category name and merges the words together. Some categories transform into visual icons for enhanced engagement.

**Languages Supported**:
- 🇮🇷 Persian (Farsi) - Primary language
- 🇬🇧 English - Full translations
- 🔤 Finglish - Persian words in Latin script

**Gameplay Features**:
- Drag-and-drop word tiles to category rows
- Progressive revelation of categories as words match
- Icon transformations for visual categories (fruits 🍎, colors 🎨, etc.)
- Multi-step levels with increasing difficulty
- Smooth animations and confetti celebrations
- Sound effects and haptic feedback

## 🛠️ Admin Utilities

**Content Management Panel** (`npm run util`)

A dedicated admin interface for managing game content:

- **Groups Tab**: Browse, edit, and manage word groups
  - View Persian, English, and Finglish translations
  - Set difficulty levels and quality scores
  - Configure icon settings (emoji, label, icon name)
  - Approve/reject AI-generated groups

- **Levels Tab**: Create and organize game levels
  - Drag-and-drop interface for level composition
  - Select which groups to include in each level
  - Control icon conversions per group
  - Preview level difficulty distribution

- **Process Tab**: AI content generation
  - Connect OpenAI API for automated word group generation
  - Configure batch size and quality thresholds
  - Review and curate AI-generated content
  - Automate Persian word group creation at scale

## 🚀 Key Features

### Data Architecture
- **SQLite Database**: Cross-platform, embedded database for word groups and levels
- **Multi-language Schema**: Native support for Persian, English, and Finglish
- **Icon System**: Flexible icon mapping with emoji fallbacks and label support

### Content Generation
- **AI-Powered**: Uses OpenAI GPT models to generate culturally relevant Persian word groups
- **Quality Control**: Built-in scoring and approval workflow for generated content
- **Batch Processing**: Generate and curate content in bulk with customizable parameters

### Icon Transformations
- Merged word groups can display as icons (e.g., 🍎 میوه‌ها)
- Supports emoji fallbacks and icon libraries (Lucide)
- Configurable per-group and per-level

### Developer Experience
- TypeScript + React for type-safe UI development
- Express + better-sqlite3 for efficient backend
- Hot-reload development with Vite
- Cross-platform compatibility (Windows, macOS, Linux)

## 📦 Installation & Running

```bash
# Install dependencies
npm install

# Run the game (development)
npm run dev

# Run admin utilities
npm run util

# Build for production
npm run build

# Run production server
npm run server
```

## 🗂️ Project Structure

```
├── src/
│   ├── App.tsx              # Main game interface
│   ├── components/          # Game UI components (tiles, rows, header)
│   ├── data/                # Static level data (fallback)
│   ├── utils/               # Level loader, icon mapper, sound manager
│   └── util/                # Admin panel components
├── server/
│   ├── index.js             # Express API server
│   ├── db.js                # Database schema and connection
│   ├── worker.js            # AI content generation worker
│   ├── levelCurator.js      # AI level curation (future)
│   ├── game_data.db         # SQLite database (tracked in git)
│   └── seed_*.js            # Database seeding scripts
└── build/                   # Production build output (git-ignored)
```

## 🌐 API Endpoints

- `GET /api/levels` - List all levels
- `GET /api/levels/:id` - Get specific level with word groups
- `GET /api/groups` - List all word groups (with filters)
- `POST /api/groups` - Create new word group
- `PUT /api/groups/:id` - Update word group
- `POST /api/process/start` - Start AI content generation
- `POST /api/process/stop` - Stop AI worker

## 🎯 Use Cases

- **Language Learning**: Practice Persian vocabulary through contextual grouping
- **Cultural Education**: Explore Iranian culture, literature, and geography
- **Cognitive Training**: Pattern recognition and abstract thinking exercises
- **Entertainment**: Casual puzzle game with progressive difficulty

## 📝 Notes

- Database (`game_data.db`) is tracked in git and works cross-platform
- Temporary SQLite files (`*.db-wal`, `*.db-shm`) are git-ignored
- Admin panel runs on port 3001, game preview on port 3009
- AI features require OpenAI API key (configured in Process Tab)

---

**Original Design**: [Figma - Design Word Merge Game UI](https://www.figma.com/design/GzOmO4w6e0PxqKJixMLWpW/Design-Word-Merge-Game-UI)

**Version**: 0.1.0 | **License**: Private
