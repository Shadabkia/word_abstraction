const fs = require('fs');

function validateLevel(levelNum) {
  const data = JSON.parse(fs.readFileSync(`src/data/levels/level${levelNum}.json`, 'utf8'));
  const tileIds = new Set();
  const duplicates = [];
  
  // Check for duplicate IDs
  data.dictionary.tiles.forEach(tile => {
    if (tileIds.has(tile.id)) {
      duplicates.push(tile.id);
    }
    tileIds.add(tile.id);
  });
  
  // Check that all reveal_ids exist
  const missingIds = [];
  data.mechanics.groups.forEach(group => {
    if (group.outcomes && group.outcomes.reveal_ids) {
      group.outcomes.reveal_ids.forEach(id => {
        if (!tileIds.has(id)) {
          missingIds.push(id);
        }
      });
    }
  });
  
  // Check that all trigger_ids exist
  const missingTriggers = [];
  data.mechanics.groups.forEach(group => {
    group.requirements.trigger_ids.forEach(id => {
      if (!tileIds.has(id)) {
        missingTriggers.push(id);
      }
    });
  });
  
  // Check grid layout
  const gridSize = data.layout.rows * data.layout.cols;
  const gridTileCount = data.layout.initial_grid.flat().length;
  const visibleTiles = data.dictionary.tiles.filter(t => !t.meta || !t.meta.is_hidden_at_start).length;
  
  console.log(`\nLevel ${levelNum} (${data.meta.title}):`);
  console.log(`  Layout: ${data.layout.rows}x${data.layout.cols} = ${gridSize} cells`);
  console.log(`  Grid tiles: ${gridTileCount}`);
  console.log(`  Visible tiles: ${visibleTiles}`);
  console.log(`  Total tiles: ${data.dictionary.tiles.length}`);
  console.log(`  Total groups: ${data.mechanics.groups.length}`);
  console.log(`  Duplicate IDs: ${duplicates.length > 0 ? duplicates.join(', ') : 'None ✓'}`);
  console.log(`  Missing reveal IDs: ${missingIds.length > 0 ? missingIds.join(', ') : 'None ✓'}`);
  console.log(`  Missing trigger IDs: ${missingTriggers.length > 0 ? missingTriggers.join(', ') : 'None ✓'}`);
  
  const valid = duplicates.length === 0 && missingIds.length === 0 && missingTriggers.length === 0 && gridTileCount === visibleTiles;
  if (!valid) {
    console.log('  ❌ VALIDATION FAILED');
  } else {
    console.log('  ✅ Valid');
  }
  
  return valid;
}

console.log('=== Level Data Validation ===');
let allValid = true;
for (let i = 1; i <= 6; i++) {
  try {
    if (!validateLevel(i)) allValid = false;
  } catch (e) {
    console.log(`\nLevel ${i}: ERROR - ${e.message}`);
    allValid = false;
  }
}
console.log(`\n${allValid ? '✅ All levels valid!' : '❌ Some levels have issues'}`);

