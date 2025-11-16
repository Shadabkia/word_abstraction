import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import * as React from "react";

interface Word {
  id: string;
  text: string;
  category: string;
}

interface GridWordTileProps {
  word: Word;
  rowIndex: number;
  colIndex: number;
  onSwap: (word: Word, targetRowIndex: number, targetColIndex: number) => void;
  isAnimating?: boolean;
  swapOffset?: { x: number; y: number };
}

export function GridWordTile({ word, rowIndex, colIndex, onSwap, isAnimating = false, swapOffset }: GridWordTileProps) {
  const tileRef = React.useRef<HTMLDivElement | null>(null);
  const lastDropTimeRef = React.useRef<number>(0);

  const isTouch =
    typeof window !== 'undefined' &&
    (('ontouchstart' in window) || (navigator as any).maxTouchPoints > 0);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'word',
    // include live dimensions so the preview can match tile size
    item: () => {
      const rect = tileRef.current?.getBoundingClientRect();
      return {
        ...word,
        __previewWidth: rect?.width ?? undefined,
        __previewHeight: rect?.height ?? undefined,
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  React.useEffect(() => {
    if (!isTouch) {
      preview(getEmptyImage(), { captureDraggingState: true });
    }
  }, [preview, isTouch]);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'word',
    drop: (item: Word) => {
      // Prevent multiple rapid drops (debounce)
      const now = Date.now();
      if (now - lastDropTimeRef.current < 100) {
        return;
      }
      lastDropTimeRef.current = now;

      // Only swap if dropping on a different tile
      if (item.id !== word.id) {
        onSwap(item, rowIndex, colIndex);
      }
    },
    canDrop: (item: Word) => item.id !== word.id,
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  }), [word.id, rowIndex, colIndex, onSwap]);

  return (
    <div
      ref={(node) => {
        tileRef.current = node;
        drag(drop(node));
      }}
      data-word-id={word.id}
      className={`
        bg-gradient-to-br from-yellow-100 to-yellow-200
        border-2 border-yellow-300
        rounded-2xl
        shadow-md
        px-3 py-4
        cursor-move
        select-none
        flex items-center justify-center
        text-center
        h-16
        hover:shadow-lg
        hover:scale-105
        active:scale-95
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${isOver && canDrop ? 'border-blue-400 border-4 scale-105 shadow-xl' : ''}
        ${isOver && !canDrop ? 'opacity-75' : ''}
        ${isAnimating ? 'animate-swap' : 'transition-all'}
      `}
      style={{ 
        touchAction: 'none',
        ...(isAnimating && swapOffset ? {
          '--swap-x': `${swapOffset.x}px`,
          '--swap-y': `${swapOffset.y}px`,
        } as React.CSSProperties : {})
      }}
    >
      <span className="text-gray-900 text-sm leading-tight break-words font-bold">
        {word.text}
      </span>
    </div>
  );
}