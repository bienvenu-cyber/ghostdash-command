import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function BalanceEditForm() {
  const { state, updateState, isBalanceEditFormOpen, setBalanceEditFormOpen } = useAppContext();
  
  const [currentBal, setCurrentBal] = useState(state.currentBalance.toString());
  const [pendingBal, setPendingBal] = useState(state.pendingBalance.toString());
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>(state.theme);

  useEffect(() => {
    if (isBalanceEditFormOpen) {
      setCurrentBal(state.currentBalance.toString());
      setPendingBal(state.pendingBalance.toString());
      setLocalTheme(state.theme);
    }
  }, [isBalanceEditFormOpen, state.currentBalance, state.pendingBalance, state.theme]);

  if (!isBalanceEditFormOpen) return null;

  // Toggle theme immediately
  const handleThemeToggle = () => {
    const newTheme = localTheme === 'light' ? 'dark' : 'light';
    setLocalTheme(newTheme);
    updateState({ theme: newTheme });
  };

  const handleSave = () => {
    updateState({
      currentBalance: parseFloat(currentBal) || state.currentBalance,
      pendingBalance: parseFloat(pendingBal) || state.pendingBalance,
      currentBalanceStats: parseFloat(currentBal) || state.currentBalanceStats,
      pendingBalanceStats: parseFloat(pendingBal) || state.pendingBalanceStats,
      theme: localTheme,
    });
    setBalanceEditFormOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40" 
        onClick={() => setBalanceEditFormOpen(false)}
      />
      <div className="bg-card rounded-xl shadow-2xl p-5 w-full max-w-xs relative z-10 border border-border">
        <h3 className="text-lg font-bold text-foreground mb-4">Ghostdash</h3>
        
        <div className="flex flex-col gap-4 mb-6">
          {/* Theme Toggle */}
          <div className="bg-muted rounded-lg p-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Thème</h4>
            <div className="flex items-center gap-3">
              <span className={`text-sm ${localTheme === 'light' ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>☀️ Light</span>
              <button
                onClick={handleThemeToggle}
                className={`w-12 h-6 rounded-full p-1 transition-colors flex-shrink-0 ${localTheme === 'dark' ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${localTheme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <span className={`text-sm ${localTheme === 'dark' ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>🌙 Dark</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Current Balance ($)</label>
            <input 
              type="number" 
              step="0.01"
              value={currentBal}
              onChange={(e) => setCurrentBal(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground outline-none focus:border-primary"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Pending Balance ($)</label>
            <input 
              type="number" 
              step="0.01"
              value={pendingBal}
              onChange={(e) => setPendingBal(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button 
            onClick={() => setBalanceEditFormOpen(false)}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-5 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-full transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
