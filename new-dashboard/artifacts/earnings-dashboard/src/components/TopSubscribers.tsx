import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { UserCircle } from 'lucide-react';

export function TopSubscribers() {
  const { data } = useDashboard();

  return (
    <div className="bg-[#1a1a1a] border border-white/[0.08] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.3)] overflow-hidden hover:border-primary/30 transition-colors">
      <div className="p-5 border-b border-white/[0.06] flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Top Subscribers</h3>
      </div>
      <div className="divide-y divide-white/[0.06]">
        {data.topSubscribers.slice(0, 5).map((sub, idx) => (
          <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-[#252525] transition-colors group">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#252525] border border-white/10 flex items-center justify-center text-[#b3b3b3]">
                  <UserCircle className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary text-black text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#1a1a1a]">
                  {idx + 1}
                </div>
              </div>
              <div>
                <p className="font-medium text-white group-hover:text-primary transition-colors">{sub.username}</p>
                <p className="text-xs text-[#666666]">Since {formatDate(sub.since)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-white tabular-nums">{formatCurrency(sub.spent)}</p>
              <div className="flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]"></span>
                <p className="text-[11px] text-[#b3b3b3]">Active</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-white/[0.06] bg-[#0a0a0a]/50 text-center">
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          View All Subscribers
        </button>
      </div>
    </div>
  );
}
