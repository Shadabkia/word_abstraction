
import React from 'react';
import { BottomNavProps } from '../../types';
import { useForge } from '../../context';
import { Home, Swords, Backpack, Map as MapIcon, Settings, Play } from 'lucide-react';

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, variant = 'flat' }) => {
  const { theme, isAlive } = useForge();
  const styles = theme.components.bottomNav;
  
  const tabs = [
    { icon: Home, label: 'Home' },
    { icon: Swords, label: 'Quest' },
    { icon: variant === 'center' ? Play : Backpack, label: variant === 'center' ? 'Play' : 'Inv' },
    { icon: MapIcon, label: 'Map' },
    { icon: Settings, label: 'Menu' },
  ];

  let containerLayout = '';
  switch (variant) {
      case 'floating': containerLayout = 'mx-4 mb-4 rounded-full shadow-xl relative min-h-[60px] flex items-center px-2'; break;
      case 'bubbles': containerLayout = '!bg-transparent !border-none !shadow-none px-4 mb-2 gap-2 flex justify-between min-h-[60px] items-end'; break;
      case 'center': containerLayout = 'pb-safe pt-2 relative overflow-visible min-h-[64px]'; break;
      case 'flat': default: containerLayout = 'w-full pb-safe pt-2 relative min-h-[60px]'; break;
  }

  const finalContainerClass = `${styles.container} ${containerLayout}`;

  return (
    <div className={finalContainerClass}>
      {variant !== 'bubbles' && styles.indicator && (
           <div 
           className={`${styles.indicator} !${theme.colors.primary}`} 
           style={{ 
               width: `${100/tabs.length}%`, 
               left: `${activeTab * (100/tabs.length)}%`,
           }}
        />
      )}

      <div className={`flex items-center justify-between w-full h-full ${variant === 'bubbles' ? 'gap-2' : ''}`}>
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === index;
          const isCenter = variant === 'center' && index === 2;
          
          let activeThemeClass = isActive ? `${styles.itemActive} !${theme.colors.primary.replace('bg-', 'text-')}` : styles.itemInactive;
          let structureClass = styles.item;
          
          if (variant === 'bubbles') {
              structureClass = `rounded-full aspect-square flex flex-col items-center justify-center transition-all duration-300 ${isActive ? `${theme.colors.background} shadow-md scale-110` : 'bg-black/5'}`;
              if (isActive) activeThemeClass = `${theme.colors.primary.replace('bg-', 'text-')}`;
          }

          if (isCenter) {
              structureClass += ` !h-16 !w-16 -mt-8 rounded-full !${theme.colors.primary} !text-white !opacity-100 shadow-lg border-4 ${theme.colors.border} z-20 flex items-center justify-center`;
              activeThemeClass = ''; 
          }

          return (
            <button 
                key={index}
                onClick={() => onTabChange(index)}
                className={`
                    ${structureClass} 
                    ${activeThemeClass}
                    relative group py-1
                    ${isAlive && isActive && !isCenter ? 'animate-pulse-slow' : ''}
                    ${isAlive && isCenter ? 'animate-bounce-small' : ''}
                `}
            >
              <Icon 
                size={isCenter ? 32 : 24} 
                className={`
                    ${isCenter ? '' : 'mb-1'} 
                    transition-transform duration-300 
                    ${isActive && !isCenter ? 'scale-110' : 'group-hover:scale-110'}
                `}
              />
              
              {!isCenter && (
                  <span className={`text-[10px] font-bold transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                      {tab.label}
                  </span>
              )}
              {variant === 'bubbles' && isActive && (
                  <div className={`absolute -bottom-1 w-1 h-1 rounded-full !${theme.colors.primary}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
