# Word Connect - Visual Redesign Specification

## 1. Core Visual Identity
**Philosophy:** Calm, intelligent, clear. "Designed, not decorated."

### Color Palette (Climate System)
We will introduce a CSS variable system for "Climates".
Default Climate (Calm/Neutral):
- `--bg-primary`: `#F2F4F6` (Soft Blue-Grey)
- `--bg-secondary`: `#E8EAED` (Slightly darker for patterns)
- `--tile-bg`: `#FFFFFF`
- `--text-primary`: `#2D3436`
- `--text-secondary`: `#636E72`
- `--accent-subtle`: `#DFE6E9`
- `--shadow-soft`: `0 2px 8px rgba(0, 0, 0, 0.04)`
- `--shadow-elevation`: `0 4px 12px rgba(0, 0, 0, 0.08)`

### Typography
- Primary: 'Poppins', sans-serif.
- Weights: 400 (Regular) for body, 500/600 (Medium/SemiBold) for headers.
- Size: Readable, generous spacing.

## 2. Component Design

### The Grid & Tiles (`GridWordTile`)
- **Shape:** Rounded squares (`rounded-2xl`).
- **Surface:** Matte finish, not glossy.
- **Elevation:** Subtle shadow (`box-shadow`), no 3D bevels/borders.
- **Interaction:**
    - Drag: Scale up slightly (`1.05`), increased shadow.
    - Drop/Place: Soft spring animation.
    - Selection/Hint: Soft colored border or background tint (Pastel Yellow/Green), not bright neon.

### Background
- **Atmosphere:** CSS radial gradients or SVG patterns.
- **Pattern:** Subtle dots or geometric shapes with low opacity (5-10%).
- **Animation:** Very slow, subtle pulse or drift (optional, if performance allows).

### UI Overlay (HUD)
- **Top Bar:**
    - Minimalist coin counter (Text + Icon, flat).
    - Level Indicator: Plain text or subtle capsule.
    - Remove "ADS" / "Gift" loud buttons, replace with minimal icons if functionality must remain.
- **Bottom Bar:**
    - Buttons: Circular or pill-shaped, flat or very soft neumorphic depth.
    - Icons: Thin stroke (Lucide), dark grey.

## 3. Implementation Plan

1.  **Clean up `globals.css`**: Remove "candy" themes. Add "Climate" variables.
2.  **Refactor `WordConnectGame.tsx`**:
    - Remove `bg-candy-bg`, `btn-3d`.
    - Centered layout using Flex/Grid.
    - Implement "Climate" background wrapper.
3.  **Refactor `GridWordTile.tsx`**:
    - New visual style.
    - Smooth `framer-motion` transitions.
4.  **Refactor `GameHeader.tsx`**:
    - Minimalist progress.
5.  **Refactor `LevelSelector.tsx`**:
    - Clean list/grid of levels.

## 4. CSS Variables Structure
```css
:root {
  --climate-bg: #F0F2F5;
  --climate-pattern: #E4E7EB;
  --tile-surface: #FFFFFF;
  --tile-text: #2D3436;
  --ui-surface: rgba(255, 255, 255, 0.8);
  --ui-border: rgba(0, 0, 0, 0.05);
}
```
