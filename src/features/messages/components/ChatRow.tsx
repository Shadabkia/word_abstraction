import React from 'react';

interface ChatRowProps {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  avatarColor: string;
  onClick: () => void;
}

export function ChatRow({ id, name, lastMessage, time, unreadCount, avatarColor, onClick }: ChatRowProps) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 p-4 active:bg-slate-100 cursor-pointer transition-colors touch-manipulation ${unreadCount > 0 ? 'bg-indigo-50/50' : ''}`}
    >
      {/* Avatar */}
      <div className={`w-14 h-14 rounded-full ${avatarColor} flex items-center justify-center border-2 border-white shadow-sm shrink-0`}>
        <span className="text-white font-bold text-lg">{name[0]}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className={`text-sm truncate ${unreadCount > 0 ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
            {name}
          </h3>
          <span className={`text-xs whitespace-nowrap ${unreadCount > 0 ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
            {time}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className={`text-sm truncate pr-2 ${unreadCount > 0 ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
            {lastMessage}
          </p>
          {unreadCount > 0 && (
            <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-[10px] font-bold">{unreadCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

