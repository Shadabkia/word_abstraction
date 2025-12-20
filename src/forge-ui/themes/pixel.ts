
import { GameTheme } from '../types';

export const pixelTheme: GameTheme = {
  id: 'pixel',
  name: 'Pixel',
  description: '8-bit retro nostalgia.',
  colors: {
    background: 'bg-slate-900',
    text: 'text-white',
    primary: 'bg-blue-600',
    secondary: 'bg-slate-600',
    accent: 'bg-yellow-400',
    muted: 'text-slate-400',
    danger: 'bg-red-600',
    success: 'bg-green-600',
    warning: 'bg-orange-500',
    border: 'border-white'
  },
  palettes: {
      'gameboy': {
          background: 'bg-[#9bbc0f]',
          primary: 'bg-[#0f380f]',
          secondary: 'bg-[#306230]',
          accent: 'bg-[#8bac0f]',
          text: 'text-[#0f380f]',
          border: 'border-[#0f380f]'
      },
      'nes': {
          background: 'bg-[#202020]',
          primary: 'bg-[#ff0000]',
          secondary: 'bg-[#808080]',
          accent: 'bg-[#ffffff]',
          text: 'text-[#ffffff]',
          border: 'border-[#ff0000]'
      },
      'cga': {
          background: 'bg-black',
          primary: 'bg-magenta-600',
          secondary: 'bg-cyan-600',
          accent: 'bg-white',
          text: 'text-cyan-400',
          border: 'border-white'
      },
      'cyber': {
          background: 'bg-[#1a0b2e]',
          primary: 'bg-[#ff00ff]',
          secondary: 'bg-[#711c91]',
          accent: 'bg-[#00ffff]',
          text: 'text-[#e0e0e0]',
          border: 'border-[#ff00ff]'
      },
      'sepia': {
          background: 'bg-[#3e3226]',
          primary: 'bg-[#e09c4d]',
          secondary: 'bg-[#705234]',
          accent: 'bg-[#d8cba8]',
          text: 'text-[#d8cba8]',
          border: 'border-[#d8cba8]'
      }
  },
  typography: {
    fontFamily: 'font-pixel',
    headerFont: 'font-pixel',
    bodyFont: 'font-pixel'
  },
  components: {
    button: {
      base: 'relative transition-transform active:translate-y-1 active:shadow-none font-pixel text-[10px] md:text-xs uppercase tracking-tight image-rendering-pixelated',
      variants: {
        primary: 'bg-blue-600 text-white shadow-[4px_4px_0_0_black] border-2 border-white hover:bg-blue-500',
        secondary: 'bg-slate-600 text-white shadow-[4px_4px_0_0_black] border-2 border-white hover:bg-slate-500',
        danger: 'bg-red-600 text-white shadow-[4px_4px_0_0_black] border-2 border-white hover:bg-red-500',
        ghost: 'bg-transparent text-white border-2 border-transparent hover:border-white hover:bg-white/10',
        icon: 'bg-white text-black border-2 border-black shadow-[4px_4px_0_0_black] p-2 aspect-square flex items-center justify-center hover:translate-y-1 hover:shadow-none'
      },
      sizes: {
        sm: 'px-2 py-2',
        md: 'px-4 py-3',
        lg: 'px-6 py-4'
      }
    },
    card: {
      container: 'bg-slate-800 border-4 border-white p-4 font-pixel shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] image-rendering-pixelated',
      header: 'text-yellow-400 text-sm mb-2 uppercase',
      body: 'text-slate-300 text-[10px] leading-relaxed',
      imageWrapper: 'border-4 border-black mb-4 bg-slate-900',
      rarityOverlay: (rarity) => rarity === 'legendary' ? 'absolute top-2 right-2 text-yellow-400 animate-pulse text-[10px]' : ''
    },
    dialog: {
      overlay: 'bg-black/80',
      container: 'bg-slate-800 border-4 border-white p-6 text-center font-pixel shadow-[12px_12px_0_0_rgba(0,0,0,0.8)] max-w-lg w-full image-rendering-pixelated',
      header: 'text-xl text-white mb-6 uppercase border-b-4 border-white pb-4',
      body: 'text-slate-300 text-xs mb-8',
      closeButton: 'absolute top-4 right-4 text-white hover:text-red-500'
    },
    progressBar: {
      container: 'h-6 bg-black border-4 border-white relative p-1',
      bar: 'h-full bg-green-500',
      label: 'text-white font-pixel text-[10px] mb-2 flex justify-between uppercase'
    },
    bottomNav: {
      container: 'bg-slate-900 border-t-4 border-white',
      item: 'flex-1 flex flex-col items-center justify-center font-pixel text-[8px] text-slate-500 hover:text-white hover:bg-white/10 active:bg-white/20',
      itemActive: 'text-yellow-400 bg-white/5 border-t-2 border-yellow-400',
      itemInactive: '',
      indicator: ''
    },
    input: {
        wrapper: 'relative',
        input: 'w-full bg-black border-2 border-white text-white px-3 py-3 font-pixel text-xs focus:outline-none focus:bg-slate-900',
        label: 'text-white font-pixel text-[10px] mb-1 block uppercase'
    },
    badge: {
        base: 'px-2 py-1 text-[8px] font-pixel border-2 uppercase',
        variants: {
            neutral: 'bg-slate-700 border-slate-500 text-slate-300',
            accent: 'bg-blue-900 border-blue-500 text-blue-300',
            outline: 'border-white text-white',
            danger: 'bg-red-900 border-red-500 text-red-300',
            success: 'bg-green-900 border-green-500 text-green-300'
        }
    },
    toggle: {
        base: 'w-10 h-6 bg-black border-2 border-white p-0.5 relative transition-none',
        checked: 'bg-green-600',
        unchecked: 'bg-slate-700',
        thumb: 'w-4 h-4 bg-white border-2 border-black absolute top-0.5 left-0.5 transition-none'
    },
    checkbox: {
        base: 'w-5 h-5 bg-black border-2 border-white flex items-center justify-center hover:bg-slate-800 transition-none',
        checked: 'bg-blue-600 text-white',
        unchecked: '',
        icon: 'text-white w-3 h-3'
    },
    slider: {
        track: 'h-4 bg-black border-2 border-white',
        filled: 'h-full bg-yellow-400 border-r-2 border-black',
        thumb: 'w-4 h-6 bg-white border-2 border-black hover:bg-slate-200'
    },
    tooltip: '',
    divider: 'h-1 bg-white my-4 border-b-2 border-black',
    panel: 'bg-slate-800 border-4 border-white p-4 shadow-[4px_4px_0_0_black]',
    toast: 'bg-slate-800 border-4 border-white text-white px-4 py-4 shadow-[8px_8px_0_0_black] font-pixel text-xs',
    spinner: 'border-4 border-slate-700 border-t-white h-8 w-8 animate-spin rounded-none',
    itemSlot: 'bg-slate-900 border-4 border-slate-600 aspect-square flex items-center justify-center hover:border-white',
    statRow: 'flex justify-between items-center py-2 border-b-2 border-slate-700 font-pixel text-[10px]'
  },
  utils: {
    renderBackground: () => null
  }
};
