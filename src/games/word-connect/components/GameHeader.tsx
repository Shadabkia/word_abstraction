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
    <div className="flex flex-col items-center justify-center mb-4 w-full" dir="rtl">
      <motion.p 
        className="text-[var(--color-climate-text-secondary)] text-sm mb-3 font-medium text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {t.gameInstruction}
      </motion.p>
      
      <div className="w-full max-w-[200px] h-1.5 bg-[var(--color-climate-bg-secondary)] rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-[var(--color-climate-text-primary)] rounded-full opacity-80"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
      </div>
      
      <div className="mt-2 text-xs font-medium text-[var(--color-climate-text-secondary)]">
        {completed} / {total}
      </div>
    </div>
  );
}
