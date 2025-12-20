import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

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

interface DragState {
  isDragging: boolean;
  draggedWord: Word | null;
  dragOffset: { x: number; y: number };
  currentPosition: { x: number; y: number };
  previewSize: { width: number; height: number };
  sourcePosition: { rowIndex: number; colIndex: number } | null;
}

interface DragContextType {
  dragState: DragState;
  startDrag: (
    word: Word,
    offset: { x: number; y: number },
    position: { x: number; y: number },
    size: { width: number; height: number },
    source: { rowIndex: number; colIndex: number }
  ) => void;
  updateDragPosition: (position: { x: number; y: number }) => void;
  endDrag: () => void;
  cancelDrag: () => void;
}

const DragContext = createContext<DragContextType | undefined>(undefined);

export const useDragContext = () => {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error('useDragContext must be used within a DragProvider');
  }
  return context;
};

interface DragProviderProps {
  children: ReactNode;
}

export const DragProvider: React.FC<DragProviderProps> = ({ children }) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedWord: null,
    dragOffset: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    previewSize: { width: 0, height: 0 },
    sourcePosition: null,
  });

  const startDrag = (
    word: Word,
    offset: { x: number; y: number },
    position: { x: number; y: number },
    size: { width: number; height: number },
    source: { rowIndex: number; colIndex: number }
  ) => {
    console.log('🎯 DragContext.startDrag called:', { word: word.text, position, offset, size, source });
    setDragState({
      isDragging: true,
      draggedWord: word,
      dragOffset: offset,
      currentPosition: position,
      previewSize: size,
      sourcePosition: source,
    });
  };

  const updateDragPosition = (position: { x: number; y: number }) => {
    console.log('🔄 DragContext.updateDragPosition called:', position);
    setDragState((prev) => ({
      ...prev,
      currentPosition: position,
    }));
  };

  const endDrag = () => {
    setDragState({
      isDragging: false,
      draggedWord: null,
      dragOffset: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 },
      previewSize: { width: 0, height: 0 },
      sourcePosition: null,
    });
  };

  const cancelDrag = () => {
    endDrag();
  };

  return (
    <DragContext.Provider
      value={{
        dragState,
        startDrag,
        updateDragPosition,
        endDrag,
        cancelDrag,
      }}
    >
      {children}
    </DragContext.Provider>
  );
};



