import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useDashboard } from '@/context/DashboardContext';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { editMode } = useDashboard();
  
  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        {editMode && (
          <div className="bg-accent/10 border-b border-accent/20 py-2 px-4 flex justify-center items-center">
            <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Edit Mode Active - Changes auto-save
            </div>
          </div>
        )}
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1200px] mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
