
import React from 'react';
import { ModalProps } from '../../types';
import GameButton from '../primitives/GameButton';
import { useForge } from '../../context';
import { X } from 'lucide-react';

const GameDialog: React.FC<ModalProps> = ({ isOpen, onClose, title, children, type = 'info' }) => {
  const { theme, isAlive } = useForge();
  const styles = theme.components.dialog;

  if (!isOpen) return null;
  const animationClass = isAlive ? 'animate-pop' : '';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn ${styles.overlay}`}>
      <div className={`w-full max-w-md ${animationClass} relative ${styles.container}`}>
        <div className="absolute top-4 right-4 z-20">
             <button onClick={onClose} className={styles.closeButton}>
                <X size={24} />
             </button>
        </div>
        {theme.id === 'fantasy' && (
            <>
                <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-amber-500 rounded-tl-lg" />
                <div className="absolute -top-3 -right-3 w-8 h-8 border-t-4 border-r-4 border-amber-500 rounded-tr-lg" />
            </>
        )}
        <h2 className={styles.header}>{title}</h2>
        <div className={styles.body}>
          {children}
        </div>
        <div className="flex gap-3 justify-center">
            <GameButton theme={theme.id} variant="secondary" label="Cancel" onClick={onClose} />
            <GameButton theme={theme.id} variant={type === 'danger' ? 'danger' : 'primary'} label="Confirm" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default GameDialog;
