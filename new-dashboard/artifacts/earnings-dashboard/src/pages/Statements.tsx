import React, { useState, useRef } from 'react';
import {
  HelpCircle, ChevronDown, ChevronUp, ArrowLeft,
  Calendar, DollarSign, Landmark, TrendingUp, CornerUpLeft, Users
} from 'lucide-react';
import { AreaChart, Area, XAxis } from 'recharts';
import { useAppContext } from '@/context/AppContext';
import EditableValue from '@/components/EditableValue';
import WithdrawalModal from '@/components/WithdrawalModal';

export default function Statements() {
  const [activeMenu, setActiveMenu] = useState('EARNING STATISTICS');
  const [withdrawalOpen, setWithdrawalOpen] = useState(false);
  const { state, updateState, setChartEditFormOpen, setBalanceEditFormOpen } = useAppContext();

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

  const handleBreakdownEdit = (index: number, field: string, value: string) => {
    const newData = [...state.breakdownData];
    newData[index] = { ...newData[index], [field]: value };
    updateState({ breakdownData: newData });
  };

  const handleMonthlyEdit = (index: number, value: string) => {
    const newData = [...state.monthlyData];
    newData[index] = { ...newData[index], amount: value };
    updateState({ monthlyData: newData });
  };

  const menuItems = [
    { id: 'EARNINGS', label: 'EARNINGS', icon: DollarSign },
    { id: 'PAYOUT REQUESTS', label: 'PAYOUT REQUESTS', icon: Landmark },
    { id: 'EARNING STATISTICS', label: 'EARNING STATISTICS', icon: TrendingUp },
    { id: 'CHARGEBACKS', label: 'CHARGEBACKS', icon: CornerUpLeft },
    { id: 'REFERRALS', label: 'REFERRALS', icon: Users },
  ];

  const handleMenuClick = (itemId: string) => {
    setActiveMenu(itemId);
  };

  const BalanceCard = () => (
    <div
      className="border border-border rounded-lg p-4 flex flex-col gap-4 cursor-pointer hover:bg-muted/50"
      onClick={() => setBalanceEditFormOpen(true)}
    >
      <div className="flex justify-between items-center">
        <div className="text-[12px] text-muted-foreground font-bold tracking-wider">CURRENT BALANCE</div>
        <div className="flex items-center gap-1">
          <span className="text-[18px] font-bold text-foreground">
            ${state.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <ChevronUp className="w-4 h-4 text-foreground" />
        </div>
      </div>
      <div className="h-[1px] bg-border w-full" />
      <div className="flex justify-between items-center">
        <div className="text-[12px] text-muted-foreground flex items-center gap-1">
          PENDING BALANCE <span className="text-[10px] w-3 h-3 rounded-full border border-muted-foreground flex items-center justify-center text-muted-foreground">i</span>
        </div>
        <div className="text-[15px] font-medium text-foreground">
          ${state.pendingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );

  const EarningStatsContent = () => (
    <>
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-6 shadow-sm">
        <div className="p-5 border-b border-border">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[14px] font-bold text-foreground border-b-2 border-foreground pb-1 inline-block">All time</div>
            <div className="flex items-center gap-1">
              <span className="text-[20px] font-bold text-foreground">
                $<EditableValue
                  value={state.allTimeTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  onChange={(v) => updateState({ allTimeTotal: parseFloat(v.replace(/,/g, '')) || state.allTimeTotal })}
                />
              </span>
              <ChevronUp className="w-5 h-5 text-foreground" />
            </div>
          </div>

          <div
            className="w-full mb-4 cursor-pointer relative select-none overflow-x-auto"
            onClick={handleChartDoubleClick}
            onTouchEnd={handleChartDoubleTap}
            title="Double-cliquer pour éditer"
          >
            <AreaChart width={Math.min(typeof window !== 'undefined' ? window.innerWidth - 60 : 600, 700)} height={130} data={state.allTimeChartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00AFF0" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00AFF0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
              <Area type="linear" dataKey="gross" stroke="#FF6B35" strokeWidth={2} fillOpacity={1} fill="url(#colorGross)" dot={false} />
              <Area type="linear" dataKey="net" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorNet)" dot={false} />
            </AreaChart>
          </div>

          <div className="border border-border rounded-md p-3 flex items-center gap-3 mb-5">
            <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="text-[14px] text-foreground">
              From <EditableValue value={state.startDate} onChange={(v) => updateState({ startDate: v })} /> To{' '}
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {state.breakdownData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2 w-[130px] flex-shrink-0">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color === '#000000' && state.theme === 'dark' ? 'hsl(var(--foreground))' : item.color }} />
                  <span className="text-muted-foreground">{item.label}</span>
                </div>
                <div className="text-right flex-1 text-foreground font-medium">
                  <EditableValue value={item.gross} onChange={(v) => handleBreakdownEdit(i, 'gross', v)} />
                </div>
                <div className="text-right flex-1 text-foreground font-medium">
                  <EditableValue value={item.net} onChange={(v) => handleBreakdownEdit(i, 'net', v)} />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between text-[13px] pt-3 mt-1 border-t border-border">
              <div className="font-bold text-foreground w-[130px]">TOTAL</div>
              <div className="flex-1 text-right">
                <span className="text-muted-foreground text-[11px] mr-1">GROSS</span>
                <span className="font-bold text-foreground">$119,461.84</span>
              </div>
              <div className="flex-1 text-right">
                <span className="text-muted-foreground text-[11px] mr-1">NET</span>
                <span className="font-bold text-foreground">
                  ${state.allTimeTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {state.monthlyData.map((item, i) => (
          <div key={i} className="flex justify-between items-center p-4 border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="text-[14px] font-medium text-foreground capitalize">{item.month}</div>
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-bold text-foreground">
                <EditableValue value={item.amount} onChange={(v) => handleMonthlyEdit(i, v)} />
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="flex h-full w-full bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] overflow-hidden flex-col md:flex-row">

      {/* Mobile layout: single scrollable column */}
      <div className="md:hidden flex flex-col h-full overflow-y-auto bg-white dark:bg-[hsl(var(--card))] pb-20">
        <div className="flex justify-between items-center px-4 py-4 border-b border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-foreground" />
            <h1 className="text-[17px] font-bold text-foreground uppercase tracking-tight">STATEMENTS</h1>
          </div>
          <HelpCircle className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
        </div>

        <div className="px-4 py-4 flex flex-col gap-4">
          <div className="bg-[#fffcf0] dark:bg-[#2a2410] border border-[#f5e6b3] dark:border-[#4a3f1c] rounded-lg p-3 flex items-center gap-2">
            <span>⭐</span>
            <span className="text-[#d4af37] text-[11px] font-bold tracking-wide uppercase">YOU ARE IN {state.topRated.toUpperCase()} OF ALL CREATORS!</span>
          </div>

          <BalanceCard />

          <div className="border border-border rounded-lg p-3 flex justify-between items-center">
            <span className="text-[14px] text-foreground">Manual payouts</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>

          <button onClick={() => setWithdrawalOpen(true)} className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] text-white rounded-full py-3 font-bold text-[14px] uppercase tracking-wide transition-colors">
            REQUEST WITHDRAWAL
          </button>
        </div>

        {/* Mobile icon tab bar */}
        <div className="flex items-center justify-around px-2 py-3 border-t border-[hsl(var(--border))] dark:border-[hsl(var(--border))] bg-white dark:bg-[hsl(var(--card))]">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`relative p-2 flex items-center justify-center transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 1.5} />
                {isActive && <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-foreground rounded-full" />}
              </button>
            );
          })}
        </div>

        <div className="px-4 py-5 bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[13px] font-bold text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] uppercase tracking-wider">EARNING STATISTICS</h2>
            <div className="text-[11px] text-[hsl(var(--muted-foreground))]">UTC time zone</div>
          </div>
          <EarningStatsContent />
        </div>
      </div>

      {/* Desktop: Left Panel */}
      <div className="hidden md:flex w-[280px] flex-shrink-0 bg-white dark:bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] dark:border-[hsl(var(--border))] flex-col h-full overflow-y-auto">
        <div className="p-5 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer group">
              <ArrowLeft className="w-5 h-5 text-foreground group-hover:-translate-x-1 transition-transform" />
              <h1 className="text-[17px] font-bold text-foreground uppercase tracking-tight">STATEMENTS</h1>
            </div>
            <HelpCircle className="w-5 h-5 text-[hsl(var(--muted-foreground))] cursor-pointer" />
          </div>

          <div className="bg-[#fffcf0] dark:bg-[#2a2410] border border-[#f5e6b3] dark:border-[#4a3f1c] rounded-lg p-3 flex items-center gap-2">
            <span>⭐</span>
            <span className="text-[#d4af37] text-[11px] font-bold tracking-wide uppercase">YOU ARE IN {state.topRated.toUpperCase()} OF ALL CREATORS!</span>
          </div>

          <BalanceCard />

          <div className="border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] rounded-lg p-3 flex justify-between items-center cursor-pointer">
            <span className="text-[14px] text-foreground">Manual payouts</span>
            <ChevronDown className="w-4 h-4 text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]" />
          </div>

          <button onClick={() => setWithdrawalOpen(true)} className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] text-white rounded-full py-3 font-bold text-[14px] uppercase tracking-wide transition-colors">
            REQUEST WITHDRAWAL
          </button>

          <nav className="flex flex-col mt-2">
            {menuItems.map(item => {
              const isActive = activeMenu === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`flex items-center gap-3 py-3 px-2 text-left relative transition-colors ${isActive ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground font-medium'}`}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 1.5} />
                  <span className="text-[13px] tracking-wide">{item.label}</span>
                  {isActive && <div className="absolute bottom-1 left-2 right-4 h-[2px] bg-foreground rounded-full" />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop: Right Panel */}
      <div className="hidden md:flex flex-1 flex-col h-full bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] overflow-y-auto">
        <div className="p-6 max-w-[800px] w-full mx-auto pb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[13px] font-bold text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] uppercase tracking-wider">EARNING STATISTICS</h2>
            <div className="text-[12px] text-[hsl(var(--muted-foreground))]">Date/Time shown in UTC time zone</div>
          </div>
          <EarningStatsContent />
        </div>
      </div>
      <WithdrawalModal open={withdrawalOpen} onClose={() => setWithdrawalOpen(false)} />
    </div>
  );
}
