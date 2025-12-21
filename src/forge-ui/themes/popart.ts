
import { GameTheme } from '../types';

export const popartTheme: GameTheme = {
  id: 'popart',
  name: 'PopArt',
  description: 'Bold, dotted, and expressive.',
  colors: {
    background: 'bg-yellow-200',
    text: 'text-black',
    primary: 'bg-red-500',
    secondary: 'bg-blue-500',
    accent: 'bg-yellow-400',
    muted: 'text-slate-800',
    danger: 'bg-black',
    success: 'bg-green-500',
    warning: 'bg-orange-500',
    border: 'border-black'
  },
  palettes: {
      'warhol': {
          background: 'bg-[#ff00ff]',
          primary: 'bg-[#ffff00]',
          secondary: 'bg-[#00ffff]',
          accent: 'bg-[#000000]',
          text: 'text-black',
          border: 'border-black'
      },
      'comic-book': {
          background: 'bg-white',
          primary: 'bg-[#ed1c24]',
          secondary: 'bg-[#0054a6]',
          accent: 'bg-[#fff200]',
          text: 'text-black',
          border: 'border-black'
      },
      'neon': {
          background: 'bg-[#111111]',
          primary: 'bg-[#39ff14]',
          secondary: 'bg-[#ff0099]',
          accent: 'bg-[#0ff0fc]',
          text: 'text-white',
          border: 'border-white'
      },
      'monochrome': {
          background: 'bg-white',
          primary: 'bg-black',
          secondary: 'bg-gray-400',
          accent: 'bg-red-600',
          text: 'text-black',
          border: 'border-black'
      },
      'pastel-pop': {
          background: 'bg-[#ffb7b2]',
          primary: 'bg-[#ff9aa2]',
          secondary: 'bg-[#e2f0cb]',
          accent: 'bg-[#b5ead7]',
          text: 'text-[#6d6875]',
          border: 'border-[#6d6875]'
      }
  },
  typography: {
    fontFamily: 'font-popart',
    headerFont: 'font-popart',
    bodyFont: 'font-comicBody'
  },
  components: {
    button: {
      base: 'relative overflow-visible transition-transform font-popart text-xl tracking-wide uppercase border-[3px] border-black shadow-pop hover:-translate-y-1 hover:shadow-[6px_6px_0_0_black] active:translate-y-0 active:shadow-pop',
      variants: {
        primary: 'bg-red-500 text-white',
        secondary: 'bg-blue-500 text-white',
        danger: 'bg-black text-white',
        ghost: 'bg-transparent border-transparent shadow-none hover:bg-white/50 text-black',
        icon: 'bg-white text-black border-[3px] border-black aspect-square p-2 rounded-full'
      },
      sizes: {
        sm: 'px-4 py-2 text-lg',
        md: 'px-8 py-3 text-2xl',
        lg: 'px-10 py-4 text-3xl'
      }
    },
    card: {
      container: 'bg-white border-[4px] border-black p-4 font-comicBody shadow-pop relative group bg-popart-dots bg-[length:10px_10px]',
      header: 'font-popart text-3xl text-black bg-white inline-block border-2 border-black px-2 shadow-[2px_2px_0_0_black] mb-2',
      body: 'bg-white p-2 border-2 border-black font-bold text-black',
      imageWrapper: 'border-[3px] border-black mb-4 bg-yellow-400 p-1',
      rarityOverlay: (rarity) => rarity === 'legendary' ? 'absolute -top-3 -right-3 bg-blue-500 text-white border-[3px] border-black p-2 font-popart text-xs rotate-12 z-20' : ''
    },
    dialog: {
      overlay: 'bg-blue-500/80 bg-popart-dots bg-[length:20px_20px]',
      container: 'bg-white border-[5px] border-black p-8 text-center font-popart shadow-[20px_20px_0_0_black] max-w-lg w-full',
      header: 'text-5xl text-black mb-6 uppercase text-shadow-pop',
      body: 'bg-yellow-200 border-2 border-black p-4 text-black font-comicBody text-xl font-bold mb-8',
      closeButton: 'bg-red-500 text-white border-[3px] border-black rounded-full p-2 absolute -top-5 -right-5 hover:scale-110'
    },
    progressBar: {
      container: 'h-8 bg-white border-[3px] border-black',
      bar: 'h-full bg-blue-500 border-r-[3px] border-black',
      label: 'text-black font-popart text-xl mb-1 flex justify-between uppercase bg-white inline-block px-1 border-2 border-black shadow-[2px_2px_0_0_black]'
    },
    bottomNav: {
      container: 'bg-red-500 border-t-[4px] border-black bg-popart-dots bg-[length:4px_4px]',
      item: 'flex-1 flex flex-col items-center justify-center transition-all text-white border-x-2 border-black hover:bg-black/10',
      itemActive: 'bg-yellow-400 text-black border-[3px] border-black shadow-[4px_4px_0_0_black] -translate-y-4 rounded-full w-14 h-14 mx-auto z-10',
      itemInactive: '',
      indicator: ''
    },
    input: {
        wrapper: 'relative',
        input: 'w-full bg-white border-[3px] border-black px-4 py-3 font-comicBody text-xl font-bold focus:outline-none focus:shadow-pop transition-shadow',
        label: 'text-black font-popart text-lg mb-1 block bg-yellow-300 inline-block px-1 border-2 border-black transform -rotate-1'
    },
    badge: {
        base: 'px-2 py-1 text-sm font-popart uppercase border-2 border-black',
        variants: {
            neutral: 'bg-white',
            accent: 'bg-yellow-400',
            outline: 'bg-transparent',
            danger: 'bg-black text-white',
            success: 'bg-green-500 text-black'
        }
    },
    toggle: {
        base: 'w-14 h-8 bg-white border-[3px] border-black transition-colors',
        checked: 'bg-blue-500',
        unchecked: 'bg-white',
        thumb: 'w-6 h-6 bg-yellow-400 border-[3px] border-black shadow-[2px_2px_0_0_black]'
    },
    checkbox: {
        base: 'w-6 h-6 border-[3px] border-black bg-white flex items-center justify-center hover:bg-yellow-200',
        checked: 'bg-red-500',
        unchecked: '',
        icon: 'text-white w-4 h-4'
    },
    slider: {
        track: 'h-4 bg-white border-[3px] border-black',
        filled: 'h-full bg-blue-500 border-r-[3px] border-black',
        thumb: 'w-6 h-6 bg-yellow-400 border-[3px] border-black shadow-[2px_2px_0_0_black]'
    },
    tooltip: '',
    divider: 'h-[4px] bg-black my-6',
    panel: 'bg-white border-[3px] border-black p-5 shadow-pop',
    toast: 'bg-blue-500 border-[3px] border-black text-white px-6 py-4 shadow-pop font-popart text-xl',
    spinner: 'border-[4px] border-black border-t-yellow-400 rounded-full animate-spin',
    itemSlot: 'bg-white border-[3px] border-black aspect-square flex items-center justify-center shadow-[inset_4px_4px_0_0_rgba(0,0,0,0.1)]',
    statRow: 'flex justify-between items-center py-2 border-b-[3px] border-black font-popart text-xl'
  },
  utils: {
    renderBackground: () => null
  }
};
