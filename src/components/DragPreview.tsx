import * as React from "react";
import { useDragLayer, XYCoord } from "react-dnd";

interface Word {
  id: string;
  text: string;
  category: string;
  // injected on drag start
  __previewWidth?: number;
  __previewHeight?: number;
  __offsetX?: number;
  __offsetY?: number;
}

function getItemStyles(currentOffset: XYCoord | null, offsetX: number = 0, offsetY: number = 0, height?: number): React.CSSProperties {
  if (!currentOffset) {
    return { display: "none" };
  }
  const { x, y } = currentOffset;
  
  // Position the preview above the finger so it's visible
  // Move it up slightly above the touch point
  const upwardOffset = (height ?? 64) * 0.5 ; // half tile height + 10px gap
  
  const transform = `translate(${x - offsetX}px, ${y - offsetY - upwardOffset}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

export function DragPreview() {
  const { isDragging, itemType, item, currentOffset } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    itemType: monitor.getItemType(),
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
          ...getItemStyles(currentOffset, offsetX, offsetY, height),
          width: width ?? undefined,
          height: height ?? undefined,
        }}
        className="
          bg-gradient-to-br from-yellow-100 to-yellow-200
          border-2 border-yellow-300
          rounded-2xl
          shadow-2xl
          px-3 py-4
          flex items-center justify-center
          text-center
          scale-105
          opacity-90
        "
        dir="rtl"
      >
        <span className="text-gray-900 text-sm leading-tight break-words font-bold">
          {item.text}
        </span>
      </div>
    </div>
  );
}


