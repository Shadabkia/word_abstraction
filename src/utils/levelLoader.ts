import { LevelJSON, LevelData, Word, ChapterMeta, SubcategoryInfo } from '../data/types';
import { getIconMetadata } from './iconMapper';
import { allGameData } from '../data/levels';

console.log('[LevelLoader] Module loaded with bundled data');

// Helper to get level data from bundled source
function getLevelFromBundle(levelNumber: number): { json: LevelJSON, chapter: ChapterMeta } | null {
  // Iterate through chapters to find the level
  for (const chapterKey in allGameData) {
    const chapterData = allGameData[chapterKey];
    const levelFiles = chapterData.meta.levels;
    
    for (const filename of levelFiles) {
      const match = filename.match(/level(\d+)\.json/);
      if (match && parseInt(match[1]) === levelNumber) {
        const levelJson = chapterData.levels[filename];
        if (levelJson) {
          const jsonCopy = JSON.parse(JSON.stringify(levelJson));
          // Inject the global level number derived from filename
          jsonCopy.meta.levelNumber = levelNumber;
          
          return {
            json: jsonCopy, // Deep copy to avoid mutation issues
            chapter: chapterData.meta
          };
        }
      }
    }
  }
  return null;
}

/**
 * Loads all levels from bundled data
 */
export async function loadAllLevels(): Promise<LevelData[]> {
  const levels: LevelData[] = [];
  const availableLevels = await getAvailableLevels();

  for (const levelNum of availableLevels) {
    const levelData = await loadLevel(levelNum);
    if (levelData) {
      levels.push(levelData);
    }
  }
  
  return levels;
}

/**
 * Loads a single level by number from bundled data
 */
export async function loadLevel(levelNumber: number): Promise<LevelData | null> {
  try {
    const data = getLevelFromBundle(levelNumber);
    
    if (!data) {
      console.error(`Level ${levelNumber} not found in bundle`);
      return null;
    }

    const { json, chapter } = data;

    // Inject chapter info
    json.meta.chapter = {
        id: chapter.id,
        name: chapter.name
    };

    const levelData = convertJSONToLevelData(json);
    // Ensure chapter info is also in LevelData
    levelData.chapter = {
        id: chapter.id,
        name: chapter.name
    };
    return levelData;
  } catch (error) {
    console.error(`Error loading level ${levelNumber}:`, error);
    return null;
  }
}

/**
 * Converts the new JSON format to the legacy LevelData format
 * for backward compatibility with existing game logic
 */
function convertJSONToLevelData(jsonLevel: LevelJSON): LevelData {
  const words: Word[] = [];
  const categories: Record<string, string> = {};
  const hiddenTileIds = new Set<string>();
  
  // Build a map of tile ID to tile for quick lookup
  const tileMap = new Map(jsonLevel.dictionary.tiles.map(tile => [tile.id, tile]));
  
  // First pass: identify hidden tiles and create category map
  jsonLevel.dictionary.tiles.forEach(tile => {
    if (tile.meta?.is_hidden_at_start) {
      hiddenTileIds.add(tile.id);
    }
  });

  // Identify all revealed IDs from mechanics
  const revealedIds = new Set<string>();
  jsonLevel.mechanics.groups.forEach(g => {
    if (g.outcomes?.reveal_ids) {
      g.outcomes.reveal_ids.forEach(id => revealedIds.add(id));
    }
  });
  
  // Create groups map for category lookup
  
  // Second pass: convert tiles to words based on initial_grid
  const initialGrid = jsonLevel.layout.initial_grid;
  const processedTiles = new Set<string>();
  
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
            
            // Build icon data from registry if icon is enabled
            let iconData = undefined;
            if (tile.visuals?.icon_enabled && tile.visuals.icon_id) {
              const iconMeta = getIconMetadata(tile.visuals.icon_id);
              if (iconMeta) {
                iconData = {
                  id: iconMeta.id,
                  type: iconMeta.type,
                  label: tile.text, // Use tile text as label
                  emoji: iconMeta.emoji,
                  iconName: iconMeta.libraryIcon
                };
              } else {
                // Icon ID not found in registry - will fallback to "*" in UI
                console.warn(`Icon ID "${tile.visuals.icon_id}" not found in registry for tile ${tile.id}`);
              }
            }
            
            words.push({
              id: tile.id,
              text: tile.text,
              category: categoryId,
              hidden: false,
              meta: {
                en: tile.meta?.en,
                finglish: tile.meta?.finglish
              },
              ...(iconData && { icon: iconData }),
              isMergedGroup: tile.type === 'meta_group'
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
        
        // Build icon data from registry if icon is enabled
        let iconData = undefined;
        if (tile.visuals?.icon_enabled && tile.visuals.icon_id) {
          const iconMeta = getIconMetadata(tile.visuals.icon_id);
          if (iconMeta) {
            iconData = {
              id: iconMeta.id,
              type: iconMeta.type,
              label: tile.text, // Use tile text as label
              emoji: iconMeta.emoji,
              iconName: iconMeta.libraryIcon
            };
          } else {
            // Icon ID not found in registry - will fallback to "*" in UI
            console.warn(`Icon ID "${tile.visuals.icon_id}" not found in registry for tile ${tile.id}`);
          }
        }
        
        words.push({
          id: tile.id,
          text: tile.text,
          category: categoryId,
          hidden: true,
          meta: {
            en: tile.meta?.en,
            finglish: tile.meta?.finglish
          },
          ...(iconData && { icon: iconData }),
          isMergedGroup: tile.type === 'meta_group'
        });
        processedTiles.add(tile.id);
      }
    }
  });
  
  // FIX: Handle hierarchical/transformation mechanics with better error checking
  const transformGroups = jsonLevel.mechanics.groups.filter(g => g.behavior === 'transform');
  let hierarchy = undefined;
  
  if (transformGroups.length > 0) {
    const subcategories = transformGroups
      .map(transformGroup => {
        if (!transformGroup.outcomes?.reveal_ids || transformGroup.outcomes.reveal_ids.length === 0) {
          console.warn(`Transform group ${transformGroup.id} has no reveal_ids`);
          return null;
        }
        
        // Find the meta_group tile that represents the merged category
        const metaGroupTile = transformGroup.outcomes.reveal_ids
          .map(id => tileMap.get(id))
          .find(tile => tile?.type === 'meta_group');
        
        if (!metaGroupTile) {
          console.warn(`No meta_group found in reveal_ids for ${transformGroup.id}`);
          return null;
        }
        
        // Find the parent group that the meta_group belongs to
        const parentGroup = jsonLevel.mechanics.groups.find(g =>
          g.requirements.trigger_ids.includes(metaGroupTile.id)
        );
        
        if (!parentGroup) {
          console.warn(`No parent group found for meta_group ${metaGroupTile.id}`);
          return null;
        }
        
        // Get the other reveal_ids as words to reveal
        const wordsToRevealIds = transformGroup.outcomes.reveal_ids.filter(
          id => id !== metaGroupTile.id
        );
        
        // Verify all words to reveal exist
        const missingWords = wordsToRevealIds.filter(id => !tileMap.has(id));
        if (missingWords.length > 0) {
          console.warn(`Missing tiles in reveal_ids: ${missingWords.join(', ')}`);
        }
        
        // Use the first tile's category or fallback to group id
        const categoryId = transformGroup.requirements.trigger_ids[0] ? 
          tileMap.get(transformGroup.requirements.trigger_ids[0])?.meta?.category || transformGroup.id : 
          transformGroup.id;
        
        // Build icon data from registry if icon is enabled
        let subcategoryIcon = undefined;
        if (metaGroupTile.visuals?.icon_enabled && metaGroupTile.visuals.icon_id) {
          const iconMeta = getIconMetadata(metaGroupTile.visuals.icon_id);
          if (iconMeta) {
            subcategoryIcon = {
              id: iconMeta.id,
              type: iconMeta.type,
              label: metaGroupTile.text,
              emoji: iconMeta.emoji,
              iconName: iconMeta.libraryIcon
            };
          } else {
            console.warn(`Icon ID "${metaGroupTile.visuals.icon_id}" not found in registry for meta_group ${metaGroupTile.id}`);
          }
        }
        
        return {
          category: categoryId,
          mergesInto: metaGroupTile.meta?.category || parentGroup.id,
          displayAfterMerge: metaGroupTile.text,
          wordsToReveal: wordsToRevealIds,
          icon: subcategoryIcon
        };
      })
      .filter(Boolean) as SubcategoryInfo[];
    
    if (subcategories.length > 0) {
      hierarchy = {
        // Keep backward compatibility: if there's only one, use the old format
        ...(subcategories.length === 1 ? { subcategory: subcategories[0] } : {}),
        // New format: always include subcategories array
        subcategories: subcategories
      };
    }
  }
  
    return {
    levelNumber: jsonLevel.meta.levelNumber || parseInt(jsonLevel.meta.id.match(/\d+/)?.[0] || '1'),
    words,
    categories,
    totalSteps: jsonLevel.mechanics.groups.length,
    ...(hierarchy && { hierarchy })
  };
}

/**
 * Gets available level numbers
 */
export async function getAvailableLevels(): Promise<number[]> {
  const levels: number[] = [];
  
  for (const chapterKey in allGameData) {
    const levelFiles = allGameData[chapterKey].meta.levels;
    for (const filename of levelFiles) {
      const match = filename.match(/level(\d+)\.json/);
      if (match) {
        levels.push(parseInt(match[1]));
      }
    }
  }
  
  return levels.sort((a, b) => a - b);
}

/**
 * Loads just the metadata for a level (for level selector)
 */
export async function loadLevelMetadata(levelNumber: number): Promise<LevelJSON | null> {
  const data = getLevelFromBundle(levelNumber);
  if (!data) return null;
  
  const { json, chapter } = data;
  json.meta.chapter = {
      id: chapter.id,
      name: chapter.name
  };
  return json;
}

/**
 * Loads metadata for all available levels
 */
export async function loadAllLevelMetadata(): Promise<LevelJSON[]> {
  const metadata: LevelJSON[] = [];
  const availableLevels = await getAvailableLevels();

  for (const levelNum of availableLevels) {
     const meta = await loadLevelMetadata(levelNum);
     if (meta) metadata.push(meta);
  }
  
  return metadata;
}
