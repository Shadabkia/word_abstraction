import React from 'react';
import { Lock } from 'lucide-react';

interface LevelGridProps {
  levels: { id: string; number: number; isLocked: boolean; isCompleted: boolean }[];
  onLevelClick: (id: string) => void;
}

export function LevelGrid({ levels, onLevelClick }: LevelGridProps) {
  return (
    <div className="grid grid-cols-3 gap-0.5 bg-slate-100">
      {levels.map((level) => (
        <div 
          key={level.id}
          onClick={() => !level.isLocked && onLevelClick(level.id)}
          className={`
            relative aspect-square bg-white cursor-pointer group
            ${level.isLocked ? 'bg-slate-50' : 'hover:opacity-90'}
          `}
        >
          {/* Level Content / Thumbnail */}
          <div className="absolute inset-0 flex items-center justify-center">
             {level.isLocked ? (
                <Lock className="w-6 h-6 text-slate-300" />
             ) : (
                <div className={`
                  text-lg font-bold
                  ${level.isCompleted ? 'text-indigo-600' : 'text-slate-800'}
                `}>
                  {level.number}
                </div>
             )}
          </div>
          
          {/* Completed Checkmark (optional) */}
          {level.isCompleted && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></div>
          )}
        </div>
      ))}
      
      {/* Fillers to maintain grid look if needed */}
      {[...Array(Math.max(0, 9 - levels.length))].map((_, i) => (
        <div key={`filler-${i}`} className="aspect-square bg-slate-50 opacity-20"></div>
      ))}
    </div>
  );
}

