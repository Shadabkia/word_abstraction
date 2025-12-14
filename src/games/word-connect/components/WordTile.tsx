import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import * as React from "react";

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
}

interface WordTileProps {
  word: Word;
  inDropZone?: boolean;
}

export function WordTile({ word, inDropZone = false }: WordTileProps) {
  const tileRef = React.useRef<HTMLDivElement | null>(null);
  const touchOffsetRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  // FIX: Freeze word data at drag start to prevent mutations
  const draggedWordRef = React.useRef<Word | null>(null);

  const isTouch =
    typeof window !== 'undefined' &&
    (('ontouchstart' in window) || (navigator as any).maxTouchPoints > 0);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'word',
    item: () => {
      // Capture and freeze word data
      draggedWordRef.current = { ...word };
      const rect = tileRef.current?.getBoundingClientRect();
      return {
        ...draggedWordRef.current,
        __previewWidth: rect?.width ?? undefined,
        __previewHeight: rect?.height ?? undefined,
        __offsetX: touchOffsetRef.current.x,
        __offsetY: touchOffsetRef.current.y,
      };
    },
    end: () => {
      draggedWordRef.current = null;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [word]);

  React.useEffect(() => {
    if (!isTouch) {
      preview(getEmptyImage(), { captureDraggingState: true });
    }
  }, [preview, isTouch]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (tileRef.current && e.touches.length > 0) {
      const rect = tileRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      touchOffsetRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tileRef.current) {
      const rect = tileRef.current.getBoundingClientRect();
      touchOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  return (
    <div
      ref={(node) => {
        tileRef.current = node;
        drag(node);
      }}
      onTouchStart={handleTouchStart}
      onMouseDown={handleMouseDown}
      className={`
        bg-[var(--color-climate-tile)]
        rounded-2xl
        shadow-[var(--shadow-climate-hover)]
        px-3 py-4
        cursor-move
        select-none
        flex items-center justify-center
        text-center
        transition-all
        scale-105
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${inDropZone ? 'h-12' : 'min-h-[3rem]'}
      `}
      style={{ touchAction: 'none' }}
    >
      <span className="text-[var(--color-climate-text-primary)] font-medium text-sm leading-tight break-words">
        {word.text}
      </span>
    </div>
  );
}
