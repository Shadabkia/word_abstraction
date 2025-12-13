import React from 'react';
import { motion } from 'framer-motion';
import { Play, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface HeroCardProps {
  levelNumber: number;
  chapterTitle: string;
  levelTitle: string;
  description: string;
  isLocked?: boolean;
  onPlay: () => void;
}

export function HeroCard({ 
  levelNumber, 
  chapterTitle, 
  levelTitle, 
  description, 
  isLocked = false,
  onPlay 
}: HeroCardProps) {
  return (
    <motion.div 
      className="relative w-full h-72 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
      onClick={onPlay}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        {/* Animated overlay circles */}
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full blur-3xl opacity-40"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-64 h-64 bg-pink-400 rounded-full blur-3xl opacity-40"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating particles - keep disabled for portrait-first UI */}
        <div className="hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
        <motion.div 
          className="flex items-center gap-2 mb-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="bg-white/25 backdrop-blur-xl px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-white/30 shadow-lg">
            {chapterTitle}
          </span>
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            Level {levelNumber}
          </span>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </motion.div>
        </motion.div>
        
        <motion.h2 
          className="text-4xl font-bold mb-2 leading-tight drop-shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {levelTitle}
        </motion.h2>
        <motion.p 
          className="text-white/90 text-sm mb-5 line-clamp-2 drop-shadow"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {description}
        </motion.p>
        
        <motion.div 
          className="flex items-center justify-between"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              className="rounded-full bg-white text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 font-bold px-8 py-6 shadow-xl border-2 border-white/50 transition-all duration-300"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
              disabled={isLocked}
            >
              {isLocked ? (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Locked
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Continue Journey
                </>
              )}
            </Button>
          </motion.div>
          
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-lg px-3 py-2 rounded-full border border-white/30">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium">~10 mins</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

