import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForge } from '@/forge-ui';
import { GameCard } from './components/GameCard';
import { LevelSelector } from './components/LevelSelector';
import { Gamepad2 } from 'lucide-react';
import { getAllWordConnectLevels } from '@/games/word-connect/data/levels/levelRegistry';

interface ArcadeScreenProps {
  onPlayGame: (ref: { gameId: 'word-connect'; levelId: number }) => void;
  selectedGameId?: string | null;
  onSelectGame?: (gameId: string) => void;
  onCloseGameSelector?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      duration: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.15
    }
  }
};

export function ArcadeScreen({
  onPlayGame,
  selectedGameId,
  onSelectGame,
  onCloseGameSelector,
}: ArcadeScreenProps) {
  const { theme } = useForge();
  const [uncontrolledSelectedGame, setUncontrolledSelectedGame] = useState<string | null>(null);
  const selectedGame = selectedGameId !== undefined ? selectedGameId : uncontrolledSelectedGame;

  // If Word Connect is selected, show level selector
  if (selectedGame === 'word-connect') {
    const allLevels = getAllWordConnectLevels();
    
    // Map levels to selector format
    const levels = allLevels.map(level => ({
      id: level.number,
      name: level.name,
      difficulty: level.difficulty,
      isLocked: false, // All levels unlocked in arcade mode
      stars: undefined, // TODO: Get from progress if we track arcade progress
      bestScore: undefined,
    }));

    return (
      <LevelSelector
        gameId="word-connect"
        gameName="Word Connect"
        levels={levels}
        onSelectLevel={(levelNumber) => {
          if (!onSelectGame && !onCloseGameSelector) setUncontrolledSelectedGame(null);
          onPlayGame({ gameId: 'word-connect', levelId: levelNumber });
        }}
        onBack={() => {
          if (onCloseGameSelector) {
            onCloseGameSelector();
            return;
          }
          setUncontrolledSelectedGame(null);
        }}
      />
    );
  }

  // Show game library
  return (
    <motion.div 
      className={`p-6 min-h-full ${theme.colors.background}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-8 px-2">
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            className={`w-12 h-12 ${theme.colors.accent} rounded-2xl flex items-center justify-center shadow-lg`}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Gamepad2 className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h2 className={`text-3xl font-bold bg-clip-text text-transparent ${theme.colors.accent.includes('gradient') ? theme.colors.accent.replace('bg-', 'bg-') : 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500'}`}>
              Arcade
            </h2>
          </div>
        </div>
        <p className={`${theme.colors.muted} text-sm ml-1`}>Quick games for short breaks. 🎮</p>
      </motion.div>
      
      <div className="grid grid-cols-2 gap-4 pb-20">
        <motion.div variants={itemVariants}>
          <GameCard
            title="Word Connect"
            description="Connect letters to find words"
            icon="🧩"
            color="indigo"
            onPlay={() => {
              if (onSelectGame) {
                onSelectGame('word-connect');
                return;
              }
              setUncontrolledSelectedGame('word-connect');
            }}
            variant="grid"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <GameCard
            title="Word Search"
            description="Find hidden words in the grid"
            icon="🔍"
            color="green"
            onPlay={() => console.log('Word Search')}
            isComingSoon
            variant="grid"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <GameCard
            title="Crossword"
            description="Solve clues to fill the board"
            icon="📝"
            color="orange"
            onPlay={() => console.log('Crossword')}
            isComingSoon
            variant="grid"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <GameCard
            title="Guess It"
            description="Guess the word in 6 tries"
            icon="🤔"
            color="pink"
            onPlay={() => console.log('Guess')}
            isComingSoon
            variant="grid"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
