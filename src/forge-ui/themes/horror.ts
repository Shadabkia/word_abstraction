
import { GameTheme } from '../types';

export const horrorTheme: GameTheme = {
  id: 'horror',
  name: 'Horror',
  description: 'Dark, grungy, and unsettling.',
  colors: {
    background: 'bg-[#0a0505]',
    text: 'text-red-50',
    primary: 'bg-red-900',
    secondary: 'bg-stone-800',
    accent: 'bg-red-600',
    muted: 'text-stone-500',
    danger: 'bg-red-700',
    success: 'bg-stone-700',
    warning: 'bg-orange-900',
    border: 'border-red-900'
  },
  palettes: {
      'vampire': {
          background: 'bg-[#1a0515]',
          primary: 'bg-purple-900',
          secondary: 'bg-fuchsia-900',
          accent: 'bg-red-600',
          text: 'text-purple-50',
          border: 'border-purple-900',
          danger: 'bg-red-700'
      },
      'swamp': {
          background: 'bg-[#0a1505]',
          primary: 'bg-green-900',
          secondary: 'bg-stone-800',
          accent: 'bg-lime-900',
          text: 'text-green-50',
          border: 'border-green-900',
          success: 'bg-green-700'
      },
      'ghost': {
          background: 'bg-[#051015]',
          primary: 'bg-cyan-900',
          secondary: 'bg-slate-800',
          accent: 'bg-cyan-400',
          text: 'text-cyan-50',
          border: 'border-cyan-900'
      },
      'rust': {
          background: 'bg-[#1a1005]',
          primary: 'bg-orange-900',
          secondary: 'bg-stone-800',
          accent: 'bg-orange-600',
          text: 'text-orange-50',
          border: 'border-orange-900'
      },
      'noir': {
          background: 'bg-[#050505]',
          primary: 'bg-stone-800',
          secondary: 'bg-stone-900',
          accent: 'bg-white',
          text: 'text-stone-300',
          border: 'border-stone-800',
          danger: 'bg-stone-700'
      }
  },
  typography: {
    fontFamily: 'font-horror',
    headerFont: 'font-horror',
    bodyFont: 'font-horrorBody'
  },
  components: {
    button: {
      base: 'relative overflow-hidden transition-all duration-200 font-horror tracking-widest uppercase border border-red-900/50 hover:brightness-125 active:scale-95 clip-path-grunge',
      variants: {
        primary: 'bg-[#1a0505] text-red-500 border-red-800 shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]',
        secondary: 'bg-[#1c1917] text-stone-400 border-stone-700',
        danger: 'bg-red-950 text-red-500 border-red-600 animate-pulse-fast',
        ghost: 'bg-transparent text-red-900 hover:text-red-600',
        icon: 'bg-[#1a0505] text-red-600 border border-red-900 aspect-square p-0 rounded-none'
      },
      sizes: {
        sm: 'px-4 py-1 text-sm',
        md: 'px-8 py-3 text-xl',
        lg: 'px-10 py-4 text-2xl'
      }
    },
    card: {
      container: 'bg-[#120808] border border-red-900/30 p-4 font-horrorBody relative group overflow-hidden shadow-2xl',
      header: 'font-horror text-2xl text-red-600 tracking-wider',
      body: 'text-stone-500 text-sm leading-relaxed italic',
      imageWrapper: 'opacity-80 grayscale group-hover:grayscale-0 transition-all duration-500 mb-4 border border-stone-800',
      rarityOverlay: (rarity) => rarity === 'legendary' ? 'absolute inset-0 border-2 border-red-600/50 shadow-[inset_0_0_30px_rgba(220,38,38,0.3)] pointer-events-none' : ''
    },
    dialog: {
      overlay: 'bg-black/90 backdrop-blur-sm',
      container: 'bg-[#0f0505] border-2 border-red-900 p-8 text-center font-horror shadow-[0_0_50px_rgba(153,27,27,0.3)] relative max-w-lg w-full',
      header: 'text-4xl text-red-600 mb-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]',
      body: 'text-stone-400 font-horrorBody text-lg mb-8 leading-relaxed',
      closeButton: 'text-red-900 hover:text-red-500 transition-colors absolute top-4 right-4'
    },
    progressBar: {
      container: 'h-5 bg-[#1c1917] border border-stone-800',
      bar: 'h-full bg-red-900 relative shadow-[0_0_10px_rgba(220,38,38,0.5)]',
      label: 'text-stone-600 font-horror text-xs tracking-widest mb-1 flex justify-between'
    },
    bottomNav: {
      container: 'bg-[#0a0000] border-t border-red-900/30 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]',
      item: 'flex-1 flex flex-col items-center justify-center transition-all text-stone-800 hover:text-red-900',
      itemActive: 'text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.6)] bg-gradient-to-t from-red-900/10 to-transparent',
      itemInactive: '',
      indicator: 'absolute top-0 h-[1px] bg-red-800 shadow-[0_0_10px_red]'
    },
    input: {
        wrapper: 'relative',
        input: 'w-full bg-[#0a0000] border border-red-900/50 text-red-100 px-4 py-3 font-horrorBody focus:outline-none focus:border-red-600 focus:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all placeholder-red-900/50',
        label: 'text-red-800 font-horror text-xs tracking-widest mb-1 block'
    },
    badge: {
        base: 'px-2 py-0.5 text-xs font-horror tracking-wider border',
        variants: {
            neutral: 'bg-stone-900 border-stone-700 text-stone-500',
            accent: 'bg-red-950/50 border-red-800 text-red-500',
            outline: 'border-red-900 text-red-800',
            danger: 'bg-red-950 text-red-600 border-red-800',
            success: 'bg-stone-900 text-stone-400 border-stone-600'
        }
    },
    toggle: {
        base: 'w-12 h-6 bg-[#1a0505] border border-red-900/50 relative transition-all duration-300',
        checked: 'border-red-600 bg-red-950',
        unchecked: 'border-stone-800',
        thumb: 'w-4 h-4 bg-stone-500 rounded-sm absolute top-1 left-1 shadow-md transition-transform duration-300'
    },
    checkbox: {
        base: 'w-5 h-5 bg-[#0a0505] border border-red-900/50 flex items-center justify-center hover:border-red-600 transition-colors',
        checked: 'bg-red-900/30 border-red-600 text-red-600',
        unchecked: '',
        icon: 'text-red-600'
    },
    slider: {
        track: 'h-1.5 bg-[#1c1917] border border-stone-800',
        filled: 'h-full bg-red-800 shadow-[0_0_8px_rgba(153,27,27,0.5)]',
        thumb: 'w-3 h-3 bg-[#0a0505] border border-red-600 shadow-[0_0_5px_rgba(220,38,38,0.5)] hover:bg-red-900 transition-colors'
    },
    tooltip: '',
    divider: 'h-px bg-gradient-to-r from-transparent via-red-900 to-transparent my-6 opacity-50',
    panel: 'bg-[#0f0505] border border-red-900/20 p-6',
    toast: 'bg-[#1a0505] border border-red-800 text-red-500 px-6 py-4 shadow-2xl font-horror tracking-wider',
    spinner: 'border-2 border-stone-800 border-t-red-800 rounded-full animate-spin',
    itemSlot: 'bg-[#0a0000] border border-stone-800 aspect-square flex items-center justify-center hover:border-red-900 transition-colors',
    statRow: 'flex justify-between items-center py-2 border-b border-stone-900 font-horrorBody text-stone-500'
  },
  utils: {
    renderBackground: () => null
  }
};
