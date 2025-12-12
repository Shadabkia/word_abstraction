# Core Directory

This directory contains the core business logic and domain entities of the platform.

## Structure

-   **domain/**: Pure TypeScript interfaces and classes defining the domain model (User, GameState, Level, Post, Message).
-   **state/**: Global state management (e.g., Zustand/Redux stores) that drives the application.

## Rules
-   Code here should be UI-agnostic.
-   No React components (hooks are okay in `state` if using a React-based state manager).

