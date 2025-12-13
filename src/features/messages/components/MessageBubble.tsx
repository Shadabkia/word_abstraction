interface MessageBubbleProps {
  text: string;
  isSender: boolean;
  timestamp: number;
  type?: 'text' | 'quest' | 'system';
  actionLink?: string;
}

export function MessageBubble({ text, isSender, timestamp, type = 'text', actionLink }: MessageBubbleProps) {
  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getBubbleStyle = () => {
    if (type === 'quest') {
      return 'bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-300 text-slate-800';
    }
    if (type === 'system') {
      return 'bg-slate-100 text-slate-600 text-center';
    }
    if (isSender) {
      return 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white';
    }
    return 'bg-white text-slate-800 border border-slate-200';
  };

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-3 px-1`}>
      <div className={`max-w-[80%] ${isSender ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-2.5 rounded-2xl ${getBubbleStyle()} shadow-sm`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{text}</p>
          {type === 'quest' && actionLink && (
            <div className="mt-2 pt-2 border-t border-amber-300">
              <button className="text-xs font-bold text-amber-700 active:text-amber-800 flex items-center gap-1 touch-manipulation">
                🎯 View Quest
              </button>
            </div>
          )}
        </div>
        <span className={`text-[10px] text-slate-400 px-2 ${isSender ? 'text-right' : 'text-left'}`}>
          {formatTimestamp(timestamp)}
        </span>
      </div>
    </div>
  );
}

