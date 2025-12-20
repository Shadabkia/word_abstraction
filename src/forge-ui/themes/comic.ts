
import { GameTheme } from '../types';

export const comicTheme: GameTheme = {
  id: 'comic',
  name: 'Comic',
  description: 'Bold, expressive, and action-packed.',
  colors: {
    background: 'bg-yellow-50',
    text: 'text-black',
    primary: 'bg-yellow-400',
    secondary: 'bg-sky-400',
    accent: 'bg-red-500',
    muted: 'text-slate-600',
    danger: 'bg-red-600',
    success: 'bg-green-500',
    warning: 'bg-orange-400',
    border: 'border-black'
  },
  palettes: {
      'villain': {
          background: 'bg-purple-50',
          primary: 'bg-purple-600',
          secondary: 'bg-green-500',
          accent: 'bg-orange-500',
          text: 'text-purple-900',
          border: 'border-black'
      },
      'noir': {
          background: 'bg-gray-100',
          primary: 'bg-gray-800',
          secondary: 'bg-gray-400',
          accent: 'bg-red-600',
          text: 'text-black',
          border: 'border-black'
      },
      'retro': {
          background: 'bg-orange-50',
          primary: 'bg-orange-400',
          secondary: 'bg-teal-400',
          accent: 'bg-yellow-300',
          text: 'text-teal-900',
          border: 'border-black'
      },
      'hero': {
          background: 'bg-blue-50',
          primary: 'bg-blue-600',
          secondary: 'bg-red-600',
          accent: 'bg-yellow-400',
          text: 'text-blue-900',
          border: 'border-black'
      },
      'print': {
          background: 'bg-white',
          primary: 'bg-cyan-400',
          secondary: 'bg-magenta-400',
          accent: 'bg-yellow-400',
          text: 'text-black',
          border: 'border-black'
      }
  },
  typography: {
    fontFamily: 'font-comic',
    headerFont: 'font-comic',
    bodyFont: 'font-comicBody'
  },
  components: {
    button: {
      base: 'relative overflow-visible transition-transform font-comic tracking-wider text-xl uppercase border-[3px] border-black shadow-[4px_4px_0_0_black] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_black] active:translate-y-0 active:shadow-[2px_2px_0_0_black] skew-x-[-2deg]',
      variants: {
        primary: 'bg-yellow-400 text-black',
        secondary: 'bg-sky-400 text-black',
        danger: 'bg-red-600 text-white',
        ghost: 'bg-transparent border-transparent shadow-none hover:shadow-none hover:bg-yellow-100 skew-x-0 border-0 underline decoration-wavy',
        icon: 'bg-white text-black aspect-square p-2 rounded-full border-[3px] border-black'
      },
      sizes: {
        sm: 'px-3 py-1 text-lg',
        md: 'px-6 py-2 text-2xl',
        lg: 'px-8 py-4 text-3xl'
      }
    },
    card: {
      container: 'bg-white border-[3px] border-black p-4 font-comicBody shadow-[8px_8px_0_0_black] relative hover:-rotate-1 transition-transform',
      header: 'font-comic text-2xl text-black uppercase leading-none mb-2 bg-yellow-300 inline-block px-1 border-2 border-black -rotate-2',
      body: 'text-black font-bold text-lg',
      imageWrapper: 'border-[3px] border-black mb-3 bg-halftone bg-[length:10px_10px]',
      rarityOverlay: (rarity) => rarity === 'legendary' ? 'absolute -top-4 -right-4 bg-red-500 text-white font-comic px-3 py-1 border-[3px] border-black shadow-[4px_4px_0_0_black] rotate-12 z-10' : ''
    },
    dialog: {
      overlay: 'bg-black/50 backdrop-grayscale',
      container: 'bg-white border-[4px] border-black p-8 text-center font-comic shadow-[15px_15px_0_0_rgba(0,0,0,1)] max-w-lg w-full transform rotate-1',
      header: 'text-5xl text-black mb-6 uppercase drop-shadow-[2px_2px_0_white] text-shadow-black',
      body: 'text-black font-comicBody text-xl font-bold mb-8',
      closeButton: 'bg-red-500 text-white border-[3px] border-black rounded-full p-1 absolute -top-4 -right-4 hover:scale-110 transition-transform'
    },
    progressBar: {
      container: 'h-8 bg-white border-[3px] border-black skew-x-[-5deg]',
      bar: 'h-full bg-stripes bg-red-500 bg-[length:20px_20px] border-r-[3px] border-black',
      label: 'text-black font-comic text-xl mb-1 flex justify-between uppercase'
    },
    bottomNav: {
      container: 'bg-white border-t-[3px] border-black bg-halftone bg-[length:4px_4px]',
      item: 'flex-1 flex flex-col items-center justify-center transition-all text-black border-l border-black first:border-l-0 hover:bg-yellow-100',
      itemActive: 'bg-yellow-300 -skew-x-6 border-[3px] border-black shadow-[2px_2px_0_0_black]',
      itemInactive: '',
      indicator: ''
    },
    input: {
        wrapper: 'relative',
        input: 'w-full bg-white border-[3px] border-black px-4 py-3 font-comicBody text-xl font-bold focus:outline-none focus:shadow-[4px_4px_0_0_black] transition-shadow',
        label: 'text-black font-comic text-lg uppercase mb-1 block'
    },
    badge: {
        base: 'px-2 py-0.5 text-sm font-comic uppercase border-2 border-black shadow-[2px_2px_0_0_black]',
        variants: {
            neutral: 'bg-slate-200',
            accent: 'bg-yellow-300',
            outline: 'bg-white',
            danger: 'bg-red-500 text-white',
            success: 'bg-green-400 text-black'
        }
    },
    toggle: {
        base: 'w-14 h-8 bg-white border-[3px] border-black p-1 transition-colors duration-200',
        checked: 'bg-green-400',
        unchecked: 'bg-slate-300',
        thumb: 'w-5 h-5 bg-white border-[3px] border-black shadow-sm transform transition-transform duration-200'
    },
    checkbox: {
        base: 'w-6 h-6 border-[3px] border-black flex items-center justify-center bg-white hover:bg-yellow-100 transition-colors',
        checked: 'bg-sky-400',
        unchecked: '',
        icon: 'text-black w-4 h-4'
    },
    slider: {
        track: 'h-4 bg-white border-[3px] border-black',
        filled: 'h-full bg-yellow-400 border-r-[3px] border-black',
        thumb: 'w-6 h-6 bg-white border-[3px] border-black shadow-[2px_2px_0_0_black] hover:scale-110'
    },
    tooltip: '',
    divider: 'h-[3px] bg-black my-6 rounded-full',
    panel: 'bg-white border-[3px] border-black p-5 shadow-[5px_5px_0_0_black]',
    toast: 'bg-yellow-300 border-[3px] border-black text-black px-5 py-3 shadow-[6px_6px_0_0_black] font-comic text-xl uppercase',
    spinner: 'border-[4px] border-black border-t-yellow-400 rounded-full animate-spin',
    itemSlot: 'bg-white border-[3px] border-black aspect-square flex items-center justify-center hover:bg-yellow-50',
    statRow: 'flex justify-between items-center py-2 border-b-[3px] border-black font-comic text-lg'
  },
  utils: {
    renderBackground: () => null
  }
};
