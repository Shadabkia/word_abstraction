import { AnimatePresence } from 'framer-motion';
import { ChatRow } from './components/ChatRow';
import { ChatView } from './components/ChatView';
import { Edit, MessageCircle } from 'lucide-react';
import { useGameState } from '@/core/state/gameState';
import { contentManager } from '@/core/services/contentManager';
import { useState } from 'react';

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
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  
  // Get unlocked threads based on completed levels
  const threads = contentManager.getUnlockedThreads(progress.completedLevels);
  const npcs = contentManager.getNPCs();
  
  // Create a map of NPC data
  const npcMap = Object.fromEntries(npcs.map(npc => [npc.id, npc]));
  
  // Get selected thread details
  const selectedThread = selectedThreadId 
    ? threads.find(t => t.id === selectedThreadId)
    : null;
  const selectedNPC = selectedThread ? npcMap[selectedThread.participantId] : null;
  
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
    <div className="bg-gradient-to-b from-white to-slate-50 h-full flex flex-col relative">
      {/* Hidden overlay prevents interaction with list when chat is open */}
      {selectedThreadId && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelectedThreadId(null)} />
      )}
      {/* Header - Enhanced */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between border-b-2 border-slate-100 bg-white shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Messages
          </h1>
        </div>
        <button 
          className="text-slate-600 active:text-indigo-600 transition-colors p-2 active:bg-indigo-50 rounded-xl touch-manipulation"
        >
          <Edit className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Search (Optional placeholder) - Enhanced */}
      <div className="px-4 sm:px-6 py-3 shrink-0">
        <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl h-11 flex items-center px-4 text-slate-400 text-sm border border-slate-200 shadow-sm">
          🔍 Search
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="py-3">
          <div className="px-4 sm:px-6 pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="text-base">💬</span>
            Primary
          </div>
          {threads.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-4xl">💬</span>
              </div>
              <p className="text-slate-400 text-sm font-medium">No messages yet</p>
              <p className="text-slate-300 text-xs mt-1">Complete levels to unlock conversations!</p>
            </div>
          ) : (
            threads.map((thread) => {
              const npc = npcMap[thread.participantId];
              return (
                <ChatRow 
                  key={thread.id}
                  id={thread.id}
                  name={npc?.name || 'Unknown'}
                  lastMessage={thread.lastMessagePreview}
                  time={formatTime(thread.lastMessageTime)}
                  unreadCount={thread.unreadCount}
                  avatarColor={NPC_COLORS[thread.participantId] || 'bg-gradient-to-br from-slate-400 to-slate-500'}
                  onClick={() => setSelectedThreadId(thread.id)}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Chat View Overlay */}
      <AnimatePresence>
        {selectedThreadId && selectedThread && selectedNPC && (
          <ChatView
            threadId={selectedThreadId}
            npcName={selectedNPC.name}
            npcHandle={selectedNPC.handle}
            avatarColor={NPC_COLORS[selectedThread.participantId] || 'bg-gradient-to-br from-slate-400 to-slate-500'}
            onBack={() => setSelectedThreadId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
