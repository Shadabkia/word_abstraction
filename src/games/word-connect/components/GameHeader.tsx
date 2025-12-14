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
    <div className="flex flex-col items-center justify-center mb-6 w-full" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel px-4 py-2 rounded-full mb-4"
      >
        <p className="text-[var(--color-climate-text-primary)] text-sm sm:text-base font-bold text-center tracking-wide">
          {t.gameInstruction}
        </p>
      </motion.div>
      
      <div className="w-full max-w-[200px] h-2 bg-black/10 backdrop-blur-sm rounded-full overflow-hidden border border-white/20">
        <motion.div 
          className="h-full bg-[var(--color-climate-text-primary)] rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
      </div>
      
      <div className="mt-2 text-sm font-bold text-[var(--color-climate-text-primary)] drop-shadow-sm bg-white/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
        {completed} / {total}
      </div>
    </div>
  );
}
