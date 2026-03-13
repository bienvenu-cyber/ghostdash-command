import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export function ThemeToggle() {
  const { state, updateState } = useAppContext();

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    updateState({ theme: newTheme });
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
      aria-label="Toggle theme"
    >
      {state.theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-600" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500" />
      )}
    </button>
  );
}
