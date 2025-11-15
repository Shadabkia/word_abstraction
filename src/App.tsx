import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { GameHeader } from './components/GameHeader';
import { GridWordTile } from './components/GridWordTile';
import { CategoryRow } from './components/CategoryRow';
import { Settings, Search, Lightbulb } from 'lucide-react';
import { Button } from './components/ui/button';

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
  { id: '1', text: 'ACOUSTIC', category: 'MUSICAL_TERMS' },
  { id: '2', text: 'TREATMENT', category: 'MEDICAL' },
  { id: '3', text: 'CAT', category: 'ANIMALS' },
  { id: '4', text: 'BASS', category: 'MUSICAL_TERMS' },
  { id: '5', text: 'TEACHER', category: 'PROFESSIONS' },
  { id: '6', text: 'SCALPEL', category: 'MEDICAL' },
  { id: '7', text: 'MEDICATIONS', category: 'MEDICAL' },
  { id: '8', text: 'ACTOR', category: 'PROFESSIONS' },
  { id: '9', text: 'ASTRONAUT', category: 'PROFESSIONS' },
  { id: '10', text: 'CLASSICAL', category: 'MUSICAL_TERMS' },
  { id: '11', text: 'MESSAGE', category: 'COMMUNICATION' },
  { id: '12', text: 'WHITE', category: 'COLORS' },
  { id: '13', text: 'CALL', category: 'PROFESSIONS' },
  { id: '14', text: 'BLUE', category: 'COLORS' },
  { id: '15', text: 'RABBIT', category: 'ANIMALS' },
  { id: '16', text: 'ELECTRIC', category: 'MUSICAL_TERMS' },
  { id: '17', text: 'HAMSTER', category: 'ANIMALS' },
  { id: '18', text: 'SCREEN', category: 'COMMUNICATION' },
  { id: '19', text: 'PATIENT', category: 'MEDICAL' },
  { id: '20', text: 'SELFIES', category: 'COMMUNICATION' },
  { id: '21', text: 'RED', category: 'COLORS' },
  { id: '22', text: 'GREEN', category: 'COLORS' },
  { id: '23', text: 'MOUSE', category: 'ANIMALS' },
  { id: '24', text: 'TEXT', category: 'COMMUNICATION' },
];

const CATEGORY_NAMES: Record<string, string> = {
  MUSICAL_TERMS: 'MUSICAL TERMS',
  MEDICAL: 'MEDICAL',
  ANIMALS: 'ANIMALS',
  PROFESSIONS: 'PROFESSIONS',
  COLORS: 'COLORS',
  COMMUNICATION: 'COMMUNICATION',
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

  const totalCategories = 6;
  const completedCount = gridRows.filter(row => row.type === 'completed').length;

  const handleSwap = (draggedWord: Word, targetRowIndex: number, targetColIndex: number) => {
    const newGridRows = [...gridRows];
    
    // Find the dragged word's position
    let sourceRowIndex = -1;
    let sourceColIndex = -1;
    
    for (let i = 0; i < newGridRows.length; i++) {
      if (newGridRows[i].type === 'words' && newGridRows[i].words) {
        const colIndex = newGridRows[i].words!.findIndex(w => w.id === draggedWord.id);
        if (colIndex !== -1) {
          sourceRowIndex = i;
          sourceColIndex = colIndex;
          break;
        }
      }
    }
    
    if (sourceRowIndex === -1 || newGridRows[targetRowIndex].type !== 'words') return;
    
    // Swap the words
    const targetWord = newGridRows[targetRowIndex].words![targetColIndex];
    newGridRows[sourceRowIndex].words![sourceColIndex] = targetWord;
    newGridRows[targetRowIndex].words![targetColIndex] = draggedWord;
    
    setGridRows(newGridRows);
    
    // Check both rows for matches
    setTimeout(() => {
      checkRowForMatch(newGridRows, sourceRowIndex);
      if (targetRowIndex !== sourceRowIndex) {
        checkRowForMatch(newGridRows, targetRowIndex);
      }
    }, 100);
  };

  const checkRowForMatch = (rows: GridRow[], rowIndex: number) => {
    const row = rows[rowIndex];
    if (row.type !== 'words' || !row.words || row.words.length !== 4) return;
    
    const categories = row.words.map(w => w.category);
    const allSame = categories.every(cat => cat === categories[0]);
    
    if (allSame) {
      setTimeout(() => {
        const categoryName = CATEGORY_NAMES[categories[0]] || categories[0];
        const words = row.words!.map(w => w.text.charAt(0) + w.text.slice(1).toLowerCase());
        
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
    <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white">
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
