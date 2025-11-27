import { LevelJSON, ChapterMeta } from '../types';

// Interface for the structure we will export
export interface BundledChapter {
  meta: ChapterMeta;
  levels: Record<string, LevelJSON>;
}

// Define the Glob type for TypeScript
type GlobImport = Record<string, { default: any } | any>;

// 1. Import all JSON files in this directory and subdirectories eagerly
// This tells Vite/Webpack to bundle them all.
const allFiles = import.meta.glob('./**/*.json', { eager: true }) as GlobImport;

// 2. Process the files into the structured format
const processGameData = () => {
  const chapters: Record<string, BundledChapter> = {};

  // Helper to safely get module content
  const getContent = (path: string) => {
    const mod = allFiles[path];
    // Handle both ES module default export and direct JSON content
    return (mod && mod.default) ? mod.default : mod;
  };

  Object.keys(allFiles).forEach(path => {
    try {
      // Parse path: ./chapterX/filename.json
      // We expect structure: ./chapter{id}/meta.json OR ./chapter{id}/level{n}.json
      const parts = path.split('/');
      if (parts.length < 3) return; // Skip files in root like index.ts (though glob filters for .json)

      const chapterDir = parts[1]; // e.g. "chapter1"
      const filename = parts[2];   // e.g. "level1.json" or "meta.json"

      // Ensure chapter entry exists
      if (!chapters[chapterDir]) {
        chapters[chapterDir] = {
          meta: { id: chapterDir, name: `Chapter ${chapterDir.replace('chapter', '')}`, levels: [] },
          levels: {}
        };
      }

      const content = getContent(path);

      if (filename === 'meta.json') {
        // It's the chapter metadata
        chapters[chapterDir].meta = content as ChapterMeta;
      } else if (filename.startsWith('level') && filename.endsWith('.json')) {
        // It's a level file
        chapters[chapterDir].levels[filename] = content as LevelJSON;
      }
    } catch (e) {
      console.warn(`[GameData] Failed to process file ${path}:`, e);
    }
  });

  return chapters;
};

// 3. Export the processed data
export const allGameData: Record<string, BundledChapter> = processGameData();
