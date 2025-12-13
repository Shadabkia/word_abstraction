import { useState, useMemo, useEffect, type CSSProperties } from 'react';
import { GameHeader } from './components/GameHeader';
import { GridWordTile } from './components/GridWordTile';
import { CategoryRow } from './components/CategoryRow';
import { CustomDragPreview } from './components/CustomDragPreview';
import { Settings, Search, Lightbulb, X } from 'lucide-react';
import { Button } from '../../shared/ui/button';
import { SettingsDialog } from '../../shared/ui/dialogs/SettingsDialog';
import { LevelSelector } from './components/LevelSelector';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { DragProvider } from '../../contexts/DragContext';
import { Word, LevelData, LevelJSON } from './data/types';
import { loadLevel, getAvailableLevels, loadAllLevelMetadata } from './utils/levelLoader';
import confetti from 'canvas-confetti';
import { soundManager } from './utils/soundManager';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { gameStorage } from './utils/gameStorage';
import { Toaster } from '../../shared/ui/sonner';

interface CompletedCategory {
  name: string;
  words: string[];
}

interface GridRow {
  type: 'words' | 'completed';
  words?: Word[];
  completed?: CompletedCategory;
}

// Helper function to trigger vibration on supported devices
const triggerHapticFeedback = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Light }); // Changed to Light for subtler feel
  } catch (error) {
    // Silently fail on web or unsupported platforms
    console.log('Haptics not available:', error);
  }
};

interface WordConnectGameProps {
  onExit?: () => void;
  onComplete?: (score: number) => void;
  initialLevel?: number;
}

export default function WordConnectGame({ onExit, onComplete, initialLevel = 1 }: WordConnectGameProps) {
  const [level, setLevel] = useState(initialLevel);
  const [coins] = useState(10);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [glowingSubcategoryId, setGlowingSubcategoryId] = useState<string | null>(null);
  const [hintedWords, setHintedWords] = useState<Map<string, string>>(new Map());
  
  // Level data state
  const [currentLevelData, setCurrentLevelData] = useState<LevelData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableLevels, setAvailableLevels] = useState<number[]>([1, 2, 3]); // Default levels
  const [levelMetadata, setLevelMetadata] = useState<LevelJSON[]>([]);
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Set initial level
  useEffect(() => {
    if (initialLevel && initialLevel > 0) {
      setLevel(initialLevel);
    }
  }, [initialLevel]);

  // Load available levels and metadata
  useEffect(() => {
    Promise.all([
      getAvailableLevels(),
      loadAllLevelMetadata()
    ]).then(([levels, metadata]) => {
      if (levels.length > 0) setAvailableLevels(levels);
      if (metadata.length > 0) setLevelMetadata(metadata);
    }).catch(console.error);
  }, []);

  // Load level data
  useEffect(() => {
    setIsLoading(true);
    setMergedSubcategoriesCount(0);
    setHintedWords(new Map());
    gameStorage.saveCurrentLevel(level);
    
    loadLevel(level).then(async data => {
      setCurrentLevelData(data);
      const savedProgress = await gameStorage.getLevelProgress(level);
      if (savedProgress?.gridRows?.length) {
        setGridRows(savedProgress.gridRows);
        setHiddenPool(savedProgress.hiddenPool || []);
        setMergedSubcategoriesCount(savedProgress.mergedSubcategoriesCount || 0);
      }
      setIsLoading(false);
    }).catch(error => {
      console.error('Failed to load level:', error);
      setIsLoading(false);
    });
  }, [level]);
  
  const LEVEL_DATA = currentLevelData?.words || [];
  const CATEGORY_NAMES = currentLevelData?.categories || {};
  const HIERARCHY = currentLevelData?.hierarchy;

  const visibleWords = useMemo(() => LEVEL_DATA ? LEVEL_DATA.filter((w: Word) => !w.hidden) : [], [LEVEL_DATA]);
  const hiddenWordsPool = useMemo(() => LEVEL_DATA ? LEVEL_DATA.filter((w: Word) => w.hidden) : [], [LEVEL_DATA]);

  const shuffledWords = useMemo(() => visibleWords.length ? visibleWords : [], [visibleWords]);

  const [gridRows, setGridRows] = useState<GridRow[]>([]);
  const [hiddenPool, setHiddenPool] = useState<Word[]>([]);

  // Initialize grid rows
  useEffect(() => {
    if (shuffledWords.length > 0) {
      const rowSize = 4;
      const numRows = Math.ceil(shuffledWords.length / rowSize);
      const newRows: GridRow[] = [];
      
      for (let i = 0; i < numRows; i++) {
        const startIdx = i * rowSize;
        const endIdx = Math.min(startIdx + rowSize, shuffledWords.length);
        const rowWords = shuffledWords.slice(startIdx, endIdx);
        
        if (rowWords.length > 0) {
          const immutableWords = rowWords.map(w => ({ ...w }));
          newRows.push({ type: 'words', words: immutableWords });
        }
      }
      
      setGridRows(newRows);
      setHiddenPool([...hiddenWordsPool]);
    }
  }, [shuffledWords, hiddenWordsPool]);

  const totalSteps = currentLevelData?.totalSteps || 6;

  // ----------------------------
  // Visual system (JSON-driven)
  // ----------------------------
  const screenVisuals = currentLevelData?.visuals;
  const chapterId = currentLevelData?.chapter?.id;

  const screenStyle = useMemo<CSSProperties>(() => {
    const style: Record<string, any> = {};

    // Optional climate overrides (CSS vars)
    const climate = screenVisuals?.climate;
    if (climate?.bg) style['--color-climate-bg'] = climate.bg;
    if (climate?.bgSecondary) style['--color-climate-bg-secondary'] = climate.bgSecondary;
    if (climate?.tile) style['--color-climate-tile'] = climate.tile;
    if (climate?.textPrimary) style['--color-climate-text-primary'] = climate.textPrimary;
    if (climate?.textSecondary) style['--color-climate-text-secondary'] = climate.textSecondary;
    if (climate?.accent) style['--color-climate-accent'] = climate.accent;
    if (climate?.hint) style['--color-climate-hint'] = climate.hint;
    if (climate?.highlight) style['--color-climate-highlight'] = climate.highlight;
    if (climate?.success) style['--color-climate-success'] = climate.success;

    // Full-screen background image
    const rawSrc = screenVisuals?.background?.src;
    const normalizedSrc =
      rawSrc ? (rawSrc.startsWith('/') ? rawSrc : `/${rawSrc}`) : undefined;

    // Fallback: chapter-based background asset.
    // Note: chapter meta ids are like "chapter_1" but asset filenames might be "chapter1".
    const chapterIdNoUnderscore = chapterId ? chapterId.replace(/_/g, '') : undefined;
    const chapterIdPrefixFixed = chapterId ? chapterId.replace(/^chapter_/, 'chapter') : undefined;

    const fallbackCandidates = chapterId
      ? [
          `/backgrounds/${chapterId}.png`,
          `/backgrounds/${chapterIdNoUnderscore}.png`,
          `/backgrounds/${chapterIdPrefixFixed}.png`,
          `/backgrounds/${chapterId}.webp`,
          `/backgrounds/${chapterIdNoUnderscore}.webp`,
          `/backgrounds/${chapterIdPrefixFixed}.webp`,
        ]
      : [];

    // Primary background source (level JSON overrides chapter fallback)
    const bgCandidates = normalizedSrc ? [normalizedSrc, ...fallbackCandidates] : fallbackCandidates;

    style.backgroundColor = 'var(--color-climate-bg)';

    if (bgCandidates.length > 0) {
      // Multiple url() layers allow graceful fallback if one asset 404s.
      // No overlay/scrim: background is shown at full strength.
      style.backgroundImage = bgCandidates.map((s) => `url('${s}')`).join(', ');
      style.backgroundPosition = screenVisuals?.background?.position || 'center';
    }

    return style as CSSProperties;
  }, [screenVisuals, chapterId]);
  
  if (!isLoading && (!currentLevelData || !currentLevelData.words || currentLevelData.words.length === 0)) {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-[var(--color-climate-bg)] font-display flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-[var(--color-climate-bg-secondary)] rounded-2xl flex items-center justify-center mb-4 text-3xl">
              🚧
            </div>
            <h2 className="text-xl font-medium text-[var(--color-climate-text-primary)] mb-2">
              Level Under Construction
            </h2>
            <p className="text-[var(--color-climate-text-secondary)] mb-6 text-sm">
                This level is currently being designed.
            </p>
            <Button onClick={() => setLevel(1)} className="bg-[var(--color-climate-tile)] text-[var(--color-climate-text-primary)] shadow-sm hover:bg-[var(--color-climate-bg-secondary)] rounded-full px-6 py-2">
              Go to Level 1
            </Button>
        </div>
      </LanguageProvider>
    );
  }

  const [mergedSubcategoriesCount, setMergedSubcategoriesCount] = useState(0);
  const completedCategoriesCount = gridRows.filter(row => row.type === 'completed').length;
  const completedSteps = mergedSubcategoriesCount + completedCategoriesCount;
  const [mergingRow, setMergingRow] = useState<number | null>(null);

  const handleSwap = (draggedWord: Word, targetRowIndex: number, targetColIndex: number) => {
    if (isProcessing) return;
    
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
    
    if (sourceRowIndex === -1 || gridRows[targetRowIndex]?.type !== 'words') return;
    if (sourceRowIndex === targetRowIndex && sourceColIndex === targetColIndex) return;
    if (!gridRows[targetRowIndex].words || targetColIndex >= gridRows[targetRowIndex].words!.length) return;
    
    const targetWord = gridRows[targetRowIndex].words![targetColIndex];
    if (!targetWord) return;
    
    const newGridRows = gridRows.map((row, rowIdx) => {
      if (row.type !== 'words') return row;
      return {
        ...row,
        words: row.words!.map((w, colIdx) => {
          if (rowIdx === sourceRowIndex && colIdx === sourceColIndex) return { ...targetWord };
          if (rowIdx === targetRowIndex && colIdx === targetColIndex) return { ...draggedWord };
          return { ...w };
        })
      };
    });
    
    setGridRows(newGridRows);
    
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
    
    const validWords = row.words.filter(w => w && w.category && w.category !== 'empty');
    if (validWords.length !== 4) return;
    
    const categories = validWords.map(w => w.category);
    const allSame = categories.every(cat => cat === categories[0]);
    
    if (allSame) {
      setIsProcessing(true);
      setMergingRow(rowIndex);

      setTimeout(() => {
        const matchedCategory = categories[0];
        const categoryName = CATEGORY_NAMES[matchedCategory] || matchedCategory;
        const words = validWords.map(w => w.text);
        
        const subcategories = HIERARCHY?.subcategories || (HIERARCHY?.subcategory ? [HIERARCHY.subcategory] : []);
        const matchingSubcategory = subcategories.find(sub => sub.category === matchedCategory);
        
        if (matchingSubcategory) {
          handleSubcategoryCompletion(rows, rowIndex, matchingSubcategory);
        } else {
          soundManager.playSuccess();
          triggerHapticFeedback();
          // Reduced confetti intensity for "Calm"
          confetti({
            particleCount: 30,
            spread: 40,
            origin: { y: 0.6 },
            colors: ['#A8D8EA', '#AA96DA'], // Softer colors
            disableForReducedMotion: true
          });
          const newGridRows = [...rows];
          newGridRows[rowIndex] = {
            type: 'completed',
            completed: { name: categoryName, words }
          };
          setGridRows(newGridRows);
          
          gameStorage.saveLevelProgress(
            level,
            newGridRows,
            hiddenPool,
            mergedSubcategoriesCount,
            newGridRows.filter(r => r.type === 'completed').length
          );
          
          const newCompletedCount = newGridRows.filter(r => r.type === 'completed').length;
          const newTotalCompleted = mergedSubcategoriesCount + newCompletedCount;
          
          if (newTotalCompleted >= totalSteps) {
            setTimeout(() => {
              if (onComplete) onComplete(1000);
            }, 1000);
          }
        }
        
        setMergingRow(null);
        setIsProcessing(false);
      }, 800); // Slightly faster merge
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
      icon?: { id: string; label?: string; emoji?: string; iconName?: string; };
    }
  ) => {
    const timestamp = Date.now();
    const subcategoryWord: Word = {
      id: `merged_${subcategoryInfo.category}_${timestamp}`,
      text: subcategoryInfo.displayAfterMerge,
      category: subcategoryInfo.mergesInto,
      isMergedGroup: true,
      icon: subcategoryInfo.icon
    };
    
    setGlowingSubcategoryId(subcategoryWord.id);
    soundManager.playMerge();
    
    // Subtler merge feedback
    const tileElement = document.querySelector(`[data-word-id="${subcategoryWord.id}"]`);
    if (tileElement) {
        // Could add specific small particle effect here
    }

    setTimeout(() => {
      setGlowingSubcategoryId(null);
    }, 1200);

    const wordsToAdd: Word[] = [];
    const newHiddenPool = [...hiddenPool];
    
    for (const wordId of subcategoryInfo.wordsToReveal) {
      let word = newHiddenPool.find(w => w.id === wordId);
      let fromPool = true;

      if (!word) {
        word = LEVEL_DATA.find((w: Word) => w.id === wordId);
        fromPool = false;
      }

      if (word) {
        wordsToAdd.push({ ...word, hidden: false });
        if (fromPool) {
          const wordIndex = newHiddenPool.findIndex(w => w.id === wordId);
          if (wordIndex !== -1) newHiddenPool.splice(wordIndex, 1);
        }
      }
    }

    if (wordsToAdd.length > 0) {
      const consensusCategory = wordsToAdd[0].category;
      if (consensusCategory !== subcategoryWord.category) {
        subcategoryWord.category = consensusCategory;
      }
    }

    const newRow: Word[] = [subcategoryWord, ...wordsToAdd];
    while (newRow.length < 4) {
      newRow.push({
        id: `empty_${Date.now()}_${newRow.length}`,
        text: '...',
        category: 'empty'
      });
    }

    const newGridRows = [...rows];
    newGridRows[rowIndex] = { type: 'words', words: newRow };
    setGridRows(newGridRows);
    setHiddenPool(newHiddenPool);
    setMergedSubcategoriesCount(prev => prev + 1);
  };

  const handleHint = () => {
    const categoryToWords = new Map<string, string[]>();
    gridRows.forEach(row => {
      if (row.type === 'words' && row.words) {
        row.words.forEach(word => {
          if (word.category === 'empty') return;
          if (!categoryToWords.has(word.category)) categoryToWords.set(word.category, []);
          categoryToWords.get(word.category)!.push(word.id);
        });
      }
    });

    let hintWords: string[] = [];
    for (const [, wordIds] of categoryToWords.entries()) {
      if (wordIds.length >= 2) {
        const shuffled = [...wordIds].sort(() => Math.random() - 0.5);
        hintWords = shuffled.slice(0, 2);
        break;
      }
    }

    if (hintWords.length === 2) {
      const newHints = new Map(hintedWords);
      hintWords.forEach(id => newHints.set(id, 'yellow'));
      setHintedWords(newHints);
      soundManager.playMerge();
    } else {
      soundManager.playError();
    }
  };

  const handleSearchHint = () => {
    const categoryToWords = new Map<string, string[]>();
    gridRows.forEach(row => {
      if (row.type === 'words' && row.words) {
        row.words.forEach(word => {
          if (word.category === 'empty') return;
          if (!categoryToWords.has(word.category)) categoryToWords.set(word.category, []);
          categoryToWords.get(word.category)!.push(word.id);
        });
      }
    });

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
       setHintedWords(newHints);
       soundManager.playMerge();
    } else {
       soundManager.playError();
    }
  };

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
      <DragProvider>
        <div
          className="min-h-screen transition-colors duration-700 font-display selection:bg-[var(--color-climate-accent)] overflow-hidden bg-no-repeat bg-cover md:bg-contain"
          style={screenStyle}
        >
          <CustomDragPreview />
          
          <div className="max-w-md mx-auto relative min-h-screen flex flex-col pb-24">
            {/* Minimalist Top Bar */}
            <div className="px-6 pt-8 pb-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="text-[var(--color-climate-text-secondary)] font-medium text-sm">
                        Lvl {level}
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1.5 text-[var(--color-climate-text-primary)]">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{coins}</span>
                     </div>
                     {onExit && (
                        <button onClick={onExit} className="text-[var(--color-climate-text-secondary)] hover:text-red-500 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Game Content - Vertically Centered */}
            <div className="flex-1 flex flex-col justify-center px-4 -mt-16 sm:mt-0">
                
                {/* Progress/Header Context */}
                <div className="mb-8 px-2">
                     <GameHeader completed={completedSteps} total={totalSteps} />
                </div>

                {/* Level Selector (Contextual) */}
                {!onExit && (
                  <div className="mb-6 opacity-80 hover:opacity-100 transition-opacity">
                    <LevelSelector
                      currentLevel={level}
                      levels={levelMetadata}
                      onLevelSelect={setLevel}
                      availableLevels={availableLevels}
                    />
                  </div>
                )}

                {/* The Grid */}
                {!isLoading && (
                <div className="space-y-3 relative z-10">
                  {gridRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="animate-fade-in-up" style={{ animationDelay: `${rowIndex * 0.05}s` }}>
                      {row.type === 'completed' && row.completed ? (
                        <CategoryRow name={row.completed.name} words={row.completed.words} />
                      ) : (
                        <div className="grid grid-cols-4 gap-2 sm:gap-3">
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
                
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                         <div className="w-6 h-6 border-2 border-[var(--color-climate-accent)] border-t-[var(--color-climate-text-primary)] rounded-full animate-spin" />
                    </div>
                )}
            </div>
            
            {/* Minimal Bottom Dock */}
            <div className="fixed bottom-8 left-0 right-0 z-20 px-4 pointer-events-none">
                <div className="max-w-md mx-auto flex items-center justify-center gap-6 pointer-events-auto">
                     <button
                        onClick={() => setShowSettingsDialog(true)}
                        className="w-12 h-12 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-[var(--color-climate-text-secondary)] flex items-center justify-center hover:bg-slate-50 hover:shadow-md transition-all active:scale-95"
                     >
                        <Settings className="w-5 h-5" />
                     </button>
                     
                     <div className="flex items-center gap-3 px-2">
                        <button
                            onClick={handleSearchHint}
                            className="w-14 h-14 rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-[var(--color-climate-text-primary)] flex items-center justify-center hover:bg-slate-50 hover:-translate-y-1 transition-all active:scale-95 active:translate-y-0"
                            title="Reveal Categories"
                        >
                             <Search className="w-6 h-6 opacity-70" />
                        </button>
                        
                        <button
                            onClick={handleHint}
                            className="w-14 h-14 rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-[var(--color-climate-text-primary)] flex items-center justify-center hover:bg-slate-50 hover:-translate-y-1 transition-all active:scale-95 active:translate-y-0"
                             title="Hint Pair"
                        >
                            <Lightbulb className="w-6 h-6 opacity-70" />
                        </button>
                     </div>
                </div>
            </div>

          </div>
        </div>
      </DragProvider>

      <SettingsDialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog} />
      <Toaster />
    </LanguageProvider>
  );
}