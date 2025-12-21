import { useEffect, useRef } from 'react';
import { useForge } from '@/forge-ui/context';
import GameButton from '@/forge-ui/components/primitives/GameButton';
import { Sparkles, X } from 'lucide-react';

export type CelebrationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
  onCelebrate?: () => void;
  icon?: React.ReactNode;
};

export function CelebrationDialog({
  open,
  onOpenChange,
  title,
  description,
  primaryLabel = 'Continue',
  secondaryLabel,
  onPrimary,
  onSecondary,
  onCelebrate,
  icon,
}: CelebrationDialogProps) {
  const { theme, isAlive } = useForge();
  const styles = theme.components.dialog;
  const celebratedForThisOpen = useRef(false);

  useEffect(() => {
    if (!open) {
      celebratedForThisOpen.current = false;
      return;
    }
    if (celebratedForThisOpen.current) return;
    celebratedForThisOpen.current = true;
    onCelebrate?.();
  }, [open, onCelebrate]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  const animationClass = isAlive ? 'animate-pop' : '';
  const successBg = theme.colors.success || 'bg-green-500';
  const successText = successBg.replace('bg-', 'text-');

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn ${styles.overlay}`}
      onClick={handleBackdropClick}
    >
      <div className={`w-full max-w-md ${animationClass} relative ${styles.container}`}>
        {/* Close button */}
        <button 
          onClick={() => onOpenChange(false)} 
          className={`absolute top-4 right-4 z-20 ${styles.closeButton}`}
        >
          <X size={20} />
        </button>

        {/* Theme-specific decorations */}
        {theme.id === 'fantasy' && (
          <>
            <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-amber-500 rounded-tl-lg" />
            <div className="absolute -top-3 -right-3 w-8 h-8 border-t-4 border-r-4 border-amber-500 rounded-tr-lg" />
          </>
        )}

        {/* Celebration icon with sparkle effect */}
        <div className="mb-6 flex justify-center relative">
          <div className={`p-4 rounded-2xl ${theme.colors.background} shadow-lg ring-2 ${theme.colors.border} relative overflow-visible`}>
            <div className="text-4xl">{icon ?? '🎉'}</div>
            {isAlive && (
              <>
                <Sparkles className={`absolute -top-2 -right-2 w-5 h-5 ${successText} animate-pulse`} />
                <Sparkles className={`absolute -bottom-1 -left-2 w-4 h-4 ${successText} animate-pulse`} style={{ animationDelay: '0.5s' }} />
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className={`${styles.header} text-center`}>{title}</h2>

        {/* Description */}
        {description && (
          <div className={`${styles.body} text-center`}>
            <p className="leading-relaxed">{description}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-6">
          <GameButton 
            variant="primary" 
            label={primaryLabel} 
            onClick={() => {
              onPrimary();
              onOpenChange(false);
            }}
            fullWidth
          />
          {secondaryLabel && (
            <GameButton 
              variant="ghost" 
              label={secondaryLabel} 
              onClick={() => {
                onSecondary?.();
                onOpenChange(false);
              }}
              fullWidth
            />
          )}
        </div>
      </div>
    </div>
  );
}


