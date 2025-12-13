import React from 'react';
import { useDragContext } from '@/contexts/DragContext';
import { getIcon } from '@/shared/utils/iconMapper';
import { createPortal } from 'react-dom';

export const CustomDragPreview: React.FC = () => {
  const { dragState } = useDragContext();

  if (!dragState.isDragging || !dragState.draggedWord) {
    return null;
  }

  const { draggedWord, currentPosition, dragOffset, previewSize } = dragState;
  
  // Calculate position - subtract offset so cursor is at the original click point
  const left = currentPosition.x - dragOffset.x;
  const top = currentPosition.y - dragOffset.y;
  
  const iconName = draggedWord.icon?.iconName;
  const IconComponent = iconName ? getIcon(iconName) : null;
  
  const hasIcon = draggedWord.icon && (draggedWord.icon.type === 'library' || draggedWord.icon.type === 'emoji');
  const hasEmoji = hasIcon && draggedWord.icon.type === 'emoji' && draggedWord.icon.emoji;
  const hasLibraryIcon = hasIcon && draggedWord.icon.type === 'library' && IconComponent;
  const showFallbackIcon = hasIcon && !hasEmoji && !hasLibraryIcon;
  const displayText = draggedWord.icon?.label || draggedWord.text;

  const preview = (
    <div
      style={{
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        width: `${previewSize.width}px`,
        height: `${previewSize.height}px`,
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'scale(1.05)',
      }}
    >
      {/* Main Tile Face - Matches GridWordTile */}
      <div className={`
        absolute inset-0 
        rounded-2xl
        flex items-center justify-center 
        px-2
        text-center
        ${draggedWord.isMergedGroup 
          ? 'bg-purple-50 border border-purple-100' 
          : 'bg-[var(--color-climate-tile)] border border-transparent'
        }
        shadow-[var(--shadow-climate-hover)]
      `}>
        {/* Content */}
        <div className="flex flex-col items-center justify-center gap-0.5 z-10">
          {hasLibraryIcon && IconComponent && (
            <IconComponent 
              className={`w-6 h-6 ${draggedWord.isMergedGroup ? 'text-purple-700/70' : 'text-slate-500/70'}`}
              strokeWidth={2}
            />
          )}
          
          {hasEmoji && (
            <span className="text-xl filter grayscale-[0.3]">{draggedWord.icon!.emoji}</span>
          )}
          
          {showFallbackIcon && (
            <span className="text-xl font-bold text-slate-400">*</span>
          )}
          
          <span className={`
            text-sm font-medium leading-tight break-words
            ${draggedWord.isMergedGroup ? 'text-purple-900' : 'text-[var(--color-climate-text-primary)]'}
          `}>
            {displayText}
          </span>
        </div>
      </div>
    </div>
  );

  return createPortal(preview, document.body);
};

