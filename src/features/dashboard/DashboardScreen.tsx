import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/core/state/gameState';
import { contentManager } from '@/core/services/contentManager';
import { HeroCard } from './components/HeroCard';
import { QuickAccessCard } from './components/QuickAccessCard';
import { Gift, Warehouse, Image, Bell, MapPin } from 'lucide-react';

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

// Carousel slide variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export function DashboardScreen() {
  const { user, progress } = useGameState();
  const [[page, direction], setPage] = useState([0, 0]);

  // We only have 3 cards, so we wrap the page index around 0-2
  const heroCardsData = [
    {
      levelNumber: progress.completedLevels.length + 1,
      chapterTitle: "Chapter 1",
      levelTitle: "The Departure",
      description: "Continue your journey...",
      color: "from-sky-300 via-cyan-200 to-emerald-300",
      icon: "🚐",
      tag: "Hero Card"
    },
    {
      levelNumber: 0,
      chapterTitle: "Zen Mode",
      levelTitle: "Daily Meditation",
      description: "Find peace in the dunes",
      color: "from-amber-200 via-orange-100 to-rose-200",
      icon: "🧘‍♂️",
      tag: "Zen Mode"
    },
    {
      levelNumber: 0,
      chapterTitle: "Time Attack",
      levelTitle: "Speed Challenge",
      description: "Race against time",
      color: "from-indigo-300 via-purple-300 to-pink-300",
      icon: "⏱️",
      tag: "Challenge"
    }
  ];

  const heroIndex = ((page % heroCardsData.length) + heroCardsData.length) % heroCardsData.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleDotClick = (index: number) => {
    // Calculate direction based on current index
    const direction = index > heroIndex ? 1 : -1;
    // We update page to exact index but need to keep it consistent with the wrap logic
    // Actually, simple way: reset to the clicked index and set direction
    // But since we use modulo on 'page', we should probably just update page to that index + current cycle
    // For simplicity with dots, let's just jump to that index if possible or update page
    // A simple hack for small number of items:
    setPage([index, direction]);
  };

  const handlePlayLevel = () => {
    console.log('Playing next level...');
  };

  const currentChapter = contentManager.getUnlockedChapters(progress.completedLevels)[0];

  return (
    <motion.div 
      className="bg-white min-h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="px-6 pt-5 pb-3">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-[28px] font-bold text-slate-900 leading-tight">
            Good Morning, {user.name}
          </h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="relative p-2 -m-2 touch-manipulation"
          >
            <Bell className="w-7 h-7 text-slate-900" strokeWidth={2} />
            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </motion.button>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 pl-0.5">
          <MapPin className="w-4 h-4" strokeWidth={2} />
          <span className="text-[15px] font-medium">Location, {currentChapter?.city || 'Tehran'}</span>
        </div>
      </motion.div>

      {/* Hero Carousel */}
      <motion.div variants={itemVariants} className="px-6 mb-8 mt-2">
        <div className="relative">
          <div className="overflow-hidden relative h-auto"> {/* Removed fixed height, let card define it */}
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={page}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="w-full cursor-grab active:cursor-grabbing touch-pan-y"
              >
                <HeroCard 
                  {...heroCardsData[heroIndex]}
                  onPlay={handlePlayLevel}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Carousel dots */}
          <div className="flex justify-center gap-1.5 mt-5">
            {heroCardsData.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className="touch-manipulation p-1"
              >
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === heroIndex 
                      ? 'bg-red-500 w-6' 
                      : 'bg-slate-200 w-2'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Access Grid */}
      <motion.div variants={itemVariants} className="px-6 mb-6">
        <div className="flex gap-4">
          <QuickAccessCard 
            title="Daily Gift" 
            icon={Gift} 
            color="orange" 
            onClick={() => console.log('Daily Gift')} 
            className="flex-1"
          />
          <QuickAccessCard 
            title="Garage" 
            icon={Warehouse} 
            color="purple" 
            onClick={() => console.log('Garage')}
            className="flex-1" 
          />
          <QuickAccessCard 
            title="Gallery" 
            icon={Image} 
            color="teal" 
            onClick={() => console.log('Gallery')}
            className="flex-1" 
          />
        </div>
      </motion.div>

      {/* Tab Bar placeholder space */}
      <div className="h-20" />
    </motion.div>
  );
}
