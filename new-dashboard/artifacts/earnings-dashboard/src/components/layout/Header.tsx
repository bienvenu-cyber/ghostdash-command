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
    <header className="sticky top-0 z-40 border-b transition-colors bg-sidebar border-border">
      <div className="px-6 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden transition-colors text-muted-foreground hover:text-foreground">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-foreground">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex rounded-full p-1 border bg-muted border-border">
            {['7d', '30d', '90d', '1y', 'Custom'].map((period) => (
              <button
                key={period}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-full transition-colors",
                  period === '30d' 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
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
                : "bg-transparent text-muted-foreground border border-border hover:border-foreground/30 hover:text-foreground"
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
