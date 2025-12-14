import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Award } from 'lucide-react';
import { useGameState } from '@/core/state/gameState';
import { campaignManager } from '@/core/services/campaignManager';
import { LevelPostView } from './components/LevelPostView';

interface ProfileScreenProps {
  onPlayGame?: (ref: { gameId: 'word-connect'; levelId: number; campaignLevelId: string }) => void;
}

function FallbackImage({
  candidates,
  alt,
  className,
}: {
  candidates: string[];
  alt: string;
  className?: string;
}) {
  const [idx, setIdx] = useState(0);
  const src = candidates[idx];
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (idx < candidates.length - 1) setIdx(idx + 1);
      }}
    />
  );
}

export function ProfileScreen({ onPlayGame }: ProfileScreenProps) {
  const { user, progress } = useGameState();
  const [selectedChapter, setSelectedChapter] = useState('chapter_1');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Convert completed level IDs to numbers for campaign manager
  const completedLevelNumbers = progress.completedLevels
    .map(id => parseInt(id.replace('level_', '')))
    .filter(n => !isNaN(n));

  // Get campaign data
  const chapters = campaignManager.getChapters();
  const unlockedChapters = campaignManager.getUnlockedChapters(completedLevelNumbers);
  
  // Get levels for selected chapter
  const currentChapter = chapters.find(ch => ch.id === selectedChapter);
  const levels = currentChapter?.levels || [];

  // Handle level click
  const handleLevelClick = (levelId: string) => {
    setSelectedLevel(levelId);
  };

  // Close post view
  const handleClosePost = () => {
    setSelectedLevel(null);
  };

  // Start game from post view
  const handleStartGame = (gameId: 'word-connect', levelNumber: number, campaignLevelId: string) => {
    setSelectedLevel(null);
    if (onPlayGame) {
      onPlayGame({ gameId, levelId: levelNumber, campaignLevelId });
    }
  };

  // Get post data for selected level
  const selectedLevelPost = selectedLevel ? campaignManager.getLevelAsPost(selectedLevel) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/20">
      {/* Profile Header */}
      <div className="bg-white border-b border-slate-100 px-6 pt-6 pb-4">
        <div className="flex items-start gap-6 mb-4">
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
          >
            <User className="w-10 h-10" />
          </motion.div>

          {/* Stats */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-800 mb-1">{user.name}</h2>
            <p className="text-sm text-slate-500 mb-3">@kian_ontheroad</p>
            
            <div className="flex gap-6 text-sm">
              <div>
                <span className="font-bold text-slate-800">{progress.completedLevels.length}</span>
                <span className="text-slate-500 ml-1">levels</span>
              </div>
              <div>
                <span className="font-bold text-slate-800">{user.followers}</span>
                <span className="text-slate-500 ml-1">followers</span>
              </div>
              <div>
                <span className="font-bold text-slate-800">{user.following}</span>
                <span className="text-slate-500 ml-1">following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-slate-700 mb-2">
          Former office worker. Now driving across Iran in The Onion 🚐
        </p>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="w-3 h-3" />
          <span>Currently in: {currentChapter?.city || 'Tehran'}</span>
        </div>
      </div>

      {/* Chapter Selector (Story Highlights) */}
      <div className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {chapters.map((chapter) => {
            const isUnlocked = unlockedChapters.some(ch => ch.id === chapter.id);
            const isSelected = selectedChapter === chapter.id;
            const completedLevels = chapter.levels.filter(l => 
              progress.completedLevels.includes(`level_${l.levelNumber}`)
            ).length;
            const totalLevels = chapter.levels.length;

            return (
              <motion.button
                key={chapter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => isUnlocked && setSelectedChapter(chapter.id)}
                disabled={!isUnlocked}
                className="flex-shrink-0"
              >
                <div className="flex flex-col items-center gap-2">
                  {/* Chapter Circle */}
                  <div
                    className={`
                      w-16 h-16 rounded-full flex flex-col items-center justify-center text-white font-bold
                      ${isUnlocked 
                        ? `bg-gradient-to-br ${chapter.color}` 
                        : 'bg-slate-200'
                      }
                      ${isSelected ? 'ring-4 ring-purple-300 scale-110' : ''}
                      transition-all duration-200
                    `}
                  >
                    {isUnlocked ? (
                      <>
                        <div className="text-xs">{chapter.title}</div>
                        <div className="text-[10px] opacity-75">{completedLevels}/{totalLevels}</div>
                      </>
                    ) : (
                      <span className="text-2xl">🔒</span>
                    )}
                  </div>
                  
                  {/* Chapter Name */}
                  <span className="text-xs text-slate-600 max-w-[70px] text-center line-clamp-1">
                    {chapter.subtitle}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Level Grid (Posts Grid) */}
      <div className="grid grid-cols-3 gap-1 p-1">
        {levels.map((level) => {
          const levelId = `level_${level.levelNumber}`;
          const isCompleted = progress.completedLevels.includes(levelId);
          const isLocked = !isCompleted && level.levelNumber > (completedLevelNumbers.length + 1);
          const thumbnailCandidates = campaignManager.getLevelThumbnailCandidates(level.id);

          return (
            <motion.button
              key={level.id}
              whileHover={!isLocked ? { scale: 1.02 } : {}}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
              onClick={() => !isLocked && handleLevelClick(level.id)}
              disabled={isLocked}
              className="relative aspect-square bg-slate-100 overflow-hidden group"
            >
              {/* Thumbnail (falls back across extensions) */}
              <div className="absolute inset-0">
                {/* Gradient fallback behind image */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${currentChapter?.color || 'from-slate-300 to-slate-400'} ${
                    isLocked ? 'opacity-30' : 'opacity-100'
                  }`}
                />
                {thumbnailCandidates.length > 0 && (
                  <FallbackImage
                    candidates={thumbnailCandidates}
                    alt={level.titleEn || level.title}
                    className={`absolute inset-0 w-full h-full object-cover ${
                      isLocked ? 'opacity-30 grayscale' : isCompleted ? 'opacity-100' : 'opacity-95'
                    }`}
                  />
                )}
              </div>
              
              {/* Level Number Badge */}
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full font-bold backdrop-blur-sm">
                {level.levelNumber}
              </div>

              {/* Completion Badge */}
              {isCompleted && (
                <div className="absolute top-2 right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Lock Overlay */}
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="text-4xl">🔒</div>
                </div>
              )}

              {/* Title Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <p className="text-white text-xs font-semibold" dir="rtl">
                  {level.title}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Level Post View */}
      {selectedLevelPost && (
        <LevelPostView
          post={selectedLevelPost}
          onClose={handleClosePost}
          onStartGame={handleStartGame}
        />
      )}
    </div>
  );
}
