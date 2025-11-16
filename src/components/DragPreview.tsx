import * as React from "react";
import { useDragLayer, XYCoord } from "react-dnd";

interface Word {
  id: string;
  text: string;
  category: string;
  // injected on drag start
  __previewWidth?: number;
  __previewHeight?: number;
}

function getItemStyles(currentOffset: XYCoord | null): React.CSSProperties {
  if (!currentOffset) {
    return { display: "none" };
  }
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
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
    currentOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging || !item) {
    return null;
  }

  const width = item.__previewWidth;
  const height = item.__previewHeight;

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
    >
      <div
        style={{
          ...getItemStyles(currentOffset),
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
      >
        <span className="text-gray-900 text-sm leading-tight break-words font-bold">
          {item.text}
        </span>
      </div>
    </div>
  );
}


