
import { GameTheme } from '../types';

export const clayTheme: GameTheme = {
  id: 'clay',
  name: 'Clay',
  description: 'Soft, extruded, and matte.',
  colors: {
    background: 'bg-[#e0e5ec]',
    text: 'text-slate-600',
    primary: 'bg-[#e0e5ec]', // Clay relies on shadows, not bg colors usually
    secondary: 'bg-[#e0e5ec]',
    accent: 'bg-[#9baacf]',
    muted: 'text-slate-400',
    danger: 'bg-[#e89a9a]',
    success: 'bg-[#9ae8b6]',
    warning: 'bg-[#e8d29a]',
    border: 'border-transparent'
  },
  palettes: {
      'primary': {
          background: 'bg-yellow-50',
          primary: 'bg-blue-400',
          secondary: 'bg-red-400',
          accent: 'bg-yellow-400',
          text: 'text-slate-800',
          border: 'border-transparent'
      },
      'terracotta': {
          background: 'bg-[#f0e6dd]',
          primary: 'bg-[#ccaea1]',
          secondary: 'bg-[#a1887f]',
          accent: 'bg-[#8d6e63]',
          text: 'text-[#5d4037]',
          border: 'border-transparent'
      },
      'pastel': {
          background: 'bg-[#f3e5f5]',
          primary: 'bg-[#e1bee7]',
          secondary: 'bg-[#d1c4e9]',
          accent: 'bg-[#b39ddb]',
          text: 'text-[#4527a0]',
          border: 'border-transparent'
      },
      'glaze': {
          background: 'bg-[#e3f2fd]',
          primary: 'bg-[#bbdefb]',
          secondary: 'bg-[#90caf9]',
          accent: 'bg-[#64b5f6]',
          text: 'text-[#1565c0]',
          border: 'border-transparent'
      },
      'forest': {
          background: 'bg-[#e8f5e9]',
          primary: 'bg-[#c8e6c9]',
          secondary: 'bg-[#a5d6a7]',
          accent: 'bg-[#81c784]',
          text: 'text-[#2e7d32]',
          border: 'border-transparent'
      }
  },
  typography: {
    fontFamily: 'font-clay',
    headerFont: 'font-clay',
    bodyFont: 'font-clay'
  },
  components: {
    button: {
      base: 'relative overflow-hidden transition-all duration-300 font-clay font-bold text-slate-600 rounded-2xl shadow-clay hover:scale-[1.02] active:shadow-clay-active active:scale-95',
      variants: {
        primary: 'bg-[#e0e5ec] text-slate-700',
        secondary: 'bg-[#e0e5ec] text-slate-500',
        danger: 'bg-[#e89a9a] text-red-800',
        ghost: 'bg-transparent shadow-none hover:bg-slate-200/50',
        icon: 'bg-[#e0e5ec] text-slate-600 aspect-square p-2 rounded-full shadow-clay'
      },
      sizes: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-8 py-3 text-lg',
        lg: 'px-10 py-4 text-xl'
      }
    },
    card: {
      container: 'bg-[#e0e5ec] rounded-[2rem] p-6 shadow-clay font-clay text-slate-600 group hover:translate-y-[-4px] transition-transform',
      header: 'font-clay text-2xl text-slate-700 mb-2',
      body: 'text-slate-500 text-sm',
      imageWrapper: 'rounded-2xl mb-4 shadow-clay-active p-1 overflow-hidden',
      rarityOverlay: (rarity) => rarity === 'legendary' ? 'absolute top-4 right-4 text-yellow-600 font-bold text-xs bg-[#e8d29a] px-2 py-1 rounded-full shadow-clay' : ''
    },
    dialog: {
      overlay: 'bg-slate-500/20 backdrop-blur-sm',
      container: 'bg-[#e0e5ec] rounded-[3rem] p-8 text-center font-clay shadow-clay max-w-md w-full',
      header: 'text-3xl text-slate-700 mb-6',
      body: 'text-slate-500 text-lg mb-8',
      closeButton: 'bg-[#e0e5ec] text-slate-400 rounded-full p-3 shadow-clay hover:text-red-500 absolute top-6 right-6 active:shadow-clay-active'
    },
    progressBar: {
      container: 'h-6 bg-[#e0e5ec] rounded-full shadow-clay-active overflow-hidden p-1',
      bar: 'h-full bg-[#9baacf] rounded-full shadow-clay',
      label: 'text-slate-500 font-clay text-sm mb-2 flex justify-between px-2'
    },
    bottomNav: {
      container: 'bg-[#e0e5ec] shadow-[0_-10px_20px_rgba(255,255,255,0.7),0_-5px_10px_rgba(0,0,0,0.05)] border-t border-white',
      item: 'flex-1 flex flex-col items-center justify-center transition-all text-slate-400 hover:text-slate-600',
      itemActive: 'text-slate-600 shadow-clay-active rounded-xl bg-[#e0e5ec] mx-2',
      itemInactive: '',
      indicator: ''
    },
    input: {
        wrapper: 'relative',
        input: 'w-full bg-[#e0e5ec] rounded-2xl px-6 py-4 font-clay text-slate-600 shadow-clay-active focus:outline-none focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] transition-shadow',
        label: 'text-slate-500 font-clay text-sm mb-2 ml-4 block'
    },
    badge: {
        base: 'px-3 py-1 rounded-full font-clay text-xs font-bold shadow-clay',
        variants: {
            neutral: 'bg-[#e0e5ec] text-slate-500',
            accent: 'bg-[#9baacf] text-blue-800',
            outline: 'shadow-none border border-slate-300 text-slate-500',
            danger: 'bg-[#e89a9a] text-red-800',
            success: 'bg-[#9ae8b6] text-green-800'
        }
    },
    toggle: {
        base: 'w-12 h-6 bg-[#e0e5ec] rounded-full p-1 shadow-clay-active transition-colors',
        checked: 'bg-[#9ae8b6]',
        unchecked: 'bg-[#e0e5ec]',
        thumb: 'w-4 h-4 bg-[#e0e5ec] rounded-full shadow-clay'
    },
    checkbox: {
        base: 'w-6 h-6 bg-[#e0e5ec] rounded-lg shadow-clay-active flex items-center justify-center hover:shadow-clay',
        checked: 'bg-[#9baacf] text-white shadow-clay',
        unchecked: '',
        icon: 'text-white'
    },
    slider: {
        track: 'h-2 bg-[#e0e5ec] rounded-full shadow-clay-active',
        filled: 'h-full bg-[#9baacf] rounded-full shadow-clay',
        thumb: 'w-5 h-5 bg-[#e0e5ec] rounded-full shadow-clay hover:scale-110'
    },
    tooltip: '',
    divider: 'h-2 bg-[#e0e5ec] rounded-full my-6 shadow-clay-active',
    panel: 'bg-[#e0e5ec] rounded-[2rem] p-6 shadow-clay',
    toast: 'bg-[#e0e5ec] text-slate-700 rounded-2xl px-6 py-4 shadow-clay font-clay border-l-4 border-[#9baacf]',
    spinner: 'border-4 border-[#e0e5ec] border-t-slate-400 rounded-full animate-spin shadow-clay',
    itemSlot: 'bg-[#e0e5ec] rounded-2xl aspect-square flex items-center justify-center shadow-clay-active text-slate-400',
    statRow: 'flex justify-between items-center py-3 border-b border-slate-200/50 font-clay text-slate-600'
  },
  utils: {
    renderBackground: () => null
  }
};
