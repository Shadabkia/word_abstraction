# Feature: Dashboard / Home Tab

## Purpose & Intent

(The “Van Hub” — the core of the Pars Ra Pas app)

The Dashboard is the default tab, anchored by the big Van icon.
Its purpose is to guide the player toward continuing the story, while also offering quick access to Arcade modes, quests, and player status.

It is designed to feel like a warm home screen — part Instagram dashboard, part travel diary, part game launcher.

- Be the primary entry point for the player.
- Present the current story level prominently (Hero Card).
- Provide quick actions for jumping into Arcade sessions.
- Display the player’s location, time-of-day, and progression state in a narrative-friendly way.
- Channel the vibe of “Kian checking his phone while traveling.”

## Overall Layout

```
----------------------------------------
| Top Bar (Avatar + Location + Icon)   |
----------------------------------------
| Hero Card (Continue Campaign)        |
----------------------------------------
| Quick Access Cards (Arcade Modes)   |
----------------------------------------
| Status Widgets (Fuel / Vibes)       |
----------------------------------------
| Small Feed Teaser / Notifications    |
----------------------------------------
```

Vertical scroll is allowed, but the screen is mostly above the fold.

## Components

### 1. Top Bar
A friendly header that conveys story context.

- **Player Profile Picture** (small circular) → tapping jumps to the Profile tab
- **Greeting text** (dynamic): “Good Morning, Kian.”, “Evening on the road…”, etc.
- **Location label**: “Location: Kashan”, “Location: Highway 7”
- **Small icons**: Messages (DM/Quests), Settings
- **Subtle animations**: shifting sun/moon icon depending on narrative time.

### 2. The Hero Card (Continue Story Button)
This is the main call-to-action of the entire game.

- **Structure**:
    - Large illustrated card of the current chapter environment
    - Title: Next Level Name
    - Subtitle: short teaser for the level
    - “Continue Journey” button, big and bouncy
    - Progress bar for the current chapter (e.g., “Level 12 of 20”)
- **Behavior**: Pulses softly; always visible above the fold; tapping opens the Level Post View for the next campaign level.
- **Narrative**: Feels like “Kian’s next memory waiting to be posted.”

### 3. Quick Access Cards (Shortcuts to Arcade)
Directly below the Hero Card are 2–4 small square cards pointing into popular Arcade content.

- **Examples**: Daily Puzzle, Time Attack, Zen Mode, Random Game.
- **Visuals**: Sticker-like icon, Header + short line, light tap animation.
- **Purpose**: Let players jump into bite-sized gameplay without switching tabs.

### 4. Status Widgets
Two compact widgets visually representing player progression.

- **Fuel Gauge (Energy)**: Styled like a retro van dashboard meter. Fills over time. Used for campaign levels.
- **Vibe Meter (Soft Currency)**: A small bottle, bowl, or abstract “heart spark” container. Shows accumulated Vibes.

### 5. Micro Feed Preview / Notifications
Small horizontal section at the bottom containing:
- Latest NPC posts (1–2 thumbnails)
- Active quests (icon + badge)
- “New chapter unlocked!” messages
- “Your followers reacted to your last post!”

## Smart Recommendation Layer (Adaptive Dashboard)

The Dashboard includes an adaptive, context-aware recommendation banner that intelligently changes based on player behavior, time-of-day, session count, and progression state.

**Behavior Logic:**
- **First session of the day**: “Continue Your Journey” (Prioritize Campaign)
- **Second session**: “Try Today’s Challenge” (Point to Daily Puzzle)
- **After completing Daily Challenge**: “Explore the Arcade”
- **Unread messages**: “You Have a New Quest”
- **New content unlocked**: “New Memory Available!”
- **Stuck player**: “Try a Simple Warm-Up Puzzle”

**Visual Behavior:**
- Appears directly below the greeting and above Quick Access Cards.
- Soft, rounded banner or card.
- Animates in subtly when it changes.

## Interactions & Navigation

- Tap Hero Card → Continue Story
- Tap Quick Cards → Jump to Arcade mode
- Tap avatar → Profile
- Tap messages icon → Quests screen

**Home Tab Behavior:**
- Always loads first
- Smooth, elastic transitions
- Strong visual identity with the Van aesthetic

## Design Philosophy

- **Warm and Alive**: The dashboard feels like Kian is checking his phone each morning.
- **Narrative-Driven**: Greeting, location, chapter progress all reinforce the story.
- **Friction-Free**: One tap from Home to gameplay.
- **Iconic Element**: The Van icon is always centered in the tab bar.
- **Playful**: Tactile animations, confetti on milestones.

## Final Essence
The Dashboard is the player’s home base — a warm, tactile hub centered on the Hero Card (“Continue Journey”), with shortcuts to Arcade modes, dynamic narrative context (location + greeting), and progression widgets. It is the most inviting part of the app and the main bridge into the story.


