# Feature: Profile Tab (Campaign Mode)

## Purpose & Narrative Intent

The Profile Tab is the heart of the campaign mode. It intentionally mirrors an Instagram profile page to make the story feel like a social feed of Kian’s journey, where each level is a “post” and each chapter is a “Story Highlight.”

This tab blends progression, storytelling, and identity in one screen.

- This is Kian’s in-universe public profile, where he “posts” memories of his travels.
- Each level = one memory ⇒ displayed as a post.
- Each chapter = a highlight bubble at the top ⇒ acts as chapter selector.
- Player progression is visually expressed through:
    - Profile picture evolution
    - Growing follower count
    - Updated bio
    - Chapter unlocks & level unlocks
- The player navigates the journey as if browsing Kian’s travel profile.

## Overall Layout

Modeled after Instagram Profile:

```
-----------------------------------
|   Profile Header (Avatar + Bio) |
-----------------------------------
|   Stats Row (Posts – Followers – Following) |
-----------------------------------
|   Chapter Selector Row (Story Circles)     |
-----------------------------------
|   Level Grid (3-column posts)              |
-----------------------------------
```

The layout scrolls vertically as a single feed.

## Components

### 1. Profile Header

**Top Bar**
- Username displayed as title (20px, semibold)
- Settings icon in top-right corner (gear icon, touch-optimized with padding)

**Profile Picture**
- Circular avatar (80px) with Instagram-style gradient ring:
  - Outer gradient ring: Purple → Pink → Orange (2.5px)
  - White separator ring (2.5px)
  - Avatar content inside
- Touch-interactive button with scale-down feedback
- Evolves as the campaign progresses (e.g., Office Kian → Darvish Book Kian → Van Kian → Road Kian → Desert Kian)

**Username & Display Name**
- Display Name appears both in top bar and above bio
- Bio-section name: bold, 14px

**Bio Section**
- Short 2–3 lines, 14px
- Changes as the story progresses (e.g., "Former engineer. Current runaway." → "Driver of The Onion." → "Seeker of Vibes.")
- Location info below bio with pin icon (13px, gray text)

### 2. Stats Row
Styled like Instagram's "Followers / Following."

- **Followers:** Displayed with "K" suffix (e.g., "26K"), increases with story milestones; gives a feeling of narrative progression.
- **Following:** Displayed with "+" suffix (e.g., "80+"), mostly static or small changes for humor (e.g., Kian follows a few NPCs).

Note: Posts count is not displayed in the stats row to keep focus on social metrics.

### 3. Chapter Selector (Story Circles)
A horizontal row of circular icons — Instagram highlight style with "Highlights" title.

**Structure**
- Bold "Highlights" section title (15px, bold)
- Each circle (70px diameter) contains:
    - Gradient ring border (3px):
      - Selected: Purple/pink/orange gradient
      - Complete: Green gradient with checkmark badge
      - In-progress: Gray gradient
      - Locked: Plain gray
    - White inner border (2px) for separation
    - Chapter icon/emoji inside circle
    - Chapter label below (13px)

**Interaction**
- Touch-optimized buttons with haptic-like feedback
- Scroll horizontally to reveal more chapters
- Tap a chapter → level grid filters to show only levels from that chapter
- Active state: scale down to 0.90 on tap

**Visual State**
- Unlocked: Full color gradient ring based on state
- Selected: Purple/pink/orange gradient ring
- Locked: Gray with lock emoji
- Completed: Green gradient ring + checkmark badge in bottom-right corner

### 4. Level Grid (Posts Grid)
A 3-column grid with generous spacing, optimized for touch interaction.

**Level Tile Content**
- Each tile = one level with rounded corners (12px border-radius).
- Level cover image (comic-style preview or symbolic illustration).
- Status label below each tile ("completed", "current", "locked", "available").
- Visual indicators:
  - **Completed**: Large white checkmark overlay (64px), centered
  - **Current**: Orange/red ring border (3px), with "current" label
  - **Locked**: Large white lock icon (48px), grayscale image
  - **Available**: Full color, no overlay

**Touch Optimization**
- Minimum spacing of 12px between tiles for comfortable tapping
- Touch-manipulation CSS for better mobile responsiveness
- Active state feedback with scale animations (0.95 on tap)
- All interactive elements meet 44x44px minimum touch target standards

**Thumbnail Asset Convention (for the grid)**
- Each level folder may include a square thumbnail:
  - `public/campaign/images/chX/CHX-LYY/thumbnail.(webp|png|jpg|jpeg|svg)`
- The UI will try common extensions in a preferred order (webp → png → jpg → jpeg → svg).

**Sorting**
- Ordered left → right, top → bottom.
- Levels grouped by chapter.
- Levels update live after completion.

## Single Level View (Post View)

When tapping a level tile, the player enters a post-like detail view.

### Navigation Contract (Mobile Back)
- Back from the post view returns to the Profile grid (chapter + level tiles).
- If the player launches a puzzle from the post view:
  - Back from the puzzle returns to the exact place they came from (typically the post view).
  - The experience should feel like a natural “drill-in / drill-out” stack, not a tab jump.

### 1. Header
- Kian’s avatar + username
- “Location” field (auto-filled by chapter city)
- Timestamp (fictional: “3 days after quitting job”)

### 2. Carousel Content
The main gameplay narrative lives here:

#### Canonical Narrative Format: “Social Comic Post”
The campaign post is sequential visual storytelling optimized for mobile reading.

**Hard rules**
- **Comic slide count:** Exactly **4** slides.
- **Panels per slide:** **1–3** panels (intentional variation).
- **Text density:** Minimal. Either diegetic dialogue, or short narrator captions.
- **No exposition dumps, no spoilers, no heroic framing.**

**Slide structure**
- **Slide 1 — Establishing**: atmosphere + Kian-in-context + status gag.
- **Slide 2 — First attempt**: action → partial response → pause.
- **Slide 3 — Repetition/absurdity**: repeated action + ironic beat + restrained reaction.
- **Slide 4 — Temporary resolution**: stabilizes without triumph.

#### Silent Start Screen (separate from the 4 comic slides)
After the 4th slide, the post shows a **silent start screen frame**:
- **Image only** (no narration, no dialogue in UI).
- Same location, calm neutral composition.
- Signals “now you play” without instruction.
- UI overlays (CTA) are **not part of the artwork**.

The “Start Puzzle” CTA appears as UI (bold, sticker-like), not baked into the art.

### 3. Footer
- Heart (likes)
- Comment icon
- Save/Bookmark icon
- Comments section:
    - NPCs leave funny comments related to the level (e.g., Mr. Ghoulian: “This tea break is unauthorized.”, Mom: “Did you eat? You look pale.”)

This blends world-building with UI familiarity.

### 4. Content Loading (Data-Driven)
Campaign post content (comic slides, start screen frame, comments, caption) is authored as JSON and loaded dynamically.
- **Per-level narrative JSON:** `src/assets/content/campaign/levels/**`
- **Comic/start-screen images:** `public/campaign/images/**` (served as `/campaign/images/**`)
- The runtime resolves image URLs from the images directory (build-friendly).

### 5. Launching the Game (Campaign → Puzzle)
Each campaign post launches a specific game session using a `gameRef`:
- **gameId**: which game module to mount (e.g. `word-connect`)
- **levelId**: which level inside that game to load (number for Word Connect)

`gameRef` is defined in `campaign.json` and may be overridden per-level in `campaign/levels/**` so the narrative file can be the “single source of truth” for that level.

## Progression Features

### 1. Career Mode Progress Tracking
- Profile tab launches games in **Career mode**
- Career progress is **separate** from Arcade mode
- Completing levels in Career mode:
  - Awards coins
  - Unlocks narrative content (posts, messages, chapters)
  - Tracks high scores
  - Marks levels as complete in Career progression
  - Advances the story
- Career completion does not affect Arcade progress
- Levels are unlocked sequentially in Career mode

### 2. Profile Evolution
The profile itself becomes a record of Kian's transformation.
Progression signals include:
- Avatar changes
- Bio updates
- New chapters appearing
- New followers
- New achievements

### 3. Achievements Panel
- Accessible via a small icon next to the bio.
- Shows badges (e.g., "Office Escapee," "Gaz Survivor") and progress meters.

## Design Principles

- **Familiar but whimsical:** Instagram-like layout but with warm Persian motifs and playful micro-animations.
- **Narrative-first:** Profile = storybook; Levels = posts; Chapters = highlights.
- **Clear progression:** Lock states, completion badges, follower growth.
- **Tactile:** Sticker-like UI, bouncy animations, soft shadows, "satisfying" interactions.
- **Persian identity:** Typography, icons, subtle textures, cultural cues embedded in visuals.
- **Polished aesthetics:** 
  - Profile header with gradient-ringed avatar (Instagram story style)
  - Settings icon for profile management
  - Bold "Highlights" section title
  - Chapter highlights with gradient rings (purple/pink/orange for selected, green for complete, gray for in-progress)
  - Clean 3-column level grid with 12px gaps on light background (#FAFAFA)
  - Prominent status labels below each level tile ("completed", "current", "locked")
  - Large, centered visual indicators (checkmarks, lock icons)
  - Current level marked with orange ring border
  - Rounded corners (12px) on all level tiles
- **Touch-optimized for mobile:**
  - All interactive elements meet 44x44px minimum touch targets
  - Generous spacing (12px) between grid items
  - Touch-manipulation CSS for responsive feedback
  - Scale-down animations on tap (0.90-0.95)
  - Active state feedback on all buttons
  - Optimized for thumb-based navigation
  - No hover-dependent interactions

## Final Essence
The Profile Tab is an Instagram-like narrative hub where the player browses Kian’s life as a series of “posts,” selects chapters and levels through highlight circles and a photo grid, and experiences the campaign story as a social media profile of his journey across Iran.



