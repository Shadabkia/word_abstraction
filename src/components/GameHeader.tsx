interface GameHeaderProps {
  level: number;
  completed: number;
  total: number;
}

export function GameHeader({ level, completed, total }: GameHeaderProps) {
  const progress = (completed / total) * 100;

  return (
    <div className="bg-gradient-to-b from-blue-200 to-blue-100 py-6 px-4 mb-6">
      <h1 className="text-center text-blue-900 mb-2">LEVEL {level}</h1>
      <p className="text-center text-blue-800 text-sm mb-4">
        Group four word tiles by putting them in one row
      </p>
      
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-md flex items-center justify-center transform -rotate-12">
            <span className="text-white text-lg">📚</span>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg shadow-md flex items-center justify-center transform rotate-12 -ml-2">
            <span className="text-white text-lg">📚</span>
          </div>
        </div>
        
        <div className="flex-1 max-w-xs">
          <div className="h-6 bg-blue-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <span className="text-blue-900 min-w-[3rem] text-center">
          {completed}/{total}
        </span>
      </div>
    </div>
  );
}
