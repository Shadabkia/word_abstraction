import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeConfig, ThemeMode } from '@/forge-ui';

type Language = 'en' | 'fa';

interface SettingsState {
  language: Language;
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;

  // Theme (Forge UI)
  themeMode: ThemeMode;
  themePalette: string;
  themeAlive: boolean;
  themeConfig: ThemeConfig;
  
  // Actions
  setLanguage: (lang: Language) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleHaptics: () => void;

  setThemeMode: (mode: ThemeMode) => void;
  setThemePalette: (palette: string) => void;
  setThemeAlive: (alive: boolean) => void;
  toggleThemeAlive: () => void;
  updateThemeConfig: <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en', // Default to English for now as per previous logic, or 'fa' if preferred
      soundEnabled: true,
      musicEnabled: true,
      hapticsEnabled: true,

      themeMode: 'casual',
      themePalette: 'default',
      themeAlive: true,
      themeConfig: {
        density: 'comfortable',
        radiusScale: 1,
        animationSpeed: 1,
        reducedMotion: false,
      },

      setLanguage: (lang) => set({ language: lang }),
      toggleSound: () => {
        let next = true;
        set((state) => {
          next = !state.soundEnabled;
          return { soundEnabled: next };
        });
        return next;
      },
      toggleMusic: () => {
        let next = true;
        set((state) => {
          next = !state.musicEnabled;
          return { musicEnabled: next };
        });
        return next;
      },
      toggleHaptics: () => {
        let next = true;
        set((state) => {
          next = !state.hapticsEnabled;
          return { hapticsEnabled: next };
        });
        return next;
      },

      setThemeMode: (mode) => set({ themeMode: mode }),
      setThemePalette: (palette) => set({ themePalette: palette }),
      setThemeAlive: (alive) => set({ themeAlive: alive }),
      toggleThemeAlive: () => set((state) => ({ themeAlive: !state.themeAlive })),
      updateThemeConfig: (key, value) => set((state) => ({ themeConfig: { ...state.themeConfig, [key]: value } })),
    }),
    {
      name: 'pars-ra-pas-settings',
    }
  )
);

