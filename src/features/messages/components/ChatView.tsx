import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MoreVertical, Phone, Video, Send, Paperclip, Smile } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { contentManager } from '@/core/services/contentManager';
import { useGameState } from '@/core/state/gameState';

interface ChatViewProps {
  threadId: string;
  npcName: string;
  npcHandle: string;
  avatarColor: string;
  onBack: () => void;
}

export function ChatView({ threadId, npcName, npcHandle, avatarColor, onBack }: ChatViewProps) {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { progress } = useGameState();
  
  // Get messages for this thread
  const thread = contentManager.getThreadById(threadId);
  
  // Filter messages based on unlock conditions
  const visibleMessages = thread?.messages.filter(msg => {
    if (!msg.unlockCondition) return true;
    if (msg.unlockCondition.type === 'level_complete') {
      return progress.completedLevels.includes(msg.unlockCondition.targetId);
    }
    return true;
  }) || [];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleMessages.length]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // TODO: Add message to state/storage
      console.log('Sending message:', inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-white flex flex-col z-50 touch-pan-y"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
      style={{ 
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
        overscrollBehavior: 'contain'
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b-2 border-slate-100 bg-white shrink-0 shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={onBack}
            className="text-indigo-600 active:text-indigo-700 transition-colors p-2 active:bg-indigo-50 rounded-xl -ml-2 touch-manipulation"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div
            className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center border-2 border-white shadow-sm shrink-0`}
          >
            <span className="text-white font-bold text-sm">{npcName[0]}</span>
          </div>
          
          <div className="flex-1 min-w-0 mr-2">
            <h2 className="text-base font-bold text-slate-900 truncate leading-tight">{npcName}</h2>
            <p className="text-xs text-slate-500 truncate">{npcHandle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            className="text-slate-600 active:text-indigo-600 transition-colors p-2 active:bg-indigo-50 rounded-xl touch-manipulation"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            className="text-slate-600 active:text-indigo-600 transition-colors p-2 active:bg-indigo-50 rounded-xl touch-manipulation"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white overscroll-contain"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y'
        }}
      >
        <div className="px-4 py-6 min-h-full">
          {/* Date separator */}
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="bg-slate-200/70 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full">
              Today
            </span>
          </motion.div>

          {/* Messages */}
          <AnimatePresence mode="popLayout">
            {visibleMessages.length === 0 ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="text-3xl">💬</span>
                </motion.div>
                <p className="text-slate-400 text-sm">No messages yet</p>
                <p className="text-slate-300 text-xs mt-1">Start the conversation!</p>
              </motion.div>
            ) : (
              visibleMessages.map((msg, index) => (
                <MessageBubble
                  key={msg.id}
                  text={msg.text}
                  isSender={msg.senderId === 'player'}
                  timestamp={msg.timestamp}
                  type={msg.type}
                  actionLink={msg.actionLink}
                />
              ))
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Locked messages indicator */}
      {thread && thread.messages.length > visibleMessages.length && (
        <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 shrink-0">
          <p className="text-xs text-amber-700 text-center flex items-center justify-center gap-2">
            <span>🔒</span>
            <span>
              {thread.messages.length - visibleMessages.length} message
              {thread.messages.length - visibleMessages.length > 1 ? 's' : ''} locked. 
              Complete more levels to unlock!
            </span>
          </p>
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 py-3 border-t-2 border-slate-100 bg-white shrink-0 safe-area-bottom">
        <div className="flex items-end gap-2">
          <button
            className="text-slate-400 active:text-indigo-600 transition-colors p-2 active:bg-indigo-50 rounded-xl touch-manipulation shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 bg-slate-100 rounded-2xl px-4 py-2.5 flex items-center gap-2 border-2 border-slate-200 focus-within:border-indigo-400 transition-colors min-w-0">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400 min-w-0"
            />
            <button
              className="text-slate-400 active:text-indigo-600 transition-colors touch-manipulation shrink-0"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className={`p-3 rounded-xl transition-all touch-manipulation shrink-0 ${
              inputMessage.trim()
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

