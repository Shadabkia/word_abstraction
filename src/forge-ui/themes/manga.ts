
import { GameTheme } from '../types';

export const mangaTheme: GameTheme = {
  id: 'manga',
  name: 'Manga',
  description: 'Black & white, action lines, and dramatic.',
  colors: {
    background: 'bg-white',
    text: 'text-black',
    primary: 'bg-black',
    secondary: 'bg-slate-200',
    accent: 'bg-black',
    muted: 'text-slate-500',
    danger: 'bg-black',
    success: 'bg-black',
    warning: 'bg-black',
    border: 'border-black'
  },
  palettes: {
      'shonen': {
          background: 'bg-white',
          primary: 'bg-orange-500',
          secondary: 'bg-black',
          accent: 'bg-orange-600',
          text: 'text-black',
          border: 'border-black'
      },
      'shojo': {
          background: 'bg-pink-50',
          primary: 'bg-pink-400',
          secondary: 'bg-slate-200',
          accent: 'bg-pink-300',
          text: 'text-slate-900',
          border: 'border-pink-300'
      },
      'noir': {
          background: 'bg-stone-900',
          primary: 'bg-white',
          secondary: 'bg-stone-600',
          accent: 'bg-stone-400',
          text: 'text-white',
          border: 'border-white'
      },
      'vintage': {
          background: 'bg-[#f4e4bc]',
          primary: 'bg-[#5c4b36]',
          secondary: 'bg-[#8c7658]',
          accent: 'bg-[#4a3b2a]',
          text: 'text-[#2e251a]',
          border: 'border-[#4a3b2a]'
      },
      'inked': {
          background: 'bg-[#f0f8ff]',
          primary: 'bg-[#000080]',
          secondary: 'bg-[#4682b4]',
          accent: 'bg-[#191970]',
          text: 'text-[#000033]',
          border: 'border-[#000080]'
      }
  },
  typography: {
    fontFamily: 'font-manga',
    headerFont: 'font-manga',
    bodyFont: 'font-mangaBody'
  },
  components: {
    button: {
      base: 'relative overflow-hidden transition-all duration-200 font-manga uppercase tracking-widest border-[3px] border-black hover:bg-black hover:text-white active:scale-95 clip-path-polygon',
      variants: {
        primary: 'bg-white text-black shadow-[4px_4px_0_0_black]',
        secondary: 'bg-slate-200 text-black shadow-[4px_4px_0_0_black]',
        danger: 'bg-black text-white border-white ring-2 ring-black shadow-[4px_4px_0_0_black]',
        ghost: 'bg-transparent border-transparent shadow-none hover:bg-slate-100 hover:text-black',
        icon: 'bg-white text-black aspect-square p-2 border-[3px] border-black shadow-[2px_2px_0_0_black]'
      },
      sizes: {
        sm: 'px-4 py-1 text-sm',
        md: 'px-8 py-2 text-xl',
        lg: 'px-12 py-4 text-2xl'
      }
    },
    card: {
      container: 'bg-white border-[3px] border-black p-0 font-mangaBody overflow-hidden relative group hover:shadow-[8px_8px_0_0_black] transition-all',
      header: 'font-manga text-2xl bg-black text-white p-2 text-center uppercase skew-x-[-10deg] mx-4 -mt-2 mb-2',
      body: 'text-black p-4 font-bold',
      imageWrapper: 'border-b-[3px] border-black bg-manga-speed h-40 grayscale group-hover:grayscale-0 transition-all',
      rarityOverlay: (rarity) => rarity === 'legendary' ? 'absolute top-0 right-0 bg-black text-white text-xs px-2 py-1 font-bold z-10' : ''
    },
    dialog: {
      overlay: 'bg-white/80 backdrop-grayscale',
      container: 'bg-white border-[4px] border-black p-8 text-center font-manga shadow-[10px_10px_0_0_black] max-w-lg w-full relative',
      header: 'text-5xl text-black mb-6 uppercase tracking-tighter',
      body: 'text-black font-mangaBody text-xl font-bold mb-8',
      closeButton: 'absolute top-0 right-0 bg-black text-white p-2 hover:bg-slate-800'
    },
    progressBar: {
      container: 'h-6 bg-white border-[3px] border-black skew-x-[-15deg] overflow-hidden',
      bar: 'h-full bg-black',
      label: 'text-black font-manga text-sm mb-1 flex justify-between uppercase'
    },
    bottomNav: {
      container: 'bg-black text-white clip-path-polygon',
      item: 'flex-1 flex flex-col items-center justify-center transition-all text-slate-400 hover:text-white',
      itemActive: 'bg-white text-black clip-path-polygon -skew-x-12',
      itemInactive: '',
      indicator: ''
    },
    input: {
        wrapper: 'relative',
        input: 'w-full bg-white border-[3px] border-black px-4 py-3 font-mangaBody text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0_0_black] transition-shadow placeholder-slate-400',
        label: 'bg-black text-white font-manga text-xs px-1 absolute -top-2 left-2 uppercase'
    },
    badge: {
        base: 'px-2 py-0.5 border-2 border-black font-manga text-xs uppercase',
        variants: {
            neutral: 'bg-slate-100 text-black',
            accent: 'bg-black text-white',
            outline: 'bg-white text-black',
            danger: 'bg-black text-white border-white ring-1 ring-black',
            success: 'bg-white text-black border-black'
        }
    },
    toggle: {
        base: 'w-12 h-6 border-[3px] border-black bg-white transition-colors duration-200',
        checked: 'bg-black',
        unchecked: 'bg-white',
        thumb: 'w-4 h-4 bg-white border-2 border-black shadow-[1px_1px_0_0_black]'
    },
    checkbox: {
        base: 'w-5 h-5 border-[3px] border-black bg-white flex items-center justify-center hover:bg-slate-100',
        checked: 'bg-black text-white',
        unchecked: '',
        icon: 'text-white w-3 h-3'
    },
    slider: {
        track: 'h-3 bg-white border-[3px] border-black',
        filled: 'h-full bg-black',
        thumb: 'w-4 h-4 bg-white border-[3px] border-black shadow-[2px_2px_0_0_black] hover:scale-125 transition-transform'
    },
    tooltip: '',
    divider: 'h-[3px] bg-black my-6',
    panel: 'bg-white border-[3px] border-black p-5',
    toast: 'bg-black text-white border-2 border-white px-6 py-4 shadow-[5px_5px_0_0_rgba(0,0,0,0.5)] font-manga uppercase',
    spinner: 'border-4 border-slate-200 border-t-black rounded-full animate-spin',
    itemSlot: 'bg-white border-[3px] border-black aspect-square flex items-center justify-center hover:bg-slate-100',
    statRow: 'flex justify-between items-center py-2 border-b-[2px] border-black font-mangaBody font-bold'
  },
  utils: {
    renderBackground: () => null
  }
};
