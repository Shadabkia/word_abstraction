import React from 'react';
import { motion } from 'framer-motion';
import { StoryRow } from './components/StoryRow';
import { PostCard } from './components/PostCard';
import { useGameState } from '@/core/state/gameState';
import { contentManager } from '@/core/services/contentManager';
import { Sparkles } from 'lucide-react';

export function FeedScreen() {
  const { progress } = useGameState();
  
  // Get unlocked posts based on completed levels
  const posts = contentManager.getUnlockedPosts(progress.completedLevels);
  const npcs = contentManager.getNPCs();
  
  // Create a map of NPC data for quick lookup
  const npcMap = Object.fromEntries(npcs.map(npc => [npc.id, npc]));

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-full pb-6">
      <StoryRow />
      
      <div className="mt-3 sm:mt-5">
        {posts.length === 0 ? (
          <motion.div 
            className="p-12 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl border-4 border-white"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-12 h-12 text-indigo-500" />
            </motion.div>
            <p className="text-slate-600 text-base font-bold mb-2">No posts yet!</p>
            <p className="text-slate-400 text-sm">Complete levels to unlock story posts. 🎮</p>
          </motion.div>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard 
                post={post} 
                authorName={npcMap[post.authorId]?.name || 'Unknown'}
                authorAvatar={npcMap[post.authorId]?.avatar || ''}
              />
            </motion.div>
          ))
        )}
      </div>
      
      {posts.length > 0 && (
        <motion.div 
          className="p-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 rounded-full shadow-sm border-2 border-white"
            animate={{ 
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-2xl">🎉</span>
            <span className="text-slate-600 text-sm font-medium">You're all caught up!</span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
