import { motion } from 'framer-motion';
import { Lock, Crown } from 'lucide-react';

interface HeroCardProps {
  levelNumber: number;
  chapterTitle: string;
  levelTitle: string;
  description: string;
  isLocked?: boolean;
  isPremium?: boolean;
  onPlay: () => void;
  color?: string; // New prop for gradient customization
  icon?: string; // New prop for custom icon/illustration
  tag?: string; // "Hero Card" or other tags
}

export function HeroCard({ 
  levelNumber, 
  chapterTitle, 
  levelTitle, 
  description, 
  isLocked = false,
  isPremium = false,
  onPlay,
  color = "from-sky-300 via-cyan-200 to-emerald-300",
  icon = "🚐",
  tag = "Hero Card"
}: HeroCardProps) {
  return (
    <motion.button 
      className="relative w-full aspect-[4/4.5] rounded-[32px] overflow-hidden shadow-xl touch-manipulation mx-auto block"
      onClick={onPlay}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      {/* Background with Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color}`}>
        {/* Main Illustration Area */}
        <div className="absolute inset-0 flex items-center justify-center pb-20">
          <div className="text-[100px] drop-shadow-2xl filter">{icon}</div>
        </div>
        
        {/* Cloud/Atmosphere decorations (CSS only) */}
        <div className="absolute top-10 left-10 w-20 h-8 bg-white/20 rounded-full blur-xl" />
        <div className="absolute top-20 right-10 w-32 h-10 bg-white/20 rounded-full blur-xl" />
      </div>

      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 rounded-full p-2 shadow-lg z-10">
          <Crown className="w-5 h-5 fill-current" />
        </div>
      )}

      {/* Bottom Text Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-24 text-left">
        <p className="text-white/90 text-[15px] font-medium mb-1.5">{tag}</p>
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-tight">
          {levelTitle}
        </h2>
        {isPremium && (
          <p className="text-amber-300 text-sm font-bold mt-1 flex items-center gap-1">
            <Crown className="w-3 h-3 fill-current" /> Premium Level
          </p>
        )}
      </div>
      
      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Lock className="w-12 h-12 text-white" />
            <span className="text-white font-bold">Locked</span>
          </div>
        </div>
      )}
    </motion.button>
  );
}
