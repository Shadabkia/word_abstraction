import { useDrag } from 'react-dnd';
import * as React from "react";

interface Word {
  id: string;
  text: string;
  category: string;
}

interface WordTileProps {
  word: Word;
  inDropZone?: boolean;
}

export function WordTile({ word, inDropZone = false }: WordTileProps) {
  const tileRef = React.useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
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

  return (
    <div
      ref={(node) => {
        tileRef.current = node;
        drag(node);
      }}
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
        transition-all
        hover:shadow-lg
        hover:scale-105
        active:scale-95
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${inDropZone ? 'h-12' : 'min-h-[3rem]'}
      `}
      style={{ touchAction: 'none' }}
    >
      <span className="text-gray-900 text-sm leading-tight break-words">
        {word.text}
      </span>
    </div>
  );
}
