import { useDrop } from 'react-dnd';
import { WordTile } from './WordTile';
import { X } from 'lucide-react';

interface Word {
  id: string;
  text: string;
  category: string;
}

interface DropSlotProps {
  word: Word | null;
  onDrop: (word: Word) => void;
  onRemove: () => void;
}

function DropSlot({ word, onDrop, onRemove }: DropSlotProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'word',
    drop: (item: Word) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  if (word) {
    return (
      <div
        ref={drop}
        className={`relative flex-1 transition-all ${isOver ? 'scale-105' : ''}`}
      >
        <WordTile word={word} inDropZone />
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors z-10"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={drop}
      className={`
        flex-1 h-16
        border-2 border-dashed border-gray-300
        rounded-2xl
        transition-all
        ${isOver ? 'border-blue-400 bg-blue-50 scale-105' : 'bg-white/50'}
      `}
    />
  );
}

interface DropZoneProps {
  zoneIndex: number;
  slots: (Word | null)[];
  onDrop: (word: Word, zoneIndex: number, slotIndex: number) => void;
  onReturn: (word: Word, zoneIndex: number, slotIndex: number) => void;
}

export function DropZone({ zoneIndex, slots, onDrop, onReturn }: DropZoneProps) {
  return (
    <div className="flex gap-2">
      {slots.map((word, slotIndex) => (
        <DropSlot
          key={slotIndex}
          word={word}
          onDrop={(droppedWord) => onDrop(droppedWord, zoneIndex, slotIndex)}
          onRemove={() => word && onReturn(word, zoneIndex, slotIndex)}
        />
      ))}
    </div>
  );
}