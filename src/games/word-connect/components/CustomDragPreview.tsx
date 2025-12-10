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
        opacity: 0.95,
      }}
    >
      {/* Shadow/Depth Layer */}
      <div className={`
        absolute inset-0 
        rounded-xl sm:rounded-2xl 
        translate-y-[4px] sm:translate-y-[5px]
        ${draggedWord.isMergedGroup ? 'bg-purple-300' : 'bg-slate-300'}
      `}></div>

      {/* Main Tile Face */}
      <div className={`
        absolute inset-0 
        rounded-xl sm:rounded-2xl 
        flex items-center justify-center 
        px-1.5 sm:px-2
        text-center
        border-2
        ${draggedWord.isMergedGroup 
          ? 'bg-gradient-to-b from-purple-50 to-purple-100 border-purple-200 text-purple-700' 
          : 'bg-gradient-to-b from-white to-slate-50 border-white text-slate-700'
        }
        shadow-2xl
      `}>
        {/* Inner shine */}
        <div className="absolute inset-x-2 top-1 h-1/3 bg-gradient-to-b from-white/60 to-transparent rounded-t-lg pointer-events-none"></div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center gap-0.5 z-10">
          {hasLibraryIcon && IconComponent && (
            <IconComponent 
              className={`w-5 h-5 sm:w-6 sm:h-6 ${draggedWord.isMergedGroup ? 'text-purple-600' : 'text-slate-600'}`}
              strokeWidth={2.5}
            />
          )}
          
          {hasEmoji && (
            <span className="text-lg sm:text-xl drop-shadow-sm filter">{draggedWord.icon!.emoji}</span>
          )}
          
          {showFallbackIcon && (
            <span className="text-lg sm:text-xl font-bold drop-shadow-sm filter">*</span>
          )}
          
          <span className={`
            text-xs sm:text-sm font-bold leading-tight break-words
            drop-shadow-sm
            ${draggedWord.isMergedGroup ? 'text-purple-800' : 'text-slate-700'}
          `}>
            {displayText}
          </span>
        </div>
      </div>
    </div>
  );

  return createPortal(preview, document.body);
};

