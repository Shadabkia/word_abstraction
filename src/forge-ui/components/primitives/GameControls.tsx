
import React from 'react';
import { useForge } from '../../context';
import { Check, ChevronDown, Minus, Plus } from 'lucide-react';
import { SelectProps, StepperProps } from '../../types';

interface GameInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
export const GameInput: React.FC<GameInputProps> = ({ label, className = '', ...props }) => {
  const { theme } = useForge();
  return (
    <div className={theme.components.input.wrapper}>
      {label && <label className={theme.components.input.label}>{label}</label>}
      <input 
        className={`${theme.components.input.input} ${className}`} 
        {...props} 
      />
    </div>
  );
};

export const GameSelect: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
  const { theme } = useForge();
  return (
    <div className={theme.components.input.wrapper}>
      {label && <label className={theme.components.input.label}>{label}</label>}
      <div className="relative">
        <select 
          className={`${theme.components.input.input} appearance-none pr-10 cursor-pointer ${className}`} 
          {...props} 
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="text-black bg-white">
              {opt.label}
            </option>
          ))}
        </select>
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${theme.colors.muted}`}>
            <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

export const GameStepper: React.FC<StepperProps> = ({ value, min = 0, max = 100, step = 1, onChange, label }) => {
    const { theme } = useForge();
    const handleDec = () => onChange(Math.max(min, value - step));
    const handleInc = () => onChange(Math.min(max, value + step));

    return (
        <div>
            {label && <label className={theme.components.input.label}>{label}</label>}
            <div className={`flex items-center gap-2 ${theme.components.input.wrapper}`}>
                <button 
                    onClick={handleDec}
                    className={`p-2 rounded-lg !${theme.colors.secondary} text-white shadow-sm active:scale-95 transition-transform`}
                >
                    <Minus size={16} />
                </button>
                <div className={`flex-1 text-center font-bold ${theme.typography.bodyFont} ${theme.components.input.input} flex items-center justify-center !py-2`}>
                    {value}
                </div>
                <button 
                    onClick={handleInc}
                    className={`p-2 rounded-lg !${theme.colors.primary} text-white shadow-sm active:scale-95 transition-transform`}
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
}

interface GameToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}
export const GameToggle: React.FC<GameToggleProps> = ({ checked, onChange, label }) => {
  const { theme } = useForge();
  const styles = theme.components.toggle;
  const checkedClass = checked ? `!${theme.colors.success}` : styles.unchecked;

  return (
    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onChange(!checked)}>
      <div className={`${styles.base} ${checkedClass}`}>
        <div className={`${styles.thumb} ${checked ? 'translate-x-full' : 'translate-x-0'}`} />
      </div>
      {label && <span className={`font-bold text-sm select-none ${theme.colors.muted}`}>{label}</span>}
    </div>
  );
};

interface GameCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}
export const GameCheckbox: React.FC<GameCheckboxProps> = ({ checked, onChange, label }) => {
  const { theme } = useForge();
  const styles = theme.components.checkbox;
  const checkedClass = checked ? `!${theme.colors.primary} border-transparent text-white` : styles.unchecked;

  return (
    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onChange(!checked)}>
      <div className={`${styles.base} ${checkedClass}`}>
        {checked && <Check size={14} className={styles.icon || 'text-white'} strokeWidth={4} />}
      </div>
       {label && <span className={`font-bold text-sm select-none ${theme.colors.muted} group-hover:opacity-100 opacity-80 transition-opacity`}>{label}</span>}
    </div>
  );
};

interface GameSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  label?: string;
}
export const GameSlider: React.FC<GameSliderProps> = ({ value, min, max, onChange, label }) => {
  const { theme } = useForge();
  const styles = theme.components.slider;
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
       {label && (
          <div className="flex justify-between mb-1">
             <label className={`font-bold text-xs uppercase ${theme.colors.muted}`}>{label}</label>
             <span className={`font-bold text-xs ${theme.colors.text}`}>{Math.round(value)}%</span>
          </div>
       )}
      <div className="relative h-6 flex items-center select-none cursor-pointer group">
        <div className={`w-full ${styles.track}`}>
           <div className={`${styles.filled} !${theme.colors.primary}`} style={{ width: `${percentage}%` }} />
        </div>
        <input 
          type="range" min={min} max={max} value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
        <div 
          className={`absolute z-10 ${styles.thumb}`} 
          style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }} 
        />
      </div>
    </div>
  );
};
