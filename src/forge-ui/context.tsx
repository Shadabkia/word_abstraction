
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { GameTheme, ThemeMode, ThemeConfig } from './types';

// Theme Imports
import { casualTheme } from './themes/casual';
import { scifiTheme } from './themes/scifi';
import { fantasyTheme } from './themes/fantasy';
import { playfulTheme } from './themes/playful';
import { horrorTheme } from './themes/horror';
import { pixelTheme } from './themes/pixel';
import { comicTheme } from './themes/comic';
import { natureTheme } from './themes/nature';
import { bubbleTheme } from './themes/bubble';
import { paperTheme } from './themes/paper';
import { mangaTheme } from './themes/manga';
import { popartTheme } from './themes/popart';
import { sketchTheme } from './themes/sketch';
import { stickerTheme } from './themes/sticker';
import { clayTheme } from './themes/clay';
import { socialTheme } from './themes/social';

const themeRegistry: Record<ThemeMode, GameTheme> = {
  casual: casualTheme,
  scifi: scifiTheme,
  fantasy: fantasyTheme,
  playful: playfulTheme,
  horror: horrorTheme,
  pixel: pixelTheme,
  comic: comicTheme,
  nature: natureTheme,
  bubble: bubbleTheme,
  paper: paperTheme,
  manga: mangaTheme,
  popart: popartTheme,
  sketch: sketchTheme,
  sticker: stickerTheme,
  clay: clayTheme,
  social: socialTheme,
};

export type ForgeState = {
  currentMode: ThemeMode;
  activePalette: string;
  isAlive: boolean;
  config: ThemeConfig;
};

interface ForgeContextType {
  theme: GameTheme;
  currentMode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  availableThemes: ThemeMode[];
  availableThemeMeta: Array<{ mode: ThemeMode; name: string; description: string }>;
  isAlive: boolean;
  toggleAlive: () => void;
  activePalette: string;
  setPalette: (paletteName: string) => void;
  availablePalettes: string[];
  config: ThemeConfig;
  updateConfig: (key: keyof ThemeConfig, value: any) => void;
}

const ForgeContext = createContext<ForgeContextType | undefined>(undefined);

type ForgeProviderProps = {
  children: React.ReactNode;
  initialState?: Partial<ForgeState>;
  onStateChange?: (state: ForgeState) => void;
};

export const ForgeProvider: React.FC<ForgeProviderProps> = ({ children, initialState, onStateChange }) => {
  const [currentMode, setCurrentMode] = useState<ThemeMode>(initialState?.currentMode ?? 'casual');
  const [activePalette, setActivePalette] = useState<string>(initialState?.activePalette ?? 'default');
  const [isAlive, setIsAlive] = useState<boolean>(initialState?.isAlive ?? true);

  const [config, setConfig] = useState<ThemeConfig>(
    initialState?.config ?? {
      density: 'comfortable',
      radiusScale: 1,
      animationSpeed: 1,
      reducedMotion: false,
    }
  );

  const baseTheme = themeRegistry[currentMode] || casualTheme;

  const theme = useMemo(() => {
     let activeTheme = baseTheme;
     if (baseTheme.palettes && activePalette !== 'default' && baseTheme.palettes[activePalette]) {
         const paletteOverrides = baseTheme.palettes[activePalette];
         activeTheme = {
             ...baseTheme,
             colors: { ...baseTheme.colors, ...paletteOverrides }
         };
     }
     return activeTheme;
  }, [baseTheme, activePalette]);

  useEffect(() => { setActivePalette('default'); }, [currentMode]);

  const setTheme = (mode: ThemeMode) => setCurrentMode(mode);
  const setPalette = (paletteName: string) => setActivePalette(paletteName);
  const toggleAlive = () => setIsAlive((prev) => !prev);
  const updateConfig = (key: keyof ThemeConfig, value: any) => setConfig((prev) => ({ ...prev, [key]: value }));

  const availableThemes = Object.keys(themeRegistry) as ThemeMode[];
  const availableThemeMeta = useMemo(
    () =>
      availableThemes.map((mode) => ({
        mode,
        name: themeRegistry[mode].name,
        description: themeRegistry[mode].description,
      })),
    [availableThemes]
  );
  const availablePalettes = baseTheme.palettes ? ['default', ...Object.keys(baseTheme.palettes)] : ['default'];

  const effectiveIsAlive = isAlive && !config.reducedMotion;

  useEffect(() => {
    if (!onStateChange) return;
    onStateChange({ currentMode, activePalette, isAlive, config });
  }, [currentMode, activePalette, isAlive, config, onStateChange]);

  return (
    <ForgeContext.Provider value={{ 
        theme, currentMode, setTheme, availableThemes,
        availableThemeMeta,
        isAlive: effectiveIsAlive, toggleAlive, activePalette, setPalette, availablePalettes,
        config, updateConfig
    }}>
      {children}
    </ForgeContext.Provider>
  );
};

export const useForge = () => {
  const context = useContext(ForgeContext);
  if (!context) throw new Error('useForge must be used within a ForgeProvider');
  return context;
};
