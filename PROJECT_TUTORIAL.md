# 🎮 Design Word Merge Game - Project Structure Tutorial

## 📋 Overview

This is a **drag-and-drop word puzzle game** built with React, TypeScript, and Vite. Players rearrange word tiles in a grid, and when all 4 words in a row belong to the same category, they automatically merge into a completed category group.

---

## 🏗️ Project Architecture

```
Design_Word_Merge/
├── src/
│   ├── App.tsx                    # Main game logic & state management
│   ├── main.tsx                   # React app entry point
│   ├── index.css                  # Global styles
│   ├── components/
│   │   ├── GameHeader.tsx         # Level progress & instructions
│   │   ├── GridWordTile.tsx       # Draggable word tiles in grid
│   │   ├── WordTile.tsx           # Reusable word tile component
│   │   ├── CategoryRow.tsx        # Completed category display
│   │   ├── DropZone.tsx           # Drop zone component (not used in current implementation)
│   │   └── ui/                     # shadcn/ui component library
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite build configuration
└── package.json                   # Dependencies & scripts
```

---

## 🎯 Core Game Mechanics

### **Game Flow:**
1. **Initial State**: 24 words are distributed across 6 rows (4 words per row)
2. **Player Action**: Drag and drop tiles to swap positions
3. **Auto-Detection**: System checks if all 4 words in a row share the same category
4. **Auto-Merge**: Matching rows transform into completed category groups
5. **Win Condition**: Complete all 6 categories to finish the level

---

## 📦 Component Breakdown

### **1. App.tsx** - The Game Brain 🧠

**Location**: `src/App.tsx`

**Responsibilities:**
- Manages all game state
- Handles drag-and-drop logic
- Detects category matches
- Renders the game UI

**Key State Variables:**
```typescript
const [gridRows, setGridRows] = useState<GridRow[]>(...)  // Game grid state
const [coins, setCoins] = useState(10)                     // Player currency
const [hints, setHints] = useState(3)                      // Available hints
```

**Data Structures:**

**Word Interface:**
```typescript
interface Word {
  id: string;        // Unique identifier
  text: string;      // Display text (e.g., "ACOUSTIC")
  category: string;  // Category key (e.g., "MUSICAL_TERMS")
}
```

**GridRow Interface:**
```typescript
interface GridRow {
  type: 'words' | 'completed';           // Row state
  words?: Word[];                        // Active word tiles
  completed?: CompletedCategory;         // Merged category data
}
```

**Key Functions:**

#### **`handleSwap()`** - The Swap Logic
```typescript
handleSwap(draggedWord, targetRowIndex, targetColIndex)
```
**What it does:**
1. Finds the source position of the dragged word
2. Swaps the dragged word with the target position word
3. Triggers match checking on both affected rows
4. Updates the grid state

**Flow:**
```
User drags tile → Drop on target → Find source → Swap words → Check matches
```

#### **`checkRowForMatch()`** - The Match Detector
```typescript
checkRowForMatch(rows, rowIndex)
```
**What it does:**
1. Checks if row has exactly 4 words
2. Verifies all words share the same category
3. If match found, transforms row into completed category
4. Uses 500ms delay for smooth animation

**Logic:**
```typescript
const categories = row.words.map(w => w.category);
const allSame = categories.every(cat => cat === categories[0]);
```

**Transformation:**
```
Words Row → [Check Match] → Completed Category Row
```

---

### **2. GridWordTile.tsx** - The Draggable Tile 🎴

**Location**: `src/components/GridWordTile.tsx`

**Purpose**: Individual word tile that can be dragged and dropped within the grid

**Key Features:**
- **Dual Functionality**: Both draggable AND droppable
- **Visual Feedback**: Shows drag state and hover state
- **Touch Support**: Works on mobile devices

**React DnD Hooks:**

**`useDrag()`** - Makes tile draggable:
```typescript
const [{ isDragging }, drag] = useDrag(() => ({
  type: 'word',           // Item type identifier
  item: word,             // Data being dragged
  collect: (monitor) => ({
    isDragging: monitor.isDragging()  // Real-time drag state
  }),
}));
```

**`useDrop()`** - Makes tile a drop target:
```typescript
const [{ isOver }, drop] = useDrop(() => ({
  accept: 'word',         // Accepts 'word' type items
  drop: (item) => onSwap(item, rowIndex, colIndex),  // Callback on drop
  collect: (monitor) => ({
    isOver: monitor.isOver()  // Hover state
  }),
}));
```

**Visual States:**
- **Normal**: Yellow gradient background, full opacity
- **Dragging**: 50% opacity
- **Hover Target**: Blue border, slightly scaled up
- **Active**: Slightly scaled down for tactile feedback

---

### **3. CategoryRow.tsx** - The Completed Category 🏆

**Location**: `src/components/CategoryRow.tsx`

**Purpose**: Displays a successfully matched category group

**When it appears:**
- After `checkRowForMatch()` detects a match
- Replaces the 4-word row with a single category card

**Visual Design:**
- Green gradient background (success color)
- Checkmark icon
- Category name (e.g., "MUSICAL TERMS")
- List of words in the category
- Smooth fade-in animation

**Props:**
```typescript
interface CategoryRowProps {
  name: string;      // Display name (e.g., "MUSICAL TERMS")
  words: string[];  // Array of word texts
}
```

---

### **4. GameHeader.tsx** - The Progress Tracker 📊

**Location**: `src/components/GameHeader.tsx`

**Purpose**: Shows level information and completion progress

**Displays:**
- Current level number
- Game instructions
- Progress bar (completed/total categories)
- Visual progress indicator

**Progress Calculation:**
```typescript
const progress = (completed / total) * 100;
```

**Visual Elements:**
- Animated progress bar
- Book emoji icons
- Blue gradient theme

---

### **5. WordTile.tsx** - Reusable Tile Component 🧩

**Location**: `src/components/WordTile.tsx`

**Purpose**: Base word tile component (used in DropZone, not in main grid)

**Note**: The main game uses `GridWordTile` instead, which combines drag and drop functionality.

---

### **6. DropZone.tsx** - Alternative Drop Area 📥

**Location**: `src/components/DropZone.tsx`

**Purpose**: Alternative drop zone implementation (currently not used in main game)

**Features:**
- Multiple drop slots
- Remove functionality (X button)
- Visual feedback on hover

---

## 🔄 Game State Flow

### **Initialization:**
```
App loads → LEVEL_DATA split into 6 rows → gridRows state initialized
```

### **User Interaction:**
```
1. User drags GridWordTile
   ↓
2. useDrag() tracks drag state
   ↓
3. User drops on another GridWordTile
   ↓
4. useDrop() triggers onSwap callback
   ↓
5. handleSwap() executes swap logic
   ↓
6. checkRowForMatch() validates both rows
   ↓
7. If match found → Row transforms to CategoryRow
```

### **State Updates:**
```
gridRows state change → React re-renders → UI updates
```

---

## 🎨 UI/UX Features

### **Drag and Drop System:**
- **Backend Selection**: Automatically uses `TouchBackend` for mobile, `HTML5Backend` for desktop
- **Visual Feedback**: Opacity changes, border highlights, scale animations
- **Smooth Animations**: CSS transitions for all state changes

### **Responsive Design:**
- Mobile-friendly touch interactions
- Adaptive layouts
- Gradient backgrounds for visual appeal

### **Game Elements:**
- **Top Bar**: Coins, hints, ads button, gift button
- **Game Grid**: 6 rows of word tiles
- **Bottom Actions**: Settings, search hint, lightbulb hint

---

## 🛠️ Technical Stack

### **Core Technologies:**
- **React 18.3.1**: UI framework
- **TypeScript**: Type safety
- **Vite 6.3.5**: Build tool & dev server

### **Key Libraries:**
- **react-dnd**: Drag and drop functionality
  - `react-dnd-html5-backend`: Desktop drag support
  - `react-dnd-touch-backend`: Mobile touch support
- **lucide-react**: Icon library
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling

---

## 📝 Key Functions Reference

### **App.tsx Functions:**

| Function | Purpose | Parameters |
|----------|---------|------------|
| `handleSwap()` | Swaps two word tiles | `draggedWord`, `targetRowIndex`, `targetColIndex` |
| `checkRowForMatch()` | Checks if row matches category | `rows`, `rowIndex` |
| `isTouchDevice()` | Detects touch capability | None |

### **GridWordTile Functions:**

| Hook | Purpose | Returns |
|------|---------|---------|
| `useDrag()` | Makes tile draggable | `{ isDragging }`, `drag` ref |
| `useDrop()` | Makes tile droppable | `{ isOver }`, `drop` ref |

---

## 🎯 Game Categories

The game includes 6 categories:
1. **MUSICAL_TERMS**: ACOUSTIC, BASS, CLASSICAL, ELECTRIC
2. **MEDICAL**: TREATMENT, SCALPEL, MEDICATIONS, PATIENT
3. **ANIMALS**: CAT, RABBIT, HAMSTER, MOUSE
4. **PROFESSIONS**: TEACHER, ACTOR, ASTRONAUT, CALL
5. **COLORS**: WHITE, BLUE, RED, GREEN
6. **COMMUNICATION**: MESSAGE, SCREEN, SELFIES, TEXT

---

## 🚀 How to Play

1. **Observe**: Look at the words in each row
2. **Identify**: Find words that belong to the same category
3. **Drag**: Click and hold a word tile
4. **Drop**: Release on another tile to swap positions
5. **Match**: When 4 words of the same category are in one row, they auto-merge
6. **Complete**: Finish all 6 categories to win!

---

## 🔧 Development Commands

```bash
npm run dev      # Start development server (port 3009)
npm run build    # Build for production
```

---

## 📚 Learning Points

### **React DnD Pattern:**
- Use `DndProvider` to wrap the app
- Use `useDrag` for draggable items
- Use `useDrop` for drop targets
- Combine both for swap functionality

### **State Management:**
- Single source of truth (`gridRows` state)
- Immutable updates (spread operator)
- Delayed state updates for animations

### **Type Safety:**
- TypeScript interfaces for all data structures
- Type-safe props and callbacks
- Compile-time error checking

---

## 🎓 Summary

This project demonstrates:
- ✅ Drag and drop implementation
- ✅ State management in React
- ✅ Conditional rendering
- ✅ Animation and transitions
- ✅ Mobile-responsive design
- ✅ TypeScript best practices
- ✅ Component composition

The game successfully combines interactive drag-and-drop mechanics with automatic pattern recognition, creating an engaging puzzle experience!

