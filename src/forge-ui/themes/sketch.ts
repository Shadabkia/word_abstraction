
import { GameTheme } from '../types';

export const sketchTheme: GameTheme = {
  id: 'sketch',
  name: 'Sketch',
  description: 'Rough, hand-drawn, and artistic.',
  colors: {
    background: 'bg-[#fefefe]',
    text: 'text-slate-800',
    primary: 'bg-slate-800',
    secondary: 'bg-slate-600',
    accent: 'bg-blue-500',
    muted: 'text-slate-500',
    danger: 'bg-red-500',
    success: 'bg-green-600',
    warning: 'bg-orange-500',
    border: 'border-slate-800'
  },
  palettes: {
      'graphite': {
          background: 'bg-[#f0f0f0]',
          primary: 'bg-[#404040]',
          secondary: 'bg-[#808080]',
          accent: 'bg-[#202020]',
          text: 'text-[#101010]',
          border: 'border-[#404040]'
      },
      'blueprint': {
          background: 'bg-[#003366]',
          primary: 'bg-[#ffffff]',
          secondary: 'bg-[#80b3ff]',
          accent: 'bg-[#4d94ff]',
          text: 'text-[#ffffff]',
          border: 'border-[#ffffff]'
      },
      'red-pencil': {
          background: 'bg-[#fff5f5]',
          primary: 'bg-[#cc0000]',
          secondary: 'bg-[#ff6666]',
          accent: 'bg-[#ff3333]',
          text: 'text-[#990000]',
          border: 'border-[#cc0000]'
      },
      'charcoal': {
          background: 'bg-[#d6d6d6]',
          primary: 'bg-[#1a1a1a]',
          secondary: 'bg-[#4d4d4d]',
          accent: 'bg-[#000000]',
          text: 'text-[#000000]',
          border: 'border-[#1a1a1a]'
      },
      'sepia': {
          background: 'bg-[#f4ecd8]',
          primary: 'bg-[#5c4b36]',
          secondary: 'bg-[#8c7658]',
          accent: 'bg-[#a36936]',
          text: 'text-[#473625]',
          border: 'border-[#5c4b36]'
      }
  },
  typography: {
    fontFamily: 'font-sketch',
    headerFont: 'font-sketch',
    bodyFont: 'font-sketch'
  },
  components: {
    button: {
      base: 'relative overflow-visible transition-transform font-sketch font-bold text-lg tracking-wider border-2 border-slate-800 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] hover:border-slate-600 active:scale-95',
      variants: {
        primary: 'bg-slate-800 text-white',
        secondary: 'bg-white text-slate-800',
        danger: 'bg-white text-red-600 border-red-600',
        ghost: 'bg-transparent border-transparent shadow-none hover:bg-slate-50 text-slate-600',
        icon: 'bg-white text-slate-800 aspect-square p-2 border-2 border-slate-800 rounded-full'
      },
      sizes: {
        sm: 'px-3 py-1 text-base',
        md: 'px-6 py-2 text-xl',
        lg: 'px-8 py-3 text-2xl'
      }
    },
    card: {
      container: 'bg-white border-2 border-slate-800 p-4 font-sketch shadow-[4px_4px_0_rgba(0,0,0,0.1)] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] hover:scale-[1.01] transition-transform',
      header: 'font-sketch text-2xl text-slate-900 mb-2 border-b-2 border-slate-800/20 pb-1',
      body: 'text-slate-600 font-bold',
      imageWrapper: 'border-2 border-slate-800 mb-4 p-1 rounded-[5px]',
      rarityOverlay: (rarity) => rarity === 'legendary' ? 'absolute top-0 right-0 bg-yellow-100 text-slate-800 border-2 border-slate-800 px-2 py-1 rotate-3 z-10' : ''
    },
    dialog: {
      overlay: 'bg-white/90 backdrop-blur-[1px]',
      container: 'bg-white border-2 border-slate-800 p-8 text-center font-sketch shadow-xl max-w-md w-full rounded-[255px_15px_225px_15px/15px_225px_15px_255px]',
      header: 'text-4xl text-slate-900 mb-6',
      body: 'text-slate-600 text-xl mb-8',
      closeButton: 'text-slate-400 hover:text-red-500 absolute top-6 right-6 font-bold text-xl'
    },
    progressBar: {
      container: 'h-5 bg-white border-2 border-slate-800 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] overflow-hidden p-0.5',
      bar: 'h-full bg-slate-800 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]',
      label: 'text-slate-800 font-sketch text-lg mb-1 flex justify-between'
    },
    bottomNav: {
      container: 'bg-white border-t-2 border-slate-800 rounded-t-[255px_50px_225px_15px/15px_15px_5px_5px]',
      item: 'flex-1 flex flex-col items-center justify-center transition-all text-slate-400 hover:text-slate-800',
      itemActive: 'text-slate-900 font-bold decoration-wavy underline decoration-slate-400 scale-110',
      itemInactive: '',
      indicator: ''
    },
    input: {
        wrapper: 'relative',
        input: 'w-full bg-transparent border-2 border-slate-800 px-4 py-2 font-sketch text-xl text-slate-900 focus:outline-none focus:border-blue-600 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]',
        label: 'text-slate-500 font-sketch text-lg mb-1 block ml-2'
    },
    badge: {
        base: 'px-2 py-0.5 font-sketch text-sm border-2 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]',
        variants: {
            neutral: 'border-slate-300 text-slate-500',
            accent: 'border-blue-500 text-blue-600 bg-blue-50',
            outline: 'border-slate-800 text-slate-800',
            danger: 'border-red-500 text-red-600 bg-red-50',
            success: 'border-green-600 text-green-700 bg-green-50'
        }
    },
    toggle: {
        base: 'w-10 h-6 border-2 border-slate-800 p-0.5 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] transition-colors',
        checked: 'bg-slate-800',
        unchecked: 'bg-white',
        thumb: 'w-4 h-4 bg-white border-2 border-slate-800 rounded-full shadow-sm'
    },
    checkbox: {
        base: 'w-5 h-5 border-2 border-slate-800 bg-white rounded-[255px_15px_225px_15px/15px_225px_15px_255px] flex items-center justify-center hover:border-blue-600',
        checked: 'bg-slate-800 text-white',
        unchecked: '',
        icon: 'text-white'
    },
    slider: {
        track: 'h-2 bg-slate-200 border border-slate-800 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]',
        filled: 'h-full bg-slate-800',
        thumb: 'w-4 h-4 bg-white border-2 border-slate-800 rounded-full hover:scale-110'
    },
    tooltip: '',
    divider: 'h-0.5 bg-slate-800 my-6 opacity-30',
    panel: 'bg-white border-2 border-slate-800 p-6 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]',
    toast: 'bg-white border-2 border-slate-800 text-slate-800 px-6 py-3 shadow-md font-sketch text-lg',
    spinner: 'border-4 border-slate-200 border-t-slate-800 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-spin',
    itemSlot: 'bg-slate-50 border-2 border-slate-800 aspect-square flex items-center justify-center rounded-[255px_15px_225px_15px/15px_225px_15px_255px]',
    statRow: 'flex justify-between items-center py-2 border-b-2 border-slate-200 font-sketch text-xl'
  },
  utils: {
    renderBackground: () => null
  }
};
