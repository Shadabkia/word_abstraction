import { useEffect, useMemo, useState } from 'react';
import { Truck, Grid, MessageCircle, User, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardScreen } from './features/dashboard/DashboardScreen';
import { FeedScreen } from './features/feed/FeedScreen';
import { ArcadeScreen } from './features/arcade/ArcadeScreen';
import { MessagesScreen } from './features/messages/MessagesScreen';
import { ProfileScreen } from './features/profile/ProfileScreen';
import { DebugOverlay } from './shared/components/DebugOverlay';
import { DeviceSimulatorBar, DeviceModel } from './shared/components/DeviceSimulatorBar';
import { useGameState } from './core/state/gameState';
import { gameRegistry, type GameLaunchRef } from './core/games/gameRegistry';
import type { AppTab } from '@/core/navigation/types';
import * as historyNav from '@/core/navigation/historyNav';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

export default function App() {
  const [nav, setNav] = useState<historyNav.NavState>(() => {
    if (typeof window === 'undefined') return { kind: 'tab', tab: 'dashboard', v: 1, depth: 0 };
    return historyNav.getNavState() ?? { kind: 'tab', tab: 'dashboard', v: 1, depth: 0 };
  });
  const [debugOpen, setDebugOpen] = useState(false);
  const [deviceModel, setDeviceModel] = useState<DeviceModel>('iphone-14-pro');
  const [scale, setScale] = useState(100);
  const { completeLevel, inbox } = useGameState();
  
  // Calculate total unread messages
  const unreadCount = inbox.activeThreads.length - inbox.readMessages.length;

  // Debug shortcut: Press Ctrl+Shift+D to open debug panel
  useEffect(() => {
    // Ensure we have a root history entry and subscribe to back/forward.
    const initial = historyNav.init('dashboard');
    setNav(initial);
    const unsub = historyNav.subscribe(setNav);
    return unsub;
  }, []);

  // Android hardware back: pop in-app stack; root exits.
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const remove = CapacitorApp.addListener('backButton', () => {
      const current = historyNav.getNavState();
      if (historyNav.canGoBack(current)) {
        historyNav.back();
        return;
      }
      CapacitorApp.exitApp();
    });
    return () => {
      remove.then((h) => h.remove());
    };
  }, []);

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

  const activeGame: GameLaunchRef | null = nav.kind === 'game' ? nav.ref : null;
  const activeTab: AppTab = useMemo(() => {
    switch (nav.kind) {
      case 'tab':
        return nav.tab;
      case 'profilePost':
        return 'profile';
      case 'arcadeGame':
        return 'arcade';
      case 'game':
        // Should not matter; game view hides tabs.
        return 'dashboard';
    }
  }, [nav]);

  const profileSelectedLevelId = nav.kind === 'profilePost' ? nav.levelId : null;
  const arcadeSelectedGameId = nav.kind === 'arcadeGame' ? nav.gameId : null;

  const setTab = (tab: AppTab) => {
    // Mobile-friendly: tab switches do NOT add to the back stack.
    historyNav.replace({ kind: 'tab', tab, v: 1, depth: 0 });
    setNav({ kind: 'tab', tab, v: 1, depth: 0 });
  };

  const handlePlayGame = (ref: GameLaunchRef) => {
    historyNav.push({ kind: 'game', ref, v: 1, depth: 2 });
    setNav({ kind: 'game', ref, v: 1, depth: 2 });
  };

  const handleExitGame = () => {
    historyNav.backOrReplaceTab('arcade');
  };

  const handleGameComplete = (score: number) => {
    // Update campaign progression only when launched from campaign.
    if (activeGame?.campaignLevelId) {
      completeLevel(activeGame.campaignLevelId, score, 3); // 3 stars for now
    }
    
    // Show success, then return to previous tab
    setTimeout(() => {
      // Return to wherever the player was before the game.
      historyNav.backOrReplaceTab('arcade');
    }, 2000);
  };

  const getContainerStyle = (model: DeviceModel) => {
    switch (model) {
      // iOS Devices
      case 'iphone-se':
        return 'w-full max-w-[375px] h-[667px] rounded-[2rem] border-[8px] border-slate-800';
      case 'iphone-13-mini':
        return 'w-full max-w-[375px] h-[812px] rounded-[2.5rem] border-[8px] border-slate-800';
      case 'iphone-14-pro':
        return 'w-full max-w-[430px] h-[932px] rounded-[3rem] border-[8px] border-slate-800';
      case 'iphone-14-plus':
        return 'w-full max-w-[428px] h-[926px] rounded-[3rem] border-[8px] border-slate-800';
      case 'iphone-14-pro-max':
        return 'w-full max-w-[430px] h-[932px] rounded-[3rem] border-[8px] border-slate-800';
      
      // Android Devices
      case 'pixel-5':
        return 'w-full max-w-[393px] h-[851px] rounded-[2rem] border-[8px] border-slate-800';
      case 'pixel-7':
        return 'w-full max-w-[412px] h-[915px] rounded-[2.5rem] border-[8px] border-slate-800';
      case 'galaxy-s22':
        return 'w-full max-w-[360px] h-[780px] rounded-[2rem] border-[8px] border-slate-800';
      case 'galaxy-s22-ultra':
        return 'w-full max-w-[412px] h-[915px] rounded-[2.5rem] border-[8px] border-slate-800';
      
      case 'fullscreen':
        return 'w-full h-full max-w-none max-h-none rounded-none border-0';
      default:
        return 'w-full max-w-[430px] h-[932px] rounded-[3rem] border-[8px] border-slate-800';
    }
  };

  const isFullscreen = deviceModel === 'fullscreen';

  const renderContent = () => {
    if (activeGame) {
      const entry = gameRegistry[activeGame.gameId];
      const GameComponent = entry.Component;
      return (
        <GameComponent
          onExit={handleExitGame}
          onComplete={handleGameComplete}
          {...entry.buildProps(activeGame)}
        />
      );
    }

    return (
      <>
        <div className={`flex flex-col h-full bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 relative overflow-hidden ${isFullscreen ? 'h-screen' : ''}`}>
          
          {/* Background Texture */}
          <div className="absolute inset-0 bg-pattern-subtle opacity-[0.03] pointer-events-none" />

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
            {activeTab === 'arcade' && (
              <ArcadeScreen
                onPlayGame={handlePlayGame}
                selectedGameId={arcadeSelectedGameId}
                onSelectGame={(gameId) => {
                  historyNav.push({ kind: 'arcadeGame', tab: 'arcade', gameId, v: 1, depth: 1 });
                  setNav({ kind: 'arcadeGame', tab: 'arcade', gameId, v: 1, depth: 1 });
                }}
                onCloseGameSelector={() => historyNav.backOrReplaceTab('arcade')}
              />
            )}
            {activeTab === 'messages' && <MessagesScreen />}
            {activeTab === 'profile' && (
              <ProfileScreen
                onPlayGame={handlePlayGame}
                selectedLevelId={profileSelectedLevelId}
                onOpenLevel={(levelId) => {
                  historyNav.push({ kind: 'profilePost', tab: 'profile', levelId, v: 1, depth: 1 });
                  setNav({ kind: 'profilePost', tab: 'profile', levelId, v: 1, depth: 1 });
                }}
                onCloseLevel={() => historyNav.backOrReplaceTab('profile')}
              />
            )}
          </div>

          {/* Bottom Navigation Bar - Enhanced Floating Pill */}
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className={`absolute bottom-6 left-4 right-4 bg-white/90 backdrop-blur-xl border border-white/50 px-2 py-2 flex items-center justify-between rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-40 ${isFullscreen ? 'max-w-md mx-auto mb-4' : ''}`}
          >
            
            <NavButton 
              active={activeTab === 'feed'} 
              onClick={() => setTab('feed')}
              icon={Zap}
            />
            
            <NavButton 
              active={activeTab === 'arcade'} 
              onClick={() => setTab('arcade')}
              icon={Grid}
            />
            
            {/* Center Dashboard Button - The "Home" Anchor */}
            <div className="relative px-2">
              <motion.button 
                onClick={() => setTab('dashboard')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300
                  ${activeTab === 'dashboard' 
                    ? 'bg-indigo-50 text-indigo-600 shadow-lg ring-2 ring-indigo-100' 
                    : 'bg-white text-slate-400 border border-slate-100 shadow-sm'
                  }
                `}
              >
                {/* "Cheron" / Ripple / Glow Animation Layer */}
                {activeTab === 'dashboard' && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-indigo-200"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <Truck className="w-7 h-7 relative z-10" strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
              </motion.button>
            </div>

            <NavButton 
              active={activeTab === 'messages'} 
              onClick={() => setTab('messages')}
              icon={MessageCircle}
              badge={unreadCount > 0 ? unreadCount : undefined}
            />
            
            <NavButton 
              active={activeTab === 'profile'} 
              onClick={() => setTab('profile')}
              icon={User}
            />
          </motion.div>
        </div>

        {/* Debug Overlay - Ctrl+Shift+D to open */}
        <DebugOverlay isOpen={debugOpen} onClose={() => setDebugOpen(false)} />
      </>
    );
  };

  // Mobile detection hook or check
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isMobile) {
    return (
      <div className="h-[100dvh] w-full bg-white">
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0b0f14] flex flex-col items-center justify-center font-sans overflow-auto py-12">
      <div 
        className="transition-all duration-300 origin-top"
        style={{ transform: `scale(${scale / 100})` }}
      >
        <div className={`bg-white overflow-hidden shadow-2xl relative ring-1 ring-slate-900/5 transition-all duration-500 ease-spring ${getContainerStyle(deviceModel)}`}>
          {renderContent()}
        </div>
      </div>
      
      <DeviceSimulatorBar 
        currentModel={deviceModel} 
        onModelChange={setDeviceModel} 
        scale={scale}
        onScaleChange={setScale}
      />
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, badge }: { active: boolean, onClick: () => void, icon: any, badge?: number }) {
  return (
    <motion.button 
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`p-3 rounded-full transition-all relative ${
        active 
          ? 'text-indigo-600 bg-indigo-50 shadow-inner' 
          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
      }`}
    >
      <motion.div
        animate={active ? { rotate: [0, -10, 10, 0], scale: 1.1 } : {}}
        transition={{ duration: 0.5 }}
      >
        <Icon className={`w-6 h-6 ${active ? 'fill-current' : ''}`} strokeWidth={active ? 2.5 : 2} />
      </motion.div>
      {badge !== undefined && badge > 0 && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
        >
          <span className="text-white text-[10px] font-bold">{badge > 9 ? '9+' : badge}</span>
        </motion.div>
      )}
    </motion.button>
  );
}
