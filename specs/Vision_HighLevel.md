# Pars Ra Pas — High Level Vision

**"A pocket arcade inside a storybook."**

Pars Ra Pas is a narrative-driven platform where the player follows **Kian**, a character traveling across Iran in his van, "The Onion". The entire game experience is presented as a **fictional social media app** on Kian's phone.

## Core Experience
The player explores Kian's journey through 5 main tabs:

1.  **Feed (The Lore Stream):** An Instagram-style feed of NPC posts, daily challenges, and comments that flesh out the world.
2.  **Arcade (The Game Library):** A collection of standalone word and puzzle games (Word Connect, Word Search, etc.) available for quick play.
3.  **Dashboard (The Hub):** The central home screen showing current location, "Hero Card" for the next story level, and quick access shortcuts.
4.  **Messages (Quests & Lore):** Read-only DMs from NPCs that serve as quests, hints, and story notifications.
5.  **Profile (Campaign Mode):** The main progression system. Levels are "posts" in Kian's profile grid; Chapters are "Story Highlights".

## Architecture Philosophy
-   **Content-Driven:** All content (levels, posts, messages) is defined in JSON/DSL, making it easy to expand without code changes.
-   **Modular:** Each game type is a standalone module with a standard interface, pluggable into both Campaign and Arcade modes.
-   **State-First:** A central `GameState` tracks all progression, ensuring a cohesive experience across all tabs.

