
import { GameTheme } from '../types';

export const casualTheme: GameTheme = {
  id: 'casual',
  name: 'Casual',
  description: 'Friendly, accessible, and clean with gloss effects.',
  colors: {
    background: 'bg-sky-50',
    text: 'text-slate-900',
    primary: 'bg-yellow-400',
    secondary: 'bg-sky-400',
    accent: 'bg-orange-400',
    muted: 'text-slate-500',
    danger: 'bg-rose-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    border: 'border-slate-200'
  },
  palettes: {
      'candy': {
          background: 'bg-pink-50',
          primary: 'bg-pink-400',
          secondary: 'bg-purple-400',
          accent: 'bg-sky-400',
          border: 'border-pink-200'
      },
      'mint': {
          background: 'bg-emerald-50',
          primary: 'bg-emerald-400',
          secondary: 'bg-teal-400',
          accent: 'bg-lime-400',
          border: 'border-emerald-200'
      },
      'ocean': {
          background: 'bg-cyan-50',
          primary: 'bg-blue-400',
          secondary: 'bg-cyan-400',
          accent: 'bg-indigo-400',
          border: 'border-cyan-200'
      },
      'sunset': {
          background: 'bg-orange-50',
          primary: 'bg-orange-400',
          secondary: 'bg-rose-400',
          accent: 'bg-violet-400',
          border: 'border-orange-200'
      },
      'lavender': {
          background: 'bg-violet-50',
          primary: 'bg-violet-400',
          secondary: 'bg-fuchsia-400',
          accent: 'bg-purple-400',
          border: 'border-violet-200'
      }
  },
  typography: {
    fontFamily: 'font-casual',
    headerFont: 'font-casual',
    bodyFont: 'font-sans'
  },
  components: {
    button: {
      base: 'relative overflow-hidden transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 select-none font-casual font-bold shadow-lg rounded-2xl',
      variants: {
        primary: 'bg-yellow-400 hover:bg-yellow-300 text-amber-900 border-b-4 border-amber-700',
        secondary: 'bg-sky-400 hover:bg-sky-300 text-white border-b-4 border-sky-700',
        danger: 'bg-rose-500 hover:bg-rose-400 text-white border-b-4 border-rose-800',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 shadow-none border-none',
        icon: 'bg-white hover:bg-gray-50 text-gray-700 border-b-4 border-gray-300 rounded-full shadow-md aspect-square p-0'
      },
      sizes: {
        sm: 'px-3 py-1 text-sm',
        md: 'px-6 py-3 text-lg',
        lg: 'px-8 py-4 text-xl'
      }
    },
    card: {
      container: 'bg-white rounded-3xl p-4 shadow-xl border-b-8 border-slate-100 font-casual group hover:-translate-y-2 transition-transform duration-300',
      header: 'font-bold text-lg leading-tight text-slate-800',
      body: 'text-slate-500 text-sm leading-snug',
      imageWrapper: 'rounded-2xl bg-slate-100 overflow-hidden mb-4 border-4 border-white shadow-inner',
    },
    dialog: {
      overlay: 'bg-black/60 backdrop-blur-sm',
      container: 'bg-white rounded-[2rem] border-4 border-slate-100 shadow-[0_10px_0_rgba(0,0,0,0.1)] p-6 text-center font-casual',
      header: 'text-3xl font-extrabold text-slate-700 mb-4 tracking-tight',
      body: 'text-slate-600 font-medium leading-relaxed mb-8',
      closeButton: 'text-slate-400 hover:bg-slate-100 rounded-full p-2',
      decorations: null
    },
    progressBar: {
      container: 'h-8 bg-slate-200 rounded-full border-4 border-slate-300 overflow-hidden relative',
      bar: 'h-full rounded-l-md relative',
      label: 'text-slate-500 font-casual font-bold uppercase text-xs tracking-wider mb-1 flex justify-between'
    },
    bottomNav: {
      container: 'bg-white shadow-2xl border-t border-slate-100',
      item: 'flex-1 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50/50 rounded-xl transition-colors',
      itemActive: 'text-yellow-500 font-bold',
      itemInactive: '',
      indicator: 'absolute bottom-0 h-1 bg-yellow-400 rounded-t-lg transition-all duration-300'
    },
    input: {
      wrapper: 'relative',
      input: 'w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 font-casual text-slate-700 focus:outline-none focus:border-sky-400 focus:bg-white transition-all',
      label: 'block text-sm font-bold text-slate-500 mb-1 ml-2'
    },
    badge: {
      base: 'px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide',
      variants: {
        neutral: 'bg-slate-100 text-slate-600',
        accent: 'bg-orange-100 text-orange-600',
        outline: 'border-2 border-slate-200 text-slate-500',
        danger: 'bg-rose-100 text-rose-600',
        success: 'bg-green-100 text-green-600'
      }
    },
    toggle: {
      base: 'w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out border-2 border-transparent shadow-inner',
      checked: 'bg-green-400',
      unchecked: 'bg-slate-300',
      thumb: 'w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out'
    },
    checkbox: {
      base: 'w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200',
      checked: 'bg-sky-400 border-sky-400 text-white',
      unchecked: 'bg-white border-slate-300',
      icon: 'text-white'
    },
    slider: {
      track: 'h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300',
      filled: 'h-full bg-yellow-400',
      thumb: 'w-6 h-6 bg-white border-2 border-slate-200 rounded-full shadow-lg hover:scale-110 transition-transform'
    },
    divider: 'h-1 bg-slate-100 rounded-full my-4',
    panel: 'bg-white rounded-2xl p-4 shadow-sm border border-slate-100',
    tooltip: 'bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg',
    toast: 'bg-white text-slate-700 rounded-2xl px-4 py-3 shadow-xl border-2 border-slate-100 flex items-center gap-3',
    spinner: 'w-8 h-8 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin',
    itemSlot: 'bg-slate-50 rounded-xl border-2 border-slate-200 aspect-square flex items-center justify-center hover:bg-white hover:shadow-md transition-all',
    statRow: 'flex justify-between items-center py-3 border-b border-slate-100 last:border-0'
  },
  utils: {
    renderBackground: () => null
  }
};
