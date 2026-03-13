import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Edit2, Check, Menu } from 'lucide-react';
import { useLocation } from 'wouter';

export function Header() {
  const { editMode, setEditMode } = useDashboard();
  const { state } = useAppContext();
  const [location] = useLocation();

  const getPageTitle = () => {
    if (location.startsWith('/earnings') || location === '/') return 'Statistics';
    if (location.startsWith('/statements')) return 'Statements';
    if (location.startsWith('/subscribers')) return 'Subscribers';
    if (location.startsWith('/messages')) return 'Messages';
    if (location.startsWith('/payouts')) return 'Payouts';
    if (location.startsWith('/settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <header className={cn(
      "sticky top-0 z-40 border-b transition-colors",
      state.theme === 'dark'
        ? "bg-[#0a0a0a] border-white/[0.06]"
        : "bg-white border-gray-200"
    )}>
      <div className="px-6 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className={cn(
            "md:hidden transition-colors",
            state.theme === 'dark' ? "text-[#b3b3b3] hover:text-white" : "text-gray-600 hover:text-black"
          )}>
            <Menu className="w-6 h-6" />
          </button>
          <h1 className={cn(
            "text-xl font-bold tracking-tight",
            state.theme === 'dark' ? "text-white" : "text-black"
          )}>{getPageTitle()}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className={cn(
            "hidden sm:flex rounded-full p-1 border",
            state.theme === 'dark'
              ? "bg-[#1a1a1a] border-white/[0.06]"
              : "bg-gray-100 border-gray-300"
          )}>
            {['7d', '30d', '90d', '1y', 'Custom'].map((period) => (
              <button
                key={period}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-full transition-colors",
                  period === '30d' 
                    ? "bg-primary text-black" 
                    : state.theme === 'dark'
                      ? "text-[#b3b3b3] hover:text-white"
                      : "text-gray-600 hover:text-black"
                )}
              >
                {period}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setEditMode(!editMode)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
              editMode 
                ? "bg-primary/20 text-primary border border-primary/50" 
                : state.theme === 'dark'
                  ? "bg-transparent text-[#b3b3b3] border border-white/10 hover:border-white/20 hover:text-white"
                  : "bg-transparent text-gray-600 border border-gray-300 hover:border-gray-400 hover:text-black"
            )}
          >
            {editMode ? (
              <>
                <Check className="w-4 h-4" />
                Exit Edit Mode
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                Edit Mode
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
