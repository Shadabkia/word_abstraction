# Word Connect Game Module

This module contains the "Word Connect" game engine.

## Structure

-   **components/**: Game-specific UI components (Grid, Tiles, etc.).
-   **data/**: Level data and game-specific types.
-   **utils/**: Game-specific utilities (level loader, shuffler).
-   **WordConnectGame.tsx**: The main entry point for this game engine.

## Integration

This module exports `WordConnectGame` (default export) which can be mounted by the Arcade or Campaign features. It handles its own internal game state.

