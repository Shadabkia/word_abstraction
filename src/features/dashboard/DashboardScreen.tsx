import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/core/state/gameState';
import { useForge } from '@/forge-ui';
import { contentManager } from '@/core/services/contentManager';
import { HeroCard } from './components/HeroCard';
import { QuickAccessCard } from './components/QuickAccessCard';
import { KianShop } from '@/features/shop/KianShop';
import { Gift, Warehouse, Image, Bell, MapPin, Coins, Zap, Plus } from 'lucide-react';

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
  const { theme } = useForge();
  const [[page, direction], setPage] = useState([0, 0]);
  const [isShopOpen, setIsShopOpen] = useState(false);

  // We only have 4 cards now, so we wrap the page index around 0-3
  const heroCardsData = [
    {
      levelNumber: progress.completedLevels.length + 1,
      chapterTitle: "Chapter 1",
      levelTitle: "The Departure",
      description: "Continue your journey...",
      color: "from-sky-300 via-cyan-200 to-emerald-300",
      icon: "🚐",
      tag: "Hero Card",
      isPremium: false
    },
    {
      levelNumber: 0,
      chapterTitle: "Premium Story",
      levelTitle: "The Lost Garden",
      description: "Unlock exclusive memories",
      color: "from-purple-400 via-fuchsia-300 to-pink-400",
      icon: "🌸",
      tag: "Premium Story",
      isPremium: true
    },
    {
      levelNumber: 0,
      chapterTitle: "Zen Mode",
      levelTitle: "Daily Meditation",
      description: "Find peace in the dunes",
      color: "from-amber-200 via-orange-100 to-rose-200",
      icon: "🧘‍♂️",
      tag: "Zen Mode",
      isPremium: false
    },
    {
      levelNumber: 0,
      chapterTitle: "Time Attack",
      levelTitle: "Speed Challenge",
      description: "Race against time",
      color: "from-indigo-300 via-purple-300 to-pink-300",
      icon: "⏱️",
      tag: "Challenge",
      isPremium: false
    }
  ];

  const heroIndex = ((page % heroCardsData.length) + heroCardsData.length) % heroCardsData.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleDotClick = (index: number) => {
    // Calculate direction based on current index
    const direction = index > heroIndex ? 1 : -1;
    setPage([index, direction]);
  };

  const handlePlayLevel = () => {
    const currentCard = heroCardsData[heroIndex];
    if (currentCard.isPremium) {
      setIsShopOpen(true);
      return;
    }
    console.log('Playing next level...');
  };

  const currentChapter = contentManager.getUnlockedChapters(progress.completedLevels)[0];

  return (
    <motion.div 
      className={`${theme.colors.background} min-h-full`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="px-6 pt-5 pb-3">
        {/* Top Bar: Location & Status */}
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-1.5 ${theme.colors.muted}`}>
            <MapPin className="w-4 h-4" strokeWidth={2} />
            <span className="text-[13px] font-medium tracking-wide">
              {currentChapter?.city || 'Tehran'}
            </span>
          </div>

          <div className="flex items-center gap-2">
             {/* Vibes Widget */}
             <div className="flex items-center gap-1.5 bg-slate-100 rounded-full pl-2 pr-3 py-1">
              <Zap className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />
              <span className="text-xs font-bold text-slate-700">{user.vibes}</span>
            </div>

            {/* Coins Widget */}
            <button 
              onClick={() => setIsShopOpen(true)}
              className="flex items-center gap-1.5 bg-amber-100 rounded-full pl-2 pr-1 py-0.5 active:scale-95 transition-transform"
            >
              <Coins className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span className="text-xs font-bold text-amber-800">{user.coins}</span>
              <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                <Plus className="w-3 h-3 text-amber-600" strokeWidth={3} />
              </div>
            </button>
          </div>
        </div>

        <div className="flex items-start justify-between mb-2">
          <h1 className={`text-[28px] font-bold ${theme.colors.text} leading-tight`}>
            Good Morning, {user.name}
          </h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="relative p-2 -m-2 touch-manipulation mt-1"
          >
            <Bell className={`w-6 h-6 ${theme.colors.text}`} strokeWidth={2} />
            <div className={`absolute top-2 right-2 w-2 h-2 ${theme.colors.danger.replace('bg-', 'bg-')} rounded-full border-2 border-white`} />
          </motion.button>
        </div>
      </motion.div>

      <KianShop isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />

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
                      ? theme.colors.primary + ' w-6' 
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
