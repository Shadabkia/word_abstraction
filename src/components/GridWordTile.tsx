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
  hintColor?: string;
  isDisabled?: boolean;
}

// Map hint colors to their specific styling classes
const getHintStyles = (color: string) => {
  switch (color) {
    case 'yellow':
      return 'ring-4 ring-yellow-300 border-yellow-400 z-20 shadow-[0_0_15px_rgba(253,224,71,0.6)]';
    case 'green':
      return 'ring-4 ring-green-400 border-green-500 z-20 shadow-[0_0_15px_rgba(74,222,128,0.6)]';
    case 'blue':
      return 'ring-4 ring-blue-400 border-blue-500 z-20 shadow-[0_0_15px_rgba(96,165,250,0.6)]';
    case 'purple':
      return 'ring-4 ring-purple-400 border-purple-500 z-20 shadow-[0_0_15px_rgba(192,132,252,0.6)]';
    case 'orange':
      return 'ring-4 ring-orange-400 border-orange-500 z-20 shadow-[0_0_15px_rgba(251,146,60,0.6)]';
    case 'pink':
      return 'ring-4 ring-pink-400 border-pink-500 z-20 shadow-[0_0_15px_rgba(244,114,182,0.6)]';
    case 'cyan':
      return 'ring-4 ring-cyan-400 border-cyan-500 z-20 shadow-[0_0_15px_rgba(34,211,238,0.6)]';
    case 'red':
      return 'ring-4 ring-red-400 border-red-500 z-20 shadow-[0_0_15px_rgba(248,113,113,0.6)]';
    default:
      return '';
  }
};

export function GridWordTile({ word, rowIndex, colIndex, onSwap, isSubcategoryGlow = false, isMerging = false, hintColor, isDisabled = false }: GridWordTileProps) {
  const tileRef = React.useRef<HTMLDivElement | null>(null);
  const lastDropTimeRef = React.useRef<number>(0);
  const touchOffsetRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // FIX #1: Freeze word data at drag start to prevent mid-drag mutations
  const draggedWordRef = React.useRef<Word | null>(null);

  const isTouch =
    typeof window !== 'undefined' &&
    (('ontouchstart' in window) || (navigator as any).maxTouchPoints > 0);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'word',
    canDrag: () => !isDisabled, // FIX: Disable dragging when processing
    item: () => {
      soundManager.playPickUp();
      // Capture word data at drag start and freeze it
      draggedWordRef.current = { ...word };
      const rect = tileRef.current?.getBoundingClientRect();
      const offset = touchOffsetRef.current;
      return {
        ...draggedWordRef.current,  // Use frozen word data
        __previewWidth: rect?.width ?? undefined,
        __previewHeight: rect?.height ?? undefined,
        __offsetX: offset.x,
        __offsetY: offset.y,
      };
    },
    end: () => {
      // Clear frozen data after drag ends
      draggedWordRef.current = null;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [word, isDisabled]);

  React.useEffect(() => {
    if (!isTouch) {
      preview(getEmptyImage(), { captureDraggingState: true });
    }
  }, [preview, isTouch]);

  // FIX #2: Increase debounce and include word in dependencies
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'word',
    drop: (item: Word) => {
      const now = Date.now();
      // Increased debounce from 100ms to 200ms for better touch device support
      if (now - lastDropTimeRef.current < 200) return;
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
  }), [word, rowIndex, colIndex, onSwap]);

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

  // FIX #3: Dynamic random rotation for playfulness (use word.id for stability)
  const rotation = React.useMemo(() => word.isMergedGroup ? 0 : Math.random() * 2 - 1, [word.id, word.isMergedGroup]);

  // Get icon component if icon is provided (stable memoization)
  const iconName = word.icon?.iconName;
  const IconComponent = React.useMemo(() => 
    iconName ? getIcon(iconName) : null, 
    [iconName]
  );
  
  // Check if word has icon and it should be displayed
  const hasIcon = word.icon && (word.icon.type === 'library' || word.icon.type === 'emoji');
  const hasEmoji = hasIcon && word.icon.type === 'emoji' && word.icon.emoji;
  const hasLibraryIcon = hasIcon && word.icon.type === 'library' && IconComponent;
  const showFallbackIcon = hasIcon && !hasEmoji && !hasLibraryIcon; // Show "*" if icon not found
  
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

  // Simplified hint animation (just subtle scale/pulse)
  const hintAnimation = hintColor ? {
    scale: [1, 1.05, 1],
    filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
    zIndex: 20,
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
    }
  } : {};

  return (
    <motion.div
      layoutId={word.id}
      layout={!isDragging} // FIX: Disable layout animation during drag
      initial={{ opacity: 0, scale: 0.8 }}
      animate={
        isMerging ? mergeAnimation : 
        (hintColor && !isDragging) ? hintAnimation :
        { 
          opacity: isDragging ? 0.5 : 1, 
          scale: 1, 
          x: 0,
          y: 0,
          rotate: 0,
          filter: "brightness(1)",
          zIndex: isDragging ? 100 : 10 
        }
      }
      transition={
        isMerging || hintColor ? {} : 
        { 
          type: "spring", 
          stiffness: 350, 
          damping: 25,
          layout: { duration: 0.2 },
          repeat: 0 // Explicitly stop repeating
        }
      }
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
        ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-grab active:cursor-grabbing'}
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
        ${hintColor ? getHintStyles(hintColor) : ''}
      `}>
        
        {/* Inner shine for extra polish */}
        <div className="absolute inset-x-2 top-1 h-1/3 bg-gradient-to-b from-white/60 to-transparent rounded-t-lg pointer-events-none"></div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center gap-0.5 z-10">
          {/* Show icon from Lucide library */}
          {hasLibraryIcon && IconComponent && (
            <IconComponent 
              className={`w-5 h-5 sm:w-6 sm:h-6 ${word.isMergedGroup ? 'text-purple-600' : 'text-slate-600'}`}
              strokeWidth={2.5}
            />
          )}
          
          {/* Show emoji if type is emoji */}
          {hasEmoji && (
            <span className="text-lg sm:text-xl drop-shadow-sm filter">{word.icon!.emoji}</span>
          )}
          
          {/* Show fallback "*" if icon not found */}
          {showFallbackIcon && (
            <span className="text-lg sm:text-xl font-bold drop-shadow-sm filter">*</span>
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
