
import { GameTheme } from '../types';

export const paperTheme: GameTheme = {
  id: 'paper',
  name: 'Paper',
  description: 'Hand-drawn, sketchy, and organic.',
  colors: {
    background: 'bg-[#fcfbf9]',
    text: 'text-slate-800',
    primary: 'bg-blue-600',
    secondary: 'bg-slate-600',
    accent: 'bg-orange-400',
    muted: 'text-slate-500',
    danger: 'bg-red-500',
    success: 'bg-green-600',
    warning: 'bg-yellow-500',
    border: 'border-slate-800'
  },
  palettes: {
      'blueprint': {
          background: 'bg-[#1e40af]',
          primary: 'bg-white',
          secondary: 'bg-blue-300',
          accent: 'bg-blue-100',
          text: 'text-white',
          border: 'border-white',
          muted: 'text-blue-200'
      },
      'parchment': {
          background: 'bg-[#fdf6e3]',
          primary: 'bg-[#8b4513]',
          secondary: 'bg-[#d2691e]',
          accent: 'bg-[#deb887]',
          text: 'text-[#5c4033]',
          border: 'border-[#8b4513]',
          muted: 'text-[#8b4513]/60'
      },
      'notebook': {
          background: 'bg-yellow-50',
          primary: 'bg-red-500',
          secondary: 'bg-blue-500',
          accent: 'bg-yellow-400',
          text: 'text-slate-700',
          border: 'border-blue-200'
      },
      'chalkboard': {
          background: 'bg-[#2f3e30]',
          primary: 'bg-white',
          secondary: 'bg-[#e0e0e0]',
          accent: 'bg-yellow-200',
          text: 'text-white',
          border: 'border-white/20'
      },
      'newsprint': {
          background: 'bg-[#e8e6e1]',
          primary: 'bg-black',
          secondary: 'bg-slate-700',
          accent: 'bg-red-700',
          text: 'text-black',
          border: 'border-black'
      }
  },
  typography: {
    fontFamily: 'font-paper',
    headerFont: 'font-paper',
    bodyFont: 'font-paper'
  },
  components: {
    button: {
      base: 'relative overflow-visible transition-transform font-paper font-bold text-xl tracking-wide border-2 border-slate-800 rounded-sm hover:-rotate-1 active:scale-95 shadow-[2px_2px_0_rgba(0,0,0,0.1)]',
      variants: {
        primary: 'bg-white text-blue-600 hover:bg-blue-50',
        secondary: 'bg-white text-slate-600 hover:bg-slate-50',
        danger: 'bg-white text-red-500 hover:bg-red-50',
        ghost: 'bg-transparent border-transparent shadow-none hover:bg-slate-100/50 underline decoration-wavy decoration-slate-300',
        icon: 'bg-white text-slate-700 aspect-square p-2 rounded-full border-2 border-slate-800'
      },
      sizes: {
        sm: 'px-3 py-1 text-lg',
        md: 'px-6 py-2 text-2xl',
        lg: 'px-8 py-3 text-3xl'
      }
    },
    card: {
      container: 'bg-white border border-slate-300 shadow-md p-4 font-paper relative rotate-1 hover:rotate-0 transition-transform duration-300 bg-paper-grid bg-[length:20px_20px]',
      header: 'font-paper text-2xl text-blue-800 mb-2 border-b-2 border-blue-800/20 pb-1 inline-block',
      body: 'text-slate-600 text-lg leading-relaxed',
      imageWrapper: 'border-2 border-slate-800 mb-4 p-2 bg-white transform -rotate-2 shadow-sm',
      rarityOverlay: (rarity) => rarity === 'legendary' ? 'absolute -top-2 -right-2 bg-yellow-300 text-slate-900 border border-slate-800 px-2 py-1 rotate-3 shadow-sm z-10' : ''
    },
    dialog: {
      overlay: 'bg-slate-900/20 backdrop-blur-[2px]',
      container: 'bg-[#fffdf5] border-2 border-slate-800 p-8 text-center font-paper shadow-[5px_5px_0_rgba(0,0,0,0.2)] max-w-md w-full rotate-1',
      header: 'text-4xl text-slate-800 mb-4 underline decoration-blue-400 decoration-4',
      body: 'text-slate-600 text-xl mb-8',
      closeButton: 'text-slate-400 hover:text-red-500 absolute top-4 right-4'
    },
    progressBar: {
      container: 'h-5 bg-white border-2 border-slate-800 rounded-full overflow-hidden p-0.5',
      bar: 'h-full bg-slate-800 rounded-full bg-paper-grid',
      label: 'text-slate-700 font-paper text-lg mb-1 flex justify-between'
    },
    bottomNav: {
      container: 'bg-[#fcfbf9] border-t-2 border-dashed border-slate-400 bg-paper-grid',
      item: 'flex-1 flex flex-col items-center justify-center transition-all text-slate-400 hover:text-slate-800 relative',
      itemActive: 'text-blue-600 font-bold',
      itemInactive: '',
      indicator: 'absolute top-0 w-full h-0.5 bg-blue-600 transform scale-x-50 transition-transform'
    },
    input: {
        wrapper: 'relative',
        input: 'w-full bg-transparent border-b-2 border-slate-400 px-2 py-2 font-paper text-xl text-slate-800 focus:outline-none focus:border-blue-600 transition-colors rounded-none bg-paper-grid',
        label: 'text-slate-500 font-paper text-lg mb-0 block'
    },
    badge: {
        base: 'px-2 py-0.5 border border-slate-400 rounded-sm font-paper text-sm',
        variants: {
            neutral: 'bg-slate-100 text-slate-600',
            accent: 'bg-orange-100 text-orange-700',
            outline: 'border-slate-800 text-slate-800 border-dashed',
            danger: 'bg-red-50 text-red-600',
            success: 'bg-green-50 text-green-600'
        }
    },
    toggle: {
        base: 'w-12 h-6 border-2 border-slate-800 rounded-full p-0.5 transition-colors',
        checked: 'bg-green-200',
        unchecked: 'bg-slate-100',
        thumb: 'w-4 h-4 bg-slate-800 rounded-full shadow-sm'
    },
    checkbox: {
        base: 'w-5 h-5 border-2 border-slate-800 bg-white flex items-center justify-center hover:bg-slate-50',
        checked: 'bg-blue-100',
        unchecked: '',
        icon: 'text-slate-800'
    },
    slider: {
        track: 'h-1 bg-slate-300 rounded-full',
        filled: 'h-full bg-slate-800',
        thumb: 'w-4 h-4 bg-white border-2 border-slate-800 rounded-full shadow-sm hover:scale-125'
    },
    tooltip: '',
    divider: 'h-px bg-slate-300 my-6 border-b border-dashed border-slate-400',
    panel: 'bg-white border border-slate-200 shadow-sm p-4 rotate-1',
    toast: 'bg-white border-2 border-slate-800 text-slate-800 px-6 py-4 shadow-md font-paper text-xl rotate-1',
    spinner: 'border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin',
    itemSlot: 'bg-white border-2 border-slate-300 aspect-square flex items-center justify-center border-dashed text-slate-300',
    statRow: 'flex justify-between items-center py-2 border-b border-dashed border-slate-300 font-paper text-xl'
  },
  utils: {
    renderBackground: () => null
  }
};
