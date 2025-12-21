import { motion } from 'framer-motion';
import { Zap, Grid, Truck, MessageCircle, User, type LucideIcon } from 'lucide-react';
import type { AppTab } from '@/core/navigation/types';
import { cn } from '@/shared/ui/utils';

interface BottomNavigationProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  unreadCount?: number;
  isFullscreen?: boolean;
}

interface NavItem {
  id: AppTab;
  icon: LucideIcon;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'feed', icon: Zap, label: 'Feed' },
  { id: 'arcade', icon: Grid, label: 'Arcade' },
  { id: 'dashboard', icon: Truck, label: 'Drive' },
  { id: 'messages', icon: MessageCircle, label: 'Chat' },
  { id: 'profile', icon: User, label: 'Me' },
];

export function BottomNavigation({ activeTab, onTabChange, unreadCount = 0, isFullscreen }: BottomNavigationProps) {
  return (
    <div className={cn(
      "absolute bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none",
      isFullscreen && "mb-4"
    )}>
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="pointer-events-auto relative bg-card border-2 border-border shadow-sticker rounded-3xl p-2 flex items-center gap-1 sm:gap-2 max-w-md w-full"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const isCenter = item.id === 'dashboard';
          
          if (isCenter) {
             return (
               <div key={item.id} className="relative -top-6 px-1">
                 <motion.button
                   onClick={() => onTabChange(item.id)}
                   whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
                   whileTap={{ scale: 0.95 }}
                   transition={{ type: "spring", stiffness: 400, damping: 15 }}
                   className={cn(
                     "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 relative group z-20 border-2 border-border",
                     isActive 
                       ? "bg-primary shadow-sticker text-primary-foreground" 
                       : "bg-card text-foreground shadow-sticker hover:bg-muted"
                   )}
                 >
                   <item.icon 
                     className={cn(
                       "w-8 h-8 transition-all duration-300",
                       isActive ? "text-primary-foreground" : "text-foreground"
                     )} 
                     strokeWidth={2.5}
                   />
                 </motion.button>
               </div>
             );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative flex-1 flex flex-col items-center justify-center py-2 min-w-[3.5rem] rounded-xl group"
            >
              {/* Active Background Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-accent border-2 border-border rounded-xl shadow-[2px_2px_0px_0px_var(--color-border)]"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Icon Container */}
              <div className="relative z-10">
                <motion.div
                  animate={isActive ? {
                    scale: 1.1,
                    y: -2,
                    color: 'var(--color-foreground)'
                  } : {
                    scale: 1,
                    y: 0,
                    color: 'var(--color-muted-foreground)'
                  }}
                  whileHover={{ scale: 1.1, color: 'var(--color-foreground)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <item.icon className="w-6 h-6" strokeWidth={2.5} />
                </motion.div>
              </div>

              {/* Unread Badge */}
              {item.id === 'messages' && unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-2 w-5 h-5 bg-destructive border-2 border-border rounded-full flex items-center justify-center text-[10px] text-destructive-foreground font-black shadow-[1px_1px_0px_0px_var(--color-border)]"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.div>
              )}
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
}
