import { ArrowLeft, Lock, Star } from 'lucide-react';

interface Level {
  id: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isLocked?: boolean;
  stars?: number;
  bestScore?: number;
}

interface LevelSelectorProps {
  gameId: string;
  gameName: string;
  levels: Level[];
  onSelectLevel: (levelNumber: number) => void;
  onBack: () => void;
}

export function LevelSelector({ gameName, levels, onSelectLevel, onBack }: LevelSelectorProps) {
  const difficultyColors = {
    easy: 'from-green-400 to-emerald-500',
    medium: 'from-yellow-400 to-orange-500',
    hard: 'from-red-400 to-pink-500',
  };

  const difficultyLabels = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <style>{`
        @keyframes enter-scale {
          0% { opacity: 0; transform: translateY(15px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800">{gameName}</h1>
            <p className="text-sm text-slate-500">Choose a level</p>
          </div>
        </div>
      </div>

      {/* Level Grid */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-2">
          {levels.map((level, index) => (
            <button
              key={level.id}
              onClick={() => !level.isLocked && onSelectLevel(level.id)}
              disabled={level.isLocked}
              style={{
                animation: 'enter-scale 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both',
                animationDelay: `${Math.min(index * 0.03, 0.3)}s`
              }}
              className={`
                relative aspect-square rounded-xl p-2 flex flex-col items-center justify-center
                transition-all duration-200 active:scale-95
                ${!level.isLocked && 'hover:scale-105 hover:shadow-xl'}
                ${level.isLocked 
                  ? 'bg-slate-200 cursor-not-allowed opacity-50' 
                  : `bg-gradient-to-br ${difficultyColors[level.difficulty]} text-white shadow-lg`
                }
              `}
            >
              {level.isLocked ? (
                <>
                  <Lock className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-[10px] font-bold text-slate-500">Locked</span>
                </>
              ) : (
                <>
                  {/* Level Number */}
                  <div className="text-2xl font-black mb-0.5">{level.id}</div>
                  
                  {/* Stars */}
                  {level.stars !== undefined && (
                    <div className="flex gap-0.5 mb-0.5">
                      {[1, 2, 3].map((star) => (
                        <Star
                          key={star}
                          className={`w-2.5 h-2.5 ${
                            star <= level.stars! 
                              ? 'fill-yellow-300 text-yellow-300' 
                              : 'fill-white/30 text-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Difficulty Badge */}
                  <div className="absolute top-1.5 right-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  </div>
                  
                  {/* Level Name */}
                  <div className="text-[9px] font-medium opacity-90 text-center line-clamp-1">
                    {level.name}
                  </div>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-4 space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Difficulty Levels
          </div>
          {Object.entries(difficultyLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${difficultyColors[key as keyof typeof difficultyColors]}`} />
              <span className="text-sm text-slate-600 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

