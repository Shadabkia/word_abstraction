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

export function ChatRow({ name, lastMessage, unreadCount, avatarColor, onClick }: ChatRowProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full bg-white rounded-2xl shadow-sm active:shadow-md active:scale-[0.98] transition-all touch-manipulation p-4"
    >
      <div className="flex items-center gap-3">
        {/* Avatar with gradient ring */}
        <div className="relative flex-shrink-0">
          <div className={`w-14 h-14 rounded-full p-[2px] ${avatarColor}`}>
            <div className="w-full h-full rounded-full bg-white p-[2px]">
              <div className={`w-full h-full rounded-full ${avatarColor} flex items-center justify-center overflow-hidden`}>
                <span className="text-white font-bold text-lg">{name[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 text-left">
          <h3 className="text-[17px] font-bold text-slate-900 mb-1 truncate">
            {name}
          </h3>
          <p className="text-[15px] text-slate-900 font-medium truncate mb-0.5">
            {lastMessage}
          </p>
          <p className="text-[14px] text-slate-500 truncate">
            {lastMessage}
          </p>
        </div>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center ml-2">
            <span className="text-white text-xs font-bold">{unreadCount}</span>
          </div>
        )}
      </div>
    </button>
  );
}

