import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin } from 'lucide-react';
import { useGameState } from '@/core/state/gameState';
import { useForge } from '@/forge-ui';
import { campaignManager } from '@/core/services/campaignManager';
import { LevelPostView } from './components/LevelPostView';

interface ProfileScreenProps {
  onPlayGame?: (ref: { gameId: 'word-connect'; levelId: number; campaignLevelId: string }) => void;
  selectedLevelId?: string | null;
  onOpenLevel?: (levelId: string) => void;
  onCloseLevel?: () => void;
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

export function ProfileScreen({
  onPlayGame,
  selectedLevelId,
  onOpenLevel,
  onCloseLevel,
}: ProfileScreenProps) {
  const { user, progress } = useGameState();
  const { theme } = useForge();
  const [selectedChapter, setSelectedChapter] = useState('chapter_1');
  const [uncontrolledSelectedLevel, setUncontrolledSelectedLevel] = useState<string | null>(null);
  const selectedLevel = selectedLevelId !== undefined ? selectedLevelId : uncontrolledSelectedLevel;

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
    if (onOpenLevel) {
      onOpenLevel(levelId);
      return;
    }
    setUncontrolledSelectedLevel(levelId);
  };

  // Close post view
  const handleClosePost = () => {
    if (onCloseLevel) {
      onCloseLevel();
      return;
    }
    setUncontrolledSelectedLevel(null);
  };

  // Start game from post view
  const handleStartGame = (gameId: 'word-connect', levelNumber: number, campaignLevelId: string) => {
    // If this screen is controlled by the app shell, keep the post in history so back returns here.
    if (!onOpenLevel && !onCloseLevel) {
      setUncontrolledSelectedLevel(null);
    }
    if (onPlayGame) {
      onPlayGame({ gameId, levelId: levelNumber, campaignLevelId });
    }
  };

  // Get post data for selected level
  const selectedLevelPost = useMemo(
    () => (selectedLevel ? campaignManager.getLevelAsPost(selectedLevel) : null),
    [selectedLevel]
  );

  return (
    <div className={`min-h-screen ${theme.colors.background}`}>
      {/* Profile Header */}
      <div className={`bg-white px-5 pt-4 pb-5 ${theme.colors.border ? 'border-b ' + theme.colors.border.replace('border-', 'border-') : ''}`}>
        <div className="flex items-center justify-between mb-5">
          <h1 className={`text-xl font-semibold ${theme.colors.text}`}>{user.name}</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={`${theme.colors.text} opacity-80 active:opacity-100 transition-colors touch-manipulation p-2 -m-2`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </motion.button>
        </div>

        <div className="flex items-start gap-7 mb-5">
          {/* Avatar with gradient ring */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="relative flex-shrink-0 touch-manipulation"
          >
            <div className={`w-20 h-20 rounded-full ${theme.colors.accent} p-[2.5px]`}>
              <div className="w-full h-full rounded-full bg-white p-[2.5px]">
                <div className={`w-full h-full rounded-full ${theme.colors.accent} flex items-center justify-center text-white shadow-lg overflow-hidden`}>
                  <User className="w-9 h-9" />
                </div>
              </div>
            </div>
          </motion.button>

          {/* Stats */}
          <div className="flex-1 flex justify-around pt-1">
            <div className="flex flex-col items-center">
              <span className={`text-[17px] font-semibold ${theme.colors.text}`}>{user.followers}K</span>
              <span className={`text-[13px] ${theme.colors.muted} mt-0.5`}>followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`text-[17px] font-semibold ${theme.colors.text}`}>{user.following}+</span>
              <span className={`text-[13px] ${theme.colors.muted} mt-0.5`}>following</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <p className={`text-[14px] ${theme.colors.text} font-medium`}>{user.name}</p>
          <p className={`text-[14px] ${theme.colors.text} leading-relaxed`}>
            Former office worker. Now driving across Iran in The Onion 🚐
          </p>
          <div className={`flex items-center gap-1.5 text-[13px] ${theme.colors.muted}`}>
            <MapPin className="w-3.5 h-3.5" />
            <span>{currentChapter?.city || 'Tehran'}</span>
          </div>
        </div>
      </div>

      {/* Chapter Selector (Story Highlights) */}
      <div className={`bg-white border-b ${theme.colors.border || 'border-slate-100'} px-5 py-5`}>
        <div className="mb-4">
          <h3 className={`text-[15px] font-bold ${theme.colors.text} px-0`}>Highlights</h3>
        </div>
        <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-1">
          {chapters.map((chapter) => {
            const isUnlocked = unlockedChapters.some(ch => ch.id === chapter.id);
            const isSelected = selectedChapter === chapter.id;
            const completedLevels = chapter.levels.filter(l => 
              progress.completedLevels.includes(`level_${l.levelNumber}`)
            ).length;
            const totalLevels = chapter.levels.length;
            const isComplete = completedLevels === totalLevels;

            return (
              <motion.button
                key={chapter.id}
                whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                whileTap={{ scale: isUnlocked ? 0.90 : 1 }}
                onClick={() => isUnlocked && setSelectedChapter(chapter.id)}
                disabled={!isUnlocked}
                className="flex-shrink-0 touch-manipulation active:opacity-80 transition-opacity"
              >
                <div className="flex flex-col items-center gap-2">
                  {/* Chapter Circle with gradient ring */}
                  <div className="relative touch-manipulation">
                    <div
                      className={`
                        w-[70px] h-[70px] rounded-full p-[3px]
                        ${isUnlocked 
                          ? isSelected
                            ? theme.colors.accent
                            : isComplete
                              ? theme.colors.success
                              : 'bg-gradient-to-tr from-slate-300 to-slate-400'
                          : 'bg-slate-300'
                        }
                        transition-all duration-300
                      `}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden border-[2px] border-white">
                        <div
                          className={`
                            w-full h-full rounded-full flex items-center justify-center shadow-sm
                            ${isUnlocked 
                              ? `bg-gradient-to-br ${chapter.color}` 
                              : 'bg-slate-200'
                            }
                          `}
                        >
                          {isUnlocked ? (
                            // Show chapter icon/image here - for now using text
                            <div className="text-white text-2xl">
                              {chapter.id === 'chapter_1' && '🏢'}
                              {chapter.id === 'chapter_2' && '🚐'}
                              {chapter.id === 'chapter_3' && '🏖️'}
                            </div>
                          ) : (
                            <span className="text-2xl">🔒</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Checkmark for completed chapters */}
                    {isComplete && isUnlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute bottom-0 right-0 w-5 h-5 ${theme.colors.success} rounded-full flex items-center justify-center border-2 border-white shadow-md`}
                      >
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Chapter Name */}
                  <span className={`text-[13px] max-w-[75px] text-center line-clamp-1 ${
                    isSelected ? `font-semibold ${theme.colors.text}` : theme.colors.text
                  }`}>
                    {chapter.subtitle}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Level Grid (Posts Grid) */}
      <div className={`${theme.colors.background} pt-3 px-3`}>
        <div className="grid grid-cols-3 gap-3">
          {levels.map((level) => {
            const levelId = `level_${level.levelNumber}`;
            const isCompleted = progress.completedLevels.includes(levelId);
            const isCurrent = !isCompleted && level.levelNumber === (completedLevelNumbers.length + 1);
            const isLocked = !isCompleted && level.levelNumber > (completedLevelNumbers.length + 1);
            const thumbnailCandidates = campaignManager.getLevelThumbnailCandidates(level.id);

            return (
              <motion.div
                key={level.id}
                className="flex flex-col items-center"
              >
                <motion.button
                  whileHover={!isLocked ? { scale: 1.05 } : {}}
                  whileTap={!isLocked ? { scale: 0.95 } : {}}
                  onClick={() => !isLocked && handleLevelClick(level.id)}
                  disabled={isLocked}
                  className={`relative w-full aspect-square bg-white overflow-hidden group touch-manipulation ${
                    isCurrent ? `ring-[3px] ${theme.colors.primary.replace('bg-','ring-')}` : ''
                  }`}
                  style={{ borderRadius: '12px' }}
                >
                  {/* Thumbnail (falls back across extensions) */}
                  <div className="absolute inset-0">
                    {/* Gradient fallback behind image */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${currentChapter?.color || 'from-slate-300 to-slate-400'} ${
                        isLocked ? 'opacity-20' : 'opacity-100'
                      } transition-opacity duration-300`}
                    />
                    {thumbnailCandidates.length > 0 && (
                      <FallbackImage
                        candidates={thumbnailCandidates}
                        alt={level.titleEn || level.title}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
                          isLocked ? 'opacity-30 grayscale' : isCompleted ? 'opacity-100' : 'opacity-95'
                        }`}
                      />
                    )}
                  </div>

                  {/* Completion Checkmark - large and prominent */}
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-16 h-16 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </motion.div>
                  )}

                  {/* Lock Icon - prominent */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <svg className="w-12 h-12 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </motion.button>
                
                {/* Status Label */}
                <span className="text-xs text-slate-600 mt-1.5 font-medium">
                  {isCompleted ? 'completed' : isCurrent ? 'current' : isLocked ? 'locked' : 'available'}
                </span>
              </motion.div>
            );
          })}
        </div>
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
