import { useState, useMemo, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { GameHeader } from './components/GameHeader';
import { GridWordTile } from './components/GridWordTile';
import { CategoryRow } from './components/CategoryRow';
import { Settings, Search, Lightbulb, Sparkles, Gift, Database } from 'lucide-react';
import { Button } from './components/ui/button';
import { DragPreview } from './components/DragPreview';
import { SettingsDialog } from './components/ui/dialogs/SettingsDialog';
import { LanguageProvider } from './contexts/LanguageContext';
import { Word } from './data/types';
import { getLevelData } from './data/levels';
import { shuffleWordsWithConstraint } from './utils/shuffleWords';
import { loadLevelFromDB, loadPublishedLevels, isDatabaseAvailable } from './utils/levelLoader';
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
  const [level] = useState(3);
  const [coins] = useState(10);
  const [hints] = useState(3);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [glowingSubcategoryId, setGlowingSubcategoryId] = useState<string | null>(null);
  
  // Database level support
  const [dbAvailable, setDbAvailable] = useState(false);
  const [useDatabase, setUseDatabase] = useState(false);
  const [dbLevels, setDbLevels] = useState<any[]>([]);
  const [selectedDbLevel, setSelectedDbLevel] = useState<number | null>(null);
  const [dbLevelData, setDbLevelData] = useState<any | null>(null);
  const [showLevelSelector, setShowLevelSelector] = useState(false);

  // Check database availability on mount
  useEffect(() => {
    isDatabaseAvailable().then(available => {
      setDbAvailable(available);
      if (available) {
        loadPublishedLevels().then(levels => setDbLevels(levels));
      }
    });
  }, []);

  // Load selected database level
  useEffect(() => {
    if (useDatabase && selectedDbLevel) {
      loadLevelFromDB(selectedDbLevel).then(data => {
        setDbLevelData(data);
      });
    }
  }, [useDatabase, selectedDbLevel]);

  // Get current level data (from DB or hardcoded)
  const currentLevelData = useMemo(() => {
    if (useDatabase && dbLevelData) {
      return dbLevelData;
    }
    return getLevelData(level);
  }, [useDatabase, dbLevelData, level]);
  
  const LEVEL_DATA = currentLevelData?.words || [];
  const CATEGORY_NAMES = currentLevelData?.categories || {};
  const HIERARCHY = currentLevelData?.hierarchy;

  // Separate visible and hidden words
  const visibleWords = useMemo(() => LEVEL_DATA.filter(w => !w.hidden), [LEVEL_DATA]);
  const hiddenWordsPool = useMemo(() => LEVEL_DATA.filter(w => w.hidden), [LEVEL_DATA]);

  // Shuffle words ensuring no row has a complete category
  const shuffledWords = useMemo(() => {
    if (visibleWords.length === 0) return [];
    return shuffleWordsWithConstraint(visibleWords);
  }, [visibleWords]);

  const [gridRows, setGridRows] = useState<GridRow[]>([]);
  const [hiddenPool, setHiddenPool] = useState<Word[]>([]);

  // Initialize grid rows when shuffled words are ready
  useEffect(() => {
    if (shuffledWords.length > 0) {
      setGridRows([
        { type: 'words', words: shuffledWords.slice(0, 4) },
        { type: 'words', words: shuffledWords.slice(4, 8) },
        { type: 'words', words: shuffledWords.slice(8, 12) },
        { type: 'words', words: shuffledWords.slice(12, 16) },
        { type: 'words', words: shuffledWords.slice(16, 20) },
        { type: 'words', words: shuffledWords.slice(20, 24) },
      ]);
      setHiddenPool(hiddenWordsPool);
    }
  }, [shuffledWords, hiddenWordsPool]);

  // Get total steps from level data (default to 6 for backward compatibility)
  const totalSteps = currentLevelData?.totalSteps || 6;
  
  // Track if subcategory has been merged
  const [subcategoryMerged, setSubcategoryMerged] = useState(false);
  
  // Count completed categories from grid
  const completedCategoriesCount = gridRows.filter(row => row.type === 'completed').length;
  
  // Calculate total completed steps
  const completedSteps = (subcategoryMerged ? 1 : 0) + completedCategoriesCount;

  // Track merging row for animation
  const [mergingRow, setMergingRow] = useState<number | null>(null);

  const handleSwap = (draggedWord: Word, targetRowIndex: number, targetColIndex: number) => {
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
    
    // Validation checks
    if (sourceRowIndex === -1) return; // Source not found
    if (gridRows[targetRowIndex]?.type !== 'words') return; // Target row not valid
    if (sourceRowIndex === targetRowIndex && sourceColIndex === targetColIndex) return; // Same position
    
    const targetWord = gridRows[targetRowIndex].words![targetColIndex];
    
    // Create new grid with only the two tiles swapped
    const newGridRows = gridRows.map((row, rowIdx) => {
      if (row.type !== 'words') return row;
      
      return {
        ...row,
        words: row.words!.map((w, colIdx) => {
          // If this is the source position, place the target word
          if (rowIdx === sourceRowIndex && colIdx === sourceColIndex) {
            return targetWord;
          }
          // If this is the target position, place the source word
          if (rowIdx === targetRowIndex && colIdx === targetColIndex) {
            return draggedWord;
          }
          // Otherwise keep the word as is
          return w;
        })
      };
    });
    
    setGridRows(newGridRows);
    
    // Check both affected rows for matches
    // Small delay to allow animation to start/finish visually if needed, 
    // though logic happens instantly now.
    setTimeout(() => {
      checkRowForMatch(newGridRows, sourceRowIndex);
      if (targetRowIndex !== sourceRowIndex) {
        checkRowForMatch(newGridRows, targetRowIndex);
      }
    }, 300);
  };

  const checkRowForMatch = (rows: GridRow[], rowIndex: number) => {
    const row = rows[rowIndex];
    if (row.type !== 'words' || !row.words || row.words.length !== 4) return;
    
    const categories = row.words.map(w => w.category);
    const allSame = categories.every(cat => cat === categories[0]);
    
    if (allSame) {
      // Trigger merge animation
      setMergingRow(rowIndex);

      // Wait for animation to complete before processing match
      setTimeout(() => {
        const matchedCategory = categories[0];
        const categoryName = CATEGORY_NAMES[matchedCategory] || matchedCategory;
        const words = row.words!.map(w => w.text);
        
        // Check if this is THE subcategory that should merge
        const subcategoryInfo = HIERARCHY?.subcategory;
        
        if (subcategoryInfo && subcategoryInfo.category === matchedCategory) {
          // This is the subcategory - merge into single tile
          handleSubcategoryCompletion(rows, rowIndex, subcategoryInfo);
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
    // Create a single Word representing the subcategory
    const subcategoryWord: Word = {
      id: `subcategory_${subcategoryInfo.category}_${Date.now()}`,
      text: subcategoryInfo.displayAfterMerge,
      category: subcategoryInfo.mergesInto, // Parent category
      isMergedGroup: true, // Mark as merged group
      icon: subcategoryInfo.icon // Include icon metadata if available
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
    
    // Find and add the specific words that match wordsToReveal
    for (const wordText of subcategoryInfo.wordsToReveal) {
      const wordIndex = newHiddenPool.findIndex(w => w.text === wordText);
      if (wordIndex !== -1) {
        wordsToAdd.push(newHiddenPool[wordIndex]);
        newHiddenPool.splice(wordIndex, 1);
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
    
    // Mark subcategory as merged (counts as 1 step)
    setSubcategoryMerged(true);
  };

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

            {/* Database Level Selector Button */}
            {dbAvailable && (
              <div className="px-3 sm:px-4 mb-2">
                <button
                  onClick={() => setShowLevelSelector(!showLevelSelector)}
                  className="w-full glass-panel rounded-xl p-2 sm:p-3 flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Database className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    <span className="text-xs sm:text-sm font-medium">
                      {useDatabase && selectedDbLevel 
                        ? `DB Level ${selectedDbLevel}`
                        : `Level ${level} (Hardcoded)`
                      }
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    {showLevelSelector ? 'Hide' : 'Change'}
                  </span>
                </button>
              </div>
            )}

            {/* Level Selector Dropdown */}
            {showLevelSelector && dbAvailable && (
              <div className="px-3 sm:px-4 mb-3 sm:mb-4">
                <div className="glass-panel rounded-xl p-3 sm:p-4 space-y-2">
                  <h3 className="text-xs sm:text-sm font-bold mb-2">Select Level</h3>
                  
                  {/* Hardcoded Levels */}
                  <div className="space-y-1">
                    <p className="text-[10px] sm:text-xs text-gray-400 mb-1">Hardcoded Levels:</p>
                    {[1, 2, 3].map(lvl => (
                      <button
                        key={`hardcoded-${lvl}`}
                        onClick={() => {
                          setUseDatabase(false);
                          setShowLevelSelector(false);
                          // Would need to add level setter to change hardcoded level
                        }}
                        className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                          !useDatabase && level === lvl
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700/50 hover:bg-gray-600/50'
                        }`}
                      >
                        Level {lvl}
                      </button>
                    ))}
                  </div>

                  {/* Database Levels */}
                  {dbLevels.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-gray-600">
                      <p className="text-[10px] sm:text-xs text-gray-400 mb-1">Database Levels:</p>
                      {dbLevels.map(dbLevel => (
                        <button
                          key={`db-${dbLevel.id}`}
                          onClick={() => {
                            setUseDatabase(true);
                            setSelectedDbLevel(dbLevel.id);
                            setShowLevelSelector(false);
                          }}
                          className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                            useDatabase && selectedDbLevel === dbLevel.id
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-700/50 hover:bg-gray-600/50'
                          }`}
                        >
                          <div className="font-medium" dir="rtl">{dbLevel.name}</div>
                          {dbLevel.name_en && (
                            <div className="text-[10px] sm:text-xs opacity-70">{dbLevel.name_en}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Game Header (Level & Progress) */}
            <div className="px-3 sm:px-4 mt-2 mb-3 sm:mb-4">
              <GameHeader level={useDatabase && selectedDbLevel ? selectedDbLevel : level} completed={completedSteps} total={totalSteps} />
            </div>

            {/* Game Grid */}
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
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
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
              
              <Button className="w-24 h-14 sm:w-28 sm:h-16 bg-candy-green hover:bg-green-500 rounded-2xl shadow-3d border-b-4 border-green-700 active:border-b-0 btn-3d relative group overflow-hidden">
                <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Search className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-md" />
                <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-7 sm:h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold border-2 border-white shadow-sm">
                  {hints}
                </div>
              </Button>
              
              <Button className="w-24 h-14 sm:w-28 sm:h-16 bg-candy-yellow hover:bg-yellow-400 rounded-2xl shadow-3d border-b-4 border-yellow-600 active:border-b-0 btn-3d relative group overflow-hidden">
                <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-md" />
                <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-7 sm:h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold border-2 border-white shadow-sm">
                  {hints}
                </div>
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
