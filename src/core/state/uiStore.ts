import { create } from 'zustand';

interface UIState {
  activeTab: 'feed' | 'arcade' | 'dashboard' | 'messages' | 'profile';
  isTransitioning: boolean;
  
  setActiveTab: (tab: UIState['activeTab']) => void;
  setTransitioning: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'dashboard',
  isTransitioning: false,
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  setTransitioning: (value) => set({ isTransitioning: value }),
}));

