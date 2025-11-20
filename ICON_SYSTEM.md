# Icon System Documentation

## Overview

The word abstraction game supports icons for merged word groups. When 4 words in a category are matched, they can merge into a single tile that displays as an icon with a label, making the gameplay more visual and engaging.

## Data Model

### Word Interface

```typescript
interface Word {
  id: string;
  text: string;
  category: string;
  hidden?: boolean;
  meta?: {
    en?: string;
    finglish?: string;
  };
  icon?: {
    id: string;        // Unique identifier for icon mapping
    label?: string;    // Display name next to icon
    emoji?: string;    // Emoji fallback if icon not available
    iconName?: string; // Icon name from icon library
  };
  isMergedGroup?: boolean; // Indicates this is a merged word group
}
```

### SubcategoryInfo Interface

```typescript
interface SubcategoryInfo {
  category: string;
  mergesInto: string;
  displayAfterMerge: string;
  wordsToReveal: string[];
  icon?: {
    id: string;
    label?: string;
    emoji?: string;
    iconName?: string;
  };
}
```

## Display Logic

The tile display follows this priority:

1. **Always show the text** (word.text or icon.label)
2. **Show emoji if available** (when icon.emoji is set and no icon library icon)
3. **Show icon library icon** (when icon.iconName is set and icon exists)
4. **Fallback to text only** (if no icon or emoji)

## Visual Design

### Merged Group Tiles

Merged group tiles have distinct styling to differentiate them from regular word tiles:

- **Background**: Purple gradient (`from-purple-50 to-purple-100`)
- **Border**: Purple border (`border-purple-200`)
- **Shadow**: Purple shadow (`bg-purple-300`)
- **No rotation**: Merged tiles remain flat (rotation = 0)
- **Text color**: Purple text (`text-purple-700`)

### Regular Word Tiles

- **Background**: White
- **Border**: Slate border
- **Shadow**: Slate shadow
- **Slight rotation**: Random rotation for playfulness
- **Text color**: Slate text

## Recommended Icon Libraries

### 1. Lucide React (Already Installed) ⭐ RECOMMENDED

**Status**: Already in use in the project  
**Icons**: 1,000+ icons  
**License**: ISC License (Open Source)  
**Website**: https://lucide.dev/

```bash
# Already installed
npm install lucide-react
```

**Usage Example**:
```tsx
import { Dog, Cat, Flower } from 'lucide-react';

<Dog className="w-5 h-5" />
```

**Pros**:
- Already installed and used in the project
- Excellent quality and consistency
- Tree-shakeable (only import what you use)
- Persian/RTL compatible

---

### 2. Iconoir

**Icons**: 1,600+ icons  
**License**: MIT License (Free)  
**Website**: https://iconoir.com/

```bash
npm install iconoir-react
```

**Usage Example**:
```tsx
import { Dog, Cat } from 'iconoir-react';

<Dog width="20" height="20" />
```

**Pros**:
- Modern, clean design
- Consistent stroke width
- Good coverage of everyday objects

---

### 3. Phosphor Icons

**Icons**: 9,000+ icons (6 weight variants)  
**License**: MIT License (Free)  
**Website**: https://phosphoricons.com/

```bash
npm install phosphor-react
```

**Usage Example**:
```tsx
import { Dog, Cat } from 'phosphor-react';

<Dog size={20} weight="regular" />
```

**Pros**:
- Huge library with excellent coverage
- 6 different weights (thin, light, regular, bold, fill, duotone)
- Very versatile

---

### 4. Tabler Icons

**Icons**: 4,800+ icons  
**License**: MIT License (Free)  
**Website**: https://tabler.io/icons

```bash
npm install @tabler/icons-react
```

**Pros**:
- Comprehensive collection
- Stroke-based design
- Good for UI elements

---

### 5. Hero Icons

**Icons**: 300+ icons  
**License**: MIT License (Free)  
**Website**: https://heroicons.com/

```bash
npm install @heroicons/react
```

**Pros**:
- Created by Tailwind CSS team
- Perfect integration with Tailwind
- Two styles: outline and solid

---

## Implementation Recommendations

### Phase 1: Emoji Only (Current)

Use emojis as icons for immediate visual feedback:

```typescript
{
  icon: {
    id: 'animals_group',
    label: 'حیوانات',
    emoji: '🐾'
  }
}
```

### Phase 2: Icon Library Integration

1. Choose **Lucide React** (already installed) as primary library
2. Add **Phosphor Icons** for broader coverage if needed
3. Create an icon mapping system:

```typescript
// src/utils/iconMapper.ts
import * as LucideIcons from 'lucide-react';

const iconMap: Record<string, React.ComponentType> = {
  'Dog': LucideIcons.Dog,
  'Cat': LucideIcons.Cat,
  'PawPrint': LucideIcons.PawPrint,
  'Flower': LucideIcons.Flower,
  // ... more mappings
};

export function getIcon(iconName: string) {
  return iconMap[iconName];
}
```

### Phase 3: Custom SVG Icons

For Persian-specific or game-specific icons:

1. Store custom SVGs in `/src/assets/icons/`
2. Use as React components
3. Maintain consistent size and stroke width

## Database Schema

The `groups` table already supports icons:

```sql
CREATE TABLE groups (
  -- ... other fields
  icon_enabled BOOLEAN DEFAULT 0,
  icon_label TEXT,
  icon_emoji TEXT
);
```

The `levels` table supports icon conversions:

```sql
CREATE TABLE levels (
  -- ... other fields
  icon_conversions TEXT DEFAULT '{}', -- JSON mapping group_id to boolean
);
```

## Editor Support

The level editor (util tool) already has UI for managing icons:

- Checkbox to enable icon conversion
- Input field for icon label
- Input field for emoji symbol
- Visual preview in the groups table

## Game Mechanics

### After Merging

When a group is completed and converts to an icon:

1. The 4 matched words merge into 1 tile
2. The merged tile shows the icon/emoji + label
3. 3 new words are revealed to fill the row
4. The merged tile can be matched with other tiles

### Validation

The system should validate:

1. New revealed words can form valid groups
2. Icon-enabled groups have appropriate icon metadata
3. No circular dependencies in icon merging

## Future Enhancements

1. **Animated Icons**: Add subtle animations to merged tiles
2. **Icon Themes**: Different icon sets for different themes
3. **User Preferences**: Let users choose icon style
4. **Icon Progression**: Unlock new icons as players progress
5. **Persian-Specific Icons**: Commission custom icons for Persian cultural concepts

## Testing

Test cases to implement:

1. Merge without icon → should show text only
2. Merge with emoji → should show emoji + text
3. Merge with icon → should show icon + text
4. Hover/drag interactions with icon tiles
5. RTL layout with icons

---

**Last Updated**: November 20, 2025  
**Version**: 1.0


