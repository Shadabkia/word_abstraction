
const level9 = require('./src/data/levels/chapter2/level9.json');

// Mock icon registry
const getIconMetadata = (id) => ({ id, type: 'library', emoji: 'X', libraryIcon: 'Icon' });

function convertJSONToLevelData(jsonLevel) {
  const words = [];
  const categories = {};
  const hiddenTileIds = new Set();
  
  // Build a map of tile ID to tile for quick lookup
  const tileMap = new Map(jsonLevel.dictionary.tiles.map(tile => [tile.id, tile]));
  
  // First pass: identify hidden tiles and create category map
  jsonLevel.dictionary.tiles.forEach(tile => {
    if (tile.meta?.is_hidden_at_start) {
      hiddenTileIds.add(tile.id);
    }
  });

  // Identify all revealed IDs from mechanics
  const revealedIds = new Set();
  jsonLevel.mechanics.groups.forEach(g => {
    if (g.outcomes?.reveal_ids) {
      g.outcomes.reveal_ids.forEach(id => revealedIds.add(id));
    }
  });
  
  // Second pass: convert tiles to words based on initial_grid
  const initialGrid = jsonLevel.layout.initial_grid;
  const processedTiles = new Set();
  
  // Process grid tiles first (visible tiles)
  initialGrid.forEach(row => {
    row.forEach(tileId => {
      if (!processedTiles.has(tileId)) {
        const tile = tileMap.get(tileId);
        if (tile) {
          // Find which group this tile belongs to
          const group = jsonLevel.mechanics.groups.find(g => 
            g.requirements.trigger_ids.includes(tileId)
          );
          
          if (group) {
            const categoryId = tile.meta?.category || group.id;
            categories[categoryId] = group.display_name;
            
            words.push({
              id: tile.id,
              text: tile.text,
              category: categoryId,
              hidden: false
            });
            processedTiles.add(tileId);
          }
        }
      }
    });
  });
  
  // Process hidden tiles (tiles that will be revealed)
  jsonLevel.dictionary.tiles.forEach(tile => {
    if (!processedTiles.has(tile.id) && (hiddenTileIds.has(tile.id) || revealedIds.has(tile.id))) {
      // Find which group this tile belongs to or will be revealed by
      const revealingGroup = jsonLevel.mechanics.groups.find(g => 
        g.outcomes?.reveal_ids?.includes(tile.id)
      );
      
      const belongsToGroup = jsonLevel.mechanics.groups.find(g =>
        g.requirements.trigger_ids.includes(tile.id)
      );
      
      const group = belongsToGroup || revealingGroup;
      
      if (group) {
        const categoryId = tile.meta?.category || group.id;
        categories[categoryId] = group.display_name;
        
        words.push({
          id: tile.id,
          text: tile.text,
          category: categoryId,
          hidden: true
        });
        processedTiles.add(tile.id);
      }
    }
  });
  
  // Hierarchy / Subcategories
  const transformGroups = jsonLevel.mechanics.groups.filter(g => g.behavior === 'transform');
  let hierarchy = undefined;
  
  if (transformGroups.length > 0) {
    const subcategories = transformGroups
      .map(transformGroup => {
        if (!transformGroup.outcomes?.reveal_ids) return null;
        
        const metaGroupTile = transformGroup.outcomes.reveal_ids
          .map(id => tileMap.get(id))
          .find(tile => tile?.type === 'meta_group');
        
        if (!metaGroupTile) return null;
        
        const parentGroup = jsonLevel.mechanics.groups.find(g =>
          g.requirements.trigger_ids.includes(metaGroupTile.id)
        );
        
        if (!parentGroup) return null;
        
        const wordsToRevealIds = transformGroup.outcomes.reveal_ids.filter(
          id => id !== metaGroupTile.id
        );
        
        const categoryId = transformGroup.requirements.trigger_ids[0] ? 
          tileMap.get(transformGroup.requirements.trigger_ids[0])?.meta?.category || transformGroup.id : 
          transformGroup.id;
        
        return {
          category: categoryId,
          mergesInto: metaGroupTile.meta?.category || parentGroup.id,
          displayAfterMerge: metaGroupTile.text,
          wordsToReveal: wordsToRevealIds
        };
      })
      .filter(Boolean);
      
      if (subcategories.length > 0) {
         hierarchy = { subcategories };
      }
  }
  
  return { words, hierarchy };
}

const result = convertJSONToLevelData(level9);

console.log("Hierarchy Subcategories:");
if (result.hierarchy) {
    result.hierarchy.subcategories.forEach(sub => {
        console.log(`Subcategory: ${sub.category} -> Merges Into: ${sub.mergesInto}`);
        console.log(`Words to reveal: ${sub.wordsToReveal.join(', ')}`);
    });
}

console.log("\nCheck categories of revealed words:");
const targetWords = ['t_gill', 't_scale', 't_fin'];
targetWords.forEach(id => {
    const word = result.words.find(w => w.id === id);
    console.log(`Word ${id}: Category = ${word ? word.category : 'NOT FOUND'}`);
});

const iconFish = result.words.find(w => w.id === 't_icon_fish');
console.log(`\nIcon Fish (original tile): Category = ${iconFish ? iconFish.category : 'NOT FOUND'}`);

