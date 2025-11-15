import { useDrag } from 'react-dnd';

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
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'word',
    item: word,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
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
        ${inDropZone ? 'h-16' : 'min-h-[4rem]'}
      `}
      style={{ touchAction: 'none' }}
    >
      <span className="text-gray-900 text-sm leading-tight break-words">
        {word.text}
      </span>
    </div>
  );
}
