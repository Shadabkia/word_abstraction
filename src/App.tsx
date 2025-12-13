import { useState, useEffect } from 'react';
import { Truck, Grid, MessageCircle, User, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardScreen } from './features/dashboard/DashboardScreen';
import { FeedScreen } from './features/feed/FeedScreen';
import { ArcadeScreen } from './features/arcade/ArcadeScreen';
import { MessagesScreen } from './features/messages/MessagesScreen';
import { ProfileScreen } from './features/profile/ProfileScreen';
import WordConnectGame from './games/word-connect/WordConnectGame';
import { DebugOverlay } from './shared/components/DebugOverlay';
import { useGameState } from './core/state/gameState';

type Tab = 'feed' | 'arcade' | 'dashboard' | 'messages' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [debugOpen, setDebugOpen] = useState(false);
  const { completeLevel, inbox } = useGameState();
  
  // Calculate total unread messages
  const unreadCount = inbox.activeThreads.length - inbox.readMessages.length;

  // Debug shortcut: Press Ctrl+Shift+D to open debug panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setDebugOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePlayGame = (gameId: string, levelNumber?: number) => {
    setActiveGame(gameId);
    setCurrentLevel(levelNumber || 1);
  };

  const handleExitGame = () => {
    setActiveGame(null);
  };

  const handleGameComplete = (score: number) => {
    // Update game state with completed level
    const levelId = `level_${currentLevel}`;
    completeLevel(levelId, score, 3); // 3 stars for now
    
    // Show success, then return to previous tab
    setTimeout(() => {
      setActiveGame(null);
      // Return to arcade or profile based on context
    }, 2000);
  };

  if (activeGame === 'word-connect') {
    return (
      <WordConnectGame 
        onExit={handleExitGame} 
        onComplete={handleGameComplete}
        initialLevel={currentLevel}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen max-w-md mx-auto bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 relative overflow-hidden shadow-2xl">
        
        {/* Decorative floating elements - hidden (portrait-first) */}
        <div className="hidden absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-300 rounded-full blur-2xl floating-element" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-20 w-32 h-32 bg-blue-300 rounded-full blur-3xl floating-element" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-pink-300 rounded-full blur-2xl floating-element" style={{ animationDelay: '4s' }} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide relative z-10">
          {activeTab === 'dashboard' && <DashboardScreen />}
          {activeTab === 'feed' && <FeedScreen />}
          {activeTab === 'arcade' && <ArcadeScreen onPlayGame={handlePlayGame} />}
          {activeTab === 'messages' && <MessagesScreen />}
          {activeTab === 'profile' && <ProfileScreen onPlayGame={handlePlayGame} />}
        </div>

      {/* Bottom Navigation Bar - Enhanced */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/50 px-6 py-4 pb-6 flex items-center justify-between rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-40"
      >
        
        <NavButton 
          active={activeTab === 'feed'} 
          onClick={() => setActiveTab('feed')}
          icon={Zap}
        />
        
        <NavButton 
          active={activeTab === 'arcade'} 
          onClick={() => setActiveTab('arcade')}
          icon={Grid}
        />
        
        {/* Center Dashboard Button - Enhanced */}
        <motion.div 
          className="relative -top-6"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`
              w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300
              ${activeTab === 'dashboard' 
                ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 scale-110 ring-4 ring-indigo-100 shadow-indigo-200' 
                : 'bg-white text-slate-400 border-2 border-slate-100 hover:border-indigo-200'
              }
            `}
          >
            {activeTab === 'dashboard' && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear", repeatType: "loop" }}
              />
            )}
            <Truck className={`w-8 h-8 relative z-10 ${activeTab === 'dashboard' ? 'text-white' : 'text-slate-400'}`} />
          </button>
        </motion.div>

        <NavButton 
          active={activeTab === 'messages'} 
          onClick={() => setActiveTab('messages')}
          icon={MessageCircle}
          badge={unreadCount > 0 ? unreadCount : undefined}
        />
        
        <NavButton 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')}
          icon={User}
        />
      </motion.div>
    </div>

    {/* Debug Overlay - Ctrl+Shift+D to open */}
    <DebugOverlay isOpen={debugOpen} onClose={() => setDebugOpen(false)} />
    </>
  );
}

function NavButton({ active, onClick, icon: Icon, badge }: { active: boolean, onClick: () => void, icon: any, badge?: number }) {
  return (
    <motion.button 
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`p-2 rounded-xl transition-all relative ${
        active 
          ? 'text-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md' 
          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
      }`}
    >
      <motion.div
        animate={active ? { y: [0, -2, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
      >
        <Icon className={`w-7 h-7 ${active ? 'fill-current' : ''}`} strokeWidth={active ? 2.5 : 2} />
      </motion.div>
      {badge !== undefined && badge > 0 && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <span className="text-white text-[10px] font-bold">{badge > 9 ? '9+' : badge}</span>
        </motion.div>
      )}
    </motion.button>
  );
}
