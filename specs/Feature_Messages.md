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
|  Header: "Inbox" (centered)    |
|           + Compose icon        |
-----------------------------------
|  Chat List (Card-based)        |
-----------------------------------
```

A clean, card-based vertical inbox with Instagram-style aesthetics.

## Components

### 1. Header
- **Title**: "Inbox" centered (24px, bold)
- **Compose Icon**: Edit/pencil icon in top-right corner (touch-optimized)
- **Background**: White with subtle bottom border
- **Layout**: Three-column flex (empty, title, icon) for perfect centering

### 2. Chat List (Inbox)
Each NPC chat appears as a white card with rounded corners.

- **Card Design**:
    - White background with rounded corners (16px border-radius)
    - Shadow on card for depth
    - 12px spacing between cards
    - Touch-optimized with scale-down feedback on tap
    
- **Card Content**:
    - **Avatar**: 56px circular with gradient ring (Instagram style)
      - Outer gradient border matching NPC color
      - White separator ring
      - Avatar content inside
    - **Name**: Bold, 17px, black text
    - **Preview**: Two lines showing message content
      - First line: 15px, medium weight, black
      - Second line: 14px, gray text (repeated preview for emphasis)
    - **Unread Badge**: Red circular badge (24px) with white number
      - Positioned on the right side
      - Only shown when unreadCount > 0
      
- **Layout**: Light gray background (#FAFAFA) with padding
- **Sorting**: Unread chats top; others by recency
- **Touch Optimization**: 
  - Minimum 44x44px touch targets
  - Active state with scale and shadow change
  - No timestamp shown (simplified design)

### 3. Chat View (Inside a Conversation)
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

### 4. Message Types

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

- **Card-Based Design**: White cards on light gray background for modern, clean aesthetic
- **Instagram Influence**: Gradient-ringed avatars, centered header, minimalist layout
- **Touch-Optimized**: Generous spacing, large touch targets, responsive feedback
- **Visual Hierarchy**: Bold names, two-line previews, prominent unread badges
- **Color System**: 
  - NPC-specific gradient colors for avatars
  - Red badges for unread (not blue) for stronger contrast
  - Grayscale text hierarchy for readability
- **Animations**: Scale-down on tap, smooth transitions
- **Persian warmth** in NPC gradient color palette

## Final Essence
The Messages Tab is a card-based, Instagram-inspired inbox where NPCs send read-only messages. White cards with gradient-ringed avatars float on a light gray background, creating a clean, modern aesthetic. Each card shows the NPC name and a two-line message preview, with red badges marking unread conversations. The design is fully touch-optimized with generous spacing and responsive feedback. Conversations deliver quests, hints, lore, and story updates, and each opens into a narrative-driven chat view with no reply box.



