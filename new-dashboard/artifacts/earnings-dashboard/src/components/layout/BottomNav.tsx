import React from 'react';
import { Home, Bell, Plus, MessageSquare, Camera } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAppContext } from '@/context/AppContext';

export default function BottomNav() {
  const [location, setLocation] = useLocation();
  const { state, setAllTimeEarningsFormOpen, updateState } = useAppContext();

  const isOnStatistics = location.startsWith('/my/statistics') || location === '/';

  const handleHomeClick = () => {
    if (isOnStatistics) {
      setLocation('/my/statements/earnings');
    } else {
      setLocation('/my/statistics/overview/earnings');
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateState({ avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-[56px] bg-white dark:bg-[#1a1a1a] border-t border-[#e5e5e5] dark:border-[#333] flex items-center justify-between px-6 z-50">
      <button onClick={handleHomeClick} className="text-[#666666] dark:text-[#999] hover:text-black dark:hover:text-white transition-colors">
        <Home className="w-6 h-6" />
      </button>

      <button className="text-[#666666] dark:text-[#999] hover:text-black dark:hover:text-white transition-colors relative">
        <Bell className="w-6 h-6" />
        {state.notificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none">
            {state.notificationsCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setAllTimeEarningsFormOpen(true)}
        className="w-12 h-12 bg-[#00AFF0] rounded-full flex items-center justify-center text-white shadow-md -translate-y-4 hover:bg-[#0099D6] transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>

      <button className="text-[#666666] dark:text-[#999] hover:text-black dark:hover:text-white transition-colors">
        <MessageSquare className="w-6 h-6" />
      </button>

      <label className="relative cursor-pointer group">
        <div className="w-[28px] h-[28px] rounded-full overflow-hidden bg-blue-100 flex items-center justify-center relative">
          {state.avatar ? (
            <img src={state.avatar} className="w-full h-full object-cover" alt="Avatar" />
          ) : (
            <div className="w-full h-full bg-[#00AFF0] text-white flex items-center justify-center text-xs font-bold">U</div>
          )}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
            <Camera className="w-3 h-3 text-white" />
          </div>
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
      </label>
    </div>
  );
}
