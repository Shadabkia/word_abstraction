import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Coffee, Gem, Sticker, Plus } from 'lucide-react';
import { useGameState } from '@/core/state/gameState';
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
    id: 'coffee_1',
    type: 'Coffee',
    name: 'Espresso Shot',
    price: '$0.99',
    coins: 100,
    icon: Coffee,
    color: 'bg-amber-100 text-amber-700',
    description: 'Fuel for the road.'
  },
  {
    id: 'antique_1',
    type: 'Antique',
    name: 'Vintage Radio',
    price: '$4.99',
    coins: 600,
    icon: Gem,
    color: 'bg-emerald-100 text-emerald-700',
    description: 'A piece of history.'
  },
  {
    id: 'sticker_1',
    type: 'Sticker',
    name: 'The Onion Van',
    price: '$1.99',
    coins: 200,
    icon: Sticker,
    color: 'bg-purple-100 text-purple-700',
    description: 'Show off on your profile.'
  }
];

export function KianShop({ isOpen, onClose }: KianShopProps) {
  const { addCoins } = useGameState();
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const handlePurchase = (item: typeof shopItems[0]) => {
    setPurchasing(item.id);
    // Mock API call
    setTimeout(() => {
      addCoins(item.coins);
      setPurchasing(null);
      // In a real app, we'd trigger a success toast here
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
          className="fixed inset-0 z-50 bg-slate-50 flex flex-col"
        >
          {/* Header */}
          <div className="bg-white px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">Kian's Shop</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Support the Journey</DialogTitle>
                    <DialogDescription className="pt-2 text-base">
                      The game developers need your support to create stories. 
                      Your purchases help us keep Kian's adventure going!
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <button 
              onClick={onClose}
              className="p-2 -mr-2 text-slate-500 active:text-slate-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* Narrative Context */}
            <div className="mb-8 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
              <div className="text-3xl">☕️</div>
              <p className="text-amber-900 text-sm leading-relaxed font-medium">
                In order for Kian to continue his adventure, he generates income by selling coffee and stickers.
              </p>
            </div>

            {/* Shop Grid */}
            <div className="grid gap-4">
              {shopItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4"
                >
                  {/* Icon Box */}
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">{item.name}</h3>
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-slate-100 text-slate-500">
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{item.description}</p>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                      <Plus className="w-3 h-3" />
                      {item.coins} Coins
                    </div>
                  </div>

                  {/* Buy Button */}
                  <Button 
                    onClick={() => handlePurchase(item)}
                    disabled={!!purchasing}
                    className="shrink-0 min-w-[80px]"
                  >
                    {purchasing === item.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      item.price
                    )}
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400">
                Stickers purchased are added to your Badges page.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

