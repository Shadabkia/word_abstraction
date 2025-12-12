import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '@/core/state/gameState';
import { contentManager } from '@/core/services/contentManager';
import { HeroCard } from './components/HeroCard';
import { QuickAccessCard } from './components/QuickAccessCard';
import { Calendar, Zap, Trophy, Gift } from 'lucide-react';

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

export function DashboardScreen() {
  const { user, progress } = useGameState();

  const handlePlayLevel = () => {
    console.log('Playing next level...');
    // TODO: Navigate to game (would need routing or prop drilling)
  };

  const currentLevel = progress.completedLevels.length + 1;
  
  // Get current chapter context
  const chapters = contentManager.getUnlockedChapters(progress.completedLevels);
  const currentChapter = chapters[chapters.length - 1] || chapters[0];

  return (
    <motion.div 
      className="p-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
            Good Morning, {user.name} 👋
          </h1>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
            📍 <span className="font-medium text-indigo-600">Tehran Highway</span>
          </p>
        </div>
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full overflow-hidden ring-4 ring-purple-100 shadow-lg">
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
              {user.name[0]}
            </div>
          </div>
          <motion.div
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Hero Section */}
      <motion.div variants={itemVariants}>
        <HeroCard 
          levelNumber={currentLevel}
          chapterTitle={currentChapter?.title || "Chapter 1"}
          levelTitle={`Level ${currentLevel}`}
          description={currentChapter?.description || "Continue your journey..."}
          onPlay={handlePlayLevel}
        />
      </motion.div>

      {/* Quick Access Grid */}
      <motion.div variants={itemVariants}>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="text-lg">⚡</span>
          Daily Activities
        </h3>
        <div className="grid grid-cols-4 gap-3">
          <QuickAccessCard 
            title="Daily" 
            icon={Calendar} 
            color="green" 
            onClick={() => console.log('Daily')} 
            badge="1"
          />
          <QuickAccessCard 
            title="Challenges" 
            icon={Zap} 
            color="orange" 
            onClick={() => console.log('Challenges')} 
          />
          <QuickAccessCard 
            title="Rankings" 
            icon={Trophy} 
            color="blue" 
            onClick={() => console.log('Rankings')} 
          />
          <QuickAccessCard 
            title="Rewards" 
            icon={Gift} 
            color="purple" 
            onClick={() => console.log('Rewards')} 
            badge="Free"
          />
        </div>
      </motion.div>

      {/* Status Widget - Enhanced */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-br from-white to-slate-50 p-5 rounded-3xl shadow-lg border-2 border-slate-100 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl shadow-md"
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <span className="text-2xl">⛽</span>
          </motion.div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wide">Fuel</div>
            <div className="text-base font-bold text-slate-700">80% Full</div>
            <div className="w-20 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '80%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </div>
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl shadow-md"
            whileHover={{ scale: 1.1, rotate: -10 }}
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-2xl">✨</span>
          </motion.div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wide">Vibes</div>
            <motion.div 
              className="text-base font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {user.vibes} Collected
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
