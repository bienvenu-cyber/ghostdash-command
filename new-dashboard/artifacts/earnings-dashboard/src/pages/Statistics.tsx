import React, { useState, useRef } from 'react';
import { HelpCircle, ChevronDown, ArrowLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { useAppContext } from '@/context/AppContext';
import EditableValue from '@/components/EditableValue';
import WithdrawalModal from '@/components/WithdrawalModal';
import { useLocation } from 'wouter';

const sparklineData = [
  { value: 10 }, { value: 15 }, { value: 8 }, { value: 20 }, { value: 18 }, { value: 25 }
];

const TAB_ROUTES: Record<string, string> = {
  'STATEMENTS': '/my/statistics/statements/earnings',
  'OVERVIEW': '/my/statistics/overview/earnings',
  'ENGAGEMENT': '/my/statistics/engagement/posts',
  'REACH': '/my/statistics/reach/profile-visitors',
  'FANS': '/my/statistics/fans/all',
};

function getTabFromPath(path: string): string {
  if (path.includes('/overview')) return 'OVERVIEW';
  if (path.includes('/engagement')) return 'ENGAGEMENT';
  if (path.includes('/reach')) return 'REACH';
  if (path.includes('/fans')) return 'FANS';
  return 'STATEMENTS';
}

export default function Statistics() {
  const [location, setLocation] = useLocation();
  const activeTab = getTabFromPath(location);
  const { state, updateState, setChartEditFormOpen, setBalanceEditFormOpen } = useAppContext();
  const [withdrawalOpen, setWithdrawalOpen] = useState(false);

  const lastTap = useRef<number>(0);
  const lastClick = useRef<number>(0);

  const handleChartDoubleClick = () => {
    const now = Date.now();
    if (now - lastClick.current < 400) {
      setChartEditFormOpen(true);
      lastClick.current = 0;
    } else {
      lastClick.current = now;
    }
  };

  const handleChartDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 400) {
      setChartEditFormOpen(true);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  };

  const handleTransactionEdit = (index: number, field: string, value: string) => {
    const newTransactions = [...state.transactions];
    newTransactions[index] = { ...newTransactions[index], [field]: value };
    updateState({ transactions: newTransactions });
  };

  const handleEarningsEdit = (index: number, field: string, value: string) => {
    const newEarnings = [...state.earningsData];
    newEarnings[index] = { ...newEarnings[index], [field]: value };
    updateState({ earningsData: newEarnings });
  };

  const chartWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth - 48, 900) : 600;

  return (
    <div className="flex h-full w-full bg-background overflow-hidden flex-col md:flex-row">
      <div className="flex-1 flex flex-col h-full bg-card border-r border-border overflow-y-auto w-full">
        <div className="sticky top-0 bg-card z-10">
          <div className="flex justify-between items-center px-4 md:px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 text-foreground" />
              <h1 className="text-lg md:text-xl font-bold text-foreground tracking-tight uppercase">STATISTICS</h1>
            </div>
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="flex px-4 md:px-6 border-b border-border gap-4 md:gap-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
            {Object.keys(TAB_ROUTES).map(tab => (
              <button
                key={tab}
                onClick={() => setLocation(TAB_ROUTES[tab])}
                className={`py-3 text-[13px] font-medium transition-colors relative flex-shrink-0 ${
                  activeTab === tab ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 md:p-6 pb-20 md:pb-6">
          <div className="border border-border rounded-md p-4 flex justify-between items-center mb-4">
            <div>
              <div className="font-bold text-[15px] text-foreground">Last 30 days</div>
              <div className="text-[13px] text-muted-foreground mt-0.5">Apr 23, 2025 – May 22, 2025 (local time UTC +08:00)</div>
            </div>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </div>

          <div
            className="w-full mb-6 overflow-x-auto cursor-pointer relative select-none"
            onClick={handleChartDoubleClick}
            onTouchEnd={handleChartDoubleTap}
            title="Double-cliquer pour éditer"
          >
            <AreaChart
              width={chartWidth}
              height={200}
              data={state.chartData}
              margin={{ top: 10, right: 45, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A0A0A0" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#A0A0A0" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                dy={10}
                interval={4}
              />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} dx={-5} tickFormatter={(v) => `$${v}`} width={40} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} dx={5} width={35} />
              <Tooltip
                contentStyle={{
                  backgroundColor: state.theme === 'dark' ? 'hsl(var(--card))' : '#fff',
                  borderColor: state.theme === 'dark' ? 'hsl(var(--border))' : 'hsl(var(--border))',
                  fontSize: 12
                }}
              />
              <Area yAxisId="right" type="monotone" dataKey="earnings" stroke="#00D4FF" strokeWidth={2} fillOpacity={1} fill="url(#colorEarnings)" dot={false} />
              <Area yAxisId="left" type="monotone" dataKey="interactions" stroke="#A0A0A0" strokeWidth={2} fillOpacity={1} fill="url(#colorInteractions)" dot={false} />
            </AreaChart>
          </div>

          <div className="mt-2 overflow-x-auto">
            <div className="min-w-[460px]">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 px-3 py-2 border-b border-border text-[11px] text-muted-foreground uppercase font-medium">
                <div>Date</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Fee</div>
                <div className="text-right">Net</div>
              </div>
              <div className="flex flex-col">
                {state.transactions.map((tx, i) => (
                  <div key={i} className={`flex flex-col py-2.5 px-3 border-b border-border ${tx.selected ? 'bg-[rgba(0,175,240,0.06)]' : ''}`}>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 items-center">
                      <div className="text-[12px] text-muted-foreground truncate">{tx.date}</div>
                      <div className="text-[13px] font-bold text-foreground text-right">
                        <EditableValue value={tx.amount} onChange={(v) => handleTransactionEdit(i, 'amount', v)} />
                      </div>
                      <div className="text-[13px] text-muted-foreground text-right">
                        <EditableValue value={tx.fee} onChange={(v) => handleTransactionEdit(i, 'fee', v)} />
                      </div>
                      <div className="text-[13px] font-bold text-foreground text-right flex items-center justify-end gap-1">
                        <EditableValue value={tx.net} onChange={(v) => handleTransactionEdit(i, 'net', v)} />
                        {tx.status && <span className="text-primary text-xs">✓</span>}
                      </div>
                    </div>
                    <div className="mt-0.5 text-[12px] text-muted-foreground truncate">
                      {tx.desc} <span className="text-primary">{tx.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Right Info Panel only */}
      <div className="hidden md:flex w-[260px] flex-shrink-0 bg-background flex-col h-full overflow-y-auto">
        <div className="p-5 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-[#d4af37] text-[11px] font-bold tracking-wide">
            <span>⭐</span> {state.topRated.toUpperCase()} OF ALL CREATORS
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex gap-4 items-end cursor-pointer hover:opacity-80" onClick={() => setBalanceEditFormOpen(true)}>
              <div>
                <div className="text-[28px] font-bold text-foreground leading-none">
                  ${state.currentBalanceStats.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[13px] text-muted-foreground mt-1">Current balance</div>
              </div>
              <div className="pb-[2px]">
                <div className="text-[16px] font-bold text-foreground leading-none">
                  ${state.pendingBalanceStats.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[12px] text-muted-foreground mt-1 flex items-center gap-1">
                  Pending balance <span className="text-[10px] w-3 h-3 rounded-full border border-muted-foreground flex items-center justify-center text-muted-foreground">i</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="border border-border bg-card rounded-md p-3 flex justify-between items-center cursor-pointer">
              <span className="text-[14px] text-card-foreground">Manual payouts</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-[12px] text-muted-foreground">Minimum withdrawal amount is $20</div>
          </div>

          <button
            onClick={() => setWithdrawalOpen(true)}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-3 font-bold text-[14px] uppercase tracking-wide transition-colors"
          >
            REQUEST WITHDRAWAL
          </button>

          <div className="mt-2">
            <h3 className="text-[12px] uppercase text-muted-foreground font-bold mb-4 tracking-wider">EARNINGS</h3>
            <div className="flex flex-col">
              {state.earningsData.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                  <div className="flex flex-col">
                    <div className="text-[13px] text-muted-foreground mb-0.5">{item.label}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-card-foreground">
                        <EditableValue value={item.amount} onChange={(v) => handleEarningsEdit(i, 'amount', v)} />
                      </span>
                      <span className="text-[#4CAF50] text-[12px]">
                        ↑<EditableValue value={item.percent} onChange={(v) => handleEarningsEdit(i, 'percent', v)} />
                      </span>
                    </div>
                  </div>
                  <div className="w-[80px] h-[30px]">
                    <LineChart width={80} height={30} data={sparklineData}>
                      <Line type="linear" dataKey="value" stroke={item.color === '#000000' && state.theme === 'dark' ? 'hsl(var(--foreground))' : item.color} strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <WithdrawalModal open={withdrawalOpen} onClose={() => setWithdrawalOpen(false)} />
    </div>
  );
}
