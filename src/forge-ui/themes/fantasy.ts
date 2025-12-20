
import { GameTheme } from '../types';

export const fantasyTheme: GameTheme = {
  id: 'fantasy',
  name: 'Fantasy',
  description: 'Epic, ancient, and adventurous with parchment textures.',
  colors: {
    background: 'bg-[#120f0d]',
    text: 'text-amber-50',
    primary: 'bg-amber-700',
    secondary: 'bg-slate-700',
    accent: 'bg-amber-500',
    muted: 'text-[#8c7b6c]',
    danger: 'bg-red-900',
    success: 'bg-green-900',
    warning: 'bg-orange-800',
    border: 'border-[#4a3b2a]'
  },
  palettes: {
      'royal': {
          background: 'bg-[#1a1220]',
          primary: 'bg-purple-800',
          secondary: 'bg-yellow-600',
          accent: 'bg-yellow-500',
          text: 'text-purple-50',
          border: 'border-purple-900'
      },
      'necro': {
          background: 'bg-[#0a0f0a]',
          primary: 'bg-emerald-900',
          secondary: 'bg-gray-800',
          accent: 'bg-emerald-500',
          text: 'text-emerald-50',
          border: 'border-emerald-900',
          danger: 'bg-purple-900'
      },
      'frost': {
          background: 'bg-[#0f172a]',
          primary: 'bg-cyan-800',
          secondary: 'bg-blue-800',
          accent: 'bg-cyan-400',
          text: 'text-cyan-50',
          border: 'border-cyan-900'
      },
      'infernal': {
          background: 'bg-[#1a0505]',
          primary: 'bg-red-900',
          secondary: 'bg-orange-900',
          accent: 'bg-orange-500',
          text: 'text-red-50',
          border: 'border-red-900'
      },
      'druid': {
          background: 'bg-[#121a05]',
          primary: 'bg-lime-800',
          secondary: 'bg-green-800',
          accent: 'bg-amber-500',
          text: 'text-lime-50',
          border: 'border-lime-900'
      }
  },
  typography: {
    fontFamily: 'font-fantasy',
    headerFont: 'font-fantasy',
    bodyFont: 'font-serif'
  },
  components: {
    button: {
      base: 'relative overflow-hidden transition-all duration-200 font-fantasy font-bold tracking-wide rounded-lg shadow-md hover:brightness-110 active:scale-95 border-2',
      variants: {
        primary: 'bg-gradient-to-b from-amber-700 to-amber-900 text-amber-100 border-amber-400 shadow-amber-900/50',
        secondary: 'bg-gradient-to-b from-slate-600 to-slate-800 text-slate-200 border-slate-400 shadow-slate-900/50',
        danger: 'bg-gradient-to-b from-red-800 to-red-950 text-red-100 border-red-400 shadow-red-900/50',
        ghost: 'bg-transparent border-transparent text-amber-700 hover:text-amber-500',
        icon: 'bg-amber-950 border-amber-500 text-amber-400 aspect-square p-0 rounded-full'
      },
      sizes: {
        sm: 'px-3 py-1 text-xs',
        md: 'px-6 py-3',
        lg: 'px-8 py-4 text-xl'
      }
    },
    card: {
      container: 'bg-[#1e1a16] border-2 border-[#4a3b2a] rounded-xl p-5 font-fantasy relative group hover:border-amber-600 transition-colors shadow-xl',
      header: 'text-amber-100 text-xl tracking-wide',
      body: 'text-[#8c7b6c] italic',
      imageWrapper: 'rounded-lg bg-[#14110f] border border-[#33291d] overflow-hidden mb-4',
    },
    dialog: {
      overlay: 'bg-black/80',
      container: 'bg-[#2a231d] border-[3px] border-amber-600 rounded-lg p-8 text-center font-fantasy text-amber-100 shadow-2xl relative',
      header: 'text-3xl text-amber-400 mb-6 border-b-2 border-amber-800 pb-2 drop-shadow-md',
      body: 'text-[#c0a080] font-serif text-lg leading-relaxed mb-8',
      closeButton: 'text-amber-500 hover:text-amber-200',
      decorations: null
    },
    progressBar: {
      container: 'h-6 bg-[#1a1512] border border-[#4a3b2a] rounded-sm relative p-0.5',
      bar: 'h-full relative bg-gradient-to-b from-white/20 to-black/20',
      label: 'text-[#8c7b6c] font-fantasy text-xs tracking-wider mb-1 flex justify-between'
    },
    bottomNav: {
      container: 'bg-[#1e1a16] border-t-2 border-[#4a3b2a] shadow-[0_-5px_15px_rgba(0,0,0,0.5)]',
      item: 'flex-1 flex flex-col items-center justify-center transition-all text-[#5c4f42] hover:text-[#8c7b6c] hover:bg-[#2a231d]',
      itemActive: 'text-amber-400 bg-gradient-to-t from-amber-900/20 to-transparent border-t-2 border-amber-500',
      itemInactive: '',
      indicator: '' // Using border-t on itemActive instead
    },
    input: {
      wrapper: 'relative',
      input: 'w-full bg-[#14110f] border-2 border-[#4a3b2a] text-amber-100 px-4 py-2 font-serif focus:outline-none focus:border-amber-600 transition-colors placeholder-[#4a3b2a] rounded-sm',
      label: 'block text-amber-700 font-fantasy tracking-widest text-xs mb-1 uppercase'
    },
    badge: {
      base: 'px-2 py-0.5 border rounded-sm text-xs font-fantasy tracking-wide uppercase',
      variants: {
        neutral: 'bg-[#1e1a16] border-[#4a3b2a] text-[#8c7b6c]',
        accent: 'bg-amber-950/50 border-amber-900 text-amber-400',
        outline: 'border-[#4a3b2a] text-[#8c7b6c]',
        danger: 'bg-red-950/30 border-red-900 text-red-500',
        success: 'bg-green-950/30 border-green-900 text-green-500'
      }
    },
    toggle: {
      base: 'w-10 h-10 border-2 border-[#4a3b2a] bg-[#14110f] rotate-45 flex items-center justify-center transition-all',
      checked: 'bg-amber-900 border-amber-500',
      unchecked: 'opacity-50',
      thumb: 'w-6 h-6 bg-amber-500 rotate-45 border border-amber-300 shadow-inner'
    },
    checkbox: {
      base: 'w-5 h-5 border-2 border-[#4a3b2a] bg-[#14110f] rounded-sm hover:border-amber-600',
      checked: 'bg-amber-900 border-amber-500',
      unchecked: '',
      icon: 'text-amber-100'
    },
    slider: {
      track: 'h-1 bg-[#14110f] border-b border-[#4a3b2a]',
      filled: 'h-full bg-amber-700',
      thumb: 'w-4 h-4 bg-[#2a231d] border-2 border-amber-500 rotate-45 hover:scale-110 transition-transform'
    },
    divider: 'h-[2px] bg-gradient-to-r from-transparent via-[#4a3b2a] to-transparent my-4',
    panel: 'bg-[#1e1a16] border-2 border-[#4a3b2a] p-4 rounded-lg relative after:absolute after:inset-[2px] after:border after:border-[#33291d] after:rounded-md',
    tooltip: 'bg-[#2a231d] border border-amber-700 text-amber-100 text-xs px-2 py-1 font-serif',
    toast: 'bg-[#2a231d] border-2 border-amber-600 text-amber-100 px-4 py-3 shadow-2xl font-fantasy flex items-center gap-3',
    spinner: 'w-8 h-8 border-4 border-[#33291d] border-t-amber-600 rounded-full animate-spin',
    itemSlot: 'bg-[#14110f] border-2 border-[#33291d] aspect-square flex items-center justify-center hover:border-amber-600/50 rounded-sm transition-colors',
    statRow: 'flex justify-between items-center py-2 border-b border-[#33291d] font-fantasy text-amber-100/80 text-sm'
  },
  utils: {
    renderBackground: () => null 
  }
};
