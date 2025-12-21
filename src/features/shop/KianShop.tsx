import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Coffee, Gem, Sticker, Sparkles, ShoppingBag } from 'lucide-react';
import { useGameState } from '@/core/state/gameState';
import { useForge } from '@/forge-ui';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Badge } from '@/shared/ui/badge';

interface KianShopProps {
  isOpen: boolean;
  onClose: () => void;
}

const shopItems = [
  {
    id: 'coffee_pack_1',
    type: 'Coffee',
    name: 'Morning Brew',
    price: '$0.99',
    coins: 100,
    icon: Coffee,
    color: 'bg-amber-100 text-amber-700',
    description: 'Fresh roast to start the day.',
    isSticker: false
  },
  {
    id: 'antique_lamp',
    type: 'Antique',
    name: 'Brass Lantern',
    price: '$4.99',
    coins: 600,
    icon: Gem,
    color: 'bg-emerald-100 text-emerald-700',
    description: 'A glowing relic from the bazaar.',
    isSticker: false
  },
  {
    id: 'sticker_van',
    type: 'Sticker',
    name: 'The Onion Van',
    price: '$1.99',
    coins: 250,
    icon: Sticker,
    color: 'bg-purple-100 text-purple-700',
    description: 'Iconic sticker for your collection.',
    isSticker: true
  },
  {
    id: 'sticker_cat',
    type: 'Sticker',
    name: 'Persian Cat',
    price: '$2.99',
    coins: 400,
    icon: Sticker,
    color: 'bg-pink-100 text-pink-700',
    description: 'A fluffy companion badge.',
    isSticker: true
  }
];

export function KianShop({ isOpen, onClose }: KianShopProps) {
  const { theme } = useForge();
  const { addCoins, addBadge } = useGameState();
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const handlePurchase = (item: typeof shopItems[0]) => {
    setPurchasing(item.id);
    // Mock API call simulation
    setTimeout(() => {
      addCoins(item.coins);
      if (item.isSticker) {
        addBadge(item.id);
      }
      setPurchasing(null);
      // TODO: Add toast notification here
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`fixed inset-0 z-50 ${theme.colors.background} flex flex-col sm:max-w-md sm:mx-auto shadow-2xl`}
        >
          {/* Header */}
          <div className={`bg-white px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-10 border-b ${theme.colors.border || 'border-slate-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${theme.colors.primary.replace('bg-', 'bg-').replace('600', '100')} rounded-full flex items-center justify-center`}>
                <ShoppingBag className={`w-5 h-5 ${theme.colors.primary.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${theme.colors.text} leading-tight`}>Kian's Shop</h2>
                <p className={`text-xs ${theme.colors.muted}`}>Support the journey</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
               <Dialog>
                <DialogTrigger asChild>
                  <button className={`p-2 ${theme.colors.muted} hover:${theme.colors.text} transition-colors rounded-full hover:${theme.colors.secondary}`}>
                    <HelpCircle className="w-6 h-6" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Why Support Kian?</DialogTitle>
                    <DialogDescription className="pt-3 text-base leading-relaxed">
                      The game developers need your support to create more stories, chapters, and adventures.
                      <br /><br />
                      Every purchase helps keep the engine running and the stories flowing!
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <button 
                onClick={onClose}
                className={`p-2 ${theme.colors.muted} hover:${theme.colors.text} transition-colors rounded-full hover:${theme.colors.secondary}`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className={`flex-1 overflow-y-auto p-6 ${theme.colors.background}`}>
            
            {/* Narrative Context Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`mb-8 ${theme.colors.accent.includes('gradient') ? 'bg-amber-50' : theme.colors.accent.replace('bg-', 'bg-').replace('500', '50')} border ${theme.colors.border} rounded-2xl p-5 shadow-sm relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 ${theme.colors.accent} rounded-full blur-2xl opacity-50`} />
              
              <div className="flex items-start gap-4 relative z-10">
                <div className="text-4xl filter drop-shadow-sm">☕️</div>
                <div>
                  <h3 className={`${theme.colors.text} font-bold mb-1`}>Fuel the Adventure</h3>
                  <p className={`${theme.colors.text} opacity-80 text-sm leading-relaxed`}>
                    In order for Kian to continue his adventure, he generates income by selling coffee, antiques, and stickers.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Shop Grid */}
            <div className="grid gap-4">
              {shopItems.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + (index * 0.05) }}
                  className={`bg-white rounded-2xl p-4 shadow-sm border ${theme.colors.border || 'border-slate-100'} flex items-center gap-4 group hover:shadow-md transition-shadow`}
                >
                  {/* Icon Box */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.color} shadow-inner group-hover:scale-105 transition-transform`}>
                    <item.icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-bold ${theme.colors.text}`}>{item.name}</h3>
                      {item.isSticker && (
                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-purple-200 text-purple-600 bg-purple-50">
                          Badge
                        </Badge>
                      )}
                    </div>
                    <p className={`text-xs ${theme.colors.muted} mb-2 line-clamp-1`}>{item.description}</p>
                    
                    <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs bg-amber-50 w-fit px-2 py-1 rounded-lg">
                      <Sparkles className="w-3 h-3" />
                      <span>+{item.coins} Coins</span>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <Button 
                    onClick={() => handlePurchase(item)}
                    disabled={!!purchasing}
                    className={`shrink-0 h-10 px-5 ${theme.colors.primary} ${theme.colors.primary.includes('text-white') ? '' : 'text-white'} shadow-lg`}
                  >
                    {purchasing === item.id ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      item.price
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className={`text-xs ${theme.colors.muted} font-medium opacity-70`}>
                Stickers purchased are automatically added to your Badges page.
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
