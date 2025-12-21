
import React from 'react';
import { CardProps } from '../../types';
import GameButton from '../primitives/GameButton';
import { useForge } from '../../context';
import { Sparkles } from 'lucide-react';

const GameCard: React.FC<CardProps> = ({ 
    title, description, imageUrl, price, onAction, actionLabel = "Equip", rarity = 'common'
}) => {
    const { theme, isAlive } = useForge();
    const styles = theme.components.card;
    const alivenessClass = isAlive ? 'animate-float hover:scale-105 transition-transform duration-300' : '';

  return (
    <div className={`w-64 flex-shrink-0 ${styles.container} ${alivenessClass}`}>
      {styles.rarityOverlay && styles.rarityOverlay(rarity) && (
          <div className={styles.rarityOverlay(rarity)} />
      )}
      <div className={`w-full aspect-square relative ${styles.imageWrapper}`}>
         <img 
            src={imageUrl || "https://picsum.photos/200"} 
            alt={title} 
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${theme.id === 'pixel' ? 'image-rendering-pixelated' : ''}`} 
         />
         {isAlive && rarity === 'legendary' && (
             <div className="absolute top-2 right-2 animate-pulse">
                <Sparkles className="text-yellow-400 fill-yellow-400" size={24} />
             </div>
         )}
         {isAlive && theme.id === 'scifi' && (
             <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-50 animate-pulse"></div>
         )}
      </div>

      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex justify-between items-start">
            <h3 className={`${styles.header}`}>
                {title}
            </h3>
            {price && (
                <span className={`font-bold text-xs px-2 py-0.5 rounded-full ${theme.components.badge.variants.accent}`}>
                    {price}
                </span>
            )}
        </div>
        <p className={`${styles.body} h-10 line-clamp-2`}>
            {description}
        </p>

        <div className="mt-2">
            <GameButton 
                theme={theme.id}
                variant="primary" 
                label={actionLabel} 
                fullWidth 
                onClick={onAction}
            />
        </div>
      </div>
    </div>
  );
};

export default GameCard;
