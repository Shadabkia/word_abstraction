import React from 'react';
import { UserState } from '@/core/state/gameState';

interface ProfileHeaderProps {
  user: UserState;
  postsCount: number;
}

export function ProfileHeader({ user, postsCount }: ProfileHeaderProps) {
  return (
    <div className="bg-white px-6 pt-6 pb-4">
      <div className="flex items-center gap-6 mb-4">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-indigo-100 p-1 border-2 border-indigo-200">
          <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
             <span className="text-2xl font-bold text-slate-400">{user.name[0]}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 flex justify-around">
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg text-slate-800">{postsCount}</span>
            <span className="text-xs text-slate-500">Memories</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg text-slate-800">124</span>
            <span className="text-xs text-slate-500">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg text-slate-800">8</span>
            <span className="text-xs text-slate-500">Following</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <div className="font-bold text-sm text-slate-800">{user.name}</div>
        <div className="text-sm text-slate-600">
          Former Office Worker 🏢<br/>
          Currently driving "The Onion" across Iran 🚐<br/>
          Collecting words & vibes ✨
        </div>
      </div>
      
      {/* Edit Profile Button */}
      <button className="w-full mt-4 bg-slate-100 text-slate-700 font-bold py-1.5 rounded-lg text-sm hover:bg-slate-200 transition-colors">
        Edit Profile
      </button>
    </div>
  );
}

