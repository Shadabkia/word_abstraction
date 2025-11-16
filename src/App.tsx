import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { GameHeader } from './components/GameHeader';
import { GridWordTile } from './components/GridWordTile';
import { CategoryRow } from './components/CategoryRow';
import { Settings, Search, Lightbulb } from 'lucide-react';
import { Button } from './components/ui/button';
import * as React from "react";
import { DragPreview } from './components/DragPreview';

interface Word {
  id: string;
  text: string;
  category: string;
}

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

const LEVEL_DATA: Word[] = [
  { id: '1', text: 'پیانو', category: 'آلات_موسیقی' },
  { id: '2', text: 'دارو', category: 'پزشکی' },
  { id: '3', text: 'گربه', category: 'حیوانات' },
  { id: '4', text: 'گیتار', category: 'آلات_موسیقی' },
  { id: '5', text: 'معلم', category: 'مشاغل' },
  { id: '6', text: 'بیمار', category: 'پزشکی' },
  { id: '7', text: 'پزشک', category: 'پزشکی' },
  { id: '8', text: 'بازیگر', category: 'مشاغل' },
  { id: '9', text: 'فضانورد', category: 'مشاغل' },
  { id: '10', text: 'ویولن', category: 'آلات_موسیقی' },
  { id: '11', text: 'پیام', category: 'ارتباطات' },
  { id: '12', text: 'سفید', category: 'رنگ‌ها' },
  { id: '13', text: 'مهندس', category: 'مشاغل' },
  { id: '14', text: 'آبی', category: 'رنگ‌ها' },
  { id: '15', text: 'خرگوش', category: 'حیوانات' },
  { id: '16', text: 'سنتور', category: 'آلات_موسیقی' },
  { id: '17', text: 'همستر', category: 'حیوانات' },
  { id: '18', text: 'تماس', category: 'ارتباطات' },
  { id: '19', text: 'بیمارستان', category: 'پزشکی' },
  { id: '20', text: 'عکس', category: 'ارتباطات' },
  { id: '21', text: 'قرمز', category: 'رنگ‌ها' },
  { id: '22', text: 'سبز', category: 'رنگ‌ها' },
  { id: '23', text: 'موش', category: 'حیوانات' },
  { id: '24', text: 'متن', category: 'ارتباطات' },
];

const CATEGORY_NAMES: Record<string, string> = {
  'آلات_موسیقی': 'آلات موسیقی',
  'پزشکی': 'پزشکی',
  'حیوانات': 'حیوانات',
  'مشاغل': 'مشاغل',
  'رنگ‌ها': 'رنگ‌ها',
  'ارتباطات': 'ارتباطات',
};

export default function App() {
  const [gridRows, setGridRows] = useState<GridRow[]>([
    { type: 'words', words: LEVEL_DATA.slice(0, 4) },
    { type: 'words', words: LEVEL_DATA.slice(4, 8) },
    { type: 'words', words: LEVEL_DATA.slice(8, 12) },
    { type: 'words', words: LEVEL_DATA.slice(12, 16) },
    { type: 'words', words: LEVEL_DATA.slice(16, 20) },
    { type: 'words', words: LEVEL_DATA.slice(20, 24) },
  ]);
  const [coins, setCoins] = useState(10);
  const [hints, setHints] = useState(3);
  const [level] = useState(1);
  const [animatingTiles, setAnimatingTiles] = useState<Set<string>>(new Set());
  const [swapOffsets, setSwapOffsets] = useState<Map<string, { x: number; y: number }>>(new Map());

  const totalCategories = 6;
  const completedCount = gridRows.filter(row => row.type === 'completed').length;

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
    
    // Calculate position offsets for animation
    // Calculate based on grid positions (columns and rows)
    const colDiff = targetColIndex - sourceColIndex;
    const rowDiff = targetRowIndex - sourceRowIndex;
    
    // Approximate tile width/height + gap (will be refined with actual measurements)
    // Using percentage-based calculation for responsive design
    const tileWidthPercent = 100 / 4; // 4 columns
    const gapSize = 8; // gap-2 = 8px
    
    // Calculate pixel offsets
    const sourceElement = document.querySelector(`[data-word-id="${draggedWord.id}"]`);
    const targetElement = document.querySelector(`[data-word-id="${targetWord.id}"]`);
    
    if (sourceElement && targetElement) {
      const sourceRect = sourceElement.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      
      const sourceToTargetX = targetRect.left - sourceRect.left;
      const sourceToTargetY = targetRect.top - sourceRect.top;
      
      // Set offsets for both tiles (opposite directions)
      const offsets = new Map();
      offsets.set(draggedWord.id, { x: sourceToTargetX, y: sourceToTargetY });
      offsets.set(targetWord.id, { x: -sourceToTargetX, y: -sourceToTargetY });
      setSwapOffsets(offsets);
    }
    
    // Trigger animation for both tiles
    setAnimatingTiles(new Set([draggedWord.id, targetWord.id]));
    
    // Perform swap after animation completes
    setTimeout(() => {
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
      
      // Clear animation state
      setAnimatingTiles(new Set());
      setSwapOffsets(new Map());
      
      // Check both affected rows for matches
      setTimeout(() => {
        checkRowForMatch(newGridRows, sourceRowIndex);
        if (targetRowIndex !== sourceRowIndex) {
          checkRowForMatch(newGridRows, targetRowIndex);
        }
      }, 100);
    }, 400);
  };

  const checkRowForMatch = (rows: GridRow[], rowIndex: number) => {
    const row = rows[rowIndex];
    if (row.type !== 'words' || !row.words || row.words.length !== 4) return;
    
    const categories = row.words.map(w => w.category);
    const allSame = categories.every(cat => cat === categories[0]);
    
    if (allSame) {
      setTimeout(() => {
        const categoryName = CATEGORY_NAMES[categories[0]] || categories[0];
        const words = row.words!.map(w => w.text);
        
        const newGridRows = [...rows];
        newGridRows[rowIndex] = {
          type: 'completed',
          completed: { name: categoryName, words }
        };
        setGridRows(newGridRows);
      }, 500);
    }
  };

  return (
    <DndProvider
      backend={isTouchDevice() ? TouchBackend : HTML5Backend}
      options={isTouchDevice() ? { enableTouchEvents: true, enableMouseEvents: true, delay: 0 } : undefined}
    >
      <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white">
        <DragPreview />
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">⭐</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 shadow-md">
              <span>{coins}</span>
            </div>
            <button className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">+</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg relative">
              <span className="text-white text-xs">ADS</span>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                2
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🎁</span>
            </div>
          </div>
        </div>

        {/* Game Header */}
        <GameHeader level={level} completed={completedCount} total={totalCategories} />

        {/* Game Grid */}
        <div className="px-4 space-y-3 pb-32">
          {gridRows.map((row, rowIndex) => (
            <div key={rowIndex}>
              {row.type === 'completed' && row.completed ? (
                <CategoryRow name={row.completed.name} words={row.completed.words} />
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {row.words?.map((word, colIndex) => (
                    <GridWordTile
                      key={word.id}
                      word={word}
                      rowIndex={rowIndex}
                      colIndex={colIndex}
                      onSwap={handleSwap}
                      isAnimating={animatingTiles.has(word.id)}
                      swapOffset={swapOffsets.get(word.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-blue-100 to-transparent pt-8 pb-6 px-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="w-14 h-14 bg-white/80 rounded-2xl shadow-lg hover:bg-white"
            >
              <Settings className="w-6 h-6" />
            </Button>
            
            <Button className="w-32 h-14 bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 rounded-2xl shadow-lg relative">
              <Search className="w-6 h-6 text-white" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                {hints}
              </div>
            </Button>
            
            <Button className="w-32 h-14 bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 rounded-2xl shadow-lg relative">
              <Lightbulb className="w-6 h-6 text-white" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                {hints}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
