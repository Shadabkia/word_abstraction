# Pars Ra Pas

**A narrative-driven platform of Persian word games inside a fictional social app.**

Pars Ra Pas is not a single game — it's a pocket arcade wrapped in a story. Follow Kian as he travels across Iran in his van, "The Onion", while you solve word puzzles, unlock memories, and explore a world told through an Instagram-like interface.

## 🎮 What Is This?

A platform where:
- **The UI is the world**: Everything happens inside a fictional social media app
- **Multiple games**: Word Connect, word searches, and more puzzle types (modular architecture)
- **Story-driven**: Each level unlocks a memory, posts appear in the feed, NPCs send messages
- **5 Tabs**: Feed, Arcade, Dashboard, Messages, and Profile — each serving a unique purpose

## 🏗️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **State**: Zustand (global state) + React Context
- **Styling**: Tailwind CSS 4 + Framer Motion
- **UI Components**: Radix UI + shadcn/ui
- **Mobile**: Capacitor (Android/iOS)
- **Content**: JSON-driven (levels, posts, messages, NPCs)

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### Build for Production
```bash
npm run build
```

## 📂 Project Structure

```
src/
├── assets/content/      # JSON content (posts, messages, NPCs)
├── core/                # Business logic & state (no UI)
│   ├── domain/          # TypeScript interfaces
│   ├── state/           # Zustand stores
│   └── services/        # Content manager, loaders
├── features/            # Feature modules (UI + logic)
│   ├── dashboard/       # Home tab (Hero Card)
│   ├── feed/            # Social feed
│   ├── arcade/          # Game library
│   ├── messages/        # DM inbox
│   └── profile/         # Campaign mode
├── games/               # Pluggable game engines
│   └── word-connect/    # 4x4 word categorization game
└── shared/              # Reusable components & utils
```

## 🎯 The Five Tabs

1. **Feed** — Instagram-style timeline of NPC posts and daily challenges
2. **Arcade** — Browse and play all available game modes
3. **Dashboard** — The hub: continue campaign, quick access, status widgets
4. **Messages** — Read-only DMs from NPCs (quests, hints, story beats)
5. **Profile** — Campaign progression: levels as "posts", chapters as "highlights"

## 🎨 Design Philosophy

- **Warm & Familiar**: Instagram-like UX with Persian cultural flavor
- **Modular**: New games plug in with a standard interface
- **Content-Driven**: Add levels, posts, and messages without touching code
- **Story-First**: Every puzzle is a memory; every memory is a post

## 📱 Mobile Build (Capacitor)

### Sync Changes
```bash
npm run cap:sync
```

### Open Android Studio
```bash
npm run cap:open:android
```

### Full Build
```bash
npm run cap:build
```

## 🧩 Adding Content

All content lives in `src/assets/content/` as JSON:
- `campaign.json` — Campaign levels and chapter definitions
- `posts.json` — NPC social feed posts
- `messages.json` — DM threads from NPCs
- `npcs.json` — Character data

Levels for each game are in their respective directories:
- `src/games/word-connect/data/levels/`

### Validate Levels
```bash
npm run validate-levels
```

## 📖 Documentation

- [Architecture](./specs/Architecture.md) — Technical structure
- [Vision](./specs/Vision_HighLevel.md) — High-level concept
- [Developer Guide](./specs/Developer_Guide.md) — Implementation details
- [Main Spec](./specs/Main.md) — Complete UX specification

## 🛠️ Development Status

✅ Core platform architecture  
✅ All 5 tabs implemented  
✅ Word Connect game integrated  
✅ Content system (posts, messages, NPCs)  
✅ Campaign manager & progression  
🚧 Additional game modes (in progress)  
🚧 Full narrative content (in progress)

---

**Built with care in Tehran** 🇮🇷

