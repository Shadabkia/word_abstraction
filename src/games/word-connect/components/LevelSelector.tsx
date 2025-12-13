import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/shared/ui/select";
import { LevelJSON } from "../data/types";
import { cn } from "@/shared/ui/utils";
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
      <SelectTrigger className="w-full bg-[var(--color-climate-tile)] h-12 rounded-xl text-[var(--color-climate-text-primary)] hover:bg-[var(--color-climate-bg-secondary)] transition-colors border-transparent shadow-sm">
        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-climate-text-secondary)]/10 text-[var(--color-climate-text-primary)] text-xs font-medium shrink-0">
            {currentLevel}
          </div>
          <div className="flex flex-col flex-1 text-left overflow-hidden">
             {currentLevelMeta?.meta.chapter && (
                 <span className="text-[10px] text-[var(--color-climate-text-secondary)] leading-tight font-medium">
                     {currentLevelMeta.meta.chapter.name}
                 </span>
             )}
             <span className="font-medium truncate text-sm">
                {currentLevelMeta?.meta.title || `Level ${currentLevel}`}
             </span>
          </div>
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-[300px] bg-white border-slate-100 text-[var(--color-climate-text-primary)] shadow-[var(--shadow-climate-hover)] rounded-xl">
        {groupedLevels.map((group) => (
           <SelectGroup key={group.name}>
              {groupedLevels.length > 0 && (
                 <SelectLabel className="px-3 py-2 text-xs font-bold text-[var(--color-climate-text-secondary)] uppercase tracking-wider bg-slate-50 sticky top-0 z-10">
                    {group.name}
                 </SelectLabel>
              )}
              {group.levels.map((meta) => {
                  const lvl = meta.meta.levelNumber || 0;
                  const isLocked = availableLevels.length > 0 && !availableLevels.includes(lvl);
                  // Use milder difficulty indicators
                  const difficultyColor = [
                    "bg-emerald-400",
                    "bg-sky-400",
                    "bg-amber-400",
                    "bg-orange-400",
                    "bg-rose-400",
                  ][Math.min(meta.meta.difficulty - 1, 4)] || "bg-emerald-400";

                  return (
                    <SelectItem
                      key={meta.meta.id}
                      value={lvl.toString()}
                      disabled={isLocked}
                      className="py-2.5 focus:bg-[var(--color-climate-bg-secondary)] cursor-pointer my-1 mx-1 rounded-lg"
                    >
                      <div className="flex items-center w-full gap-3">
                        <div className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium shrink-0",
                          isLocked ? "bg-slate-100 text-slate-400" : "bg-slate-100 text-slate-700"
                        )}>
                           {isLocked ? <Lock className="w-3 h-3" /> : lvl}
                        </div>
                        
                        <div className="flex flex-col flex-1 gap-0.5 text-left overflow-hidden">
                          <span className={cn("font-medium text-sm truncate", isLocked && "text-slate-400")}>
                            {meta.meta.title}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-[var(--color-climate-text-secondary)]">
                            <span className="flex items-center gap-1.5">
                                <div className={cn("w-1.5 h-1.5 rounded-full opacity-60", difficultyColor)} />
                                Difficulty {meta.meta.difficulty}
                            </span>
                          </div>
                        </div>

                        {lvl < Math.max(...availableLevels, 0) && !isLocked && (
                          <Star className="w-3 h-3 text-[var(--color-climate-highlight)] fill-[var(--color-climate-highlight)] shrink-0 ml-2" />
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
