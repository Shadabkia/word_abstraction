import { useState, useMemo, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { GameHeader } from './components/GameHeader';
import { GridWordTile } from './components/GridWordTile';
import { CategoryRow } from './components/CategoryRow';
import { Settings, Search, Lightbulb, Gift } from 'lucide-react';
import { Button } from '../../shared/ui/button';
import { DragPreview } from './components/DragPreview';
import { SettingsDialog } from '../../shared/ui/dialogs/SettingsDialog';
import { LevelSelector } from './components/LevelSelector';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { Word, LevelData, LevelJSON } from './data/types';
import { loadLevel, getAvailableLevels, loadAllLevelMetadata } from './utils/levelLoader';
import confetti from 'canvas-confetti';
import { soundManager } from './utils/soundManager';

interface CompletedCategory {
  name: string;
  words: string[];
}

interface GridRow {
  type: 'words' | 'completed';
  words?: Word[];
  completed?: CompletedCategory;
}

const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export default function App() {
  const [level, setLevel] = useState(1);
  const [coins] = useState(10);
  // hints state removed as requested - infinite hints now
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [glowingSubcategoryId, setGlowingSubcategoryId] = useState<string | null>(null);
  // Track hinted words and their color (yellow for lightbulb, green for search)
  const [hintedWords, setHintedWords] = useState<Map<string, string>>(new Map());
  
  // Level data state
  const [currentLevelData, setCurrentLevelData] = useState<LevelData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableLevels, setAvailableLevels] = useState<number[]>([1, 2, 3]); // Default levels
  const [levelMetadata, setLevelMetadata] = useState<LevelJSON[]>([]);
  
  // FIX: Track when game is processing to prevent race conditions
  const [isProcessing, setIsProcessing] = useState(false);

  // Load available levels and metadata on mount
  useEffect(() => {
    Promise.all([
      getAvailableLevels(),
      loadAllLevelMetadata()
    ]).then(([levels, metadata]) => {
      if (levels.length > 0) {
        setAvailableLevels(levels);
      }
      if (metadata.length > 0) {
        setLevelMetadata(metadata);
      }
    }).catch(error => {
      console.error('Failed to load available levels:', error);
    });
  }, []);

  // Load level data on mount and when level changes
  useEffect(() => {
    setIsLoading(true);
    // Reset game state when level changes
    setMergedSubcategoriesCount(0);
    setHintedWords(new Map());
    
    loadLevel(level).then(data => {
      setCurrentLevelData(data);
      setIsLoading(false);
    }).catch(error => {
      console.error('Failed to load level:', error);
      setIsLoading(false);
    });
  }, [level]);
  
  const LEVEL_DATA = currentLevelData?.words || [];
  const CATEGORY_NAMES = currentLevelData?.categories || {};
  const HIERARCHY = currentLevelData?.hierarchy;

  // Separate visible and hidden words
  const visibleWords = useMemo(() => LEVEL_DATA ? LEVEL_DATA.filter((w: Word) => !w.hidden) : [], [LEVEL_DATA]);
  const hiddenWordsPool = useMemo(() => LEVEL_DATA ? LEVEL_DATA.filter((w: Word) => w.hidden) : [], [LEVEL_DATA]);

  // Use words exactly as they appear in the level file (no shuffling)
  const shuffledWords = useMemo(() => {
    if (visibleWords.length === 0) return [];
    return visibleWords;
  }, [visibleWords]);

  const [gridRows, setGridRows] = useState<GridRow[]>([]);
  const [hiddenPool, setHiddenPool] = useState<Word[]>([]);

  // FIX: Initialize grid rows when shuffled words are ready
  useEffect(() => {
    if (shuffledWords.length > 0) {
      // Dynamically create rows based on the actual number of words
      const rowSize = 4; // All levels use 4 columns
      const numRows = Math.ceil(shuffledWords.length / rowSize);
      const newRows: GridRow[] = [];
      
      for (let i = 0; i < numRows; i++) {
        const startIdx = i * rowSize;
        const endIdx = Math.min(startIdx + rowSize, shuffledWords.length);
        const rowWords = shuffledWords.slice(startIdx, endIdx);
        
        // Only add row if it has words
        if (rowWords.length > 0) {
          // Create immutable word objects to prevent reference changes
          const immutableWords = rowWords.map(w => ({ ...w }));
          newRows.push({ type: 'words', words: immutableWords });
        }
      }
      
      setGridRows(newRows);
      setHiddenPool([...hiddenWordsPool]); // Clone to ensure immutability
    }
  }, [shuffledWords, hiddenWordsPool]);

  // Get total steps from level data (default to 6 for backward compatibility)
  const totalSteps = currentLevelData?.totalSteps || 6;
  
  // FIX: Handle empty level data gracefully
  if (!isLoading && (!currentLevelData || !currentLevelData.words || currentLevelData.words.length === 0)) {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-candy-bg bg-pattern-dots overflow-x-hidden font-display selection:bg-candy-secondary selection:text-white flex flex-col">
          <div className="max-w-md mx-auto w-full px-4 pt-6 pb-4 flex-1 flex flex-col">
            
            {/* Simple Header for Navigation */}
            <div className="mb-6">
              <LevelSelector
                currentLevel={level}
                levels={levelMetadata}
                onLevelSelect={setLevel}
                availableLevels={availableLevels}
              />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 glass-panel rounded-3xl shadow-3d">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6 animate-bounceSlight">
                <span className="text-4xl">🚧</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-700 mb-2">
                Level Under Construction
              </h2>
              <p className="text-slate-500 mb-8">
                This level is currently being designed. <br/>Please check back later!
              </p>
              
              <Button 
                onClick={() => setLevel(1)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-8 py-3 shadow-md transition-all btn-3d"
              >
                Go to Level 1
              </Button>
            </div>
          </div>
        </div>
      </LanguageProvider>
    );
  }

  // Track count of merged subcategories (for levels with multiple transform groups)
  const [mergedSubcategoriesCount, setMergedSubcategoriesCount] = useState(0);
  
  // Count completed categories from grid
  const completedCategoriesCount = gridRows.filter(row => row.type === 'completed').length;
  
  // Calculate total completed steps (merged subcategories + completed final groups)
  const completedSteps = mergedSubcategoriesCount + completedCategoriesCount;

  // Track merging row for animation
  const [mergingRow, setMergingRow] = useState<number | null>(null);

  const handleSwap = (draggedWord: Word, targetRowIndex: number, targetColIndex: number) => {
    // FIX: Prevent swaps while processing matches/merges
    if (isProcessing) {
      console.log('Swap blocked: currently processing');
      return;
    }
    
    // Find the dragged word's position
    let sourceRowIndex = -1;
    let sourceColIndex = -1;
    
    for (let i = 0; i < gridRows.length; i++) {
      if (gridRows[i].type === 'words' && gridRows[i].words) {
        const colIndex = gridRows[i].words!.findIndex(w => w.id === draggedWord.id);
        if (colIndex !== -1) {
          sourceRowIndex = i;
          sourceColIndex = colIndex;
          break;
        }
      }
    }
    
    // FIX: Enhanced validation checks
    if (sourceRowIndex === -1) {
      console.warn('handleSwap: source word not found in grid');
      return;
    }
    if (gridRows[targetRowIndex]?.type !== 'words') {
      console.warn('handleSwap: target row is not a word row');
      return;
    }
    if (sourceRowIndex === targetRowIndex && sourceColIndex === targetColIndex) {
      console.log('handleSwap: same position, no swap needed');
      return;
    }
    if (!gridRows[targetRowIndex].words || targetColIndex >= gridRows[targetRowIndex].words!.length) {
      console.warn('handleSwap: invalid target position');
      return;
    }
    
    const targetWord = gridRows[targetRowIndex].words![targetColIndex];
    if (!targetWord) {
      console.warn('handleSwap: target word is null or undefined');
      return;
    }
    
    // FIX: Create new grid with immutable word objects to prevent reference issues
    const newGridRows = gridRows.map((row, rowIdx) => {
      if (row.type !== 'words') return row;
      
      return {
        ...row,
        words: row.words!.map((w, colIdx) => {
          // If this is the source position, place a copy of the target word
          if (rowIdx === sourceRowIndex && colIdx === sourceColIndex) {
            return { ...targetWord };
          }
          // If this is the target position, place a copy of the dragged word
          if (rowIdx === targetRowIndex && colIdx === targetColIndex) {
            return { ...draggedWord };
          }
          // Otherwise keep a copy of the word
          return { ...w };
        })
      };
    });
    
    setGridRows(newGridRows);
    
    // FIX: Check matches immediately to prevent state inconsistency
    // The visual delay should be handled by animations, not setTimeout
    requestAnimationFrame(() => {
      checkRowForMatch(newGridRows, sourceRowIndex);
      if (targetRowIndex !== sourceRowIndex) {
        checkRowForMatch(newGridRows, targetRowIndex);
      }
    });
  };

  const checkRowForMatch = (rows: GridRow[], rowIndex: number) => {
    const row = rows[rowIndex];
    if (row.type !== 'words' || !row.words || row.words.length !== 4) return;
    
    // FIX: Filter out empty/invalid words
    const validWords = row.words.filter(w => w && w.category && w.category !== 'empty');
    if (validWords.length !== 4) return;
    
    const categories = validWords.map(w => w.category);
    const allSame = categories.every(cat => cat === categories[0]);
    
    if (allSame) {
      // FIX: Set processing flag to block other interactions
      setIsProcessing(true);
      
      // Trigger merge animation
      setMergingRow(rowIndex);

      // Wait for animation to complete before processing match
      setTimeout(() => {
        const matchedCategory = categories[0];
        const categoryName = CATEGORY_NAMES[matchedCategory] || matchedCategory;
        const words = validWords.map(w => w.text);
        
        // Check if this is a subcategory that should merge
        // Support both single subcategory (backward compat) and multiple subcategories
        const subcategories = HIERARCHY?.subcategories || (HIERARCHY?.subcategory ? [HIERARCHY.subcategory] : []);
        const matchingSubcategory = subcategories.find(sub => sub.category === matchedCategory);
        
        if (matchingSubcategory) {
          // This is a subcategory - merge into single tile
          handleSubcategoryCompletion(rows, rowIndex, matchingSubcategory);
        } else {
          // Regular category - show as completed row
          soundManager.playSuccess();
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.6 },
            colors: ['#6C5DD3', '#FFA2C0']
          });
          const newGridRows = [...rows];
          newGridRows[rowIndex] = {
            type: 'completed',
            completed: { name: categoryName, words }
          };
          setGridRows(newGridRows);
        }
        
        // Reset merging state after grid update
        setMergingRow(null);
        // FIX: Clear processing flag to allow new interactions
        setIsProcessing(false);
      }, 1000);
    }
  };

  const handleSubcategoryCompletion = (
    rows: GridRow[],
    rowIndex: number,
    subcategoryInfo: { 
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
  ) => {
    // FIX: Use category and timestamp for stable IDs
    const timestamp = Date.now();
    const subcategoryWord: Word = {
      id: `merged_${subcategoryInfo.category}_${timestamp}`,
      text: subcategoryInfo.displayAfterMerge,
      category: subcategoryInfo.mergesInto,
      isMergedGroup: true,
      icon: subcategoryInfo.icon
    };
    
    // Trigger glow animation for this subcategory tile
    setGlowingSubcategoryId(subcategoryWord.id);
    
    soundManager.playMerge();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setGlowingSubcategoryId(null);
    }, 1200); // Match animation duration

    // Get the specific 3 words that should be revealed
    const wordsToAdd: Word[] = [];
    const newHiddenPool = [...hiddenPool];
    
    // Find and add the specific words that match wordsToReveal (by ID)
    for (const wordId of subcategoryInfo.wordsToReveal) {
      let word = newHiddenPool.find(w => w.id === wordId);
      let fromPool = true;

      if (!word) {
        console.warn(`Word ${wordId} not found in hidden pool! Falling back to level data.`);
        // Fallback: try to find in global level data
        word = LEVEL_DATA.find((w: Word) => w.id === wordId);
        fromPool = false;
      }

      if (word) {
        // Create a clean copy of the word
        // Ensure hidden is false so it shows up
        wordsToAdd.push({ ...word, hidden: false });
        
        if (fromPool) {
          const wordIndex = newHiddenPool.findIndex(w => w.id === wordId);
          if (wordIndex !== -1) {
            newHiddenPool.splice(wordIndex, 1);
          }
        }
      }
    }

    // FIX: Ensure the subcategory tile has the same category as the revealed words
    // This fixes potential mismatches where the hierarchy info and hidden word categories differ
    if (wordsToAdd.length > 0) {
      const consensusCategory = wordsToAdd[0].category;
      const allSame = wordsToAdd.every(w => w.category === consensusCategory);
      
      if (allSame && consensusCategory !== subcategoryWord.category) {
        console.warn(`Category mismatch detected! Subcategory tile: ${subcategoryWord.category}, Revealed words: ${consensusCategory}. Syncing to revealed words.`);
        subcategoryWord.category = consensusCategory;
      }
    }

    // Create new row: 1 subcategory tile + 3 revealed words
    const newRow: Word[] = [subcategoryWord, ...wordsToAdd];
    
    // Pad with empty slots if needed (shouldn't happen with proper level design)
    while (newRow.length < 4) {
      newRow.push({
        id: `empty_${Date.now()}_${newRow.length}`,
        text: '...',
        category: 'empty'
      });
    }

    // Update grid
    const newGridRows = [...rows];
    newGridRows[rowIndex] = { type: 'words', words: newRow };
    setGridRows(newGridRows);
    setHiddenPool(newHiddenPool);
    
    // Increment merged subcategories count (each merge counts as 1 step)
    setMergedSubcategoriesCount(prev => prev + 1);
  };

  const handleHint = () => {
    // Build category map directly from visible grid words
    const categoryToWords = new Map<string, string[]>();
    
    gridRows.forEach(row => {
      if (row.type === 'words' && row.words) {
        row.words.forEach(word => {
          // Skip empty placeholders
          if (word.category === 'empty') return;

          if (!categoryToWords.has(word.category)) {
            categoryToWords.set(word.category, []);
          }
          categoryToWords.get(word.category)!.push(word.id);
        });
      }
    });

    // Find a category with at least 2 words visible
    let hintWords: string[] = [];
    for (const [, wordIds] of categoryToWords.entries()) {
      if (wordIds.length >= 2) {
        // Shuffle and pick 2 random words from this category
        const shuffled = [...wordIds].sort(() => Math.random() - 0.5);
        hintWords = shuffled.slice(0, 2);
        break;
      }
    }

    if (hintWords.length === 2) {
      // Show hint animation (yellow)
      const newHints = new Map(hintedWords);
      hintWords.forEach(id => newHints.set(id, 'yellow'));
      setHintedWords(newHints);
      soundManager.playMerge();
    } else {
      // No valid hint available
      soundManager.playError();
    }
  };

  const handleSearchHint = () => {
    // Build category map directly from visible grid words
    const categoryToWords = new Map<string, string[]>();
    
    gridRows.forEach(row => {
      if (row.type === 'words' && row.words) {
        row.words.forEach(word => {
          // Skip empty placeholders
          if (word.category === 'empty') return;
          
          if (!categoryToWords.has(word.category)) {
            categoryToWords.set(word.category, []);
          }
          categoryToWords.get(word.category)!.push(word.id);
        });
      }
    });

    // Find ALL categories with 4 words and assign different colors
    const colors = ['green', 'blue', 'purple', 'orange', 'pink', 'cyan', 'red'];
    let colorIndex = 0;
    const newHints = new Map(hintedWords);
    let foundAny = false;

    for (const [, wordIds] of categoryToWords.entries()) {
      if (wordIds.length === 4) {
        const color = colors[colorIndex % colors.length];
        wordIds.forEach(id => newHints.set(id, color));
        colorIndex++;
        foundAny = true;
      }
    }

    if (foundAny) {
       // Show search hint animation (colors)
       setHintedWords(newHints);
       soundManager.playMerge();
    } else {
       soundManager.playError();
    }
  };

  // Auto-clear hints after 3 seconds
  useEffect(() => {
    if (hintedWords.size > 0) {
      const timer = setTimeout(() => {
        setHintedWords(new Map());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hintedWords]);

  return (
    <LanguageProvider>
      <DndProvider
        backend={isTouchDevice() ? TouchBackend : HTML5Backend}
        options={isTouchDevice() ? { enableTouchEvents: true, enableMouseEvents: true, delay: 0 } : undefined}
      >
        <div className="min-h-screen bg-candy-bg bg-pattern-dots overflow-x-hidden font-display selection:bg-candy-secondary selection:text-white">
          <DragPreview />
          
          <div className="max-w-md mx-auto relative min-h-screen pb-28 sm:pb-32">
            {/* Floating Top Bar */}
            <div className="px-3 sm:px-4 pt-4 sm:pt-6 pb-2 sticky top-0 z-10 pointer-events-none">
              <div className="glass-panel rounded-full p-1.5 sm:p-2 flex items-center justify-between pointer-events-auto shadow-3d-sm">
                <div className="flex items-center gap-1.5 sm:gap-2 pl-0.5 sm:pl-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-inner border-2 border-yellow-300 text-lg sm:text-xl animate-[bounceSlight_3s_infinite]">
                    ⭐
                  </div>
                  <div className="bg-slate-100 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 shadow-inner font-bold text-slate-700 text-sm sm:text-base">
                    {coins}
                  </div>
                  <button className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors font-bold text-base sm:text-lg btn-3d-sm">
                    +
                  </button>
                </div>
                
                <div className="flex items-center gap-1.5 sm:gap-2 pr-0.5 sm:pr-1">
                  <div className="relative group cursor-pointer">
                     <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-md btn-3d-sm transform rotate-3 group-hover:rotate-6 transition-transform">
                      <span className="text-white font-bold text-[10px] sm:text-xs">ADS</span>
                    </div>
                    <div className="absolute -top-1 -right-0.5 sm:-top-2 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold border-2 border-white shadow-sm animate-pulse">
                      2
                    </div>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-md btn-3d-sm transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                    <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Level Selector */}
            <div className="px-3 sm:px-4 mb-2">
              <LevelSelector
                currentLevel={level}
                levels={levelMetadata}
                onLevelSelect={setLevel}
                availableLevels={availableLevels}
              />
            </div>

            {/* Game Header (Level & Progress) */}
            <div className="px-3 sm:px-4 mt-2 mb-3 sm:mb-4">
              <GameHeader completed={completedSteps} total={totalSteps} />
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="px-3 sm:px-4 py-8 text-center">
                <div className="text-white text-lg">Loading level...</div>
              </div>
            )}

            {/* Game Grid */}
            {!isLoading && (
            <div className="px-3 sm:px-4 space-y-2 sm:space-y-3">
              {gridRows.map((row, rowIndex) => (
                <div key={rowIndex} className="animate-pop-in" style={{ animationDelay: `${rowIndex * 0.1}s` }}>
                  {row.type === 'completed' && row.completed ? (
                    <CategoryRow name={row.completed.name} words={row.completed.words} />
                  ) : (
                    <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                      {row.words?.map((word, colIndex) => (
                        <GridWordTile
                          key={word.id}
                          word={word}
                          rowIndex={rowIndex}
                          colIndex={colIndex}
                          onSwap={handleSwap}
                          isSubcategoryGlow={word.id === glowingSubcategoryId}
                          isMerging={mergingRow === rowIndex}
                          hintColor={hintedWords.get(word.id)}
                          isDisabled={isProcessing}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            )}
          </div>

          {/* Bottom Floating Dock */}
          <div className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-20 px-3 sm:px-4 pointer-events-none">
            <div className="max-w-md mx-auto flex items-center justify-center gap-2 sm:gap-4 pointer-events-auto">
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-white hover:bg-slate-50 rounded-2xl shadow-3d border-2 border-slate-100 text-slate-600 btn-3d"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSettingsDialog(true);
                }}
              >
                <Settings className="w-6 h-6 sm:w-7 sm:h-7" />
              </Button>
              
              <Button 
                onClick={handleSearchHint}
                className="w-24 h-14 sm:w-28 sm:h-16 bg-candy-green hover:bg-green-500 rounded-2xl shadow-3d border-b-4 border-green-700 active:border-b-0 btn-3d relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Search className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-md" />
              </Button>
              
              <Button 
                onClick={handleHint}
                className="w-24 h-14 sm:w-28 sm:h-16 bg-candy-yellow hover:bg-yellow-400 rounded-2xl shadow-3d border-b-4 border-yellow-600 active:border-b-0 btn-3d relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-md" />
              </Button>
            </div>
          </div>
        </div>
      </DndProvider>

      {/* Settings dialog */}
      <SettingsDialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog} />
    </LanguageProvider>
  );
}
