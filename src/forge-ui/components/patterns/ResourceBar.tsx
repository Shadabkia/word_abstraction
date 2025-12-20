
import React from 'react';
import { ProgressBarProps } from '../../types';
import { useForge } from '../../context';
import { Heart, Zap } from 'lucide-react';

const ResourceBar: React.FC<ProgressBarProps & { icon?: 'heart' | 'zap' }> = ({ 
    value, max, color, label, icon
}) => {
    const { theme } = useForge();
    const styles = theme.components.progressBar;
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const fillColorClass = color || (icon === 'heart' ? `!${theme.colors.danger}` : `!${theme.colors.primary}`);

    return (
        <div className="w-full flex items-center gap-3">
            {icon && (
                <div className={`flex-shrink-0 ${icon === 'heart' ? theme.colors.danger.replace('bg-', 'text-') : theme.colors.primary.replace('bg-', 'text-')}`}>
                    {icon === 'heart' ? <Heart fill="currentColor" size={24} /> : <Zap fill="currentColor" size={24} />}
                </div>
            )}
            
            <div className="flex-grow">
                {label && (
                    <div className={styles.label}>
                        <span>{label}</span>
                        <span>{value}/{max}</span>
                    </div>
                )}

                <div className={styles.container}>
                    <div 
                        className={`${styles.bar} ${fillColorClass}`} 
                        style={{ width: `${percentage}%`, transition: 'width 0.5s ease-out' }}
                    >
                        {(theme.id === 'casual' || theme.id === 'scifi') && (
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-shine" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceBar;
