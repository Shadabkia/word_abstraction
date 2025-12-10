import { motion } from 'framer-motion';
import { ChatRow } from './components/ChatRow';
import { Edit, MessageCircle } from 'lucide-react';
import { useGameState } from '@/core/state/gameState';
import { contentManager } from '@/core/services/contentManager';

// Color map for NPCs
const NPC_COLORS: Record<string, string> = {
  'npc_mom': 'bg-gradient-to-br from-pink-400 to-rose-500',
  'npc_boss': 'bg-gradient-to-br from-slate-600 to-slate-700',
  'npc_darvish': 'bg-gradient-to-br from-indigo-500 to-purple-600',
  'npc_ali': 'bg-gradient-to-br from-orange-500 to-red-500',
  'npc_kian': 'bg-gradient-to-br from-blue-400 to-cyan-500',
};

export function MessagesScreen() {
  const { progress } = useGameState();
  
  // Get unlocked threads based on completed levels
  const threads = contentManager.getUnlockedThreads(progress.completedLevels);
  const npcs = contentManager.getNPCs();
  
  // Create a map of NPC data
  const npcMap = Object.fromEntries(npcs.map(npc => [npc.id, npc]));
  
  // Format timestamp to relative time (simplified)
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="bg-gradient-to-b from-white to-slate-50 min-h-full flex flex-col">
      {/* Header - Enhanced */}
      <motion.div 
        className="px-6 py-5 flex items-center justify-between border-b-2 border-slate-100 sticky top-0 bg-white/95 backdrop-blur-xl z-10 shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Messages
          </h1>
        </div>
        <motion.button 
          className="text-slate-600 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-xl"
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <Edit className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Search (Optional placeholder) - Enhanced */}
      <motion.div 
        className="px-6 py-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl h-11 flex items-center px-4 text-slate-400 text-sm border border-slate-200 shadow-sm">
          🔍 Search
        </div>
      </motion.div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <motion.div 
          className="py-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="px-6 pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="text-base">💬</span>
            Primary
          </div>
          {threads.length === 0 ? (
            <motion.div 
              className="p-12 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-4xl">💬</span>
              </motion.div>
              <p className="text-slate-400 text-sm font-medium">No messages yet</p>
              <p className="text-slate-300 text-xs mt-1">Complete levels to unlock conversations!</p>
            </motion.div>
          ) : (
            threads.map((thread, index) => {
              const npc = npcMap[thread.participantId];
              return (
                <motion.div
                  key={thread.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ChatRow 
                    id={thread.id}
                    name={npc?.name || 'Unknown'}
                    lastMessage={thread.lastMessagePreview}
                    time={formatTime(thread.lastMessageTime)}
                    unreadCount={thread.unreadCount}
                    avatarColor={NPC_COLORS[thread.participantId] || 'bg-gradient-to-br from-slate-400 to-slate-500'}
                    onClick={() => console.log('Open chat', thread.id)}
                  />
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}
