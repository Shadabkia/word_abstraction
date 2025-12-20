
import { GameTheme } from '../types';

export const socialTheme: GameTheme = {
  id: 'social',
  name: 'Social',
  description: 'Clean, modern, and app-like.',
  colors: {
    background: 'bg-gray-50',
    text: 'text-gray-900',
    primary: 'bg-indigo-600',
    secondary: 'bg-white',
    accent: 'bg-purple-600',
    muted: 'text-gray-500',
    danger: 'bg-red-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    border: 'border-gray-200'
  },
  palettes: {
      'midnight': {
          background: 'bg-gray-900',
          primary: 'bg-indigo-500',
          secondary: 'bg-gray-800',
          accent: 'bg-blue-500',
          text: 'text-white',
          border: 'border-gray-800',
          muted: 'text-gray-400'
      },
      'dim': {
          background: 'bg-[#2b2d31]',
          primary: 'bg-[#5865f2]',
          secondary: 'bg-[#313338]',
          accent: 'bg-[#23a559]',
          text: 'text-[#f2f3f5]',
          border: 'border-[#1e1f22]',
          muted: 'text-[#949ba4]'
      },
      'ocean': {
          background: 'bg-blue-50',
          primary: 'bg-blue-600',
          secondary: 'bg-white',
          accent: 'bg-cyan-500',
          text: 'text-blue-900',
          border: 'border-blue-100'
      },
      'forest': {
          background: 'bg-green-50',
          primary: 'bg-green-600',
          secondary: 'bg-white',
          accent: 'bg-emerald-500',
          text: 'text-green-900',
          border: 'border-green-100'
      },
      'sunset': {
          background: 'bg-orange-50',
          primary: 'bg-orange-500',
          secondary: 'bg-white',
          accent: 'bg-pink-500',
          text: 'text-orange-900',
          border: 'border-orange-100'
      }
  },
  typography: {
    fontFamily: 'font-social',
    headerFont: 'font-social',
    bodyFont: 'font-socialBody'
  },
  components: {
    button: {
      base: 'relative overflow-hidden transition-all duration-200 font-socialBody font-bold rounded-xl active:scale-95',
      variants: {
        primary: 'bg-indigo-600 text-white shadow-social hover:shadow-lg hover:translate-y-[-1px]',
        secondary: 'bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50',
        danger: 'bg-red-50 text-red-600 hover:bg-red-100',
        ghost: 'bg-transparent text-gray-500 hover:bg-gray-100',
        icon: 'bg-white text-gray-600 border border-gray-200 aspect-square p-2 rounded-full shadow-sm hover:shadow-md'
      },
      sizes: {
        sm: 'px-4 py-1.5 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3.5 text-lg'
      }
    },
    card: {
      container: 'bg-white rounded-2xl p-5 shadow-social border border-gray-100 font-socialBody group hover:shadow-lg transition-shadow duration-300',
      header: 'font-social text-xl text-gray-900 mb-1',
      body: 'text-gray-500 text-sm leading-relaxed',
      imageWrapper: 'rounded-xl mb-4 overflow-hidden bg-gray-100 aspect-video',
      rarityOverlay: (rarity) => rarity === 'legendary' ? 'absolute top-3 right-3 bg-indigo-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm' : ''
    },
    dialog: {
      overlay: 'bg-gray-900/20 backdrop-blur-sm',
      container: 'bg-white rounded-3xl p-6 text-center font-social shadow-2xl max-w-sm w-full',
      header: 'text-2xl text-gray-900 mb-2',
      body: 'text-gray-500 font-socialBody text-base mb-6',
      closeButton: 'bg-gray-100 text-gray-500 rounded-full p-2 hover:bg-gray-200 absolute top-4 right-4'
    },
    progressBar: {
      container: 'h-2 bg-gray-100 rounded-full overflow-hidden',
      bar: 'h-full bg-indigo-600 rounded-full',
      label: 'text-gray-500 font-socialBody text-xs font-bold mb-1 flex justify-between'
    },
    bottomNav: {
      container: 'bg-white/80 backdrop-blur-md border-t border-gray-200',
      item: 'flex-1 flex flex-col items-center justify-center transition-colors text-gray-400 hover:text-indigo-600',
      itemActive: 'text-indigo-600',
      itemInactive: '',
      indicator: 'absolute top-0 h-[2px] bg-indigo-600 w-full transition-all duration-300'
    },
    input: {
        wrapper: 'relative',
        input: 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-socialBody text-gray-900 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all',
        label: 'text-gray-500 font-socialBody text-xs font-bold mb-1 ml-1 block uppercase tracking-wide'
    },
    badge: {
        base: 'px-2.5 py-0.5 rounded-md font-socialBody text-xs font-bold',
        variants: {
            neutral: 'bg-gray-100 text-gray-600',
            accent: 'bg-indigo-50 text-indigo-700',
            outline: 'border border-gray-200 text-gray-500',
            danger: 'bg-red-50 text-red-600',
            success: 'bg-green-50 text-green-600'
        }
    },
    toggle: {
        base: 'w-10 h-6 bg-gray-200 rounded-full p-1 transition-colors duration-300',
        checked: 'bg-indigo-600',
        unchecked: 'bg-gray-200',
        thumb: 'w-4 h-4 bg-white rounded-full shadow-sm'
    },
    checkbox: {
        base: 'w-5 h-5 bg-white border border-gray-300 rounded-md flex items-center justify-center hover:border-indigo-500 transition-colors',
        checked: 'bg-indigo-600 border-indigo-600 text-white',
        unchecked: '',
        icon: 'text-white'
    },
    slider: {
        track: 'h-1.5 bg-gray-200 rounded-full',
        filled: 'h-full bg-indigo-600 rounded-full',
        thumb: 'w-4 h-4 bg-white border border-gray-200 rounded-full shadow-md hover:scale-110'
    },
    tooltip: '',
    divider: 'h-px bg-gray-100 my-4',
    panel: 'bg-white rounded-2xl p-4 border border-gray-100 shadow-sm',
    toast: 'bg-gray-900 text-white rounded-lg px-4 py-3 shadow-lg font-socialBody text-sm flex items-center gap-3',
    spinner: 'border-2 border-gray-100 border-t-indigo-600 rounded-full animate-spin',
    itemSlot: 'bg-gray-50 border border-gray-200 rounded-xl aspect-square flex items-center justify-center hover:bg-white hover:shadow-sm transition-all',
    statRow: 'flex justify-between items-center py-3 border-b border-gray-50 font-socialBody text-sm font-medium text-gray-700'
  },
  utils: {
    renderBackground: () => null
  }
};
