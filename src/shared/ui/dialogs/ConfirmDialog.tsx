import { useForge } from '@/forge-ui/context';
import GameButton from '@/forge-ui/components/primitives/GameButton';
import { X, AlertTriangle } from 'lucide-react';

export type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmVariant?: 'default' | 'destructive';
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirmVariant = 'default',
}: ConfirmDialogProps) {
  const { theme, isAlive } = useForge();
  const styles = theme.components.dialog;

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
      onCancel?.();
    }
  };

  const animationClass = isAlive ? 'animate-pop' : '';

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn ${styles.overlay}`}
      onClick={handleBackdropClick}
    >
      <div className={`w-full max-w-md ${animationClass} relative ${styles.container}`}>
        {/* Close button */}
        <button 
          onClick={() => {
            onOpenChange(false);
            onCancel?.();
          }} 
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

        {/* Icon for destructive variant */}
        {confirmVariant === 'destructive' && (
          <div className="mb-4 flex justify-center">
            <div className={`p-3 rounded-full ${theme.colors.danger} bg-opacity-10`}>
              <AlertTriangle className={`w-8 h-8 ${theme.colors.danger.replace('bg-', 'text-')}`} />
            </div>
          </div>
        )}

        {/* Title */}
        <h2 className={styles.header}>{title}</h2>

        {/* Description */}
        {description && (
          <div className={styles.body}>
            <p className="leading-relaxed">{description}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center mt-6">
          <GameButton 
            variant="secondary" 
            label={cancelLabel} 
            onClick={() => {
              onOpenChange(false);
              onCancel?.();
            }}
            className="flex-1"
          />
          <GameButton 
            variant={confirmVariant === 'destructive' ? 'danger' : 'primary'} 
            label={confirmLabel} 
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}


