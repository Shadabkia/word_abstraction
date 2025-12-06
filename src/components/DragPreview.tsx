import * as React from "react";
import { useDragLayer, XYCoord } from "react-dnd";
import { getIcon } from '@/utils/iconMapper';

interface Word {
  id: string;
  text: string;
  category: string;
  icon?: {
    id: string;
    type?: 'library' | 'emoji';
    label?: string;
    emoji?: string;
    iconName?: string;
  };
  isMergedGroup?: boolean;
  // injected on drag start
  __previewWidth?: number;
  __previewHeight?: number;
  __offsetX?: number;
  __offsetY?: number;
  __rowIndex?: number;
}

function getItemStyles(currentOffset: XYCoord | null, offsetX: number = 0, offsetY: number = 0, rowIndex: number = 0): React.CSSProperties {
  if (!currentOffset) {
    return { display: "none" };
  }
  const { x, y } = currentOffset;
  
  // Calculate dynamic upward offset based on row index
  // Row 0: 30px, Row 1: 37px, Row 2: 47px, ... Row 5: 65px
  const upwardOffset = 30 + (rowIndex * 7);  
   
  const transform = `translate(${x - offsetX}px, ${y - offsetY - upwardOffset}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

export function DragPreview() {
  // FIX: Cache the item to prevent mid-drag updates
  const itemRef = React.useRef<Word | null>(null);
  
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => {
    const currentItem = monitor.getItem() as Word | null;
    // Freeze item data when drag starts
    if (monitor.isDragging() && currentItem && !itemRef.current) {
      itemRef.current = currentItem;
    }
    // Clear cache when drag ends
    if (!monitor.isDragging()) {
      itemRef.current = null;
    }
    
    return {
      isDragging: monitor.isDragging(),
      item: itemRef.current || currentItem,
      // Use the actual pointer position so we can center the preview under the finger/cursor
      currentOffset: monitor.getClientOffset(),
    };
  });

  if (!isDragging || !item) {
    return null;
  }

  const width = item.__previewWidth;
  const height = item.__previewHeight;
  const offsetX = item.__offsetX ?? (width ? width / 2 : 0);
  const offsetY = item.__offsetY ?? (height ? height / 2 : 0);
  const rowIndex = item.__rowIndex ?? 0;

  const IconComponent = item.icon?.iconName ? getIcon(item.icon.iconName) : null;
  
  // Check if item has icon and determine display type
  const hasIcon = item.icon && (item.icon.type === 'library' || item.icon.type === 'emoji');
  const hasEmoji = hasIcon && item.icon?.type === 'emoji' && item.icon?.emoji;
  const hasLibraryIcon = hasIcon && item.icon?.type === 'library' && IconComponent;
  const showFallbackIcon = hasIcon && !hasEmoji && !hasLibraryIcon;
  
  const displayText = item.icon?.label || item.text;
  const isMerged = item.isMergedGroup;

  return (
    <div
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 9999,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
      }}
      dir="ltr"
    >
      <div
        style={{
          ...getItemStyles(currentOffset, offsetX, offsetY, rowIndex),
          width: width ?? undefined,
          height: height ?? undefined,
        }}
        className={`
          ${isMerged ? 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300' : 'bg-white border-slate-200'}
          rounded-xl sm:rounded-2xl
          border-b-[4px] sm:border-b-[6px]
          shadow-2xl
          flex items-center justify-center gap-1
          text-center
          px-2
          scale-110
          z-50
        `}
        dir="rtl"
      >
        {/* Show icon from library */}
        {hasLibraryIcon && IconComponent && (
          <IconComponent 
            className={`w-5 h-5 sm:w-6 sm:h-6 ${isMerged ? 'text-purple-600' : 'text-blue-600'}`}
            strokeWidth={2.5}
          />
        )}
        
        {/* Show emoji if type is emoji */}
        {hasEmoji && (
          <span className="text-base sm:text-lg">{item.icon!.emoji}</span>
        )}
        
        {/* Show fallback "*" if icon not found */}
        {showFallbackIcon && (
          <span className="text-base sm:text-lg font-bold">*</span>
        )}
        
        <span className={`${isMerged ? 'text-purple-700' : 'text-blue-600'} text-sm sm:text-lg leading-tight break-words font-bold drop-shadow-sm`}>
          {displayText}
        </span>
      </div>
    </div>
  );
}
