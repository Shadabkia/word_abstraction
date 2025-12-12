import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/shared/ui/button';
import { Play, Sparkles } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: string; // Emoji for now
  color: string;
  progress?: string;
  onPlay: () => void;
  isComingSoon?: boolean;
}

export function GameCard({ title, description, icon, color, progress, onPlay, isComingSoon = false }: GameCardProps) {
  // Dynamic gradient based on color prop
  const gradients: Record<string, string> = {
    indigo: 'from-indigo-500 via-purple-500 to-pink-500',
    pink: 'from-pink-500 via-rose-500 to-orange-400',
    orange: 'from-orange-500 via-amber-500 to-yellow-500',
    green: 'from-emerald-500 via-teal-500 to-cyan-500',
  };

  const gradientClass = gradients[color] || gradients.indigo;

  return (
    <motion.div 
      onClick={!isComingSoon ? onPlay : undefined}
      whileHover={!isComingSoon ? { scale: 1.01, y: -2 } : {}}
      whileTap={!isComingSoon ? { scale: 0.98 } : {}}
      className={`
        relative bg-gradient-to-br from-white to-slate-50 p-5 rounded-3xl shadow-xl border-2 border-slate-100 
        flex items-center gap-4 
        ${!isComingSoon ? 'cursor-pointer' : 'opacity-60'}
        transition-all duration-150 overflow-hidden
      `}
    >
      {/* Animated background shimmer effect for active games - hidden on mobile */}
      {!isComingSoon && (
        <motion.div
          className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-200%', '200%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2
          }}
        />
      )}

      <motion.div 
        className={`
          w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-xl relative
          bg-gradient-to-br ${isComingSoon ? 'from-slate-200 to-slate-300' : gradientClass}
        `}
        whileHover={!isComingSoon ? { scale: 1.05 } : {}}
        transition={{ duration: 0.15 }}
      >
        {/* Sparkle effect - hidden on mobile */}
        {!isComingSoon && (
          <>
            <motion.div
              className="hidden md:block absolute -top-1 -right-1"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </motion.div>
          </>
        )}
        <span className="drop-shadow-lg">{icon}</span>
      </motion.div>
      
      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex justify-between items-start mb-2">
          <motion.h3 
            className={`font-bold text-xl leading-tight ${isComingSoon ? 'text-slate-400' : 'bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'}`}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            {title}
          </motion.h3>
          {isComingSoon && (
            <motion.span 
              className="bg-gradient-to-r from-slate-200 to-slate-300 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Soon
            </motion.span>
          )}
        </div>
        
        <p className="text-slate-600 text-sm mt-1 line-clamp-2 leading-relaxed">
          {description}
        </p>
        
        {!isComingSoon && progress && (
          <motion.div 
            className="mt-3 inline-flex items-center gap-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-xs font-bold text-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1.5 rounded-full shadow-sm border border-indigo-100">
              {progress}
            </div>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </motion.div>
        )}
      </div>

      {!isComingSoon && (
        <motion.div 
          className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg relative z-10"
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <Play className="w-6 h-6 ml-0.5 fill-current drop-shadow" />
        </motion.div>
      )}
    </motion.div>
  );
}

