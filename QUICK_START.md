# Quick Start - JSON Level System

## Running the Game

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Creating a New Level

1. **Copy an existing level** as a template:
   ```bash
   cp public/levels/level1.json public/levels/level4.json
   ```

2. **Edit the JSON file** with your level data:
   - Update `meta.id`, `meta.title`, etc.
   - Define tiles in `dictionary.tiles`
   - Create groups in `mechanics.groups`
   - Arrange initial grid in `layout.initial_grid`

3. **Save and play** - The game will automatically detect the new level!

## Example: Creating a Simple Level

```json
{
  "meta": {
    "id": "lvl_004_colors",
    "version": "1.0.0",
    "title": "رنگ‌ها",
    "difficulty": 1,
    "tags": ["colors", "basic"]
  },

  "dictionary": {
    "tiles": [
      {"id": "t_red", "text": "قرمز", "type": "word", "meta": {"category": "warm_colors"}},
      {"id": "t_orange", "text": "نارنجی", "type": "word", "meta": {"category": "warm_colors"}},
      {"id": "t_yellow", "text": "زرد", "type": "word", "meta": {"category": "warm_colors"}},
      {"id": "t_pink", "text": "صورتی", "type": "word", "meta": {"category": "warm_colors"}},
      
      {"id": "t_blue", "text": "آبی", "type": "word", "meta": {"category": "cool_colors"}},
      {"id": "t_green", "text": "سبز", "type": "word", "meta": {"category": "cool_colors"}},
      {"id": "t_purple", "text": "بنفش", "type": "word", "meta": {"category": "cool_colors"}},
      {"id": "t_cyan", "text": "فیروزه‌ای", "type": "word", "meta": {"category": "cool_colors"}}
    ]
  },

  "mechanics": {
    "groups": [
      {
        "id": "grp_warm",
        "display_name": "رنگ‌های گرم",
        "behavior": "standard",
        "requirements": {"trigger_ids": ["t_red", "t_orange", "t_yellow", "t_pink"]}
      },
      {
        "id": "grp_cool",
        "display_name": "رنگ‌های سرد",
        "behavior": "standard",
        "requirements": {"trigger_ids": ["t_blue", "t_green", "t_purple", "t_cyan"]}
      }
    ]
  },

  "layout": {
    "rows": 2,
    "cols": 4,
    "initial_grid": [
      ["t_red", "t_blue", "t_orange", "t_green"],
      ["t_yellow", "t_purple", "t_pink", "t_cyan"]
    ]
  }
}
```

## Level Files Location

- **Development**: `public/levels/levelX.json`
- **Production**: Files are copied to `build/levels/` during build
- **Naming**: Must be `level1.json`, `level2.json`, `level3.json`, etc.

## Key Concepts

### Tiles
- Each game piece
- Has an `id`, `text`, and `type`
- Can be `"word"` or `"meta_group"`

### Groups
- Define matching rules
- `behavior`: `"standard"`, `"transform"`, or `"final"`
- `requirements.trigger_ids`: The 4 tiles that form this group

### Layout
- Defines the starting grid
- Must reference tile IDs from dictionary
- Typically 6 rows × 4 cols = 24 tiles

## Behaviors Explained

### Standard Behavior
- Basic matching: 4 tiles → 1 completed category
- Used for most groups

### Transform Behavior
- Advanced: 4 tiles → merge into 1 meta_group tile
- Reveals hidden tiles
- Used for hierarchical categories (see level3.json)

### Final Behavior
- Top-level category
- Triggers special effects (confetti, sounds)
- Used for the ultimate abstraction

## Tips

1. **Start simple**: Copy level1.json and modify it
2. **Test often**: Reload browser to see changes
3. **Check console**: Errors will show in browser console
4. **Use comments**: Add `"comment"` fields for documentation
5. **Validate IDs**: Make sure tile IDs match in groups and layout

## Troubleshooting

**Level doesn't load?**
- Check JSON syntax (use a JSON validator)
- Verify file is named correctly (`levelX.json`)
- Check browser console for errors

**Tiles don't match?**
- Verify `trigger_ids` reference existing tile IDs
- Check that tile categories match group expectations

**Grid looks wrong?**
- Count tiles: should have rows × cols tiles total
- Verify all tile IDs in layout exist in dictionary

## Next Steps

- Read `LEVELS_README.md` for complete documentation
- Check `MIGRATION_SUMMARY.md` to understand the new system
- Explore existing levels in `public/levels/` for examples

