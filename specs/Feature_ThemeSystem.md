# Theme System (Forge UI) — Spec

## Purpose
The Theme System makes the UI feel cohesive, expressive, and easily re-skinnable across the entire app (shell, features, and game modules).

`forge-ui` is the single source of truth for:
- Theme tokens (color, typography, radii, density, animation feel)
- UI primitives (buttons/inputs/toggles)
- UI patterns (dialogs, nav, cards, HUD elements)

## What a “Theme” Means
A theme is a named presentation style that defines:
- **Visual identity**: background, surfaces, text, borders, emphasis colors
- **Interaction feel**: motion intensity/speed, “aliveness”, reduced motion handling
- **Layout feel**: density and radius scaling

Themes may also provide optional palettes (variants) to shift mood without changing the whole theme.

## Global Requirements
- The app runs under a single global Theme Provider.
- Theme choice is **user-configurable at runtime**.
- Theme choice is **persisted** across app launches.
- Theme changes should apply immediately without requiring reload.
- The system must support an explicit **Reduced Motion** option (independent of theme identity).
- Default theme on first launch is **Instagram**.

## Configuration Surface
The app exposes a **floating configuration entry point** that opens a dialog where the player can:
- Pick a theme
- Pick a palette (if the theme supports it)
- Toggle “aliveness” (extra playful motion affordances)
- Adjust theme options (density, radius scale, animation speed, reduced motion)

## Boundaries & Ownership
- `forge-ui` owns UI contracts and styling primitives/patterns.
- Features and games should not invent new UI systems; they should compose from `forge-ui`.
- Legacy UI components may exist temporarily, but must route into `forge-ui` or be migrated.


