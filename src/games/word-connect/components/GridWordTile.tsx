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
  const { dragState, startDrag, updateDragPosition, endDrag } = useDragContext();
  
  // Long press and drag state
  const longPressTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const dragTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const startPositionRef = React.useRef<{ x: number; y: number } | null>(null);
  const hasMoved = React.useRef<boolean>(false);
  const isDraggingThis = React.useRef<boolean>(false);
  const canStartDrag = React.useRef<boolean>(false);
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

  // Long press handler
  const handleLongPress = () => {
    console.log('🔥 LONG PRESS DETECTED - Ready to drag:', word.text);
    canStartDrag.current = true;
  };

  const startLongPressTimer = () => {
    cancelTimers();
    canStartDrag.current = false;
    longPressTimerRef.current = setTimeout(() => {
      handleLongPress();
    }, 500); // 500ms for long press
  };

  const cancelTimers = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (dragTimerRef.current) {
      clearTimeout(dragTimerRef.current);
      dragTimerRef.current = null;
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    
    // Prevent default to stop context menu and native gestures
    e.preventDefault();
    e.stopPropagation();
    
    // Capture pointer to track movement even when cursor leaves element
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    
    startPositionRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
    hasMoved.current = false;
    isDraggingThis.current = false;
    canStartDrag.current = false;
    
    startLongPressTimer();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!startPositionRef.current || isDisabled) return;

    e.preventDefault();
    e.stopPropagation();

    const currentX = e.clientX;
    const currentY = e.clientY;
    const dx = Math.abs(currentX - startPositionRef.current.x);
    const dy = Math.abs(currentY - startPositionRef.current.y);
    
    console.log('📍 Pointer move:', dx, dy, 'isDragging:', isDraggingThis.current);
    
    // Check if moved enough to be considered movement
    if (dx > 5 || dy > 5) {
      if (!hasMoved.current) {
        hasMoved.current = true;
        // Cancel long press timer if moving (but don't prevent drag)
        if (!canStartDrag.current) {
          cancelTimers();
        }
      }

      // Start drag if: 1) long press triggered, OR 2) user is moving (immediate drag)
      if (!isDraggingThis.current) {
        console.log('🚀 DRAG STARTED on:', word.text, canStartDrag.current ? '(after long press)' : '(immediate)');
        soundManager.playPickUp();
        
        const rect = tileRef.current?.getBoundingClientRect();
        if (rect) {
          console.log('📦 Starting drag with rect:', rect, 'position:', { x: currentX, y: currentY });
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
        console.log('🔄 Updating drag position:', { x: currentX, y: currentY });
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
    cancelTimers();

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
      console.log('✅ DROP on row:', finalTarget.row, 'col:', finalTarget.col);
    }

    if (isDraggingThis.current) {
      endDrag();
    }

    startPositionRef.current = null;
    hasMoved.current = false;
    isDraggingThis.current = false;
    canStartDrag.current = false;
    dropTargetRef.current = null;
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    cancelTimers();
    
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
    canStartDrag.current = false;
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
      scale: [1, 1.1, 0],
      opacity: [1, 1, 0],
      rotate: [0, 5, -5, 0],
      filter: "brightness(1.5)",
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
      scale: [1, 1.05, 1],
      filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
      zIndex: 20,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
      }
    } : {},
    [hintColor]
  );

  // OPTIMIZATION: Memoize animation state
  const animateState = React.useMemo(() => {
    if (isMerging) return mergeAnimation;
    if (hintColor && !isDragging) return hintAnimation;
    return { 
      opacity: isDragging ? 0.5 : 1, 
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
      stiffness: 350, 
      damping: 25,
      layout: { duration: 0.2 },
      repeat: 0
    },
    [isMerging, hintColor]
  );

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      cancelTimers();
    };
  }, []);

  return (
    <motion.div
      layoutId={!isDragging ? word.id : undefined}
      layout={!isDragging}
      initial={{ opacity: 0, scale: 0.8 }}
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
      {/* Shadow/Depth Layer */}
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
        ${isOver ? 'translate-y-[4px] sm:translate-y-[5px] brightness-95 ring-2 ring-blue-400' : 'hover:-translate-y-[1px]'}
        ${isSubcategoryGlow ? 'ring-4 ring-yellow-300 border-yellow-400 shadow-[0_0_15px_rgba(253,224,71,0.6)]' : ''}
        ${hintColor ? getHintStyles(hintColor) : ''}
      `}>
        
        {/* Inner shine for extra polish */}
        <div className="absolute inset-x-2 top-1 h-1/3 bg-gradient-to-b from-white/60 to-transparent rounded-t-lg pointer-events-none"></div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center gap-0.5 z-10">
          {/* Show icon from Lucide library */}
          {iconDisplay.hasLibraryIcon && IconComponent && (
            <IconComponent 
              className={`w-5 h-5 sm:w-6 sm:h-6 ${word.isMergedGroup ? 'text-purple-600' : 'text-slate-600'}`}
              strokeWidth={2.5}
            />
          )}
          
          {/* Show emoji if type is emoji */}
          {iconDisplay.hasEmoji && (
            <span className="text-lg sm:text-xl drop-shadow-sm filter">{word.icon!.emoji}</span>
          )}
          
          {/* Show fallback "*" if icon not found */}
          {iconDisplay.showFallbackIcon && (
            <span className="text-lg sm:text-xl font-bold drop-shadow-sm filter">*</span>
          )}
          
          <span className={`
            text-xs sm:text-sm font-bold leading-tight break-words
            drop-shadow-sm
            ${word.isMergedGroup ? 'text-purple-800' : 'text-slate-700'}
          `}>
            {iconDisplay.displayText}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
