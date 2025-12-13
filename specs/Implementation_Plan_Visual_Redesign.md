# Visual Redesign Implementation Plan

Based on the "Visual & Aesthetic Design Specification" provided, this plan outlines the technical steps to transform the current "candy/glass" aesthetic into a "calm, intelligent" puzzle space.

## 1. Design System Foundation (`src/styles/globals.css`)

We will replace the current chaotic color variables with a structured "Climate" system.

### New CSS Variables
```css
:root {
  /* Climate System - Default (Calm/Neutral) */
  --climate-bg-primary: #F2F4F6;       /* Soft Blue-Grey */
  --climate-bg-secondary: #E8EAED;     /* Slightly darker for context */
  
  /* The Grid */
  --climate-grid-bg: transparent;      /* The grid floats */
  
  /* Word Blocks */
  --climate-tile-bg: #FFFFFF;
  --climate-tile-text: #2D3436;        /* Dark Grey, not Black */
  --climate-tile-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  --climate-tile-shadow-active: 0 8px 24px rgba(0, 0, 0, 0.12);
  --climate-tile-border: 1px solid rgba(0, 0, 0, 0.04);
  
  /* UI Elements */
  --climate-ui-text-primary: #2D3436;
  --climate-ui-text-secondary: #636E72;
  --climate-ui-accent: #DFE6E9;
  
  /* Feedback Colors (Restrained) */
  --climate-success: #81ECEC; /* Soft Teal */
  --climate-hint: #FFEAA7;    /* Soft Yellow */
  --climate-selection: #74B9FF; /* Soft Blue */
}
```

### Global Typography
- Ensure `font-display` uses a clean sans-serif (likely existing 'Poppins' or system font) with generous line height.
- Remove text-shadows and heavy weights.

## 2. Main Game Container (`WordConnectGame.tsx`)

**Goal:** "Screen Composition - Vertically centered and hierarchically calm."

- **Remove:** `bg-candy-bg`, `bg-pattern-dots`.
- **Add:** A wrapper that uses `--climate-bg-primary` and a subtle CSS radial gradient for the "Atmosphere".
- **Layout:**
    - Center the grid vertically.
    - Move "Progress" and "Topics" to be contextual, not dominant.
    - Redesign the Top Bar to be minimal (remove "glass-panel", "shadow-3d").
    - Redesign Bottom Bar (remove "btn-3d", "skew" effects).

## 3. The Grid & Tiles (`GridWordTile.tsx`)

**Goal:** "Tactile and neutral... Soft shapes, gentle elevation."

- **Shape:** `rounded-2xl` (already present, keep).
- **Surface:** Change from "glass/gradient" to Flat Matte White (`--climate-tile-bg`).
- **Elevation:** Use soft box-shadows instead of hard borders or 3d effects.
- **Typography:** Dark grey, medium weight, centered.
- **Motion:**
    - **Idle:** No animation or very subtle breathing.
    - **Drag:** Scale 1.05, increased shadow.
    - **Drop:** Soft spring (damping: 25, stiffness: 300).
    - **Merge:** Subtle glow/fade instead of confetti explosion (reduce confetti intensity).

## 4. UI Components (`GameHeader.tsx`, `LevelSelector.tsx`)

**Goal:** "Utility elements recede unless needed."

- **Header:** Simple text or thin bar for progress. No massive banners.
- **Buttons:** Flat or very subtle neumorphic (soft shadow, no border). Icons in dark grey.
- **Level Selector:** Clean list/grid, no "candy" styling.

## 5. Background "Atmosphere"

- Implement a CSS-based background that can change based on "Climate".
- Initially, just one "Default Climate".
- **Pattern:** CSS `radial-gradient` or SVG pattern (dots/grid) at 5% opacity.

---

## Execution Steps

1.  **Global Styles:** Update `globals.css` with the new variable system.
2.  **Game Container:** Strip out old classes in `WordConnectGame.tsx` and apply the new layout.
3.  **Tile Component:** Refactor `GridWordTile.tsx` to use the new "Matte" design.
4.  **UI Cleanup:** Simplify the header and buttons.

