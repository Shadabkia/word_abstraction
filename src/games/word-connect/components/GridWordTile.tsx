import * as React from "react";
import { motion } from "framer-motion";
import { getIcon } from '@/shared/utils/iconMapper';
import { soundManager } from '../utils/soundManager';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useDragContext } from '@/contexts/DragContext';

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

// Map hint colors to their specific styling classes - Softer Palette
const getHintStyles = (color: string) => {
  switch (color) {
    case 'yellow':
      return 'ring-2 ring-yellow-200 bg-yellow-50';
    case 'green':
      return 'ring-2 ring-emerald-200 bg-emerald-50';
    case 'blue':
      return 'ring-2 ring-sky-200 bg-sky-50';
    case 'purple':
      return 'ring-2 ring-purple-200 bg-purple-50';
    case 'orange':
      return 'ring-2 ring-orange-200 bg-orange-50';
    case 'pink':
      return 'ring-2 ring-pink-200 bg-pink-50';
    case 'cyan':
      return 'ring-2 ring-cyan-200 bg-cyan-50';
    case 'red':
      return 'ring-2 ring-rose-200 bg-rose-50';
    default:
      return '';
  }
};

export function GridWordTile({ word, rowIndex, colIndex, onSwap, isSubcategoryGlow = false, isMerging = false, hintColor, isDisabled = false }: GridWordTileProps) {
  const tileRef = React.useRef<HTMLDivElement | null>(null);
  const { dragState, startDrag, updateDragPosition, endDrag } = useDragContext();
  
  // Drag state
  const startPositionRef = React.useRef<{ x: number; y: number } | null>(null);
  const hasMoved = React.useRef<boolean>(false);
  const isDraggingThis = React.useRef<boolean>(false);
  const dropTargetRef = React.useRef<{ row: number; col: number } | null>(null);

  const getDropTarget = React.useCallback((x: number, y: number) => {
    const elementsAtPoint = document.elementsFromPoint(x, y);
    const tileElement = elementsAtPoint.find(
      (el): el is HTMLElement =>
        el instanceof HTMLElement && el.hasAttribute('data-word-id')
    );

    if (!tileElement) return null;

    const targetWordId = tileElement.getAttribute('data-word-id');
    const targetRow = parseInt(tileElement.getAttribute('data-row-index') || '-1', 10);
    const targetCol = parseInt(tileElement.getAttribute('data-col-index') || '-1', 10);

    if (targetWordId === word.id || targetRow < 0 || targetCol < 0) {
      return null;
    }

    return { row: targetRow, col: targetCol };
  }, [word.id]);

  const isDragging = dragState.isDragging && dragState.draggedWord?.id === word.id;
  const isOver = dragState.isDragging && 
    dropTargetRef.current?.row === rowIndex && 
    dropTargetRef.current?.col === colIndex &&
    dragState.draggedWord?.id !== word.id;


  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    
    // Prevent default to stop context menu and native gestures
    e.preventDefault();
    e.stopPropagation();
    
    // Capture pointer to track movement even when cursor leaves element
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch (err) {
      // Ignore capture errors on some browsers
      console.log('Pointer capture failed:', err);
    }
    
    startPositionRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
    hasMoved.current = false;
    isDraggingThis.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!startPositionRef.current || isDisabled) return;

    e.preventDefault();
    e.stopPropagation();

    const currentX = e.clientX;
    const currentY = e.clientY;
    const dx = Math.abs(currentX - startPositionRef.current.x);
    const dy = Math.abs(currentY - startPositionRef.current.y);
    
    // Use smaller threshold for touch to be more responsive
    const threshold = e.pointerType === 'touch' ? 3 : 5;
    
    // Check if moved enough to be considered movement
    if (dx > threshold || dy > threshold) {
      if (!hasMoved.current) {
        hasMoved.current = true;
      }

      // Start drag immediately on movement
      if (!isDraggingThis.current) {
        soundManager.playPickUp();
        
        const rect = tileRef.current?.getBoundingClientRect();
        if (rect) {
          startDrag(
            word,
            {
              x: startPositionRef.current.x - rect.left,
              y: startPositionRef.current.y - rect.top,
            },
            { x: currentX, y: currentY },
            { width: rect.width, height: rect.height },
            { rowIndex, colIndex }
          );
          isDraggingThis.current = true;
        }
      }

      // Update drag position if dragging
      if (isDraggingThis.current) {
        updateDragPosition({ x: currentX, y: currentY });
        
        // Find drop target
        dropTargetRef.current = getDropTarget(currentX, currentY);
        // Clear target when pointer is not over any tile to avoid stale swaps
        if (!dropTargetRef.current) {
          dropTargetRef.current = null;
        }
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    // Release pointer capture
    if (e.target && (e.target as HTMLElement).hasPointerCapture) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignore if pointer capture was already released
      }
    }

    const finalTarget = getDropTarget(e.clientX, e.clientY);

    if (isDraggingThis.current && finalTarget) {
      soundManager.playPop();
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
      onSwap(word, finalTarget.row, finalTarget.col);
    }

    if (isDraggingThis.current) {
      endDrag();
    }

    startPositionRef.current = null;
    hasMoved.current = false;
    isDraggingThis.current = false;
    dropTargetRef.current = null;
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    
    // Release pointer capture
    if (e.target && (e.target as HTMLElement).hasPointerCapture) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignore if pointer capture was already released
      }
    }
    
    if (isDraggingThis.current) {
      endDrag();
    }
    startPositionRef.current = null;
    hasMoved.current = false;
    isDraggingThis.current = false;
    dropTargetRef.current = null;
  };

  // Dynamic random rotation for playfulness
  const rotation = React.useMemo(() => word.isMergedGroup ? 0 : Math.random() * 2 - 1, [word.id, word.isMergedGroup]);

  // OPTIMIZATION: Memoize icon component lookup
  const iconName = word.icon?.iconName;
  const IconComponent = React.useMemo(() => 
    iconName ? getIcon(iconName) : null, 
    [iconName]
  );
  
  // OPTIMIZATION: Memoize icon display logic
  const iconDisplay = React.useMemo(() => {
    const hasIcon = word.icon && (word.icon.type === 'library' || word.icon.type === 'emoji');
    const hasEmoji = hasIcon && word.icon.type === 'emoji' && word.icon.emoji;
    const hasLibraryIcon = hasIcon && word.icon.type === 'library' && IconComponent;
    const showFallbackIcon = hasIcon && !hasEmoji && !hasLibraryIcon;
    const displayText = word.icon?.label || word.text;
    
    return { hasEmoji, hasLibraryIcon, showFallbackIcon, displayText };
  }, [word.icon, word.text, IconComponent]);

  // OPTIMIZATION: Memoize merge animation
  const mergeAnimation = React.useMemo(() => 
    isMerging ? {
      scale: [1, 1.05, 0],
      opacity: [1, 1, 0],
      rotate: [0, 2, -2, 0],
      filter: "brightness(1.1)",
      transition: {
        duration: 0.6,
        ease: "easeInOut",
        delay: colIndex * 0.1
      }
    } : {},
    [isMerging, colIndex]
  );

  // OPTIMIZATION: Memoize hint animation
  const hintAnimation = React.useMemo(() =>
    hintColor ? {
      scale: [1, 1.02, 1],
      filter: ["brightness(1)", "brightness(1.05)", "brightness(1)"],
      zIndex: 20,
      opacity: 1,
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop" as const,
      }
    } : {},
    [hintColor]
  );

  // OPTIMIZATION: Memoize animation state
  const animateState = React.useMemo(() => {
    if (isMerging) return mergeAnimation;
    if (hintColor && !isDragging) return hintAnimation;
    return { 
      opacity: isDragging ? 0.4 : 1, 
      scale: 1, 
      x: 0,
      y: 0,
      rotate: 0,
      filter: "brightness(1)",
      zIndex: isDragging ? 100 : 10 
    };
  }, [isMerging, hintColor, isDragging, mergeAnimation, hintAnimation]);

  // OPTIMIZATION: Memoize transition config
  const transitionConfig = React.useMemo(() => 
    (isMerging || hintColor) ? {} : { 
      type: "spring", 
      stiffness: 400, 
      damping: 30,
      layout: { duration: 0.2 },
      repeat: 0
    },
    [isMerging, hintColor]
  );


  return (
    <motion.div
      layoutId={!isDragging ? word.id : undefined}
      layout={!isDragging}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={animateState}
      transition={transitionConfig}
      ref={tileRef}
      data-word-id={word.id}
      data-row-index={rowIndex}
      data-col-index={colIndex}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
      className={`
        relative group
        h-14 sm:h-16
        ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-grab active:cursor-grabbing'}
        select-none
        z-10
      `}
      style={{ 
        touchAction: 'none',
        rotate: rotation,
        willChange: isDragging ? 'transform, opacity' : 'auto',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
      dir="rtl"
    >
      {/* Main Tile Face - Clean & Calm */}
      <div className={`
        absolute inset-0 
        climate-tile
        flex items-center justify-center 
        px-1.5 sm:px-2
        text-center
        transition-all duration-300
        border border-transparent
        ${word.isMergedGroup 
          ? 'bg-purple-50 text-purple-900 border-purple-100' 
          : 'bg-white text-[var(--color-climate-text-primary)]'
        }
        ${isOver ? 'scale-95 brightness-95 ring-2 ring-climate-hint' : 'hover:-translate-y-0.5'}
        ${isSubcategoryGlow ? 'ring-2 ring-yellow-200 bg-yellow-50' : ''}
        ${hintColor ? getHintStyles(hintColor) : ''}
      `}>
        
        {/* Content */}
        <div className="flex flex-col items-center justify-center gap-0.5 z-10">
          {/* Show icon from Lucide library */}
          {iconDisplay.hasLibraryIcon && IconComponent && (
            <IconComponent 
              className={`w-5 h-5 sm:w-6 sm:h-6 ${word.isMergedGroup ? 'text-purple-700/70' : 'text-slate-500/70'}`}
              strokeWidth={2}
            />
          )}
          
          {/* Show emoji if type is emoji */}
          {iconDisplay.hasEmoji && (
            <span className="text-lg sm:text-xl drop-shadow-sm filter grayscale-[0.3]">{word.icon!.emoji}</span>
          )}
          
          {/* Show fallback "*" if icon not found */}
          {iconDisplay.showFallbackIcon && (
            <span className="text-lg sm:text-xl font-bold text-slate-400">*</span>
          )}
          
          <span className={`
            text-xs sm:text-sm font-medium leading-tight break-words
            ${word.isMergedGroup ? 'text-purple-900' : 'text-[var(--color-climate-text-primary)]'}
          `}>
            {iconDisplay.displayText}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
