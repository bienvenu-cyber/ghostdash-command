import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function AllTimeEarningsForm() {
  const { state, updateState, isAllTimeEarningsFormOpen, setAllTimeEarningsFormOpen, resetState } = useAppContext();

  const [localState, setLocalState] = useState({
    accountAge: state.accountAge,
    startDate: state.startDate,
    notificationsCount: state.notificationsCount.toString(),
    messagesCount: state.messagesCount.toString(),
    maxValue: state.maxValue.toString(),
    topRated: state.topRated,
    currentBalance: state.currentBalance.toString(),
    pendingBalance: state.pendingBalance.toString(),
  });
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>(state.theme);

  // Sync when form opens
  useEffect(() => {
    if (isAllTimeEarningsFormOpen) {
      setLocalState({
        accountAge: state.accountAge,
        startDate: state.startDate,
        notificationsCount: state.notificationsCount.toString(),
        messagesCount: state.messagesCount.toString(),
        maxValue: state.maxValue.toString(),
        topRated: state.topRated,
        currentBalance: state.currentBalance.toString(),
        pendingBalance: state.pendingBalance.toString(),
      });
      setLocalTheme(state.theme);
    }
  }, [isAllTimeEarningsFormOpen]);

  if (!isAllTimeEarningsFormOpen) return null;

  const handleChange = (field: string, value: string) => {
    setLocalState(prev => ({ ...prev, [field]: value }));
  };

  // Toggle theme immediately
  const handleThemeToggle = () => {
    const newTheme = localTheme === 'light' ? 'dark' : 'light';
    setLocalTheme(newTheme);
    updateState({ theme: newTheme });
  };

  const handleCalculate = () => {
    const parseCurrency = (str: string) => parseFloat(str.replace(/[^0-9.-]+/g, '')) || 0;
    const newTotal = state.breakdownData.reduce((acc, curr) => acc + parseCurrency(curr.net), 0);
    updateState({
      accountAge: localState.accountAge,
      startDate: localState.startDate,
      notificationsCount: parseInt(localState.notificationsCount) || 0,
      messagesCount: parseInt(localState.messagesCount) || 0,
      maxValue: parseFloat(localState.maxValue) || 0,
      topRated: localState.topRated,
      currentBalance: parseFloat(localState.currentBalance) || state.currentBalance,
      pendingBalance: parseFloat(localState.pendingBalance) || state.pendingBalance,
      allTimeTotal: newTotal > 0 ? newTotal : state.allTimeTotal,
      theme: localTheme,
    });
    setAllTimeEarningsFormOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to clear all data and reset to defaults?')) {
      localStorage.removeItem('earningsDashboardState');
      resetState();
      setAllTimeEarningsFormOpen(false);
    }
  };

  const fields = [
    { key: 'accountAge', label: 'Account Age', type: 'text' },
    { key: 'startDate', label: 'Start Date', type: 'text' },
    { key: 'notificationsCount', label: 'Notifications', type: 'number' },
    { key: 'messagesCount', label: 'Messages', type: 'number' },
    { key: 'maxValue', label: 'Max Value', type: 'number' },
    { key: 'topRated', label: 'Top Rated', type: 'text' },
    { key: 'currentBalance', label: 'Current Balance ($)', type: 'number' },
    { key: 'pendingBalance', label: 'Pending Balance ($)', type: 'number' },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-[#e5e5e5] dark:border-[#333]">
          <h2 className="text-xl font-bold text-black dark:text-white">All Time Earnings</h2>
          <button onClick={() => setAllTimeEarningsFormOpen(false)} className="text-[#666] hover:text-black dark:text-[#aaa] dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Theme Toggle */}
          <div className="bg-[#f5f5f5] dark:bg-[#111] rounded-lg p-4">
            <h3 className="text-xs font-bold text-[#666] dark:text-[#999] uppercase tracking-wider mb-3">Thème</h3>
            <div className="flex items-center gap-3">
              <span className={`text-sm ${localTheme === 'light' ? 'font-bold text-black dark:text-white' : 'text-[#999]'}`}>☀️ Light</span>
              <button
                onClick={handleThemeToggle}
                className={`w-12 h-6 rounded-full p-1 transition-colors flex-shrink-0 ${localTheme === 'dark' ? 'bg-[#00AFF0]' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${localTheme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <span className={`text-sm ${localTheme === 'dark' ? 'font-bold text-black dark:text-white' : 'text-[#999]'}`}>🌙 Dark</span>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-[#666] dark:text-[#999] uppercase mb-1">{label}</label>
                <input
                  type={type}
                  step={type === 'number' ? '0.01' : undefined}
                  value={localState[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full border border-[#e5e5e5] dark:border-[#333] rounded-md px-3 py-2 text-sm bg-transparent text-black dark:text-white outline-none focus:border-[#00AFF0] transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 border-t border-[#e5e5e5] dark:border-[#333] flex flex-wrap gap-3 justify-end items-center bg-gray-50 dark:bg-[#111] rounded-b-xl">
          <button onClick={handleLogout} className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors mr-auto">
            Logout / Reset
          </button>
          <button
            onClick={() => setLocalState({ accountAge: '2 years, 3 months', startDate: 'Mar 6, 2024', notificationsCount: '11', messagesCount: '0', maxValue: '0', topRated: 'Top 1.8%', currentBalance: '3754.34', pendingBalance: '540.75' })}
            className="px-4 py-2 text-sm font-medium text-[#666] hover:text-black dark:text-[#aaa] dark:hover:text-white"
          >
            Clear
          </button>
          <button onClick={() => setAllTimeEarningsFormOpen(false)} className="px-4 py-2 text-sm font-medium text-[#666] hover:text-black dark:text-[#aaa] dark:hover:text-white">
            Close
          </button>
          <button onClick={handleCalculate} className="px-6 py-2 bg-[#00AFF0] hover:bg-[#0099D6] text-white text-sm font-bold rounded-full transition-colors shadow-sm">
            CALCULATE
          </button>
        </div>
      </div>
    </div>
  );
}
