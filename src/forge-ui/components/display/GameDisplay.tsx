
import React from 'react';
import { useForge } from '../../context';
import { Loader2, Star, Plus } from 'lucide-react';

interface GameBadgeProps {
  label: string;
  variant?: 'neutral' | 'accent' | 'outline' | 'danger' | 'success';
}
export const GameBadge: React.FC<GameBadgeProps> = ({ label, variant = 'neutral' }) => {
  const { theme } = useForge();
  const style = theme.components.badge.variants[variant] || theme.components.badge.variants.neutral;
  
  let dynamicStyle = '';
  if (variant === 'accent') dynamicStyle = `!${theme.colors.accent} !text-white border-none`;
  if (variant === 'danger') dynamicStyle = `!${theme.colors.danger} !text-white border-none`;
  if (variant === 'success') dynamicStyle = `!${theme.colors.success} !text-white border-none`;

  return <span className={`${theme.components.badge.base} ${style} ${dynamicStyle}`}>{label}</span>;
};

export const GameTooltip: React.FC<{ children: React.ReactNode, content: string }> = ({ children, content }) => {
    const { theme } = useForge();
    return (
        <div className="relative group flex items-center justify-center">
            {children}
            <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap ${theme.components.tooltip}`}>
                {content}
            </div>
        </div>
    )
}

export const GameDivider: React.FC = () => {
  const { theme } = useForge();
  return <div className={theme.components.divider} />;
};

export const GamePanel: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className = '' }) => {
  const { theme } = useForge();
  return <div className={`${theme.components.panel} ${className}`}>{children}</div>;
};

export const GameSpinner: React.FC = () => {
  const { theme } = useForge();
  return <div className={theme.components.spinner} />;
};

interface GameItemSlotProps {
  image?: string;
  count?: number;
  quality?: 'common' | 'rare' | 'epic';
  onClick?: () => void;
}
export const GameItemSlot: React.FC<GameItemSlotProps> = ({ image, count, quality = 'common', onClick }) => {
  const { theme } = useForge();
  const qualityColor = quality === 'epic' ? theme.colors.primary : quality === 'rare' ? theme.colors.success : 'transparent';

  return (
    <div onClick={onClick} className={`${theme.components.itemSlot} relative group cursor-pointer`}>
      {image && <img src={image} alt="item" className="w-3/4 h-3/4 object-contain transition-transform group-hover:scale-110" />}
      {count && (
        <span className={`absolute bottom-1 right-1 text-[10px] font-bold px-1 rounded-sm bg-black/50 text-white ${theme.typography.bodyFont}`}>
          {count}
        </span>
      )}
      {quality !== 'common' && (
         <div className={`absolute inset-0 border-2 opacity-50 rounded-inherit pointer-events-none`} style={{ borderColor: qualityColor.replace('bg-', '')}} />
      )}
    </div>
  );
};

export const GameStatRow: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({ label, value, icon }) => {
  const { theme } = useForge();
  return (
    <div className={theme.components.statRow}>
       <div className="flex items-center gap-2">
         {icon && <span className="opacity-70">{icon}</span>}
         <span className={theme.colors.muted}>{label}</span>
       </div>
       <span className={`font-bold ${theme.colors.text}`}>{value}</span>
    </div>
  );
};

export const GameToast: React.FC<{ title: string; message: string; type?: 'info' | 'success' }> = ({ title, message, type = 'info' }) => {
    const { theme } = useForge();
    const borderClass = type === 'success' ? `!border-${theme.colors.success.replace('bg-', '')}` : `!border-${theme.colors.primary.replace('bg-', '')}`;
    return (
        <div className={`${theme.components.toast} ${borderClass}`}>
            <div className={`w-2 h-8 rounded-full ${type === 'success' ? `!${theme.colors.success}` : `!${theme.colors.primary}`}`}></div>
            <div>
                <h4 className={`font-bold text-sm leading-none`}>{title}</h4>
                <p className={`text-xs opacity-80 mt-1`}>{message}</p>
            </div>
        </div>
    )
}

export const GameAvatar: React.FC<{ src: string, size?: 'sm' | 'md' | 'lg', status?: 'online' | 'offline' | 'busy' }> = ({ src, size = 'md', status }) => {
    const { theme } = useForge();
    const sizeClasses = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-20 h-20' };
    return (
        <div className={`relative inline-block`}>
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 ${theme.colors.border} bg-black/10`}>
                <img src={src} alt="avatar" className="w-full h-full object-cover" />
            </div>
            {status && (
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${status === 'online' ? 'bg-green-500' : status === 'busy' ? 'bg-red-500' : 'bg-gray-400'}`} />
            )}
        </div>
    )
}

export const CurrencyBar: React.FC<{ amount: number, icon: React.ReactNode, type?: 'gold' | 'gem', onAdd?: () => void }> = ({ amount, icon, type = 'gold', onAdd }) => {
    const { theme } = useForge();
    const iconBg = type === 'gold' ? `!${theme.colors.warning}` : `!${theme.colors.accent}`;
    return (
        <div className={`flex items-center gap-2 ${theme.components.panel} !p-1 !pr-4 !rounded-full relative group cursor-pointer hover:scale-105 transition-transform`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm z-10 ${iconBg}`}>
                 {icon}
             </div>
             <span className={`font-bold text-sm ${theme.colors.text}`}>{amount.toLocaleString()}</span>
             {onAdd && (
                 <div onClick={(e) => { e.stopPropagation(); onAdd(); }} className={`absolute -right-2 top-1/2 -translate-y-1/2 w-5 h-5 !${theme.colors.success} rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity`}>
                     <Plus size={12} strokeWidth={4} />
                 </div>
             )}
        </div>
    );
};

export const LevelNode: React.FC<{ status: 'locked' | 'current' | 'completed', level: number, stars?: number }> = ({ status, level, stars = 0 }) => {
    const { theme, isAlive } = useForge();
    const baseStyle = "w-12 h-12 flex items-center justify-center rounded-full font-bold border-4 transition-transform duration-300 relative";
    
    let stateStyle = "";
    if (status === 'locked') stateStyle = `${theme.colors.muted} bg-black/5 border-black/10`;
    if (status === 'current') stateStyle = `!${theme.colors.primary} text-white ${theme.colors.border} scale-110 shadow-lg ${isAlive ? 'animate-bounce-small' : ''}`;
    if (status === 'completed') stateStyle = `!${theme.colors.success} text-white ${theme.colors.border}`;

    return (
        <div className={baseStyle + " " + stateStyle}>
            {status === 'locked' ? <span className="opacity-50 text-xs">Locked</span> : level}
            {(status === 'completed' || stars > 0) && (
                <div className="absolute -bottom-2 flex gap-0.5">
                    {[1,2,3].map(i => <Star key={i} size={8} className={`${i <= stars ? 'fill-yellow-400 text-yellow-600' : 'text-black/20'}`} />)}
                </div>
            )}
        </div>
    )
}

export const StarRating: React.FC<{ stars: number, max?: number }> = ({ stars, max = 3 }) => {
    const { isAlive } = useForge();
    return (
        <div className="flex gap-1 justify-center">
            {[...Array(max)].map((_, i) => (
                <Star 
                    key={i} 
                    className={`w-8 h-8 transition-all duration-500 ${i < stars ? 'fill-yellow-400 text-yellow-600 scale-100' : 'text-black/20 scale-75'} ${isAlive && i < stars ? 'animate-pop' : ''}`} 
                    strokeWidth={2}
                />
            ))}
        </div>
    );
}

export const RewardCard: React.FC<{ label: string, amount: string, icon: React.ReactNode }> = ({ label, amount, icon }) => {
    const { theme } = useForge();
    return (
        <div className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 ${theme.colors.border} bg-white/50 gap-2 min-w-[100px]`}>
            <div className={`p-3 rounded-full !${theme.colors.primary} text-white shadow-sm`}>
                {icon}
            </div>
            <span className={`text-xs uppercase font-bold ${theme.colors.muted}`}>{label}</span>
            <span className={`text-lg font-bold ${theme.colors.text}`}>{amount}</span>
        </div>
    );
};
