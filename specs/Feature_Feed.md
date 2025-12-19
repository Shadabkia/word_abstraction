# Feature: Feed Tab

## Purpose

“The Lore Stream” — NPC posts, world flavor, passive storytelling.

The Feed Tab is the fictional social network timeline of Pars Ra Pas. It delivers ambient storytelling, charm, humor, and character presence without forcing the player into gameplay. This is where the game feels alive.

- Act as the world’s social feed — NPCs posting as if they’re real people.
- Deliver story flavor and worldbuilding through captions, photos, and comments.
- Update dynamically as the player progresses through the campaign.
- Provide a daily “check-in” experience.
- Pure narrative immersion, not gameplay.

## Overall Layout

```
-----------------------------------
|  STORIES ROW (Daily Challenges) |
-----------------------------------
|  FEED POSTS (NPC Content Only)  |
-----------------------------------
```

Simple. Familiar. Scrollable. Delightful.

## Components

### 1. Stories Row
A horizontal strip of circular “story bubbles,” exactly like Instagram.

- **Content**:
    - Daily Challenge (resets every 24 hours)
    - Special game modes (e.g., limited event puzzles)
- **Visuals**:
    - New stories: colorful animated rings
    - Used stories: faded ring
    - Locked stories: greyed out
- **Interaction**: Tap → Open the daily challenge/game mode intro screen.

### 2. Feed Posts (NPC Content Only)
A vertical feed of posts authored by NPCs from the game’s world.

**Post Content (Instagram-like):**
- Header: NPC identity (name/handle), optional location
- Body: one of several content types (image, carousel, typography, plain text)
- Caption: 1–5 short lines (no lore dumping)
- Comments: 2–6 comments, optional 1-level replies
- Like icon: cosmetic only (Kian is mostly a “like”, not a commenter)

**Media sizing (Instagram-like)**
- Feed post media is **not forced square**.
- Images/carousels render at **full width** and preserve the full image (no cropping).
- Typography posts can remain square for readability and consistency.

**NPC Examples:** Mr. Ghoulian (angry boss), Mom (overprotective), The Darvish (cryptic), Mechanic Ali.

**Dynamic Updating:**
The feed changes over time, triggered by:
- Completing a level
- Entering a new chapter/city
- Daily refresh (1-3 new NPC posts)
- Unlocking a daily challenge

### 3. Post Types
Each post uses exactly one body format:

- **Image (single)**: one photo/illustration.
- **Carousel (2–5 slides)**: multiple images, sequential or associative.
- **Typography / Quote (HTML)**: text rendered as the main visual (mechanic/system/philosophical accounts).
- **Plain Text (no image)**: rare, rushed, emotional, unpolished.

## User Interaction

- Tap → open post detail view
- Swipe → scroll feed
- Double tap (optional) → heart animation
- Tap comments → see NPC-only thread
- All interactions mimic Instagram.

## Design Feel

- Warm cream backgrounds
- Soft shadows
- Rounded, tactile cells
- Persian-inspired color accents
- Smooth, bouncy animations
- Delightfully simple.

## Final Essence
The Feed Tab is a daily-updating Instagram-style timeline of NPC posts, with a Stories row for daily challenges. Posts include images, captions, and NPC comments. The feed evolves as the player progresses, providing worldbuilding and charm without gameplay pressure.

## Canonical Content Model (Feed Post)
Feed posts are authored in `src/assets/content/posts.json`.

- **Identity**: `authorId`, optional `authorType`, optional `location`
- **Body**: `body.type` + content fields depending on type
- **Caption**: `caption` (1–5 short lines)
- **Comments**: `comments[]` with optional `replies[]` (1 level deep)

Body types:
- `image`: `{ src }`
- `carousel`: `{ slides: [{ src }] }` (2–5)
- `html`: `{ html }` (rendered inside a square “post body”)
- `text`: `{ text }` (plain text fallback)



