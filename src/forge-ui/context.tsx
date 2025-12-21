
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

interface ForgeContextType {
  theme: GameTheme;
  currentMode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  availableThemes: ThemeMode[];
  isAlive: boolean;
  toggleAlive: () => void;
  activePalette: string;
  setPalette: (paletteName: string) => void;
  availablePalettes: string[];
  config: ThemeConfig;
  updateConfig: (key: keyof ThemeConfig, value: any) => void;
}

const ForgeContext = createContext<ForgeContextType | undefined>(undefined);

export const ForgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<ThemeMode>('casual');
  const [activePalette, setActivePalette] = useState<string>('default');
  const [isAlive, setIsAlive] = useState<boolean>(true);
  
  const [config, setConfig] = useState<ThemeConfig>({
    density: 'comfortable',
    radiusScale: 1,
    animationSpeed: 1,
    reducedMotion: false,
  });

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
  const toggleAlive = () => setIsAlive(prev => !prev);
  const updateConfig = (key: keyof ThemeConfig, value: any) => setConfig(prev => ({ ...prev, [key]: value }));

  const availableThemes = Object.keys(themeRegistry) as ThemeMode[];
  const availablePalettes = baseTheme.palettes ? ['default', ...Object.keys(baseTheme.palettes)] : ['default'];

  return (
    <ForgeContext.Provider value={{ 
        theme, currentMode, setTheme, availableThemes,
        isAlive, toggleAlive, activePalette, setPalette, availablePalettes,
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
