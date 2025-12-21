
import { GameTheme } from '../types';

export const scifiTheme: GameTheme = {
  id: 'scifi',
  name: 'Sci-Fi',
  description: 'Futuristic, holographic, and technical.',
  colors: {
    background: 'bg-[#050b14]',
    text: 'text-cyan-50',
    primary: 'bg-cyan-900',
    secondary: 'bg-indigo-900',
    accent: 'bg-cyan-400',
    muted: 'text-slate-400',
    danger: 'bg-red-900',
    success: 'bg-emerald-900',
    warning: 'bg-yellow-900',
    border: 'border-cyan-900'
  },
  palettes: {
      'red-alert': {
          background: 'bg-[#1a0505]',
          primary: 'bg-red-900',
          secondary: 'bg-orange-900',
          accent: 'bg-red-500',
          text: 'text-red-50',
          border: 'border-red-800',
          success: 'bg-green-900'
      },
      'void': {
          background: 'bg-black',
          primary: 'bg-violet-900',
          secondary: 'bg-fuchsia-900',
          accent: 'bg-violet-500',
          text: 'text-violet-50',
          border: 'border-violet-900'
      },
      'matrix': {
          background: 'bg-black',
          primary: 'bg-green-900',
          secondary: 'bg-emerald-900',
          accent: 'bg-green-500',
          text: 'text-green-50',
          border: 'border-green-900',
          danger: 'bg-red-900'
      },
      'solar': {
          background: 'bg-[#1a1005]',
          primary: 'bg-orange-900',
          secondary: 'bg-amber-900',
          accent: 'bg-orange-500',
          text: 'text-orange-50',
          border: 'border-orange-900'
      },
      'neon': {
          background: 'bg-[#0f0514]',
          primary: 'bg-fuchsia-800',
          secondary: 'bg-cyan-800',
          accent: 'bg-yellow-400',
          text: 'text-fuchsia-50',
          border: 'border-fuchsia-800'
      }
  },
  typography: {
    fontFamily: 'font-scifi',
    headerFont: 'font-scifi',
    bodyFont: 'font-sans'
  },
  components: {
    button: {
      base: 'relative overflow-hidden transition-all duration-200 uppercase tracking-widest font-scifi text-sm backdrop-blur-sm rounded-sm clip-path-polygon',
      variants: {
        primary: 'bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]',
        secondary: 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.3)] hover:shadow-[0_0_25px_rgba(129,140,248,0.6)]',
        danger: 'bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-500 shadow-[0_0_15px_rgba(248,113,113,0.3)] hover:shadow-[0_0_25px_rgba(248,113,113,0.6)]',
        ghost: 'bg-transparent border border-transparent text-cyan-600 hover:text-cyan-400 hover:border-cyan-900',
        icon: 'bg-slate-900 text-cyan-400 border border-cyan-500 hover:bg-slate-800 hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] aspect-square p-0'
      },
      sizes: {
        sm: 'px-3 py-1 text-xs',
        md: 'px-6 py-3',
        lg: 'px-8 py-4'
      }
    },
    card: {
      container: 'bg-slate-900/80 border border-slate-700 hover:border-cyan-400/50 p-4 font-scifi relative overflow-hidden group hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all clip-path-polygon',
      header: 'text-cyan-100 font-bold uppercase tracking-wide',
      body: 'text-slate-400 text-xs leading-relaxed',
      imageWrapper: 'bg-slate-800 border border-slate-700 mb-4 relative',
      rarityOverlay: () => 'absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent pointer-events-none'
    },
    dialog: {
      overlay: 'bg-black/80 backdrop-blur-sm bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]',
      container: 'bg-slate-900/95 border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)] p-6 relative font-scifi text-cyan-100',
      header: 'text-2xl font-bold text-cyan-400 mb-6 uppercase tracking-[0.2em] border-b border-cyan-900 pb-2',
      body: 'text-cyan-100/80 leading-relaxed mb-8 text-sm tracking-wide',
      closeButton: 'text-cyan-500 hover:text-cyan-200'
    },
    progressBar: {
      container: 'h-6 bg-slate-900 border border-slate-600 relative skew-x-[-15deg] overflow-hidden',
      bar: 'h-full relative',
      label: 'text-slate-400 font-scifi text-xs uppercase tracking-widest mb-1 flex justify-between'
    },
    bottomNav: {
      container: 'bg-slate-950 border-t border-cyan-500/30 backdrop-blur-md',
      item: 'flex-1 flex flex-col items-center justify-center transition-all text-slate-500 hover:text-cyan-400/70',
      itemActive: 'text-cyan-400 bg-gradient-to-t from-cyan-900/20 to-transparent drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]',
      itemInactive: '',
      indicator: 'absolute top-0 h-[1px] bg-cyan-400 shadow-[0_0_15px_cyan] z-10'
    },
    input: {
      wrapper: 'relative group',
      input: 'w-full bg-slate-900/50 border border-slate-700 text-cyan-100 px-4 py-3 font-scifi uppercase text-sm focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all placeholder-slate-600',
      label: 'block text-xs text-cyan-600 uppercase tracking-widest mb-1'
    },
    badge: {
      base: 'px-2 py-0.5 border text-[10px] tracking-widest uppercase font-scifi',
      variants: {
        neutral: 'border-slate-700 text-slate-400 bg-slate-900',
        accent: 'border-cyan-500 text-cyan-400 bg-cyan-950/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
        outline: 'border-cyan-900 text-cyan-600',
        danger: 'border-red-500 text-red-500 bg-red-950/30',
        success: 'border-emerald-500 text-emerald-400 bg-emerald-950/30'
      }
    },
    toggle: {
      base: 'w-12 h-6 bg-slate-900 border border-slate-700 relative transition-all duration-300 skew-x-[-15deg]',
      checked: 'border-cyan-500 shadow-[0_0_10px_cyan]',
      unchecked: 'border-slate-700',
      thumb: 'w-4 h-4 bg-cyan-400 absolute top-1 left-1 shadow-[0_0_5px_cyan] transition-transform duration-300'
    },
    checkbox: {
      base: 'w-5 h-5 bg-slate-900 border border-slate-600 flex items-center justify-center hover:border-cyan-500 transition-colors',
      checked: 'bg-cyan-950 border-cyan-400',
      unchecked: '',
      icon: 'text-cyan-400 drop-shadow-[0_0_5px_cyan]'
    },
    slider: {
      track: 'h-2 bg-slate-800 border border-slate-600 skew-x-[-15deg]',
      filled: 'h-full bg-cyan-500 shadow-[0_0_10px_cyan]',
      thumb: 'w-3 h-4 bg-slate-900 border border-cyan-400 shadow-[0_0_10px_cyan] hover:bg-cyan-400 transition-colors'
    },
    divider: 'h-px bg-gradient-to-r from-transparent via-cyan-900 to-transparent my-4',
    panel: 'bg-slate-900/50 border border-slate-700 p-4 relative before:absolute before:top-0 before:left-0 before:w-2 before:h-2 before:border-t before:border-l before:border-cyan-500 before:content-[""] after:absolute after:bottom-0 after:right-0 after:w-2 after:h-2 after:border-b after:border-r after:border-cyan-500 after:content-[""]',
    tooltip: 'bg-slate-900 border border-cyan-500 text-cyan-100 text-xs px-2 py-1',
    toast: 'bg-slate-900 border-l-4 border-cyan-500 text-cyan-100 px-4 py-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center gap-4',
    spinner: 'w-8 h-8 border-2 border-slate-800 border-t-cyan-500 rounded-full animate-spin',
    itemSlot: 'bg-slate-900 border border-slate-700 aspect-square flex items-center justify-center hover:border-cyan-500/50 transition-colors relative overflow-hidden',
    statRow: 'flex justify-between items-center py-2 border-b border-slate-800/50 text-sm font-scifi uppercase tracking-wider'
  },
  utils: {
    renderBackground: () => null 
  }
};
