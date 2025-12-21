
import React from 'react';
import { ButtonProps } from '../../types';
import { useForge } from '../../context';

const GameButton: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  label, 
  icon, 
  theme: propTheme, 
  className = '', 
  fullWidth = false,
  ...props 
}) => {
  const { theme, isAlive } = useForge();
  
  const variantStyle = theme.components.button.variants[variant] || theme.components.button.variants.primary;
  const baseStyle = theme.components.button.base;
  const sizeStyle = variant === 'icon' ? '' : (fullWidth ? 'w-full py-3' : theme.components.button.sizes.md);

  let dynamicColorClass = '';
  
  if (['primary', 'secondary', 'danger'].includes(variant)) {
      const colorToken = theme.colors[variant as keyof typeof theme.colors];
      
      if (colorToken) {
          dynamicColorClass = `!${colorToken}`;
          dynamicColorClass += ' !bg-none';
          const match = colorToken.match(/bg-([a-z]+)-(\d+)/);
          
          if (match) {
              const [_, colorName, shadeStr] = match;
              const shade = parseInt(shadeStr);
              
              if (['casual', 'playful', 'comic', 'nature', 'bubble', 'paper', 'sketch', 'clay'].includes(theme.id)) {
                  let borderShade = shade + 200;
                  if (borderShade > 900) borderShade = 950;
                  dynamicColorClass += ` !border-${colorName}-${borderShade}`;
                  if (theme.id === 'playful' || theme.id === 'comic') {
                      dynamicColorClass += ' !shadow-sm';
                  }
              } else if (['scifi', 'horror'].includes(theme.id)) {
                  let borderShade = Math.max(400, shade - 400);
                  dynamicColorClass += ` !border-${colorName}-${borderShade}`;
              }
          } else {
             if (theme.id === 'scifi') {
                 dynamicColorClass += ` !border-opacity-50 !border-${colorToken.replace('bg-', '')}`; 
             }
          }
      }
      dynamicColorClass += ' hover:brightness-110 hover:contrast-125';
  }

  const alivenessClass = isAlive ? `
    hover:scale-105 active:scale-95 transition-transform duration-200 
    ${variant === 'primary' ? 'animate-pulse-slow hover:animate-none' : ''}
    ${variant === 'icon' ? 'hover:rotate-12' : ''}
  ` : '';

  return (
    <button className={`${baseStyle} ${variantStyle} ${sizeStyle} ${dynamicColorClass} ${alivenessClass} ${className}`} {...props}>
      {theme.id === 'casual' && variant !== 'icon' && (
        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-lg pointer-events-none"></div>
      )}
      {theme.id === 'scifi' && (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
      )}
      <span className="relative z-10 flex items-center gap-2 justify-center">
        {icon}
        {label}
      </span>
    </button>
  );
};

export default GameButton;
