import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'fa';

interface SettingsState {
  language: Language;
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  
  // Actions
  setLanguage: (lang: Language) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleHaptics: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en', // Default to English for now as per previous logic, or 'fa' if preferred
      soundEnabled: true,
      musicEnabled: true,
      hapticsEnabled: true,

      setLanguage: (lang) => set({ language: lang }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
      toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
    }),
    {
      name: 'pars-ra-pas-settings',
    }
  )
);

