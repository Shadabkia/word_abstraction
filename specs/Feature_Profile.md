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

**Profile Picture**
- Circular avatar, Instagram-style border.
- Evolves as the campaign progresses (e.g., Office Kian → Darvish Book Kian → Van Kian → Road Kian → Desert Kian).
- Subtle animation when updated (pulse glow).

**Username & Display Name**
- Display Name: Kian
- Username: @pars_ra_pas or dynamically updated username.

**Bio Section**
- Short 2–3 lines.
- Changes as the story progresses (e.g., “Former engineer. Current runaway.” → “Driver of The Onion.” → “Seeker of Vibes.”).
- Bio updates after some chapters to show personal growth.

### 2. Stats Row
Styled like Instagram’s “Posts / Followers / Following.”

- **Posts:** Total completed levels.
- **Followers:** Increases with story milestones; gives a feeling of narrative progression.
- **Following:** Mostly static or small changes for humor (e.g., Kian follows 1 person: “Mom”).

Optional additional metrics (shown by tapping a small “stats” button):
- Vibes collected
- Regions visited
- Campaign completion %

### 3. Chapter Selector (Story Circles)
A horizontal row of circular icons — Instagram highlight style.

**Structure**
- Each circle contains:
    - Mini illustration (chapter icon)
    - Chapter number
    - Lock overlay (if locked)

**Interaction**
- Scroll horizontally to reveal more chapters.
- Tap a chapter → level grid filters to show only levels from that chapter.
- Selected chapter circle expands slightly (zoom 5–10%).

**Visual State**
- Unlocked: Full color.
- Current Chapter: Pulsing outline.
- Locked: Greyed with lock icon.
- Completed: Gradient ring or checkmark.

### 4. Level Grid (Posts Grid)
A 3-column grid, mimicking Instagram’s gallery.

**Level Tile Content**
- Each tile = one level.
- Level cover image (comic-style preview or symbolic illustration).
- Lock overlay if not yet unlocked.
- Level number (small badge).
- Completion state:
    - Solved: Full color.
    - Current: Animated bounce or glow.
    - Locked: Grayscale + padlock.

**Sorting**
- Ordered left → right, top → bottom.
- Levels grouped by chapter.
- Levels update live after completion.

**Additional Info (optional small overlays)**
- Difficulty tag
- Stars or rating
- Mini icon showing the type of gameplay mode

## Single Level View (Post View)

When tapping a level tile, the player enters a post-like detail view.

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

## Progression Features

### 1. Profile Evolution
The profile itself becomes a record of Kian’s transformation.
Progression signals include:
- Avatar changes
- Bio updates
- New chapters appearing
- New followers
- New achievements

### 2. Achievements Panel
- Accessible via a small icon next to the bio.
- Shows badges (e.g., “Office Escapee,” “Gaz Survivor”) and progress meters.

## Design Principles

- **Familiar but whimsical:** Instagram-like layout but with warm Persian motifs and playful micro-animations.
- **Narrative-first:** Profile = storybook; Levels = posts; Chapters = highlights.
- **Clear progression:** Lock states, completion badges, follower growth.
- **Tactile:** Sticker-like UI, bouncy animations, soft shadows, “satisfying” interactions.
- **Persian identity:** Typography, icons, subtle textures, cultural cues embedded in visuals.

## Final Essence
The Profile Tab is an Instagram-like narrative hub where the player browses Kian’s life as a series of “posts,” selects chapters and levels through highlight circles and a photo grid, and experiences the campaign story as a social media profile of his journey across Iran.


