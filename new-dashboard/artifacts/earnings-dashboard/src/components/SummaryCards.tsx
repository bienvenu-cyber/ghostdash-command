import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { formatCurrency } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function SummaryCards() {
  const { data, editMode, updateStats } = useDashboard();
  const { stats } = data;

  const handleStatChange = (key: keyof typeof stats, value: string) => {
    // allow typing intermediate values
    updateStats({ ...stats, [key]: value });
  };

  const handleBlur = (key: keyof typeof stats, value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
    updateStats({ ...stats, [key]: isNaN(num) ? 0 : num });
  };

  const cards = [
    { label: 'Total Earnings', key: 'totalEarnings', value: stats.totalEarnings, trend: +12.5 },
    { label: 'This Month', key: 'thisMonth', value: stats.thisMonth, trend: +5.2 },
    { label: 'Pending', key: 'pending', value: stats.pending, trend: -2.1 },
    { label: 'Net Earnings', key: 'netEarnings', value: stats.netEarnings, trend: +11.8 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:border-primary/30 transition-colors group relative">
          
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium text-[#b3b3b3]">{card.label}</h3>
            {editMode && <Edit2 className="w-3.5 h-3.5 text-[#666666] opacity-0 group-hover:opacity-100 transition-opacity" />}
          </div>
          
          <div className="mb-2">
            {editMode ? (
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-bold text-white">$</span>
                <Input 
                  value={card.value}
                  onChange={(e) => handleStatChange(card.key as any, e.target.value)}
                  onBlur={(e) => handleBlur(card.key as any, e.target.value)}
                  className="pl-6 text-3xl font-bold h-12 bg-[#252525] border-white/10 text-white tabular-nums rounded-lg focus-visible:ring-primary focus-visible:border-primary"
                />
              </div>
            ) : (
              <div className="text-3xl font-bold text-white tabular-nums tracking-tight">
                {formatCurrency(Number(card.value))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 text-sm">
            <span className={`flex items-center font-medium ${card.trend >= 0 ? 'text-[#4CAF50]' : 'text-[#FF4D4D]'}`}>
              {card.trend >= 0 ? <ArrowUpRight className="w-4 h-4 mr-0.5" /> : <ArrowDownRight className="w-4 h-4 mr-0.5" />}
              {Math.abs(card.trend)}%
            </span>
            <span className="text-[#666666]">vs last month</span>
          </div>
        </div>
      ))}
    </div>
  );
}
