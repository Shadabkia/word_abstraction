import React, { useState } from 'react';
import { X, Trash2, Unlock, Eye, RefreshCw } from 'lucide-react';
import { useGameState } from '@/core/state/gameState';
import { Button } from '@/shared/ui/button';

interface DebugOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DebugOverlay({ isOpen, onClose }: DebugOverlayProps) {
  const { user, progress, resetProgress, completeLevel, unlockChapter } = useGameState();
  const [showJson, setShowJson] = useState(false);

  if (!isOpen) return null;

  const handleUnlockAll = () => {
    // Unlock first 20 levels in career mode
    for (let i = 1; i <= 20; i++) {
      completeLevel(`level_${i}`, 1000, 3, 'career');
    }
    // Unlock all chapters
    ['chapter_1', 'chapter_2', 'chapter_3', 'chapter_4'].forEach(id => unlockChapter(id));
  };

  const handleResetProgress = () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      resetProgress();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-slate-800">Debug Panel</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          
          {/* User Info */}
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs font-bold text-slate-400 uppercase mb-2">User Info</div>
            <div className="text-sm space-y-1">
              <div><span className="font-bold">Name:</span> {user.name}</div>
              <div><span className="font-bold">Coins:</span> {user.coins}</div>
              <div><span className="font-bold">Vibes:</span> {user.vibes}</div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs font-bold text-slate-400 uppercase mb-2">Progress</div>
            <div className="text-sm space-y-1">
              <div><span className="font-bold">Career Levels:</span> {progress.career.completedLevels.length}</div>
              <div><span className="font-bold">Arcade Levels:</span> {progress.arcade.completedLevels.length}</div>
              <div><span className="font-bold">Chapters Unlocked:</span> {progress.career.unlockedChapters.length}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button 
              onClick={handleUnlockAll}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white justify-start"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Unlock All Content
            </Button>

            <Button 
              onClick={handleResetProgress}
              variant="destructive"
              className="w-full justify-start"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Reset All Progress
            </Button>

            <Button 
              onClick={() => setShowJson(!showJson)}
              variant="outline"
              className="w-full justify-start"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showJson ? 'Hide' : 'Show'} State JSON
            </Button>
          </div>

          {/* JSON View */}
          {showJson && (
            <div className="bg-slate-900 text-green-400 rounded-xl p-3 text-xs font-mono overflow-x-auto">
              <pre>{JSON.stringify({ user, progress }, null, 2)}</pre>
            </div>
          )}

          {/* Quick Level Complete */}
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs font-bold text-slate-400 uppercase mb-2">Quick Actions</div>
            <div className="space-y-2">
              <Button 
                onClick={() => completeLevel('level_1', 1000, 3, 'career')}
                size="sm"
                variant="outline"
                className="w-full text-xs"
              >
                Complete Level 1 (Career)
              </Button>
              <Button 
                onClick={() => completeLevel('level_5', 1000, 3, 'career')}
                size="sm"
                variant="outline"
                className="w-full text-xs"
              >
                Complete Level 5 (Career)
              </Button>
              <Button 
                onClick={() => completeLevel('level_10', 1000, 3, 'career')}
                size="sm"
                variant="outline"
                className="w-full text-xs"
              >
                Complete Level 10 (Career)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

