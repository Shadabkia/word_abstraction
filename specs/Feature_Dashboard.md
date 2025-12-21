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
| Status Widgets (Coins / Vibes)      |
----------------------------------------
| Small Feed Teaser / Notifications    |
----------------------------------------
```

Vertical scroll is allowed, but the screen is mostly above the fold.

## Components

### 1. Top Bar
A clean, minimalist header that conveys story context.

- **Greeting text** (26px, bold): "Good Morning, {Player Name}"
- **Notification Bell**: Top-right corner with red dot indicator for unread notifications
  - Touch-optimized with padding
  - Scale-down animation on tap
- **Location label**: Below greeting with pin icon
  - Format: "Location, {City}"
  - 14px, gray text
- **Layout**: White background, generous padding (20px horizontal, 16px top)
- **No profile picture** on Dashboard - keeps focus on content

### 2. Hero Card Carousel
The main call-to-action area, featuring a swipeable carousel of featured content.

- **Structure**:
    - **Carousel**: Swipeable cards with spring animations
    - **Content**:
      1. **Main Campaign**: Large illustrated card of current chapter (Van icon)
      2. **Zen Mode**: "Daily Meditation" card (Yoga/Lotus icon)
      3. **Challenge Mode**: "Time Attack" card (Stopwatch/Timer icon)
    - **Visuals**:
      - Large centered icon/emoji (120px)
      - Rich gradient background specific to content type
      - Glassmorphism effects for text overlay
      - Rounded corners (32px)
      - Bottom text overlay with tag (e.g., "Hero Card") and title
    - **Navigation**: Dot indicators below the carousel (Red for active, Gray for inactive)

- **Behavior**: 
  - Auto-advance (optional) or manual swipe
  - Smooth transitions between cards
  - Tapping performs the primary action for that card (Play Level, Start Mode)
  - Scale-down animation on tap

- **Narrative**: Feels like "Kian's next memory waiting to be posted."

### 3. Quick Access Buttons (Daily Actions)
Directly below the Hero Carousel are 3 tappable buttons for key daily actions.

- **Structure**: 3-column layout with generous spacing.
- **Card Design**:
  - **Icon Box**: Gradient-filled rounded square (22px radius) containing the icon
  - **Label**: Text below the icon box
  - **Shadows**: Soft shadows for depth
  - **Touch**: Scale-down effect on tap
- **Buttons**:
  1. **Daily Gift** (Orange): Access daily rewards.
  2. **Garage** (Purple): Customize the Van.
  3. **Gallery** (Teal): View collected memories/images.
- **Visuals**: Clean, modern, "app icon" style aesthetic.

### 4. Status Widgets (Coins / Vibes)
The dashboard may display lightweight player status widgets:
- **Coins**: shows coin icon + current balance and a **Plus (+)** entry point to Kian’s Shop
- **Vibes (Energy)**: shows current energy, supporting the core loop of earning energy through campaign play and spending it on feed consumption

### 5. Notifications
Handled via notification bell icon in top bar with red dot indicator for unread items.

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

- **Clean and Modern**: Card-based design with generous spacing and prominent gradients
- **Touch-First**: Every element optimized for mobile touch interaction
  - Minimum 44x44px touch targets
  - Scale-down feedback on all taps
  - Generous spacing between cards (12px)
- **Warm and Alive**: The dashboard feels like Kian is checking his phone each morning
- **Narrative-Driven**: Greeting, location, chapter context reinforce the story
- **Friction-Free**: One tap from Hero Card to gameplay
- **Visual Hierarchy**: 
  - Bold greeting (26px) draws attention
  - Large hero carousel (4:3 aspect ratio) is the primary CTA
  - Colorful gradient cards for secondary actions
- **Instagram Influence**: Clean white background, card-based layout, notification bell
- **Carousel Ready**: Designed to support multiple hero cards with smooth transitions

## Progress Tracking
- Dashboard launches games in **Career mode**
- Career mode progress is separate from Arcade mode
- Completing levels in Career mode:
  - Awards coins
  - Unlocks narrative content (posts, messages, chapters)
  - Tracks high scores
  - Marks levels as complete in Career progression
- Career completion does not affect Arcade progress

## Final Essence
The Dashboard is the player's home base — a clean, modern hub with a bold greeting, carousel of hero cards, and three vibrant quick-access cards. The design is Instagram-inspired with card-based layout, prominent gradients, and generous spacing. Touch-optimized with scale-down feedback and proper touch targets. The hero carousel is the primary CTA, designed to expand with multiple cards in the future. Every element reinforces the narrative (location, greeting, chapter context) while maintaining a friction-free path to gameplay.
