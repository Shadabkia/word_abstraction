import { useState } from 'react';
import { Home, Grid, MessageCircle, User, Zap, ArrowLeft } from 'lucide-react';
import { DashboardScreen } from './features/dashboard/DashboardScreen';
import { FeedScreen } from './features/feed/FeedScreen';
import { ArcadeScreen } from './features/arcade/ArcadeScreen';
import { MessagesScreen } from './features/messages/MessagesScreen';
import { ProfileScreen } from './features/profile/ProfileScreen';
import WordConnectGame from './games/word-connect/WordConnectGame';

type Tab = 'feed' | 'arcade' | 'dashboard' | 'messages' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const handlePlayGame = (gameId: string) => {
    setActiveGame(gameId);
  };

  const handleExitGame = () => {
    setActiveGame(null);
  };

  if (activeGame === 'word-connect') {
    return (
      <div className="relative w-full h-full min-h-screen bg-candy-bg">
        {/* Simple back button for now to exit game */}
        <button 
          onClick={handleExitGame}
          className="fixed top-4 left-4 z-50 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <WordConnectGame />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 relative overflow-hidden shadow-2xl">
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        {activeTab === 'dashboard' && <DashboardScreen />}
        {activeTab === 'feed' && <FeedScreen />}
        {activeTab === 'arcade' && <ArcadeScreen onPlayGame={handlePlayGame} />}
        {activeTab === 'messages' && <MessagesScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 pb-6 flex items-center justify-between rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-40">
        
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
        
        {/* Center Dashboard Button */}
        <div className="relative -top-6">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`
              w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform
              ${activeTab === 'dashboard' 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 scale-110 ring-4 ring-indigo-100' 
                : 'bg-white text-slate-400 border border-slate-100'
              }
            `}
          >
            <Home className={`w-8 h-8 ${activeTab === 'dashboard' ? 'text-white' : 'text-slate-400'}`} />
          </button>
        </div>

        <NavButton 
          active={activeTab === 'messages'} 
          onClick={() => setActiveTab('messages')}
          icon={MessageCircle}
        />
        
        <NavButton 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')}
          icon={User}
        />
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon }: { active: boolean, onClick: () => void, icon: any }) {
  return (
    <button 
      onClick={onClick}
      className={`p-2 rounded-xl transition-all ${active ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-50'}`}
    >
      <Icon className={`w-7 h-7 ${active ? 'fill-current' : ''}`} strokeWidth={active ? 2.5 : 2} />
    </button>
  );
}
