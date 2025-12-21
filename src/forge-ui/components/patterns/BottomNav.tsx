
import React from 'react';
import { BottomNavProps } from '../../types';
import { useForge } from '../../context';
import { Home, Swords, Backpack, Map as MapIcon, Settings, Play } from 'lucide-react';

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, variant = 'flat', items }) => {
  const { theme, isAlive } = useForge();
  const styles = theme.components.bottomNav;
 
  const tabs =
    items && items.length
      ? items
      : [
          { key: 'home', icon: Home, label: 'Home' },
          { key: 'quest', icon: Swords, label: 'Quest' },
          { key: 'play', icon: variant === 'center' ? Play : Backpack, label: variant === 'center' ? 'Play' : 'Inv' },
          { key: 'map', icon: MapIcon, label: 'Map' },
          { key: 'menu', icon: Settings, label: 'Menu' },
        ];

  let containerLayout = '';
  switch (variant) {
      case 'floating': containerLayout = 'mx-4 mb-4 rounded-full shadow-xl relative min-h-[60px] flex items-center px-2'; break;
      case 'bubbles': containerLayout = '!bg-transparent !border-none !shadow-none px-4 mb-2 gap-2 flex justify-between min-h-[60px] items-end'; break;
      // Center variant: iOS-style with elevated center button
      case 'center': containerLayout = 'relative overflow-visible pb-2 pt-2'; break;
      case 'flat': default: containerLayout = 'w-full pb-safe pt-2 relative min-h-[60px]'; break;
  }

  const finalContainerClass = `${styles.container} ${containerLayout}`;

  // Extract primary color classes
  const primaryBg = theme.colors.primary || 'bg-indigo-500';
  const primaryText = primaryBg.replace('bg-', 'text-');

  // Determine if primary color is light (for center button text contrast)
  const isLightPrimary =
    /-(50|100|200|300|400)\b/.test(primaryBg) ||
    /(yellow|amber|lime|sky|cyan)\b/.test(primaryBg);

  return (
    <div className={finalContainerClass}>
      {/* Top indicator line (hidden for center variant) */}
      {variant !== 'bubbles' && variant !== 'center' && styles.indicator && (
           <div 
           className={`${styles.indicator} ${primaryBg}`} 
           style={{ 
               width: `${100/tabs.length}%`, 
               left: `${activeTab * (100/tabs.length)}%`,
           }}
        />
      )}

      <div className={`flex items-end justify-between w-full px-2 ${variant === 'bubbles' ? 'gap-2' : ''}`}>
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === index;
          const isCenter = variant === 'center' && index === 2;

          let activeThemeClass = isActive ? `${styles.itemActive} ${primaryText}` : styles.itemInactive;
          let structureClass = styles.item;
          
          if (variant === 'bubbles') {
              structureClass = `rounded-full aspect-square flex flex-col items-center justify-center transition-all duration-300 ${isActive ? `${theme.colors.background} shadow-md scale-110` : 'bg-black/5'}`;
              if (isActive) activeThemeClass = primaryText;
          }

          if (isCenter) {
              // Elevated center FAB: larger circle that sits higher than other tabs
              const centerBg = isActive ? primaryBg : 'bg-white';
              const centerText = isActive 
                ? (isLightPrimary ? 'text-slate-900' : 'text-white')
                : 'text-slate-600';
              const centerShadow = isActive ? 'shadow-2xl' : 'shadow-lg';
              const centerRing = isActive ? 'ring-4 ring-white' : 'ring-2 ring-slate-200';
              
              structureClass = `
                flex flex-col items-center justify-center
                w-16 h-16 rounded-full
                ${centerBg}
                ${centerText}
                ${centerShadow}
                ${centerRing}
                -translate-y-4
                transition-all duration-300
                active:scale-95
                hover:scale-105
              `.replace(/\s+/g, ' ').trim();
              activeThemeClass = '';
          }

          return (
            <button 
                key={tab.key ?? index}
                onClick={() => onTabChange(index)}
                className={`
                    ${structureClass} 
                    ${activeThemeClass}
                    ${isCenter ? 'z-30' : 'flex-1 relative group py-2 flex flex-col items-center justify-center'}
                    ${isAlive && isActive && !isCenter ? 'animate-pulse-slow' : ''}
                `}
                aria-label={tab.label}
                title={tab.label}
            >
              <Icon 
                size={isCenter ? 28 : 24} 
                strokeWidth={isCenter ? 2.5 : 2}
                className={`
                    ${isCenter ? '' : 'mb-0.5'} 
                    transition-transform duration-300 
                    ${isActive && !isCenter ? 'scale-110' : !isCenter ? 'group-hover:scale-110' : ''}
                `}
              />
              
              {!isCenter && (
                  <span className={`text-[10px] font-semibold leading-tight transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                      {tab.label}
                  </span>
              )}
              {!!tab.badge && tab.badge > 0 && !isCenter && (
                <span
                  className="absolute top-1 right-0 min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md"
                >
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
              {variant === 'bubbles' && isActive && (
                  <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${primaryBg}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
