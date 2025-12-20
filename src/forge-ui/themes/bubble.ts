
import { GameTheme } from '../types';

export const bubbleTheme: GameTheme = {
  id: 'bubble',
  name: 'Bubble',
  description: 'Round, glossy, and poppy.',
  colors: {
    background: 'bg-cyan-50',
    text: 'text-cyan-900',
    primary: 'bg-cyan-400',
    secondary: 'bg-pink-400',
    accent: 'bg-yellow-300',
    muted: 'text-cyan-600/70',
    danger: 'bg-red-400',
    success: 'bg-emerald-400',
    warning: 'bg-orange-300',
    border: 'border-cyan-200'
  },
  palettes: {
      'pearl': {
          background: 'bg-slate-50',
          primary: 'bg-pink-300',
          secondary: 'bg-blue-300',
          accent: 'bg-purple-300',
          text: 'text-slate-600',
          border: 'border-pink-100'
      },
      'toxic': {
          background: 'bg-lime-50',
          primary: 'bg-lime-400',
          secondary: 'bg-purple-500',
          accent: 'bg-fuchsia-400',
          text: 'text-lime-900',
          border: 'border-lime-200'
      },
      'gum': {
          background: 'bg-pink-50',
          primary: 'bg-pink-500',
          secondary: 'bg-rose-400',
          accent: 'bg-red-400',
          text: 'text-pink-900',
          border: 'border-pink-200'
      },
      'aqua': {
          background: 'bg-blue-50',
          primary: 'bg-blue-500',
          secondary: 'bg-teal-400',
          accent: 'bg-cyan-400',
          text: 'text-blue-900',
          border: 'border-blue-200'
      },
      'lava': {
          background: 'bg-orange-50',
          primary: 'bg-orange-500',
          secondary: 'bg-red-500',
          accent: 'bg-yellow-400',
          text: 'text-orange-900',
          border: 'border-orange-200'
      }
  },
  typography: {
    fontFamily: 'font-bubble',
    headerFont: 'font-bubble',
    bodyFont: 'font-bubble'
  },
  components: {
    button: {
      base: 'relative overflow-hidden transition-all duration-300 font-bubble rounded-full shadow-[inset_0_-4px_4px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.1)] active:scale-95 active:shadow-[inset_0_4px_4px_rgba(0,0,0,0.1)]',
      variants: {
        primary: 'bg-cyan-400 text-white hover:bg-cyan-300',
        secondary: 'bg-pink-400 text-white hover:bg-pink-300',
        danger: 'bg-red-400 text-white hover:bg-red-300',
        ghost: 'bg-transparent text-cyan-500 shadow-none hover:bg-cyan-100/50',
        icon: 'bg-white text-cyan-500 aspect-square p-2 hover:scale-110'
      },
      sizes: {
        sm: 'px-4 py-1 text-sm',
        md: 'px-8 py-3 text-lg',
        lg: 'px-10 py-4 text-xl'
      }
    },
    card: {
      container: 'bg-white rounded-[2rem] p-5 shadow-[0_10px_30px_rgba(34,211,238,0.15)] border-4 border-white font-bubble group hover:scale-105 transition-transform duration-300',
      header: 'text-2xl text-cyan-600 mb-1',
      body: 'text-cyan-700/60 text-sm',
      imageWrapper: 'rounded-full aspect-square mx-auto mb-4 border-4 border-cyan-100 overflow-hidden shadow-inner',
      rarityOverlay: (rarity) => rarity === 'legendary' ? 'absolute top-0 right-0 bg-yellow-300 text-yellow-800 text-xs px-2 py-1 rounded-full shadow-md z-10' : ''
    },
    dialog: {
      overlay: 'bg-cyan-900/40 backdrop-blur-sm',
      container: 'bg-white rounded-[3rem] p-8 text-center font-bubble shadow-[0_20px_60px_rgba(34,211,238,0.3)] max-w-sm w-full border-8 border-cyan-50',
      header: 'text-3xl text-cyan-500 mb-4',
      body: 'text-slate-500 text-base mb-8',
      closeButton: 'bg-cyan-100 text-cyan-600 rounded-full p-2 hover:bg-cyan-200 absolute top-6 right-6'
    },
    progressBar: {
      container: 'h-6 bg-cyan-100 rounded-full overflow-hidden p-1',
      bar: 'h-full bg-cyan-400 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)]',
      label: 'text-cyan-500 font-bubble text-sm mb-1 flex justify-between px-2'
    },
    bottomNav: {
      container: 'bg-white/90 backdrop-blur-md rounded-full shadow-[0_10px_40px_rgba(34,211,238,0.2)] mx-4 mb-2 p-1',
      item: 'flex-1 h-full rounded-full flex flex-col items-center justify-center transition-all text-cyan-300 hover:bg-cyan-50',
      itemActive: 'bg-cyan-400 text-white shadow-md scale-110',
      itemInactive: '',
      indicator: ''
    },
    input: {
        wrapper: 'relative',
        input: 'w-full bg-cyan-50 border-2 border-cyan-100 rounded-full px-6 py-3 font-bubble text-cyan-700 focus:outline-none focus:border-cyan-300 focus:bg-white transition-all',
        label: 'text-cyan-400 font-bubble text-sm mb-1 ml-4 block'
    },
    badge: {
        base: 'px-3 py-1 rounded-full font-bubble text-xs shadow-sm',
        variants: {
            neutral: 'bg-slate-100 text-slate-500',
            accent: 'bg-yellow-100 text-yellow-600',
            outline: 'border-2 border-cyan-200 text-cyan-400',
            danger: 'bg-red-100 text-red-600',
            success: 'bg-emerald-100 text-emerald-600'
        }
    },
    toggle: {
        base: 'w-12 h-7 bg-cyan-100 rounded-full p-1 transition-colors duration-300 shadow-inner',
        checked: 'bg-cyan-400',
        unchecked: 'bg-cyan-100',
        thumb: 'w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300'
    },
    checkbox: {
        base: 'w-6 h-6 bg-white border-2 border-cyan-100 rounded-full flex items-center justify-center hover:border-cyan-300 transition-colors',
        checked: 'bg-cyan-400 border-cyan-400 text-white',
        unchecked: '',
        icon: 'text-white'
    },
    slider: {
        track: 'h-4 bg-cyan-100 rounded-full overflow-hidden shadow-inner',
        filled: 'h-full bg-cyan-400 rounded-full',
        thumb: 'w-6 h-6 bg-white border-2 border-cyan-200 rounded-full shadow-md hover:scale-110 transition-transform'
    },
    tooltip: '',
    divider: 'h-1.5 bg-cyan-100 rounded-full my-6 w-24 mx-auto',
    panel: 'bg-white rounded-[2rem] p-6 shadow-lg shadow-cyan-100/50',
    toast: 'bg-white border-2 border-cyan-200 text-cyan-700 rounded-full px-6 py-3 shadow-xl font-bubble',
    spinner: 'border-4 border-cyan-100 border-t-cyan-400 rounded-full animate-spin',
    itemSlot: 'bg-cyan-50 rounded-[1.5rem] border-2 border-cyan-100 aspect-square flex items-center justify-center shadow-inner',
    statRow: 'flex justify-between items-center py-2 border-b-2 border-cyan-50 font-bubble text-cyan-800'
  },
  utils: {
    renderBackground: () => null
  }
};
