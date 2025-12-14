# Feature: Messages Tab

## Purpose

“NPC DMs: Quests, hints, story beats. Read-only.”

The Messages Tab is a simple, Instagram-style messaging inbox where NPCs send messages to the player. The player cannot write back — the messages function as quests, notifications, and story moments.

- Deliver quests, hints, and story triggers.
- Provide short character moments, humor, and flavor.
- Notify the player when something new is available.
- Act as the “mission log” of the Pars Ra Pas world.

## Overall Layout

```
-----------------------------------
|  Header: Messages               |
-----------------------------------
|  Chat List (NPC conversations) |
-----------------------------------
```

A vertical DM inbox, almost identical to Instagram’s message list.

## Components

### 1. Chat List (Inbox)
Each NPC chat appears as a row.

- **Content**:
    - NPC avatar (round, expressive)
    - NPC name
    - Preview of the latest message (1 line)
    - Timestamp
    - Unread highlight if new
    - Optional: icon indicating quest/hint
- **Sorting**: Unread chats top; others by recency.
- **Unread State**: Bold name, blue dot, slight elevation.

### 2. Chat View (Inside a Conversation)
When tapping a row, player sees a chat history view.

**Structure**:
```
-----------------------------------
| NPC Name + Avatar (Header)      |
-----------------------------------
| Chat Bubbles (vertical scroll)  |
-----------------------------------
|        No input box             |
|   (read-only; cannot reply)     |
-----------------------------------
```

- **Bubbles**: NPC messages left-aligned. If Kian “speaks”, it is a system bubble.
- **No Input Box**: Intentional. Player cannot type. Keeps narrative one-directional.

### 3. Message Types

- **Quest Messages**: Trigger events leading to new levels (e.g., “Come find me on Enghelab Street”). Tapping may reveal a “Play Level” button.
- **Lore Messages**: NPC commentary (Mom worrying, Boss yelling).
- **Hint Messages**: Helpful nudges about game mechanics.
- **System Messages**: “New chapter unlocked”, “Vibes full”. Delivered as DMs to maintain immersion.

## Message Timing & Progression

Messages appear based on:
- Level completion
- Chapter unlock
- NPC introduction
- Smart Recommendations
- Special events

## Design Feel

- Clean, airy, Instagram-style DM layout.
- Persian warmth in color palette.
- Soft bounce on new messages.
- “Typing…” indicator for dramatic effect (NPC-only).
- Subtle sticker animations.

## Final Essence
The Messages Tab is a simple, Instagram-like DM inbox where NPCs send read-only messages. These DMs deliver quests, hints, lore, and story updates as the player progresses. Unread chats highlight at the top, and each conversation opens into a clean, narrative-driven chat view with no reply box.


