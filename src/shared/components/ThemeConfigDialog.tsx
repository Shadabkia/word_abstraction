import React, { useMemo } from 'react';
import { GameDialog, GameSelect, GameSlider, GameToggle, useForge, type ThemeMode } from '@/forge-ui';

type ThemeConfigDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ThemeConfigDialog({ open, onOpenChange }: ThemeConfigDialogProps) {
  const { currentMode, setTheme, availableThemeMeta, activePalette, setPalette, availablePalettes, isAlive, toggleAlive, config, updateConfig } =
    useForge();

  const themeOptions = useMemo(
    () =>
      availableThemeMeta.map((t) => ({
        value: t.mode,
        label: t.name,
      })),
    [availableThemeMeta]
  );

  const paletteOptions = useMemo(
    () =>
      availablePalettes.map((p) => ({
        value: p,
        label: p === 'default' ? 'Default' : p,
      })),
    [availablePalettes]
  );

  return (
    <GameDialog
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Theme"
      type="info"
    >
      <div className="space-y-4">
        <GameSelect
          label="Theme"
          value={currentMode}
          options={themeOptions}
          onChange={(e) => setTheme(e.target.value as ThemeMode)}
        />

        <GameSelect
          label="Palette"
          value={activePalette}
          options={paletteOptions}
          onChange={(e) => setPalette(e.target.value)}
        />

        <div className="pt-2 space-y-3">
          <GameToggle checked={isAlive} onChange={() => toggleAlive()} label="Alive (extra motion + juice)" />
          <GameToggle
            checked={config.reducedMotion}
            onChange={(checked) => updateConfig('reducedMotion', checked)}
            label="Reduced motion"
          />
        </div>

        <div className="pt-2 space-y-4">
          <GameSlider
            label="Animation speed"
            min={50}
            max={150}
            value={Math.round(config.animationSpeed * 100)}
            onChange={(v) => updateConfig('animationSpeed', v / 100)}
          />
          <GameSlider
            label="Radius scale"
            min={50}
            max={150}
            value={Math.round(config.radiusScale * 100)}
            onChange={(v) => updateConfig('radiusScale', v / 100)}
          />
          <GameSelect
            label="Density"
            value={config.density}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'spacious', label: 'Spacious' },
            ]}
            onChange={(e) => updateConfig('density', e.target.value)}
          />
        </div>
      </div>
    </GameDialog>
  );
}


