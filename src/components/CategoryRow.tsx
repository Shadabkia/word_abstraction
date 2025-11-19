import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryRowProps {
  name: string;
  words: string[];
}

export function CategoryRow({ name, words }: CategoryRowProps) {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group" 
      dir="rtl"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-green-400 blur-lg opacity-20 rounded-xl sm:rounded-2xl group-hover:opacity-30 transition-opacity"></div>
      
      <div className="relative bg-gradient-to-r from-emerald-400 to-green-400 rounded-xl sm:rounded-2xl shadow-[0_3px_0_rgb(21,128,61)] sm:shadow-[0_4px_0_rgb(21,128,61)] p-0.5 sm:p-1">
        <div className="bg-white/10 rounded-lg sm:rounded-xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3 backdrop-blur-[2px]">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md border-2 border-green-200">
            <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 stroke-[3]" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
              <span className="font-bold text-white text-base sm:text-lg drop-shadow-sm truncate">{name}</span>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 fill-yellow-300" />
              </motion.div>
            </div>
            <div className="flex flex-wrap gap-0.5 sm:gap-1">
              {words.map((word, i) => (
                <span key={i} className="inline-block bg-white/20 px-1.5 sm:px-2 py-0.5 rounded-md text-white text-[10px] sm:text-xs font-medium whitespace-nowrap">
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
