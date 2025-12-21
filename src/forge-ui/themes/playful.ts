
import { GameTheme } from '../types';

export const playfulTheme: GameTheme = {
  id: 'playful',
  name: 'Playful',
  description: 'Bouncy, vibrant, and full of joy.',
  colors: {
    background: 'bg-fuchsia-50',
    text: 'text-fuchsia-900',
    primary: 'bg-pink-500',
    secondary: 'bg-violet-500',
    accent: 'bg-yellow-400',
    muted: 'text-fuchsia-400',
    danger: 'bg-rose-500',
    success: 'bg-emerald-400',
    warning: 'bg-orange-400',
    border: 'border-pink-200'
  },
  palettes: {
      'bubblegum': {
          background: 'bg-pink-50',
          primary: 'bg-pink-500',
          secondary: 'bg-blue-400',
          accent: 'bg-yellow-300',
          text: 'text-pink-900',
          border: 'border-pink-300'
      },
      'citrus': {
          background: 'bg-yellow-50',
          primary: 'bg-orange-400',
          secondary: 'bg-lime-500',
          accent: 'bg-yellow-400',
          text: 'text-orange-900',
          border: 'border-yellow-200'
      },
      'berry': {
          background: 'bg-purple-50',
          primary: 'bg-purple-600',
          secondary: 'bg-pink-600',
          accent: 'bg-red-400',
          text: 'text-purple-900',
          border: 'border-purple-200'
      },
      'toybox': {
          background: 'bg-blue-50',
          primary: 'bg-red-500',
          secondary: 'bg-blue-500',
          accent: 'bg-yellow-400',
          text: 'text-blue-900',
          border: 'border-blue-200'
      },
      'pastel': {
          background: 'bg-teal-50',
          primary: 'bg-teal-400',
          secondary: 'bg-violet-400',
          accent: 'bg-pink-300',
          text: 'text-teal-900',
          border: 'border-teal-200'
      }
  },
  typography: {
    fontFamily: 'font-playful',
    headerFont: 'font-playful',
    bodyFont: 'font-playfulBody'
  },
  components: {
    button: {
      base: 'relative overflow-hidden transition-all duration-300 font-playful tracking-wide rounded-full transform hover:-translate-y-1 active:scale-95 active:translate-y-0',
      variants: {
        primary: 'bg-gradient-to-b from-pink-400 to-pink-500 text-white border-b-[6px] border-pink-700 shadow-[0_4px_0_rgba(190,24,93,0.3)]',
        secondary: 'bg-gradient-to-b from-violet-400 to-violet-500 text-white border-b-[6px] border-violet-700 shadow-[0_4px_0_rgba(109,40,217,0.3)]',
        danger: 'bg-gradient-to-b from-rose-400 to-rose-500 text-white border-b-[6px] border-rose-700 shadow-[0_4px_0_rgba(225,29,72,0.3)]',
        ghost: 'bg-transparent text-pink-500 hover:bg-pink-100 border-none shadow-none',
        icon: 'bg-white text-pink-500 border-4 border-pink-200 aspect-square p-0 hover:rotate-12 hover:scale-110 shadow-lg'
      },
      sizes: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-8 py-4 text-xl',
        lg: 'px-10 py-5 text-2xl'
      }
    },
    card: {
      container: 'bg-white rounded-[2rem] p-5 shadow-[0_10px_20px_rgba(236,72,153,0.15)] border-4 border-white ring-4 ring-pink-100 font-playfulBody group hover:scale-[1.02] transition-transform duration-300',
      header: 'font-playful text-2xl text-pink-600 mb-2',
      body: 'text-slate-500 font-bold',
      imageWrapper: 'rounded-3xl bg-pink-50 overflow-hidden mb-4 border-4 border-pink-100',
      rarityOverlay: (rarity) => rarity === 'legendary' ? 'absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg rotate-12 z-20 content-["LEGENDARY"]' : ''
    },
    dialog: {
      overlay: 'bg-violet-900/40 backdrop-blur-md',
      container: 'bg-white rounded-[3rem] border-8 border-pink-200 p-8 text-center font-playful shadow-2xl animate-bounce-small',
      header: 'text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-4',
      body: 'text-slate-500 font-playfulBody text-lg mb-8',
      closeButton: 'bg-pink-100 text-pink-500 rounded-full p-2 hover:bg-pink-200 hover:rotate-90 transition-transform'
    },
    progressBar: {
      container: 'h-6 bg-pink-100 rounded-full border-4 border-pink-200 overflow-hidden',
      bar: 'h-full bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full',
      label: 'text-pink-400 font-playful text-sm mb-1 flex justify-between'
    },
    bottomNav: {
      container: 'bg-white rounded-t-[2rem] shadow-[0_-8px_25px_rgba(236,72,153,0.15)] border-t-4 border-pink-100 mx-2',
      item: 'flex-1 flex flex-col items-center justify-center transition-all text-pink-300 hover:text-pink-400 hover:scale-105 active:scale-90',
      itemActive: 'text-pink-500 -translate-y-2',
      itemInactive: '',
      indicator: 'absolute top-1/2 left-1/2 w-2 h-2 bg-pink-300 rounded-full opacity-0' // Visual noise only
    },
    input: {
        wrapper: 'relative',
        input: 'w-full bg-white border-4 border-pink-100 rounded-2xl px-5 py-3 font-playfulBody text-pink-600 focus:outline-none focus:border-pink-400 transition-colors',
        label: 'text-pink-400 font-playful ml-3 mb-1 text-sm'
    },
    badge: {
        base: 'px-3 py-1 rounded-full font-playful text-xs shadow-sm',
        variants: {
            neutral: 'bg-slate-100 text-slate-500',
            accent: 'bg-yellow-300 text-yellow-800',
            outline: 'border-2 border-pink-200 text-pink-400',
            danger: 'bg-rose-100 text-rose-600',
            success: 'bg-emerald-100 text-emerald-600'
        }
    },
    toggle: {
        base: 'w-14 h-8 rounded-full p-1 transition-all duration-300 border-2 border-transparent bg-pink-100 shadow-inner',
        checked: 'bg-pink-500',
        unchecked: 'bg-slate-200',
        thumb: 'w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300'
    },
    checkbox: {
        base: 'w-6 h-6 rounded-lg border-2 border-pink-200 bg-white transition-all hover:border-pink-400',
        checked: 'bg-pink-500 border-pink-500 text-white',
        unchecked: '',
        icon: 'text-white'
    },
    slider: {
        track: 'h-3 bg-pink-100 rounded-full overflow-hidden border-2 border-pink-200',
        filled: 'h-full bg-pink-500',
        thumb: 'w-5 h-5 bg-white border-2 border-pink-200 rounded-full shadow-md hover:scale-125 transition-transform'
    },
    tooltip: '',
    divider: 'h-2 bg-pink-100 rounded-full border-2 border-white my-6 w-1/2 mx-auto',
    panel: 'bg-white rounded-[2rem] p-6 border-4 border-pink-50',
    toast: 'bg-white border-l-8 border-pink-500 rounded-2xl shadow-xl px-6 py-4 font-playful text-slate-700',
    spinner: 'border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin',
    itemSlot: 'bg-pink-50 rounded-2xl border-4 border-pink-100 aspect-square flex items-center justify-center',
    statRow: 'flex justify-between items-center py-3 border-b-2 border-pink-50 font-playfulBody text-slate-600 font-bold'
  },
  utils: {
    renderBackground: () => null
  }
};
