import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GameButtonProps extends Omit<HTMLMotionProps<"button">, "className"> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'glass' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  label?: string; // For accessibility
}

export const GameButton = ({
  variant = 'default',
  size = 'md',
  icon,
  className,
  children,
  label,
  ...props
}: GameButtonProps) => {
  const baseStyles = "relative flex items-center justify-center font-display font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none z-10";
  
  const variants = {
    default: "bg-white text-slate-700 border-2 border-slate-200 border-b-4 border-b-slate-300 hover:bg-slate-50 active:border-b-2 active:translate-y-[2px]",
    primary: "bg-blue-400 text-white border-2 border-blue-500 border-b-4 border-b-blue-700 hover:bg-blue-500 active:border-b-2 active:translate-y-[2px] shadow-blue-200",
    success: "bg-green-500 text-white border-2 border-green-600 border-b-4 border-b-green-800 hover:bg-green-600 active:border-b-2 active:translate-y-[2px] shadow-green-200",
    warning: "bg-yellow-400 text-white border-2 border-yellow-500 border-b-4 border-b-yellow-700 hover:bg-yellow-500 active:border-b-2 active:translate-y-[2px] shadow-yellow-200",
    danger: "bg-red-500 text-white border-2 border-red-600 border-b-4 border-b-red-800 hover:bg-red-600 active:border-b-2 active:translate-y-[2px] shadow-red-200",
    neutral: "bg-slate-200 text-slate-600 border-2 border-slate-300 border-b-4 border-b-slate-400 hover:bg-slate-300 active:border-b-2 active:translate-y-[2px]",
    glass: "bg-white/20 backdrop-blur-md text-white border border-white/40 hover:bg-white/30 active:scale-95 shadow-sm rounded-full",
    accent: "bg-purple-500 text-white border-2 border-purple-600 border-b-4 border-b-purple-800 hover:bg-purple-600 active:border-b-2 active:translate-y-[2px]"
  };

  const sizes = {
    sm: "w-9 h-9 rounded-lg text-sm",
    md: "w-14 h-14 rounded-2xl text-base",
    lg: "w-16 h-16 rounded-2xl text-lg",
    xl: "w-20 h-20 rounded-3xl text-xl",
  };

  return (
    <motion.button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      whileTap={{ scale: 0.9 }}
      aria-label={label}
      title={label}
      {...props}
    >
      {/* Glossy highlight effect for non-glass/default buttons */}
      {!['glass', 'default', 'neutral'].includes(variant) && (
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-[inherit] pointer-events-none" />
      )}
      
      {icon && <span className={cn("relative z-10", children ? "mr-2" : "")}>{icon}</span>}
      {children && <span className="relative z-10">{children}</span>}
    </motion.button>
  );
};
