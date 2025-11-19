# Variable Group Count Update

## Changes Made ✅

### Level Editor
- **Minimum**: 4 groups per level (was: exactly 4)
- **Maximum**: 20 groups per level (for performance)
- No upper limit on selection - add as many groups as needed
- Visual feedback shows "Need at least 4" when below minimum
- Save button displays remaining count if below minimum

### Default Levels
Regenerated with variable group counts:
1. Level 1: **4 groups** (Easy Start)
2. Level 2: **4 groups** (Fruits & Colors)
3. Level 3: **5 groups** (Animals & Nature)
4. Level 4: **6 groups** (Music & Sports)
5. Level 5: **4 groups** (Iranian Culture)

### UI Updates

**Groups Tab**:
- Counter shows: "(X selected, min: 4, max: 20)"
- Green checkmark when minimum requirement met
- Can disable selection at 20 groups

**Selected Groups Section**:
- Shows total count with warning if below 4
- Displays all selected groups in a grid
- Each group shows icon conversion toggle
- Remove button for each group

**Save Button**:
- Disabled if < 4 or > 20 groups
- Shows "(need X more)" if below minimum
- Updates dynamically as groups are added/removed

### How to Use

1. **Create New Level**:
   - Click "Create New Level"
   - Select at least 4 groups (no maximum up to 20)
   - Toggle icon conversion for individual groups
   - Save when ready

2. **Edit Existing Level**:
   - Click "Edit" on any level
   - Add or remove groups (keep min 4, max 20)
   - Adjust icon conversions
   - Update when done

3. **Best Practices**:
   - 4-6 groups: Easy/Medium difficulty
   - 7-10 groups: Hard difficulty
   - 10+ groups: Expert/Challenge levels
   - Mix icon-enabled and regular groups

### Technical Details

**Files Modified**:
- `src/util/components/LevelsTab.jsx` - Variable group support
- `server/seed_levels.js` - Variable group generation

**Validation**:
- Minimum: 4 groups (required for gameplay)
- Maximum: 20 groups (performance limit)
- Icon conversion: unlimited per level

### Example Workflow

```
Create a challenging level with 8 groups:
1. Select 8 different word groups
2. Enable icon conversion for 3-4 of them
3. Set difficulty to "hard"
4. Set status to "published"
5. Save and play!
```

🎮 **The editor now supports flexible level design with 4-20 groups!**
