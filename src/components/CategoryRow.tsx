import { Check } from 'lucide-react';
import * as React from "react";

interface CategoryRowProps {
  name: string;
  words: string[];
}

export function CategoryRow({ name, words }: CategoryRowProps) {
  return (
    <div className="bg-gradient-to-r from-green-300 to-green-400 rounded-2xl shadow-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top duration-500" dir="rtl">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
        <Check className="w-6 h-6 text-green-500" />
      </div>
      <div className="flex-1">
        <div className="text-green-900 text-sm mb-1">{name}</div>
        <div className="text-green-800 text-xs">
          {words.join(', ')}
        </div>
      </div>
    </div>
  );
}
