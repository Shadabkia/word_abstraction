import React from 'react';

interface Chapter {
  id: string;
  name: string;
  isUnlocked: boolean;
}

interface ChapterSelectorProps {
  chapters: Chapter[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ChapterSelector({ chapters, selectedId, onSelect }: ChapterSelectorProps) {
  return (
    <div className="bg-white border-b border-slate-100 py-2">
      <div className="flex gap-4 overflow-x-auto px-4 scrollbar-hide">
        {chapters.map((chapter) => (
          <div 
            key={chapter.id} 
            onClick={() => chapter.isUnlocked && onSelect(chapter.id)}
            className={`flex flex-col items-center gap-1 min-w-[64px] cursor-pointer ${!chapter.isUnlocked ? 'opacity-50' : ''}`}
          >
            <div className={`
              w-16 h-16 rounded-full p-[2px] transition-all
              ${selectedId === chapter.id ? 'border-2 border-indigo-500' : 'border border-slate-200'}
            `}>
              <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                 <span className="text-xs font-bold text-slate-400">{chapter.name.slice(0, 2)}</span>
              </div>
            </div>
            <span className={`text-xs truncate max-w-[64px] ${selectedId === chapter.id ? 'font-bold text-indigo-600' : 'text-slate-600'}`}>
              {chapter.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

