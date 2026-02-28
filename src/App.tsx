import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardScreen } from './features/dashboard/DashboardScreen';
import { FeedScreen } from './features/feed/FeedScreen';
import { ArcadeScreen } from './features/arcade/ArcadeScreen';
import { MessagesScreen } from './features/messages/MessagesScreen';
import { ProfileScreen } from './features/profile/ProfileScreen';
import { DebugOverlay } from './shared/components/DebugOverlay';
import { DeviceSimulatorBar, DeviceModel } from './shared/components/DeviceSimulatorBar';
import { BottomNavigation } from './shared/ui/BottomNavigation';
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

          {/* Bottom Navigation Bar */}
          <BottomNavigation 
            activeTab={activeTab} 
            onTabChange={setTab} 
            unreadCount={unreadCount} 
            isFullscreen={isFullscreen} 
          />
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

