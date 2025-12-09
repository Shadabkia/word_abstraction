import React from 'react';
import { Button } from '@/shared/ui/button';

interface ArcadeScreenProps {
  onPlayGame: (gameId: string) => void;
}

export function ArcadeScreen({ onPlayGame }: ArcadeScreenProps) {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 px-2">Arcade</h2>
      
      <div className="space-y-4">
        <div 
          onClick={() => onPlayGame('word-connect')}
          className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-3xl shadow-md">
            🧩
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 text-lg">Word Connect</h3>
            <p className="text-slate-500 text-sm">Classic connection puzzle.</p>
          </div>
          <Button variant="outline" className="rounded-full">Play</Button>
        </div>

        {/* Placeholder for more games */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 flex items-center gap-4 opacity-70">
          <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center text-2xl">
            ❓
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-400 text-lg">Coming Soon</h3>
            <p className="text-slate-400 text-sm">More games on the way.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

