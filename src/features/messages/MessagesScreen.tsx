import { AnimatePresence } from 'framer-motion';
import { ChatRow } from './components/ChatRow';
import { ChatView } from './components/ChatView';
import { Edit } from 'lucide-react';
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
  
  // Get unlocked threads based on completed career levels
  const threads = contentManager.getUnlockedThreads(progress.career.completedLevels);
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
    <div className="bg-[#FAFAFA] h-full flex flex-col relative">
      {/* Hidden overlay prevents interaction with list when chat is open */}
      {selectedThreadId && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelectedThreadId(null)} />
      )}
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 bg-white shrink-0">
        <div className="flex-1" />
        <h1 className="text-2xl font-bold text-slate-900">
          Inbox
        </h1>
        <div className="flex-1 flex justify-end">
          <button 
            className="text-slate-700 active:text-slate-900 transition-colors p-2 -m-2 touch-manipulation"
          >
            <Edit className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        {threads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl">💬</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">No messages yet</p>
            <p className="text-slate-300 text-xs mt-1">Complete levels to unlock conversations!</p>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {threads.map((thread) => {
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
            })}
          </div>
        )}
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
