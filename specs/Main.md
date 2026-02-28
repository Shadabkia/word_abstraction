# Pars Ra Pas — Main Spec

## Overview
Pars Ra Pas is a narrative-driven platform of Persian word games wrapped inside a fictional social app. The user plays as Kian, exploring Iran and unlocking memories through puzzles.

This document serves as the entry point for all specifications.

## Core Vision
- **[Vision & Concept](Vision.md)**: The high-level concept, narrative premise, and emotional goals.

## Architecture
- **[Architecture](Architecture.md)**: Technical stack, directory structure, and module design.
- **[Architectural Principles](Architectural_Principles.md)**: Core design philosophies, data-driven content approach, and debugging strategy.

## Business & Operations
- **[Business Plan](Business_Plan.md)**: Revenue model, monetization strategy, and growth milestones.

## Feature Specifications

### The Five Core Tabs
The app is structured around five main tabs, mimicking a social media app:

1.  **[Dashboard (Home)](Feature_Dashboard.md)**: The main hub. Hero card for campaign progress, quick access to games, and status widgets.
2.  **[Profile (Campaign)](Feature_Profile.md)**: The story campaign. Chapters are highlights, levels are posts.
3.  **[Feed (Lore)](Feature_Feed.md)**: Social feed of NPC posts. Ambient storytelling and daily challenges.
4.  **[Arcade (Games)](Feature_Arcade.md)**: Library of all standalone mini-games.
5.  **[Messages (Quests)](Feature_Messages.md)**: Read-only DMs from NPCs serving as quests and notifications.

## Shared Concepts
- **Content System**: All content (levels, posts, messages) is defined in JSON/DSL to allow rapid iteration without code changes (see Architecture).
- **Game Modules**: Individual game engines (Word Connect, etc.) are pluggable and reusable across Campaign and Arcade modes.

## Development Status
See `Developer_Guide.md` for setup and contribution guidelines.
