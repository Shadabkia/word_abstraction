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
      <p className="text-slate-500 text-xs sm:text-sm mb-2 sm:mb-3 font-medium px-2 text-center">
        {t.gameInstruction}
      </p>
      
      <div className="w-full max-w-xs bg-slate-200 h-5 sm:h-6 rounded-full relative overflow-hidden shadow-inner">
        {/* Background striped pattern for empty state */}
        <div className="absolute inset-0 opacity-20 bg-[length:8px_8px] sm:bg-[length:10px_10px] bg-[linear-gradient(45deg,transparent_25%,#000_25%,#000_50%,transparent_50%,transparent_75%,#000_75%,#000_100%)]"></div>
        
        {/* Progress Fill */}
        <motion.div 
          className="absolute top-0 right-0 h-full bg-gradient-to-r from-candy-primary to-candy-accent rounded-full flex items-center justify-end px-1.5 sm:px-2"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        >
          <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-white/50 rounded-full animate-pulse"></div>
        </motion.div>
      </div>
      
      <div className="flex justify-between w-full max-w-xs px-2 mt-0.5 sm:mt-1">
        <span className="text-[10px] sm:text-xs font-bold text-indigo-500">{completed} / {total}</span>
        <span className="text-[10px] sm:text-xs font-bold text-slate-400">0</span>
      </div>
    </div>
  );
}
