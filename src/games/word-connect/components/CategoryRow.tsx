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
      className="relative group min-h-[3.5rem] w-full mb-3" 
      dir="rtl"
    >
      <div className="relative h-full bg-[var(--color-climate-tile)] rounded-2xl shadow-[var(--shadow-climate-soft)] border border-[var(--color-climate-accent)] p-3">
        <div className="flex items-center gap-3 h-full">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-[var(--color-climate-text-primary)] text-sm sm:text-base truncate">{name}</span>
              <Star className="w-3 h-3 text-[var(--color-climate-highlight)] fill-[var(--color-climate-highlight)]" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {words.map((word, i) => (
                <span key={i} className="inline-block bg-[var(--color-climate-bg-secondary)] px-2 py-0.5 rounded-md text-[var(--color-climate-text-secondary)] text-xs font-medium whitespace-nowrap">
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
