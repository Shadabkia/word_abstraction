import { Monitor, Smartphone, GripHorizontal, ChevronDown, Check, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';

export type DeviceModel = 
  | 'iphone-se' 
  | 'iphone-13-mini' 
  | 'iphone-14-pro' 
  | 'iphone-14-plus' 
  | 'iphone-14-pro-max' 
  | 'pixel-5' 
  | 'pixel-7'
  | 'galaxy-s22' 
  | 'galaxy-s22-ultra'
  | 'fullscreen';

interface DeviceSimulatorBarProps {
  currentModel: DeviceModel;
  onModelChange: (model: DeviceModel) => void;
  scale?: number;
  onScaleChange?: (scale: number) => void;
}

const DEVICES: { id: DeviceModel; label: string; group: string }[] = [
  { id: 'fullscreen', label: 'Full Screen', group: 'Desktop' },
  { id: 'iphone-se', label: 'iPhone SE', group: 'iOS' },
  { id: 'iphone-13-mini', label: 'iPhone 13 Mini', group: 'iOS' },
  { id: 'iphone-14-pro', label: 'iPhone 14 Pro', group: 'iOS' },
  { id: 'iphone-14-plus', label: 'iPhone 14 Plus', group: 'iOS' },
  { id: 'iphone-14-pro-max', label: 'iPhone 14 Pro Max', group: 'iOS' },
  { id: 'pixel-5', label: 'Pixel 5', group: 'Android' },
  { id: 'pixel-7', label: 'Pixel 7', group: 'Android' },
  { id: 'galaxy-s22', label: 'Galaxy S22', group: 'Android' },
  { id: 'galaxy-s22-ultra', label: 'Galaxy S22 Ultra', group: 'Android' },
];

export function DeviceSimulatorBar({ currentModel, onModelChange, scale = 100, onScaleChange }: DeviceSimulatorBarProps) {
  const constraintsRef = useRef(null);

  const currentLabel = DEVICES.find(d => d.id === currentModel)?.label;

  const handleZoomIn = () => {
    if (onScaleChange) onScaleChange(Math.min(scale + 10, 150));
  };

  const handleZoomOut = () => {
    if (onScaleChange) onScaleChange(Math.max(scale - 10, 50));
  };

  return (
    <>
      {/* Invisible constraints layer for dragging */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-40" />
      
      <motion.div 
        drag
        dragMomentum={false}
        dragConstraints={constraintsRef}
        initial={{ x: "-50%", y: 0 }}
        style={{ x: "-50%" }} // Keep centered initially but allow drag overrides
        className="fixed bottom-6 left-1/2 z-50 hidden md:block cursor-grab active:cursor-grabbing touch-none"
      >
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-1.5 pl-3 pr-1.5 rounded-full shadow-2xl flex items-center gap-3">
          
          <GripHorizontal className="w-4 h-4 text-slate-500" />
          
          <Select.Root value={currentModel} onValueChange={(v) => onModelChange(v as DeviceModel)}>
            <Select.Trigger className="flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-white transition-colors outline-none min-w-[140px] justify-between px-2 py-1 rounded hover:bg-white/5">
              <div className="flex items-center gap-2">
                {currentModel === 'fullscreen' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                <Select.Value>{currentLabel}</Select.Value>
              </div>
              <Select.Icon>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="overflow-hidden bg-slate-800 rounded-xl border border-white/10 shadow-xl min-w-[200px] z-[60]">
                <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-slate-800 text-violet11 cursor-default">
                  <ChevronDown className="rotate-180 w-4 h-4" />
                </Select.ScrollUpButton>
                
                <Select.Viewport className="p-2">
                  <Select.Group>
                    <Select.Label className="px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Desktop
                    </Select.Label>
                    {DEVICES.filter(d => d.group === 'Desktop').map(device => (
                      <SelectItem key={device.id} value={device.id}>{device.label}</SelectItem>
                    ))}
                  </Select.Group>
                  
                  <Select.Separator className="h-px bg-white/10 my-2" />

                  <Select.Group>
                    <Select.Label className="px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      iOS
                    </Select.Label>
                    {DEVICES.filter(d => d.group === 'iOS').map(device => (
                      <SelectItem key={device.id} value={device.id}>{device.label}</SelectItem>
                    ))}
                  </Select.Group>

                  <Select.Separator className="h-px bg-white/10 my-2" />

                  <Select.Group>
                    <Select.Label className="px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Android
                    </Select.Label>
                    {DEVICES.filter(d => d.group === 'Android').map(device => (
                      <SelectItem key={device.id} value={device.id}>{device.label}</SelectItem>
                    ))}
                  </Select.Group>

                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          {onScaleChange && (
            <>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1">
                <button 
                  onClick={handleZoomOut}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono text-slate-400 w-8 text-center">{scale}%</span>
                <button 
                  onClick={handleZoomIn}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

        </div>
      </motion.div>
    </>
  );
}

const SelectItem = ({ children, value, ...props }: any) => {
  return (
    <Select.Item
      value={value}
      className="relative flex items-center h-9 px-8 rounded-lg text-sm text-slate-300 data-[highlighted]:bg-indigo-600 data-[highlighted]:text-white outline-none cursor-pointer select-none pl-8"
      {...props}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-2 inline-flex items-center justify-center">
        <Check className="w-4 h-4" />
      </Select.ItemIndicator>
    </Select.Item>
  );
};
