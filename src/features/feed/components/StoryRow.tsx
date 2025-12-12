import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export function StoryRow() {
  const stories = [
    { id: 'me', name: 'Your Story', isSeen: false, isUser: true },
    { id: '1', name: 'Mom', isSeen: false },
    { id: '2', name: 'Ali', isSeen: true },
    { id: '3', name: 'Boss', isSeen: false },
    { id: '4', name: 'Darvish', isSeen: false },
  ];

  return (
    <div className="flex gap-5 overflow-x-auto px-4 py-5 scrollbar-hide border-b-2 border-slate-100 bg-gradient-to-b from-white to-slate-50">
      {stories.map((story, index) => (
        <motion.div 
          key={story.id} 
          className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className={`
              w-18 h-18 rounded-full p-[3px] shadow-lg
              ${story.isUser 
                ? 'bg-gradient-to-tr from-blue-400 to-purple-500' 
                : story.isSeen 
                  ? 'bg-slate-300' 
                  : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'}
            `}
            animate={!story.isSeen && !story.isUser ? {
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-full h-full rounded-full border-3 border-white bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden shadow-inner">
              {story.isUser ? (
                <motion.div
                  whileHover={{ rotate: 90 }}
                  className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Plus className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              ) : (
                <span className="text-sm font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {story.name[0]}
                </span>
              )}
            </div>
          </motion.div>
          <span className="text-xs font-medium text-slate-700 truncate max-w-[72px]">
            {story.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

