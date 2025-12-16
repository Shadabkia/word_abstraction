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
      className="relative group h-14 w-full" 
      dir="rtl"
    >
      <div className="relative h-full glass-tile rounded-2xl px-3 py-2 border border-white/60">
        <div className="flex items-center gap-3 h-full">
          <div className="w-8 h-8 rounded-full bg-emerald-50/80 flex items-center justify-center flex-shrink-0 shadow-sm border border-emerald-100">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-[var(--color-climate-text-primary)] text-base sm:text-lg truncate drop-shadow-sm">{name}</span>
              <Star className="w-3.5 h-3.5 text-[var(--color-climate-highlight)] fill-[var(--color-climate-highlight)] drop-shadow-sm" />
            </div>
            <div className="min-w-0 mb-0.5">
              <div className="inline-flex max-w-full items-center bg-white/60 px-2 py-0.5 rounded-md border border-white/40 shadow-sm">
                <span className="min-w-0 text-[var(--color-climate-text-primary)] text-xs sm:text-sm font-semibold truncate whitespace-nowrap opacity-90">
                  {words.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
