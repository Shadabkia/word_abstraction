import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

interface GameHeaderProps {
  completed: number;
  total: number;
}

export function GameHeader({ completed, total }: GameHeaderProps) {
  const { t } = useLanguage();
  const progress = Math.min(100, (completed / total) * 100);

  return (
    <div className="flex flex-col items-center justify-center mb-3 sm:mb-4" dir="rtl">
      <motion.p 
        className="text-slate-600 text-xs sm:text-sm mb-2 sm:mb-3 font-medium px-2 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t.gameInstruction}
      </motion.p>
      
      <div className="w-full max-w-xs bg-gradient-to-r from-slate-200 to-slate-100 h-5 sm:h-6 rounded-full relative overflow-hidden shadow-lg border-2 border-white">
        {/* Background striped pattern for empty state */}
        <div className="absolute inset-0 opacity-10 bg-[length:8px_8px] sm:bg-[length:10px_10px] bg-[linear-gradient(45deg,transparent_25%,#000_25%,#000_50%,transparent_50%,transparent_75%,#000_75%,#000_100%)]"></div>
        
        {/* Progress Fill - Enhanced */}
        <motion.div 
          className="absolute top-0 right-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-end px-1.5 sm:px-2 shadow-inner"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "linear",
              repeatType: "loop"
            }}
          />
          <motion.div 
            className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-white rounded-full shadow-lg relative z-10"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
          />
        </motion.div>
      </div>
      
      <div className="flex justify-between w-full max-w-xs px-2 mt-1 sm:mt-2">
        <motion.span 
          className="text-[11px] sm:text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          key={completed}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {completed} / {total} ✨
        </motion.span>
        <span className="text-[11px] sm:text-xs font-bold text-slate-400">🎯 0</span>
      </div>
    </div>
  );
}
