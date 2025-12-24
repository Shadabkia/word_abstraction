import { useState, useMemo, useEffect, useRef, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameHeader } from './components/GameHeader';
import { GridWordTile } from './components/GridWordTile';
import { CategoryRow } from './components/CategoryRow';
import { CustomDragPreview } from './components/CustomDragPreview';
import { Settings, Search, Lightbulb, X } from 'lucide-react';
import { SettingsDialog } from '../../shared/ui/dialogs/SettingsDialog';
import { LevelSelector } from './components/LevelSelector';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { DragProvider } from '../../contexts/DragContext';
import { Word, LevelData, LevelJSON } from './data/types';
import { loadLevel, getAvailableLevels, loadAllLevelMetadata } from './utils/levelLoader';
import { soundManager } from './utils/soundManager';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { gameStorage } from './utils/gameStorage';
import { Toaster } from '../../shared/ui/sonner';
import { ConfirmDialog } from '@/shared/ui/dialogs/ConfirmDialog';
import { WinDialog } from './components/WinDialog';
import { burstConfetti } from '@/shared/effects/confetti';
import * as backGuards from '@/core/navigation/backGuards';

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
  gameMode?: 'career' | 'arcade';
}

// Animation variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const topBarVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const rowVariantsLeft = {
  hidden: { x: -100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

const rowVariantsRight = {
  hidden: { x: 100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

const bottomDockVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30, delay: 0.4 }
  }
};

export default function WordConnectGame({ onExit, onComplete, initialLevel = 1, gameMode = 'career' }: WordConnectGameProps) {
  const [level, setLevel] = useState(initialLevel);
  const [coins] = useState(10);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [glowingSubcategoryId, setGlowingSubcategoryId] = useState<string | null>(null);
  const [hintedWords, setHintedWords] = useState<Map<string, string>>(new Map());
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const [winOpen, setWinOpen] = useState(false);
  const levelCompletedRef = useRef(false);
  const isExitingRef = useRef(false);
  
  // Set the game storage mode when component mounts or mode changes
  useEffect(() => {
    gameStorage.setMode(gameMode);
    console.log(`[WordConnectGame] Running in ${gameMode} mode`);
  }, [gameMode]);
  
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
    setWinOpen(false);
    levelCompletedRef.current = false;
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

  const nextLevel = useMemo(() => {
    const sorted = [...availableLevels].sort((a, b) => a - b);
    const idx = sorted.indexOf(level);
    return idx >= 0 ? sorted[idx + 1] ?? null : null;
  }, [availableLevels, level]);

  const requestExit = () => {
    if (!onExit) return;
    setExitConfirmOpen(true);
  };

  const triggerWin = () => {
    if (levelCompletedRef.current) return;
    levelCompletedRef.current = true;
    setWinOpen(true);
  };

  useEffect(() => {
    if (!onExit) return;
    return backGuards.registerBackGuard(() => {
      if (isExitingRef.current) return false;
      setExitConfirmOpen(true);
      return true;
    });
  }, [onExit]);

  // ----------------------------
  // Visual system (JSON-driven)
  // ----------------------------
  const screenVisuals = currentLevelData?.visuals;
  const chapterId = currentLevelData?.chapter?.id;

  const backgroundCandidates = useMemo(() => {
    const rawSrc = screenVisuals?.background?.src;
    const normalizedSrc =
      rawSrc ? (rawSrc.startsWith('/') ? rawSrc : `/${rawSrc}`) : undefined;

    const candidates: string[] = [];

    // If the level JSON points at a legacy PNG background in /public/backgrounds,
    // prefer the equivalent WebP first (if present), then fall back to the original.
    if (normalizedSrc) {
      const isPublicBackgroundPng =
        normalizedSrc.startsWith('/backgrounds/') && /\.png$/i.test(normalizedSrc);
      if (isPublicBackgroundPng) {
        candidates.push(normalizedSrc.replace(/\.png$/i, '.webp'));
      }
      candidates.push(normalizedSrc);
    }

    // Fallback: chapter-based background asset.
    // Note: chapter meta ids are like "chapter_1" but asset filenames might be "chapter1".
    const chapterIdNoUnderscore = chapterId ? chapterId.replace(/_/g, '') : undefined;
    const chapterIdPrefixFixed = chapterId ? chapterId.replace(/^chapter_/, 'chapter') : undefined;

    if (chapterId) {
      // Prefer WebP for size. If you add PNG-only assets later, update this list.
      if (chapterIdPrefixFixed) candidates.push(`/backgrounds/${chapterIdPrefixFixed}.webp`);
      if (chapterIdNoUnderscore) candidates.push(`/backgrounds/${chapterIdNoUnderscore}.webp`);
      candidates.push(`/backgrounds/${chapterId}.webp`);
    }

    // De-dupe while preserving order.
    return candidates.filter((c, idx) => candidates.indexOf(c) === idx);
  }, [screenVisuals?.background?.src, chapterId]);

  const resolvedBackgroundSrc = useResolvedBackgroundSrc(backgroundCandidates);

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

    style.backgroundColor = 'var(--color-climate-bg)';

    if (resolvedBackgroundSrc) {
      // Single resolved background (avoids downloading multiple assets for "fallbacks").
      style.backgroundImage = `url('${resolvedBackgroundSrc}')`;
      style.backgroundPosition = screenVisuals?.background?.position || 'center';
    }

    return style as CSSProperties;
  }, [screenVisuals, resolvedBackgroundSrc]);

function useResolvedBackgroundSrc(candidates: string[]) {
  const [resolved, setResolved] = useState<string | undefined>(undefined);

  const key = useMemo(() => candidates.join('|'), [candidates]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setResolved(undefined);
      for (const src of candidates) {
        const ok = await canLoadImage(src);
        if (cancelled) return;
        if (ok) {
          setResolved(src);
          return;
        }
      }
    }

    // Avoid work if there are no candidates
    if (candidates.length > 0) run();
    return () => {
      cancelled = true;
    };
  }, [key, candidates]);

  return resolved;
}

function canLoadImage(src: string) {
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}
  
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
            <button onClick={() => setLevel(1)} className="bg-[var(--color-climate-tile)] text-[var(--color-climate-text-primary)] shadow-sm hover:bg-[var(--color-climate-bg-secondary)] rounded-full px-6 py-2 active:scale-95 transition-transform">
              Go to Level 1
            </button>
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
    
    // FIX: Check matches sequentially - destination row first, then source row
    // This ensures both animations play when two rows match in one swap
    requestAnimationFrame(() => {
      checkRowForMatchSequential(newGridRows, sourceRowIndex, targetRowIndex, sourceRowIndex !== targetRowIndex);
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
            // Delay win dialog to allow completion animation to finish and user to appreciate it
            setTimeout(() => {
              triggerWin();
            }, 1000);
          }
        }
        
        setMergingRow(null);
        setIsProcessing(false);
      }, 1000);
    }
  };

  // FIX: Sequential match checking for when both source and target rows match
  // This ensures both animations play in order: destination row first, then source row
  const checkRowForMatchSequential = (
    rows: GridRow[], 
    sourceRowIndex: number, 
    targetRowIndex: number,
    checkBothRows: boolean
  ) => {
    const checkMatch = (rowIndex: number): boolean => {
      const row = rows[rowIndex];
      if (row.type !== 'words' || !row.words || row.words.length !== 4) return false;
      
      const validWords = row.words.filter(w => w && w.category && w.category !== 'empty');
      if (validWords.length !== 4) return false;
      
      const categories = validWords.map(w => w.category);
      return categories.every(cat => cat === categories[0]);
    };

    const sourceMatches = checkMatch(sourceRowIndex);
    const targetMatches = checkBothRows && checkMatch(targetRowIndex);

    if (sourceMatches && targetMatches) {
      // Both rows match - process destination (target) first, then source
      console.log('Both rows match - processing destination row first, then source row');
      setIsProcessing(true);
      setMergingRow(targetRowIndex);

      // Process destination row after animation
      setTimeout(() => {
        processMatchedRowAndContinue(rows, targetRowIndex, sourceRowIndex);
      }, 1000);
    } else if (sourceMatches) {
      // Only source row matches
      checkRowForMatch(rows, sourceRowIndex);
    } else if (targetMatches) {
      // Only target row matches
      checkRowForMatch(rows, targetRowIndex);
    }
  };

  // Helper function to process a matched row (extracted from checkRowForMatch)
  const processMatchedRow = (rows: GridRow[], rowIndex: number) => {
    const row = rows[rowIndex];
    if (row.type !== 'words' || !row.words) return;
    
    const validWords = row.words.filter(w => w && w.category && w.category !== 'empty');
    const categories = validWords.map(w => w.category);
    const matchedCategory = categories[0];
    const categoryName = CATEGORY_NAMES[matchedCategory] || matchedCategory;
    const words = validWords.map(w => w.text);
    
    // Check if this is a subcategory that should merge
    const subcategories = HIERARCHY?.subcategories || (HIERARCHY?.subcategory ? [HIERARCHY.subcategory] : []);
    const matchingSubcategory = subcategories.find(sub => sub.category === matchedCategory);
    
    if (matchingSubcategory) {
      // This is a subcategory - merge into single tile
      handleSubcategoryCompletion(rows, rowIndex, matchingSubcategory);
    } else {
      // Regular category - show as completed row
      soundManager.playSuccess();
      triggerHapticFeedback();
      
      const newGridRows = [...rows];
      newGridRows[rowIndex] = {
        type: 'completed',
        completed: { name: categoryName, words }
      };
      setGridRows(newGridRows);
      
      // Save progress after regular category completion
      const newCompletedCount = newGridRows.filter(r => r.type === 'completed').length;
      gameStorage.saveLevelProgress(
        level,
        newGridRows,
        hiddenPool,
        mergedSubcategoriesCount,
        newCompletedCount
      );
      
      // Check for level completion
      const newTotalCompleted = mergedSubcategoriesCount + newCompletedCount;
      if (newTotalCompleted >= totalSteps) {
        // Delay win dialog to allow completion animation to finish and user to appreciate it
        setTimeout(() => {
          triggerWin();
        }, 1200);
      }
    }
  };

  // Helper function to process destination row then continue with source row
  const processMatchedRowAndContinue = (rows: GridRow[], destinationRowIndex: number, sourceRowIndex: number) => {
    // Process destination row first
    processMatchedRow(rows, destinationRowIndex);
    
    // Wait for state to update, then process source row
    setTimeout(() => {
      setGridRows(currentRows => {
        // Check if source row still matches after destination row was processed
        const sourceRow = currentRows[sourceRowIndex];
        if (sourceRow.type !== 'words' || !sourceRow.words || sourceRow.words.length !== 4) {
          // Source row is no longer valid, clean up and exit
          setMergingRow(null);
          setIsProcessing(false);
          return currentRows;
        }
        
        const validWords = sourceRow.words.filter(w => w && w.category && w.category !== 'empty');
        if (validWords.length !== 4) {
          // Source row no longer has 4 valid words, clean up and exit
          setMergingRow(null);
          setIsProcessing(false);
          return currentRows;
        }
        
        const categories = validWords.map(w => w.category);
        const allSame = categories.every(cat => cat === categories[0]);
        
        if (allSame) {
          // Source row still matches - start its animation
          setMergingRow(sourceRowIndex);
          
          // Process source row after animation
          setTimeout(() => {
            processMatchedRow(currentRows, sourceRowIndex);
            
            // Clean up after both rows are processed
            setMergingRow(null);
            setIsProcessing(false);
          }, 1000);
        } else {
          // Source row no longer matches after destination row completed
          setMergingRow(null);
          setIsProcessing(false);
        }
        
        return currentRows;
      });
    }, 100); // Small delay to ensure destination row's state update completes
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
        <motion.div
          initial="hidden"
          animate="visible"
          variants={pageVariants}
          className="h-full transition-colors duration-700 font-display selection:bg-[var(--color-climate-accent)] overflow-hidden bg-no-repeat bg-cover"
          style={screenStyle}
        >
          <CustomDragPreview />
          
          <div className="w-full mx-auto relative h-full flex flex-col pb-24">
            {/* Minimalist Top Bar */}
            <motion.div variants={topBarVariants} className="px-6 pt-8 pb-4 flex items-center justify-between z-10">
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
                        <button onClick={requestExit} className="text-[var(--color-climate-text-secondary)] hover:text-red-500 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Game Content - Vertically Centered */}
            <div className="flex-1 flex flex-col justify-center px-4 -mt-16">
                
                {/* Progress/Header Context */}
                <motion.div variants={topBarVariants} className="mb-8 px-2">
                     <GameHeader completed={completedSteps} total={totalSteps} />
                </motion.div>

                {/* Level Selector (Contextual) */}
                {!onExit && (
                  <motion.div variants={topBarVariants} className="mb-6 opacity-80 hover:opacity-100 transition-opacity">
                    <LevelSelector
                      currentLevel={level}
                      levels={levelMetadata}
                      onLevelSelect={setLevel}
                      availableLevels={availableLevels}
                    />
                  </motion.div>
                )}

                {/* The Grid */}
                {!isLoading && (
                <motion.div 
                  variants={gridContainerVariants}
                  className="space-y-2 relative z-10 glass-panel rounded-[2rem] p-2 sm:p-3 transition-all duration-500"
                >
                  {gridRows.map((row, rowIndex) => (
                    <motion.div 
                      key={rowIndex} 
                      variants={rowIndex % 2 === 0 ? rowVariantsLeft : rowVariantsRight}
                    >
                      {row.type === 'completed' && row.completed ? (
                        <CategoryRow name={row.completed.name} words={row.completed.words} index={rowIndex} />
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
                    </motion.div>
                  ))}
                </motion.div>
                )}
                
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                         <div className="w-6 h-6 border-2 border-[var(--color-climate-accent)] border-t-[var(--color-climate-text-primary)] rounded-full animate-spin" />
                    </div>
                )}
            </div>
            
            {/* Minimal Bottom Dock */}
            <motion.div variants={bottomDockVariants} className="fixed bottom-8 left-0 right-0 z-20 px-4 pointer-events-none">
                <div className="w-full mx-auto flex items-center justify-center gap-6 pointer-events-auto">
                     <button
                        onClick={() => setShowSettingsDialog(true)}
                        className="w-14 h-14 rounded-full glass-tile text-[var(--color-climate-text-secondary)] flex items-center justify-center hover:bg-white transition-all active:scale-95 border border-white/60"
                     >
                        <Settings className="w-6 h-6" />
                     </button>
                     
                     <div className="flex items-center gap-3 px-2">
                        <button
                            onClick={handleSearchHint}
                            className="w-16 h-16 rounded-2xl glass-tile text-[var(--color-climate-text-primary)] flex items-center justify-center hover:bg-white hover:-translate-y-1 transition-all active:scale-95 active:translate-y-0 border border-white/60"
                            title="Reveal Categories"
                        >
                             <Search className="w-7 h-7 opacity-80" strokeWidth={2.5} />
                        </button>
                        
                        <button
                            onClick={handleHint}
                            className="w-16 h-16 rounded-2xl glass-tile text-[var(--color-climate-text-primary)] flex items-center justify-center hover:bg-white hover:-translate-y-1 transition-all active:scale-95 active:translate-y-0 border border-white/60"
                             title="Hint Pair"
                        >
                            <Lightbulb className="w-7 h-7 opacity-80" strokeWidth={2.5} />
                        </button>
                     </div>
                </div>
            </motion.div>

          </div>
        </motion.div>
      </DragProvider>

      <SettingsDialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog} />
      <ConfirmDialog
        open={exitConfirmOpen}
        onOpenChange={setExitConfirmOpen}
        title="Leave the puzzle?"
        description="Your progress here won’t be lost, but you’ll exit the current game screen."
        confirmLabel="Exit"
        cancelLabel="Stay"
        confirmVariant="destructive"
        onConfirm={() => {
          setExitConfirmOpen(false);
          isExitingRef.current = true;
          onExit?.();
        }}
      />
      <WinDialog
        open={winOpen}
        onOpenChange={(open) => {
          setWinOpen(open);
          // Mark level as complete when dialog closes (any way: button, backdrop, ESC, back)
          if (!open && onComplete && levelCompletedRef.current) {
            onComplete(1000);
          }
        }}
        title="You did it!"
        description="Level complete. That was smooth."
        primaryLabel={onComplete ? 'Continue' : nextLevel ? 'Next level' : 'Play again'}
        secondaryLabel={onComplete ? undefined : 'Stay here'}
        onPrimary={() => {
          setWinOpen(false);
          if (onComplete) {
            // onComplete will be called by onOpenChange when dialog closes
            return;
          }
          if (nextLevel) {
            setLevel(nextLevel);
            return;
          }
          setLevel(level);
        }}
        onSecondary={() => setWinOpen(false)}
        onCelebrate={() => {
          soundManager.playSuccess();
          triggerHapticFeedback();
          void burstConfetti({ preset: 'win' });
        }}
        icon="🎉"
      >
        <div className="flex flex-col gap-4 w-full mt-2">
            {/* Career Mode Coin Reward */}
            {gameMode === 'career' && (
                <div className="flex items-center justify-center gap-2 bg-yellow-400/10 rounded-xl py-3 border border-yellow-500/20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-sm text-yellow-900 font-bold text-lg">
                        $
                    </div>
                    <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">+10 Coins</span>
                </div>
            )}

            {/* Completed Words List */}
            <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10">
                <div className="text-xs font-medium text-[var(--color-climate-text-secondary)] uppercase tracking-wider text-center mb-1 opacity-70">
                    Completed Categories
                </div>
                {gridRows
                    .map((row, originalIndex) => ({ row, originalIndex }))
                    .filter(({ row }) => row.type === 'completed' && row.completed)
                    .map(({ row, originalIndex }) => (
                      <div key={originalIndex} className="scale-90 origin-top">
                        <CategoryRow 
                          name={row.completed!.name} 
                          words={row.completed!.words} 
                          index={originalIndex}
                        />
                      </div>
                ))}
            </div>
        </div>
      </WinDialog>
      <Toaster />
    </LanguageProvider>
  );
}
