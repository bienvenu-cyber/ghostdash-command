import React from 'react';
import { SummaryCards } from '@/components/SummaryCards';
import { EarningsChart, BreakdownChart } from '@/components/Charts';
import { TopSubscribers } from '@/components/TopSubscribers';

export default function Earnings() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <SummaryCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EarningsChart />
        </div>
        <div>
          <BreakdownChart />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 hidden lg:block">
          {/* Empty spacer or placeholder for future expanded analytics */}
        </div>
        <div className="lg:col-span-1">
          <TopSubscribers />
        </div>
      </div>
    </div>
  );
}
