
import { ReactNode } from 'react';

// --- Core Theme Types ---
export type ThemeMode = 'casual' | 'scifi' | 'fantasy' | 'playful' | 'horror' | 'pixel' | 'comic' | 'nature' | 'bubble' | 'paper' | 'manga' | 'popart' | 'sketch' | 'sticker' | 'clay' | 'social';

export interface ColorPalette {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  danger: string;
  success: string;
  warning: string;
  border: string;
}

export interface Typography {
  fontFamily: string;
  headerFont: string;
  bodyFont: string;
}

export interface ThemeConfig {
  density: 'compact' | 'comfortable' | 'spacious';
  radiusScale: number;
  animationSpeed: number;
  reducedMotion: boolean;
}

// --- Component Style Definitions ---
export interface ButtonStyles {
  base: string;
  variants: { primary: string; secondary: string; danger: string; ghost: string; icon: string; };
  sizes: { sm: string; md: string; lg: string; };
}

export interface CardStyles {
  container: string;
  header: string;
  body: string;
  imageWrapper: string;
  rarityOverlay?: (rarity: string) => string;
}

export interface DialogStyles {
  overlay: string;
  container: string;
  header: string;
  body: string;
  closeButton: string;
  decorations?: ReactNode;
}

export interface ProgressStyles {
  container: string;
  bar: string;
  label: string;
}

export interface NavigationStyles {
  container: string;
  item: string;
  itemActive: string;
  itemInactive: string;
  indicator?: string;
}

export interface InputStyles {
  wrapper: string;
  input: string;
  label: string;
  focus?: string;
}

export interface BadgeStyles {
  base: string;
  variants: { neutral: string; accent: string; outline: string; danger: string; success: string; };
}

export interface ToggleStyles {
  base: string;
  checked: string;
  unchecked: string;
  thumb: string;
}

export interface CheckboxStyles {
  base: string;
  checked: string;
  unchecked: string;
  icon: string;
}

export interface SliderStyles {
  track: string;
  filled: string;
  thumb: string;
}

export interface GameTheme {
  id: ThemeMode;
  name: string;
  description: string;
  colors: ColorPalette;
  typography: Typography;
  palettes?: Record<string, Partial<ColorPalette>>;
  components: {
    button: ButtonStyles;
    card: CardStyles;
    dialog: DialogStyles;
    progressBar: ProgressStyles;
    bottomNav: NavigationStyles;
    input: InputStyles; 
    badge: BadgeStyles;
    toggle: ToggleStyles;     
    checkbox: CheckboxStyles;   
    slider: SliderStyles;
    divider: string;
    panel: string;      
    tooltip: string;
    toast: string;      
    spinner: string;    
    itemSlot: string;   
    statRow: string;    
  };
  utils: {
    getIcon?: (name: string) => ReactNode;
    renderBackground?: () => ReactNode;
  };
}

// --- Component Props ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'icon' | 'ghost';
  label?: string;
  icon?: ReactNode;
  theme?: ThemeMode; 
  fullWidth?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  theme?: ThemeMode;
  type?: 'info' | 'success' | 'danger';
}

export interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  label?: string;
  theme?: ThemeMode;
}

export interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  price?: string | number;
  theme?: ThemeMode;
  onAction?: () => void;
  actionLabel?: string;
  rarity?: 'common' | 'rare' | 'legendary';
}

export interface BottomNavProps {
  theme?: ThemeMode;
  activeTab: number;
  onTabChange: (index: number) => void;
  variant?: 'flat' | 'floating' | 'bubbles' | 'center';
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
}
