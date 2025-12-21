import React, { useMemo } from 'react';
import { ForgeProvider, type ForgeState } from '@/forge-ui';
import { useSettingsStore } from '@/core/state/settingsStore';

export function ForgeSettingsProvider({ children }: { children: React.ReactNode }) {
  const {
    themeMode,
    themePalette,
    themeAlive,
    themeConfig,
    setThemeMode,
    setThemePalette,
    setThemeAlive,
    updateThemeConfig,
  } = useSettingsStore();

  const initialState = useMemo<Partial<ForgeState>>(
    () => ({
      currentMode: themeMode,
      activePalette: themePalette,
      isAlive: themeAlive,
      config: themeConfig,
    }),
    // only used on initial mount (ForgeProvider is currently uncontrolled after init)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <ForgeProvider
      initialState={initialState}
      onStateChange={(s) => {
        // Persist changes into the app settings store.
        if (s.currentMode !== themeMode) setThemeMode(s.currentMode);
        if (s.activePalette !== themePalette) setThemePalette(s.activePalette);
        if (s.isAlive !== themeAlive) setThemeAlive(s.isAlive);

        // config is a small object; update by keys to keep store stable.
        if (s.config.density !== themeConfig.density) updateThemeConfig('density', s.config.density);
        if (s.config.radiusScale !== themeConfig.radiusScale) updateThemeConfig('radiusScale', s.config.radiusScale);
        if (s.config.animationSpeed !== themeConfig.animationSpeed) updateThemeConfig('animationSpeed', s.config.animationSpeed);
        if (s.config.reducedMotion !== themeConfig.reducedMotion) updateThemeConfig('reducedMotion', s.config.reducedMotion);
      }}
    >
      {children}
    </ForgeProvider>
  );
}


