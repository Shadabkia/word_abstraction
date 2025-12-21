
import React from 'react';
import { useForge } from '../../context';

interface GameTabsProps {
  items: { label: string; icon?: React.ReactNode; id: string }[];
  activeId: string;
  onChange: (id: string) => void;
  orientation?: 'horizontal' | 'vertical' | 'bottom';
}

const GameTabs: React.FC<GameTabsProps> = ({ items, activeId, onChange, orientation = 'horizontal' }) => {
  const { theme, isAlive } = useForge();

  const containerStyle = orientation === 'vertical' 
    ? 'flex flex-col gap-2 w-full md:w-48' 
    : orientation === 'bottom'
    ? 'flex justify-between items-center w-full px-2'
    : 'flex gap-2 w-full overflow-x-auto'; 

  const getTabStyle = (isActive: boolean) => {
    const activeColor = theme.colors.primary;
    const activeText = 'text-white'; 
    const inactiveText = theme.colors.muted;
    const hoverBg = 'hover:bg-black/5';

    let shape = 'rounded-lg';
    if (theme.id === 'casual' || theme.id === 'bubble') shape = 'rounded-full';
    if (theme.id === 'scifi') shape = 'skew-x-[-10deg] border border-transparent';
    if (theme.id === 'fantasy') shape = 'rounded-t-lg border-b-2 border-transparent';
    if (theme.id === 'pixel') shape = 'rounded-none border-2 border-transparent';

    const activeClass = isActive 
      ? `${activeColor} ${activeText} shadow-md ${theme.id === 'scifi' ? 'border-cyan-400' : ''}` 
      : `${inactiveText} ${hoverBg}`;

    const sizing = orientation === 'vertical' 
        ? 'w-full text-left px-4 py-3' 
        : orientation === 'bottom'
        ? 'flex-1 flex-col py-2 px-1 text-xs'
        : 'flex-1 py-2 px-4 text-center whitespace-nowrap';

    const animation = isAlive && isActive ? 'animate-pulse' : '';
    const hoverAnim = isAlive ? 'hover:scale-[1.02] transition-transform' : '';

    return `${shape} ${activeClass} ${sizing} ${animation} ${hoverAnim} font-bold cursor-pointer flex items-center justify-center gap-2 select-none transition-all duration-200`;
  };

  return (
    <div className={`${containerStyle} ${theme.id === 'pixel' ? 'gap-0' : ''}`}>
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <div
            key={item.id}
            onClick={() => onChange(item.id)}
            className={getTabStyle(isActive)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default GameTabs;
