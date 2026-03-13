import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useDashboard } from '@/context/DashboardContext';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { editMode } = useDashboard();
  
  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white selection:bg-primary/30 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        {editMode && (
          <div className="bg-[#F59E0B]/10 border-b border-[#F59E0B]/20 py-2 px-4 flex justify-center items-center">
            <div className="flex items-center gap-2 text-[#F59E0B] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
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
