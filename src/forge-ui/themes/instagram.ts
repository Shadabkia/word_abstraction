
import { GameTheme } from '../types';

export const instagramTheme: GameTheme = {
  id: 'instagram',
  name: 'Insta',
  description: 'Clean, photo-first, and familiar.',
  colors: {
    background: 'bg-white', // Instagram is mostly white/white-ish
    text: 'text-[#262626]', // Almost black
    primary: 'bg-[#0095f6]', // Instagram Blue
    secondary: 'bg-[#efefef]', // Light gray for secondary buttons
    accent: 'bg-gradient-to-tr from-[#ffc800] via-[#ff0069] to-[#d300c5]', // The brand gradient
    muted: 'text-[#8e8e8e]',
    danger: 'bg-[#ed4956]',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    border: 'border-[#dbdbdb]'
  },
  typography: {
    fontFamily: 'font-sans', // System sans
    headerFont: 'font-sans',
    bodyFont: 'font-sans'
  },
  components: {
    button: {
      base: 'relative overflow-hidden transition-all duration-200 font-semibold rounded-lg active:opacity-70',
      variants: {
        primary: 'bg-[#0095f6] text-white',
        secondary: 'bg-[#efefef] text-[#262626] hover:bg-[#dbdbdb]',
        danger: 'text-[#ed4956] hover:bg-[#fafafa]',
        ghost: 'bg-transparent text-[#0095f6] hover:text-[#00376b]',
        icon: 'text-[#262626] hover:opacity-50'
      },
      sizes: {
        sm: 'px-3 py-1 text-sm',
        md: 'px-5 py-1.5 text-sm',
        lg: 'px-8 py-3 text-base'
      }
    },
    card: {
      container: 'bg-white font-sans border-b border-[#dbdbdb] pb-4 mb-2', // Feed style
      header: 'font-semibold text-sm text-[#262626] mb-2 px-3 flex items-center',
      body: 'text-[#262626] text-sm px-3',
      imageWrapper: 'w-full aspect-square bg-[#efefef] mb-3',
      rarityOverlay: () => ''
    },
    dialog: {
      overlay: 'bg-black/60 backdrop-blur-sm',
      container: 'bg-white rounded-xl p-0 text-center font-sans max-w-[80%] overflow-hidden',
      header: 'text-lg font-semibold text-[#262626] pt-6 pb-2 px-6',
      body: 'text-[#262626] text-sm px-6 pb-6 border-b border-[#dbdbdb]',
      closeButton: 'hidden' // Usually handled by action buttons
    },
    progressBar: {
      container: 'h-1 bg-[#dbdbdb] rounded-none',
      bar: 'h-full bg-gradient-to-r from-[#ffc800] via-[#ff0069] to-[#d300c5]',
      label: 'hidden'
    },
    bottomNav: {
      container: 'bg-white border-t border-[#dbdbdb] pb-safe',
      item: 'flex-1 flex flex-col items-center justify-center py-3 text-[#8e8e8e]',
      itemActive: 'text-[#262626]', // Icons become filled/dark
      itemInactive: 'text-[#262626] hover:opacity-50', // Actually inactive is usually just outline, active is filled. 
      // We can't swap icon components easily here without logic change, so we rely on color.
      indicator: 'hidden'
    },
    input: {
      wrapper: 'relative',
      input: 'w-full bg-[#fafafa] border border-[#dbdbdb] rounded-sm px-3 py-2 text-sm text-[#262626] focus:outline-none focus:border-[#a8a8a8]',
      label: 'hidden'
    },
    badge: {
      base: 'px-2 py-0.5 rounded text-[11px] font-semibold',
      variants: {
        neutral: 'bg-[#efefef] text-[#262626]',
        accent: 'bg-[#0095f6] text-white',
        outline: 'border border-[#dbdbdb] text-[#262626]',
        danger: 'bg-[#ed4956] text-white',
        success: 'bg-green-500 text-white'
      }
    },
    toggle: {
      base: 'w-10 h-6 bg-[#dbdbdb] rounded-full p-1 transition-colors duration-200',
      checked: 'bg-[#0095f6]',
      unchecked: 'bg-[#dbdbdb]',
      thumb: 'w-4 h-4 bg-white rounded-full shadow-sm'
    },
    checkbox: {
      base: 'w-5 h-5 bg-white border border-[#dbdbdb] rounded-[3px] flex items-center justify-center',
      checked: 'bg-[#0095f6] border-[#0095f6] text-white',
      unchecked: '',
      icon: 'text-white'
    },
    slider: {
      track: 'h-0.5 bg-[#dbdbdb]',
      filled: 'h-0.5 bg-[#262626]',
      thumb: 'w-4 h-4 bg-black rounded-full'
    },
    divider: 'h-px bg-[#dbdbdb] my-0',
    panel: 'bg-white border border-[#dbdbdb] rounded-lg',
    tooltip: 'bg-[#262626] text-white text-xs py-1 px-2 rounded',
    toast: 'bg-[#262626] text-white rounded px-4 py-3 text-sm font-semibold',
    spinner: 'border-2 border-[#dbdbdb] border-t-[#262626] rounded-full animate-spin',
    itemSlot: 'bg-[#fafafa] border border-[#dbdbdb] rounded aspect-square',
    statRow: 'flex justify-between py-3 border-b border-[#dbdbdb] text-sm'
  },
  utils: {
    renderBackground: () => null
  }
};

