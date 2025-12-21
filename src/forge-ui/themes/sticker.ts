
import { GameTheme } from '../types';

export const stickerTheme: GameTheme = {
  id: 'sticker',
  name: 'Sticker',
  description: 'Adhesive, layered, and fun.',
  colors: {
    background: 'bg-indigo-100',
    text: 'text-slate-800',
    primary: 'bg-indigo-500',
    secondary: 'bg-pink-500',
    accent: 'bg-lime-400',
    muted: 'text-slate-500',
    danger: 'bg-rose-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-400',
    border: 'border-white'
  },
  palettes: {
      'urban': {
          background: 'bg-gray-100',
          primary: 'bg-black',
          secondary: 'bg-yellow-400',
          accent: 'bg-pink-500',
          text: 'text-black',
          border: 'border-white'
      },
      'kawaii': {
          background: 'bg-pink-50',
          primary: 'bg-pink-300',
          secondary: 'bg-blue-200',
          accent: 'bg-yellow-200',
          text: 'text-slate-600',
          border: 'border-white'
      },
      'retro': {
          background: 'bg-purple-900',
          primary: 'bg-cyan-400',
          secondary: 'bg-magenta-500',
          accent: 'bg-yellow-300',
          text: 'text-white',
          border: 'border-white'
      },
      'holographic': {
          background: 'bg-slate-900',
          primary: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500',
          secondary: 'bg-white/20',
          accent: 'bg-cyan-300',
          text: 'text-white',
          border: 'border-white/50'
      },
      'vinyl': {
          background: 'bg-red-50',
          primary: 'bg-red-600',
          secondary: 'bg-black',
          accent: 'bg-white',
          text: 'text-black',
          border: 'border-white'
      }
  },
  typography: {
    fontFamily: 'font-sticker',
    headerFont: 'font-sticker',
    bodyFont: 'font-sticker'
  },
  components: {
    button: {
      base: 'relative overflow-visible transition-transform font-sticker text-xl tracking-wide text-white border-4 border-white shadow-sticker rounded-xl hover:scale-105 active:scale-95 active:rotate-1',
      variants: {
        primary: 'bg-indigo-500',
        secondary: 'bg-pink-500',
        danger: 'bg-rose-500',
        ghost: 'bg-transparent text-indigo-500 border-transparent shadow-none hover:bg-white/50',
        icon: 'bg-white text-indigo-500 border-4 border-white shadow-sticker aspect-square p-2 rounded-full'
      },
      sizes: {
        sm: 'px-4 py-1 text-lg',
        md: 'px-8 py-2 text-2xl',
        lg: 'px-10 py-3 text-3xl'
      }
    },
    card: {
      container: 'bg-white border-4 border-white p-5 font-sticker shadow-sticker rounded-3xl relative group hover:rotate-1 transition-transform',
      header: 'font-sticker text-3xl text-indigo-600 mb-2',
      body: 'text-slate-600 text-lg',
      imageWrapper: 'rounded-2xl border-4 border-indigo-100 mb-4 bg-indigo-50 overflow-hidden',
      rarityOverlay: (rarity) => rarity === 'legendary' ? 'absolute -top-3 -right-3 bg-lime-400 text-slate-800 border-4 border-white px-3 py-1 shadow-sticker rotate-6 z-10 rounded-full' : ''
    },
    dialog: {
      overlay: 'bg-indigo-900/40 backdrop-blur-sm',
      container: 'bg-white border-8 border-white p-8 text-center font-sticker shadow-2xl max-w-md w-full rounded-[3rem]',
      header: 'text-5xl text-indigo-500 mb-4 text-shadow-sm',
      body: 'text-slate-500 text-xl mb-8',
      closeButton: 'bg-rose-500 text-white border-4 border-white rounded-full p-2 absolute -top-4 -right-4 shadow-sticker hover:scale-110'
    },
    progressBar: {
      container: 'h-8 bg-white border-4 border-white rounded-full shadow-sticker overflow-hidden p-1',
      bar: 'h-full bg-lime-400 rounded-full',
      label: 'text-indigo-600 font-sticker text-lg mb-1 flex justify-between px-2'
    },
    bottomNav: {
      container: 'bg-indigo-500 border-4 border-white shadow-sticker rounded-2xl mx-4 mb-4',
      item: 'flex-1 flex flex-col items-center justify-center transition-all text-white/70 hover:text-white',
      itemActive: 'text-white bg-white/20 rounded-xl shadow-inner',
      itemInactive: '',
      indicator: ''
    },
    input: {
        wrapper: 'relative',
        input: 'w-full bg-white border-4 border-white shadow-sticker rounded-xl px-4 py-3 font-sticker text-xl text-indigo-700 focus:outline-none focus:scale-[1.01] transition-transform',
        label: 'text-indigo-500 font-sticker text-lg mb-1 ml-2 block'
    },
    badge: {
        base: 'px-2 py-0.5 rounded-lg font-sticker text-sm border-2 border-white shadow-sm',
        variants: {
            neutral: 'bg-slate-200 text-slate-500',
            accent: 'bg-lime-300 text-slate-700',
            outline: 'border-indigo-300 text-indigo-500',
            danger: 'bg-rose-200 text-rose-700',
            success: 'bg-emerald-200 text-emerald-700'
        }
    },
    toggle: {
        base: 'w-12 h-6 bg-white border-4 border-white shadow-sticker rounded-full p-0.5 transition-colors',
        checked: 'bg-indigo-500',
        unchecked: 'bg-indigo-100',
        thumb: 'w-4 h-4 bg-white rounded-full shadow-sm'
    },
    checkbox: {
        base: 'w-6 h-6 border-4 border-white bg-white shadow-sticker rounded-lg flex items-center justify-center',
        checked: 'bg-pink-500 text-white',
        unchecked: '',
        icon: 'text-white'
    },
    slider: {
        track: 'h-4 bg-white border-4 border-white shadow-sticker rounded-full',
        filled: 'h-full bg-lime-400 rounded-full',
        thumb: 'w-5 h-5 bg-white border-2 border-indigo-200 rounded-full shadow-md'
    },
    tooltip: '',
    divider: 'h-2 bg-white rounded-full my-6 shadow-sm w-1/3 mx-auto',
    panel: 'bg-white border-4 border-white shadow-sticker rounded-3xl p-6',
    toast: 'bg-indigo-600 border-4 border-white text-white px-6 py-4 shadow-sticker font-sticker text-xl rounded-2xl',
    spinner: 'border-4 border-white border-t-pink-500 rounded-full animate-spin shadow-sticker',
    itemSlot: 'bg-indigo-50 border-4 border-white aspect-square flex items-center justify-center shadow-sticker rounded-2xl',
    statRow: 'flex justify-between items-center py-2 border-b-2 border-indigo-50 font-sticker text-xl text-slate-600'
  },
  utils: {
    renderBackground: () => null
  }
};
