
import { GameTheme } from '../types';

export const natureTheme: GameTheme = {
  id: 'nature',
  name: 'Nature',
  description: 'Organic, peaceful, and fresh.',
  colors: {
    background: 'bg-[#f4f7f2]',
    text: 'text-[#2c3e2c]',
    primary: 'bg-[#6b8c42]',
    secondary: 'bg-[#a3b18a]',
    accent: 'bg-[#dda15e]',
    muted: 'text-[#606c38]',
    danger: 'bg-[#bc4749]',
    success: 'bg-[#606c38]',
    warning: 'bg-[#dda15e]',
    border: 'border-[#dad7cd]'
  },
  palettes: {
      'autumn': {
          background: 'bg-[#fff5eb]',
          primary: 'bg-[#c2410c]',
          secondary: 'bg-[#ea580c]',
          accent: 'bg-[#f97316]',
          text: 'text-[#7c2d12]',
          border: 'border-[#fed7aa]'
      },
      'winter': {
          background: 'bg-[#f0f9ff]',
          primary: 'bg-[#0369a1]',
          secondary: 'bg-[#38bdf8]',
          accent: 'bg-[#7dd3fc]',
          text: 'text-[#0c4a6e]',
          border: 'border-[#bae6fd]'
      },
      'desert': {
          background: 'bg-[#fffbeb]',
          primary: 'bg-[#b45309]',
          secondary: 'bg-[#d97706]',
          accent: 'bg-[#f59e0b]',
          text: 'text-[#78350f]',
          border: 'border-[#fde68a]'
      },
      'ocean': {
          background: 'bg-[#ecfeff]',
          primary: 'bg-[#0e7490]',
          secondary: 'bg-[#06b6d4]',
          accent: 'bg-[#22d3ee]',
          text: 'text-[#164e63]',
          border: 'border-[#a5f3fc]'
      },
      'cherry': {
          background: 'bg-[#fff1f2]',
          primary: 'bg-[#be123c]',
          secondary: 'bg-[#fb7185]',
          accent: 'bg-[#fda4af]',
          text: 'text-[#881337]',
          border: 'border-[#fecdd3]'
      }
  },
  typography: {
    fontFamily: 'font-nature',
    headerFont: 'font-nature',
    bodyFont: 'font-natureBody'
  },
  components: {
    button: {
      base: 'relative overflow-hidden transition-all duration-300 font-nature font-bold text-xl tracking-wide rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm shadow-sm hover:shadow-md hover:-translate-y-0.5',
      variants: {
        primary: 'bg-[#6b8c42] text-white hover:bg-[#5a7637]',
        secondary: 'bg-[#a3b18a] text-white hover:bg-[#8f9e78]',
        danger: 'bg-[#bc4749] text-white hover:bg-[#a63d3f]',
        ghost: 'bg-transparent text-[#606c38] hover:bg-[#dad7cd]/30 shadow-none',
        icon: 'bg-white text-[#6b8c42] border border-[#dad7cd] rounded-full aspect-square p-2 hover:bg-[#f4f7f2]'
      },
      sizes: {
        sm: 'px-4 py-1 text-lg',
        md: 'px-8 py-2 text-2xl',
        lg: 'px-10 py-3 text-3xl'
      }
    },
    card: {
      container: 'bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(44,62,44,0.08)] border border-[#dad7cd] font-natureBody group hover:shadow-[0_8px_30px_rgba(44,62,44,0.12)] transition-shadow',
      header: 'font-nature text-3xl text-[#2c3e2c] font-bold mb-1',
      body: 'text-[#606c38] font-semibold',
      imageWrapper: 'rounded-xl overflow-hidden mb-4 shadow-inner relative after:absolute after:inset-0 after:border-[6px] after:border-white/50 after:rounded-xl',
      rarityOverlay: (rarity) => rarity === 'legendary' ? 'absolute top-2 right-2 bg-[#dda15e] text-white text-xs px-2 py-1 rounded-full font-natureBody font-bold' : ''
    },
    dialog: {
      overlay: 'bg-[#2c3e2c]/60 backdrop-blur-sm',
      container: 'bg-[#f4f7f2] rounded-[2rem] p-8 text-center font-nature shadow-2xl border-4 border-white ring-1 ring-[#dad7cd]',
      header: 'text-5xl text-[#6b8c42] mb-4 font-bold',
      body: 'text-[#2c3e2c] font-natureBody text-lg mb-8',
      closeButton: 'text-[#606c38] hover:text-[#2c3e2c] bg-white rounded-full p-2 shadow-sm'
    },
    progressBar: {
      container: 'h-4 bg-[#dad7cd] rounded-full overflow-hidden relative',
      bar: 'h-full bg-[#6b8c42] rounded-full',
      label: 'text-[#606c38] font-nature text-xl mb-1 flex justify-between font-bold'
    },
    bottomNav: {
      container: 'bg-[#f4f7f2] border-t border-[#dad7cd] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] rounded-t-[2rem] mx-2',
      item: 'flex-1 flex flex-col items-center justify-center transition-all text-[#a3b18a] hover:text-[#6b8c42]',
      itemActive: 'text-[#6b8c42] -translate-y-2 relative after:absolute after:bottom-2 after:w-1 after:h-1 after:rounded-full after:bg-[#6b8c42] after:content-[""]',
      itemInactive: '',
      indicator: ''
    },
    input: {
        wrapper: 'relative',
        input: 'w-full bg-white border border-[#dad7cd] rounded-xl px-4 py-3 font-natureBody text-[#2c3e2c] focus:outline-none focus:border-[#6b8c42] focus:ring-2 focus:ring-[#6b8c42]/20 transition-all',
        label: 'text-[#606c38] font-nature text-xl mb-1 ml-2 block'
    },
    badge: {
        base: 'px-3 py-1 rounded-full font-natureBody text-xs font-bold',
        variants: {
            neutral: 'bg-[#dad7cd] text-[#2c3e2c]',
            accent: 'bg-[#dda15e]/20 text-[#bc8a5f]',
            outline: 'border border-[#a3b18a] text-[#606c38]',
            danger: 'bg-[#bc4749]/20 text-[#bc4749]',
            success: 'bg-[#606c38]/20 text-[#606c38]'
        }
    },
    toggle: {
        base: 'w-12 h-6 bg-[#dad7cd] rounded-full p-1 transition-colors duration-300',
        checked: 'bg-[#6b8c42]',
        unchecked: 'bg-[#dad7cd]',
        thumb: 'w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300'
    },
    checkbox: {
        base: 'w-5 h-5 bg-white border border-[#dad7cd] rounded-md flex items-center justify-center hover:border-[#6b8c42] transition-colors',
        checked: 'bg-[#6b8c42] border-[#6b8c42] text-white',
        unchecked: '',
        icon: 'text-white'
    },
    slider: {
        track: 'h-2 bg-[#dad7cd] rounded-full overflow-hidden',
        filled: 'h-full bg-[#6b8c42]',
        thumb: 'w-4 h-4 bg-white border border-[#a3b18a] rounded-full shadow-md hover:scale-110 transition-transform'
    },
    tooltip: '',
    divider: 'h-px bg-[#dad7cd] my-6 mx-8',
    panel: 'bg-white/80 rounded-2xl p-6 border border-[#dad7cd]',
    toast: 'bg-[#2c3e2c] text-[#f4f7f2] rounded-xl px-6 py-3 shadow-xl font-natureBody font-bold flex items-center gap-3',
    spinner: 'border-4 border-[#dad7cd] border-t-[#6b8c42] rounded-full animate-spin',
    itemSlot: 'bg-white border border-[#dad7cd] rounded-xl aspect-square flex items-center justify-center shadow-inner text-[#a3b18a]',
    statRow: 'flex justify-between items-center py-3 border-b border-[#dad7cd] font-natureBody text-[#2c3e2c] font-semibold'
  },
  utils: {
    renderBackground: () => null
  }
};
