import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const ROW_COLORS = [
  'bg-red-100/90 border-red-200',
  'bg-orange-100/90 border-orange-200',
  'bg-amber-100/90 border-amber-200', 
  'bg-lime-100/90 border-lime-200',
  'bg-emerald-100/90 border-emerald-200',
  'bg-teal-100/90 border-teal-200',
  'bg-cyan-100/90 border-cyan-200',
  'bg-sky-100/90 border-sky-200',
  'bg-blue-100/90 border-blue-200',
  'bg-indigo-100/90 border-indigo-200',
  'bg-violet-100/90 border-violet-200',
  'bg-purple-100/90 border-purple-200',
  'bg-fuchsia-100/90 border-fuchsia-200',
  'bg-pink-100/90 border-pink-200',
  'bg-rose-100/90 border-rose-200',
];

interface CategoryRowProps {
  name: string;
  words: string[];
  index?: number;
}

export function CategoryRow({ name, words, index = 0 }: CategoryRowProps) {
  const colorClass = ROW_COLORS[index % ROW_COLORS.length];

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group h-14 w-full" 
      dir="rtl"
    >
      <div className={`relative h-full rounded-2xl px-3 py-2 border shadow-sm backdrop-blur-md ${colorClass}`}>
        <div className="flex items-center gap-3 h-full">
          <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center flex-shrink-0 shadow-sm border border-white/60">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-center items-start">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-[var(--color-climate-text-primary)] text-base sm:text-lg truncate drop-shadow-sm">{name}</span>
              <Star className="w-3.5 h-3.5 text-[var(--color-climate-highlight)] fill-[var(--color-climate-highlight)] drop-shadow-sm" />
            </div>
            <div className="min-w-0 mb-0.5 w-full flex justify-start">
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
