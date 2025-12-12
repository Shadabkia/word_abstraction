# Features Directory

This directory contains the feature-based modules for the Pars Ra Pas platform. Each feature represents a major functional area of the application.

## Modules

-   **dashboard**: The main hub of the application (Home tab). Contains the "Hero Card" and quick access.
-   **feed**: The social feed tab (Lore Stream). Displays NPC posts and daily challenges.
-   **arcade**: The game library tab. Lists all available standalone games.
-   **messages**: The messaging tab. Read-only DMs for quests and lore.
-   **profile**: The campaign progression tab. Displays levels as a profile grid.

## Architecture
Each feature should be self-contained with its own screens and components. Shared logic should live in `src/core` or `src/shared`.

