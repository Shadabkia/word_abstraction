import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '@/core/state/gameState';
import { contentManager } from '@/core/services/contentManager';
import { ProfileHeader } from './components/ProfileHeader';
import { ChapterSelector } from './components/ChapterSelector';
import { LevelGrid } from './components/LevelGrid';
import { Grid, Tag } from 'lucide-react';

export function ProfileScreen() {
  const { user, progress } = useGameState();
  const [activeChapter, setActiveChapter] = useState('chapter_1');
  const [activeTab, setActiveTab] = useState<'grid' | 'tags'>('grid');

  // Get chapters from content manager
  const allChapters = contentManager.getChapters();
  const unlockedChapterIds = contentManager.getUnlockedChapters(progress.completedLevels).map(c => c.id);
  
  const chapters = allChapters.map(chapter => ({
    id: chapter.id,
    name: chapter.title,
    isUnlocked: unlockedChapterIds.includes(chapter.id)
  }));

  // Dummy Levels for active chapter (TODO: Replace with actual level data)
  const levels = Array.from({ length: 12 }, (_, i) => {
    const levelNum = i + 1;
    const levelId = `level_${levelNum}`;
    const isCompleted = progress.completedLevels.includes(levelId);
    const isLocked = levelNum > progress.completedLevels.length + 1;
    return {
      id: levelId,
      number: levelNum,
      isLocked,
      isCompleted
    };
  });

  return (
    <div className="bg-gradient-to-b from-white to-slate-50 min-h-full">
      <ProfileHeader user={user} postsCount={progress.completedLevels.length} />
      
      <ChapterSelector 
        chapters={chapters} 
        selectedId={activeChapter} 
        onSelect={setActiveChapter} 
      />

      {/* Tab Icons (Instagram Style) - Enhanced */}
      <div className="flex border-b-2 border-slate-100 bg-white">
        <motion.button 
          className={`flex-1 py-4 flex justify-center border-b-2 transition-all ${
            activeTab === 'grid' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-400'
          }`}
          onClick={() => setActiveTab('grid')}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={activeTab === 'grid' ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Grid className="w-7 h-7" strokeWidth={activeTab === 'grid' ? 2.5 : 2} />
          </motion.div>
        </motion.button>
        <motion.button 
          className={`flex-1 py-4 flex justify-center border-b-2 transition-all ${
            activeTab === 'tags' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-400'
          }`}
          onClick={() => setActiveTab('tags')}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={activeTab === 'tags' ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Tag className="w-7 h-7" strokeWidth={activeTab === 'tags' ? 2.5 : 2} />
          </motion.div>
        </motion.button>
      </div>

      {activeTab === 'grid' ? (
        <LevelGrid 
          levels={levels} 
          onLevelClick={(id) => console.log('Clicked level', id)} 
        />
      ) : (
        <motion.div 
          className="p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-6xl mb-4 block">🏷️</span>
          <p className="text-slate-400">No tagged levels yet</p>
        </motion.div>
      )}
    </div>
  );
}
