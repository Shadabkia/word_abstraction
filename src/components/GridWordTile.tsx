import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import * as React from "react";
import { motion } from "framer-motion";
import { getIcon } from '@/utils/iconMapper';
import { soundManager } from '../utils/soundManager';

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
}

interface GridWordTileProps {
  word: Word;
  rowIndex: number;
  colIndex: number;
  onSwap: (word: Word, targetRowIndex: number, targetColIndex: number) => void;
  isSubcategoryGlow?: boolean;
  isMerging?: boolean;
}

export function GridWordTile({ word, rowIndex, colIndex, onSwap, isSubcategoryGlow = false, isMerging = false }: GridWordTileProps) {
  const tileRef = React.useRef<HTMLDivElement | null>(null);
  const lastDropTimeRef = React.useRef<number>(0);
  const touchOffsetRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const isTouch =
    typeof window !== 'undefined' &&
    (('ontouchstart' in window) || (navigator as any).maxTouchPoints > 0);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'word',
    item: () => {
      soundManager.playPickUp();
      const rect = tileRef.current?.getBoundingClientRect();
      const offset = touchOffsetRef.current;
      return {
        ...word,
        __previewWidth: rect?.width ?? undefined,
        __previewHeight: rect?.height ?? undefined,
        __offsetX: offset.x,
        __offsetY: offset.y,
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
      const now = Date.now();
      if (now - lastDropTimeRef.current < 100) return;
      lastDropTimeRef.current = now;

      if (item.id !== word.id) {
        soundManager.playPop(); // Sound for successful drop/swap
        onSwap(item, rowIndex, colIndex);
      }
    },
    canDrop: (item: Word) => item.id !== word.id,
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  }), [word.id, rowIndex, colIndex, onSwap]);

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

  // Dynamic random rotation for playfulness
  const rotation = React.useMemo(() => word.isMergedGroup ? 0 : Math.random() * 2 - 1, [word.isMergedGroup]);

  // Get icon component if icon name is provided
  const IconComponent = React.useMemo(() => 
    word.icon?.iconName ? getIcon(word.icon.iconName) : null, 
    [word.icon?.iconName]
  );
  
  const hasEmoji = word.icon && word.icon.emoji;
  const displayText = word.icon?.label || word.text;

  // Simplified, visually distinct merge animation
  const mergeAnimation = isMerging ? {
    scale: [1, 1.1, 0], // Pulse then disappear
    opacity: [1, 1, 0],
    rotate: [0, 5, -5, 0], // Jiggle
    filter: "brightness(1.5)", // Flash bright
    transition: {
      duration: 0.6,
      ease: "easeInOut",
      delay: colIndex * 0.1 // Staggered disappearance
    }
  } : {};

  return (
    <motion.div
      layoutId={word.id}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isMerging ? mergeAnimation : { 
        opacity: isDragging ? 0.5 : 1, 
        scale: 1, 
        x: 0,
        y: 0,
        rotate: 0,
        zIndex: isDragging ? 100 : 10 
      }}
      transition={isMerging ? {} : { 
        type: "spring", 
        stiffness: 350, 
        damping: 25,
        layout: { duration: 0.2 }
      }}
      ref={(node) => {
        tileRef.current = node;
        drag(drop(node));
      }}
      data-word-id={word.id}
      onTouchStart={handleTouchStart}
      onMouseDown={handleMouseDown}
      className={`
        relative group
        h-14 sm:h-16
        cursor-grab active:cursor-grabbing
        select-none
        z-10
      `}
      style={{ 
        touchAction: 'none',
        rotate: rotation
      }}
      dir="rtl"
      whileTap={{ scale: 0.95 }}
    >
      {/* Shadow/Depth Layer (static background that gives 3D illusion) */}
      <div className={`
        absolute inset-0 
        rounded-xl sm:rounded-2xl 
        translate-y-[4px] sm:translate-y-[5px]
        ${word.isMergedGroup ? 'bg-purple-300' : 'bg-slate-300'}
        transition-colors duration-200
      `}></div>

      {/* Main Tile Face */}
      <div className={`
        absolute inset-0 
        rounded-xl sm:rounded-2xl 
        flex items-center justify-center 
        px-1.5 sm:px-2
        text-center
        transition-all duration-150
        border-2
        ${word.isMergedGroup 
          ? 'bg-gradient-to-b from-purple-50 to-purple-100 border-purple-200 text-purple-700' 
          : 'bg-gradient-to-b from-white to-slate-50 border-white text-slate-700'
        }
        ${isOver && canDrop ? 'translate-y-[4px] sm:translate-y-[5px] brightness-95' : 'hover:-translate-y-[1px]'}
        ${isSubcategoryGlow ? 'ring-4 ring-yellow-300 border-yellow-400 shadow-[0_0_15px_rgba(253,224,71,0.6)]' : ''}
      `}>
        
        {/* Inner shine for extra polish */}
        <div className="absolute inset-x-2 top-1 h-1/3 bg-gradient-to-b from-white/60 to-transparent rounded-t-lg pointer-events-none"></div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center gap-0.5 z-10">
          {/* Show icon from Lucide library */}
          {IconComponent && (
            <IconComponent 
              className={`w-5 h-5 sm:w-6 sm:h-6 ${word.isMergedGroup ? 'text-purple-600' : 'text-slate-600'}`}
              strokeWidth={2.5}
            />
          )}
          
          {/* Show emoji fallback if no icon component */}
          {!IconComponent && hasEmoji && (
            <span className="text-lg sm:text-xl drop-shadow-sm filter">{word.icon!.emoji}</span>
          )}
          
          <span className={`
            text-xs sm:text-sm font-bold leading-tight break-words
            drop-shadow-sm
            ${word.isMergedGroup ? 'text-purple-800' : 'text-slate-700'}
          `}>
            {displayText}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
