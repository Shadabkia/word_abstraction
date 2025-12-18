import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface QuickAccessCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
  badge?: string;
  className?: string;
}

export function QuickAccessCard({ title, icon: Icon, color, onClick, badge, className }: QuickAccessCardProps) {
  // Map color names to gradient styles
  const colorStyles: Record<string, { gradient: string }> = {
    orange: {
      gradient: 'from-amber-400 via-orange-400 to-orange-500'
    },
    purple: {
      gradient: 'from-purple-500 via-purple-600 to-purple-700'
    },
    teal: {
      gradient: 'from-teal-400 via-teal-500 to-teal-600'
    },
    blue: {
      gradient: 'from-blue-400 to-blue-600'
    },
    green: {
      gradient: 'from-green-400 to-emerald-600'
    },
    pink: {
      gradient: 'from-pink-400 to-rose-500'
    },
    red: {
      gradient: 'from-red-400 to-red-600'
    },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <motion.button 
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`flex flex-col items-center gap-2 touch-manipulation ${className || ''}`}
    >
      <div className={`w-full aspect-square bg-gradient-to-br ${style.gradient} rounded-[22px] shadow-lg relative flex items-center justify-center`}>
        {/* Icon Container with slight inner shadow/depth effect */}
        <Icon className="w-12 h-12 text-white drop-shadow-md" strokeWidth={1.5} />
        
        {/* Badge */}
        {badge && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md border-2 border-white"
          >
            {badge}
          </motion.div>
        )}
      </div>
      
      {/* Title outside the box */}
      <span className="text-slate-600 text-[14px] font-semibold tracking-tight">
        {title}
      </span>
    </motion.button>
  );
}
