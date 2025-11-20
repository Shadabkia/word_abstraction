import * as React from "react";
import { useDragLayer, XYCoord } from "react-dnd";
import { getIcon } from '@/utils/iconMapper';

interface Word {
  id: string;
  text: string;
  category: string;
  icon?: {
    id: string;
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
}

function getItemStyles(currentOffset: XYCoord | null, offsetX: number = 0, offsetY: number = 0): React.CSSProperties {
  if (!currentOffset) {
    return { display: "none" };
  }
  const { x, y } = currentOffset;
  
  // Move it up slightly above the touch point (60px above finger)
  const upwardOffset = 60;  
   
  const transform = `translate(${x - offsetX}px, ${y - offsetY - upwardOffset}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

export function DragPreview() {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    item: monitor.getItem() as Word | null,
    // Use the actual pointer position so we can center the preview under the finger/cursor
    currentOffset: monitor.getClientOffset(),
  }));

  if (!isDragging || !item) {
    return null;
  }

  const width = item.__previewWidth;
  const height = item.__previewHeight;
  const offsetX = item.__offsetX ?? (width ? width / 2 : 0);
  const offsetY = item.__offsetY ?? (height ? height / 2 : 0);

  const IconComponent = item.icon?.iconName ? getIcon(item.icon.iconName) : null;
  const hasEmoji = item.icon && item.icon.emoji;
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
          ...getItemStyles(currentOffset, offsetX, offsetY),
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
        {IconComponent && (
          <IconComponent 
            className={`w-5 h-5 sm:w-6 sm:h-6 ${isMerged ? 'text-purple-600' : 'text-blue-600'}`}
            strokeWidth={2.5}
          />
        )}
        
        {/* Show emoji fallback */}
        {!IconComponent && hasEmoji && (
          <span className="text-base sm:text-lg">{item.icon!.emoji}</span>
        )}
        
        <span className={`${isMerged ? 'text-purple-700' : 'text-blue-600'} text-sm sm:text-lg leading-tight break-words font-bold drop-shadow-sm`}>
          {displayText}
        </span>
      </div>
    </div>
  );
}
