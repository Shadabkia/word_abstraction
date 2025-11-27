import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "./ui/select";
import { LevelJSON } from "../data/types";
import { cn } from "./ui/utils";
import { Lock, Star } from "lucide-react";
import { useMemo } from "react";

interface LevelSelectorProps {
  currentLevel: number;
  levels: LevelJSON[];
  onLevelSelect: (level: number) => void;
  availableLevels?: number[];
}

export function LevelSelector({
  currentLevel,
  levels,
  onLevelSelect,
  availableLevels = [],
}: LevelSelectorProps) {
  // Sort levels by ID number
  const sortedLevels = useMemo(() => [...levels].sort((a, b) => {
    const lvlA = a.meta.levelNumber || 0;
    const lvlB = b.meta.levelNumber || 0;
    return lvlA - lvlB;
  }), [levels]);

  const currentLevelMeta = useMemo(() => levels.find((l) => {
     const lvl = l.meta.levelNumber || 0;
     return lvl === currentLevel;
  }), [levels, currentLevel]);

  const difficultyColors = [
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-red-500",
  ];

  // Group levels by chapter
  const groupedLevels = useMemo(() => {
    const groups = new Map<string, { name: string, levels: LevelJSON[] }>();
    
    sortedLevels.forEach(level => {
        // Use chapter info if available
        const chapterId = level.meta.chapter?.id || 'uncategorized';
        const chapterName = level.meta.chapter?.name || 'Other Levels';
        
        if (!groups.has(chapterId)) {
            groups.set(chapterId, { name: chapterName, levels: [] });
        }
        groups.get(chapterId)!.levels.push(level);
    });
    
    return Array.from(groups.values());
  }, [sortedLevels]);

  return (
    <Select
      value={currentLevel.toString()}
      onValueChange={(val) => onLevelSelect(parseInt(val))}
    >
      <SelectTrigger className="w-full glass-panel h-12 rounded-xl text-slate-700 hover:bg-white/80 transition-colors focus:ring-offset-0 focus:ring-indigo-500/20 border-white/40">
        <div className="flex items-center gap-2 w-full">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-bold shrink-0 shadow-sm border border-white/20">
            {currentLevel}
          </div>
          <div className="flex flex-col flex-1 text-left overflow-hidden">
             {currentLevelMeta?.meta.chapter && (
                 <span className="text-[10px] text-slate-500 leading-tight font-medium">
                     {currentLevelMeta.meta.chapter.name}
                 </span>
             )}
             <span className="font-medium truncate">
                {currentLevelMeta?.meta.title || `Level ${currentLevel}`}
             </span>
          </div>
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-[300px] bg-white/95 border-slate-200 text-slate-700 backdrop-blur-xl shadow-xl rounded-xl">
        {groupedLevels.map((group) => (
           <SelectGroup key={group.name}>
              {groupedLevels.length > 0 && (
                 <SelectLabel className="px-3 py-1.5 text-xs font-bold text-indigo-900/50 uppercase tracking-wider bg-indigo-50/30 sticky top-0 backdrop-blur-md z-10">
                    {group.name}
                 </SelectLabel>
              )}
              {group.levels.map((meta) => {
                  const lvl = meta.meta.levelNumber || 0;
                  const isLocked = availableLevels.length > 0 && !availableLevels.includes(lvl);
                  const difficultyColor = difficultyColors[Math.min(meta.meta.difficulty - 1, 4)] || difficultyColors[0];

                  return (
                    <SelectItem
                      key={meta.meta.id}
                      value={lvl.toString()}
                      disabled={isLocked}
                      className="py-3 focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer data-[state=checked]:bg-indigo-50/50 my-1 mx-1 rounded-lg"
                    >
                      <div className="flex items-center w-full gap-3">
                        <div className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                          isLocked ? "bg-slate-200 text-slate-400" : "bg-indigo-500 text-white"
                        )}>
                           {isLocked ? <Lock className="w-3 h-3" /> : lvl}
                        </div>
                        
                        <div className="flex flex-col flex-1 gap-0.5 text-left overflow-hidden">
                          <span className={cn("font-bold text-sm truncate", isLocked && "text-slate-400 font-medium")}>
                            {meta.meta.title}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="flex items-center gap-1">
                                <div className={cn("w-1.5 h-1.5 rounded-full", difficultyColor)} />
                                Difficulty {meta.meta.difficulty}
                            </span>
                            <span>•</span>
                            <span>{meta.mechanics.groups.length} Groups</span>
                          </div>
                        </div>

                        {lvl < Math.max(...availableLevels, 0) && !isLocked && (
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0 ml-2" />
                        )}
                      </div>
                    </SelectItem>
                  );
              })}
           </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
