import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GameCard } from './components/GameCard';
import { LevelSelector } from './components/LevelSelector';
import { Gamepad2 } from 'lucide-react';
import { getAllWordConnectLevels } from '@/games/word-connect/data/levels/levelRegistry';
import { useGameState } from '@/core/state/gameState';

interface ArcadeScreenProps {
  onPlayGame: (gameId: string, levelNumber?: number) => void;
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

export function ArcadeScreen({ onPlayGame }: ArcadeScreenProps) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const { progress } = useGameState();

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
          setSelectedGame(null);
          onPlayGame('word-connect', levelNumber);
        }}
        onBack={() => setSelectedGame(null)}
      />
    );
  }

  // Show game library
  return (
    <motion.div 
      className="p-6 min-h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-8 px-2">
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Gamepad2 className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Arcade
            </h2>
          </div>
        </div>
        <p className="text-slate-600 text-sm ml-1">Quick games for short breaks. 🎮</p>
      </motion.div>
      
      <div className="space-y-5 pb-20">
        <motion.div variants={itemVariants}>
          <GameCard
            title="Word Connect"
            description="Connect letters to find hidden words in this classic puzzle."
            icon="🧩"
            color="indigo"
            progress="50 Levels"
            onPlay={() => setSelectedGame('word-connect')}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <GameCard
            title="Word Search"
            description="Find all the hidden words in the grid."
            icon="🔍"
            color="green"
            onPlay={() => console.log('Word Search')}
            isComingSoon
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <GameCard
            title="Crossword"
            description="Fill the grid with words from clues."
            icon="📝"
            color="orange"
            onPlay={() => console.log('Crossword')}
            isComingSoon
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <GameCard
            title="Guess The Word"
            description="Can you guess the word in 6 tries?"
            icon="🤔"
            color="pink"
            onPlay={() => console.log('Guess')}
            isComingSoon
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
