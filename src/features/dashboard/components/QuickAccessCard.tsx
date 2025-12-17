import React from 'react';
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
  // Map color names to gradient and shadow styles
  const colorStyles: Record<string, { gradient: string; shadow: string; text: string }> = {
    blue: {
      gradient: 'from-blue-400 to-blue-600',
      shadow: 'shadow-blue-200',
      text: 'text-blue-600'
    },
    green: {
      gradient: 'from-green-400 to-emerald-600',
      shadow: 'shadow-green-200',
      text: 'text-green-600'
    },
    orange: {
      gradient: 'from-orange-400 to-red-500',
      shadow: 'shadow-orange-200',
      text: 'text-orange-600'
    },
    purple: {
      gradient: 'from-purple-400 to-purple-600',
      shadow: 'shadow-purple-200',
      text: 'text-purple-600'
    },
    pink: {
      gradient: 'from-pink-400 to-rose-500',
      shadow: 'shadow-pink-200',
      text: 'text-pink-600'
    },
    red: {
      gradient: 'from-red-400 to-red-600',
      shadow: 'shadow-red-200',
      text: 'text-red-600'
    },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ y: -5, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border-2 border-slate-100 hover:border-slate-200 transition-all cursor-pointer ${className || ''}`}
    >
      <motion.div 
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center mb-2 ${style.shadow} shadow-lg relative`}
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-7 h-7 text-white drop-shadow" />
        {badge && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg border-2 border-white"
          >
            {badge}
          </motion.div>
        )}
      </motion.div>
      <span className={`text-xs font-bold ${style.text} text-center leading-tight`}>
        {title}
      </span>
    </motion.div>
  );
}

