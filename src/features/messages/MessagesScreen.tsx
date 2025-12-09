import React from 'react';

export function MessagesScreen() {
  return (
    <div className="p-4 flex flex-col items-center justify-center h-full text-center">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-4xl">
        💬
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Messages</h2>
      <p className="text-slate-500">Quests and chats from NPCs.</p>
    </div>
  );
}

