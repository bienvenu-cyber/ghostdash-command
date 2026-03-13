import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Transaction = {
  date: string;
  amount: string;
  fee: string;
  net: string;
  desc: string;
  name: string;
  status: string;
  selected: boolean;
};

export type EarningsData = {
  label: string;
  amount: string;
  percent: string;
  color: string;
};

export type BreakdownData = {
  label: string;
  gross: string;
  net: string;
  color: string;
};

export type MonthlyData = {
  month: string;
  amount: string;
};

export type ChartDataPoint = {
  date: string;
  earnings: number;
  interactions: number;
};

export type AllTimeChartDataPoint = {
  date: string;
  gross: number;
  net: number;
};

function generateMonthlyData(): MonthlyData[] {
  const now = new Date();
  const months = [];
  const monthNames = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];
  const baseAmounts = [4295.09, 3707.68, 3421.55, 4102.30, 3890.17, 4567.22,
    3234.88, 4789.45, 3654.12, 4123.67, 3987.54, 3541.29];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const name = `${monthNames[d.getMonth()]}, ${d.getFullYear()}`;
    const amount = `$${baseAmounts[i].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    months.push({ month: name, amount });
  }
  return months;
}

function generateDailyChartData(): ChartDataPoint[] {
  const earningsBase = [95,130,78,165,145,188,112,175,155,90,200,168,140,195,125,175,160,105,185,130,170,145,195,115,160,140,175,130,165,110];
  const interactionsBase = [180,210,165,245,225,260,195,240,230,170,280,255,215,265,200,245,235,185,255,210,240,220,265,195,235,220,250,205,245,190];
  const dates: string[] = [];
  const start = new Date(2025, 3, 23);
  for (let i = 0; i < 30; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const mo = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const yr = d.getFullYear();
    dates.push(`${mo},\n${yr}`);
  }
  return dates.map((date, i) => ({
    date,
    earnings: earningsBase[i] ?? 120,
    interactions: interactionsBase[i] ?? 200,
  }));
}

interface AppState {
  theme: 'light' | 'dark';
  avatar: string;
  currentBalance: number;
  pendingBalance: number;
  currentBalanceStats: number;
  pendingBalanceStats: number;
  transactions: Transaction[];
  earningsData: EarningsData[];
  allTimeTotal: number;
  breakdownData: BreakdownData[];
  monthlyData: MonthlyData[];
  chartData: ChartDataPoint[];
  allTimeChartData: AllTimeChartDataPoint[];
  accountAge: string;
  startDate: string;
  notificationsCount: number;
  messagesCount: number;
  maxValue: number;
  topRated: string;
  annualEarnings: number;
}

const defaultState: AppState = {
  theme: 'light',
  avatar: '',
  currentBalance: 3754.34,
  pendingBalance: 540.75,
  currentBalanceStats: 3179.51,
  pendingBalanceStats: 457.96,
  transactions: [
    { date: 'May 2, 2025, 6:25 am', amount: '$152.10', fee: '$30.42', net: '$121.68', desc: 'Tip from', name: 'Neha K', status: '✓', selected: true },
    { date: 'May 22, 2025, 8:55 am', amount: '$190.74', fee: '$38.15', net: '$152.59', desc: 'Payment for message from', name: 'Rohit R', status: '✓', selected: false },
    { date: 'May 21, 2025, 2:44 am', amount: '$260.04', fee: '$52.01', net: '$208.03', desc: 'Payment for message from', name: 'Juandre W', status: '', selected: false },
    { date: 'May 20, 2025, 11:04 pm', amount: '$263.08', fee: '$52.62', net: '$210.46', desc: 'Payment for message from', name: 'Hamender K', status: '', selected: false },
    { date: 'May 19, 2025, 5:28 pm', amount: '$268.24', fee: '$53.65', net: '$214.59', desc: 'Payment for message from', name: 'Shivali C', status: '', selected: false },
    { date: 'May 18, 2025, 3:13 am', amount: '$207.89', fee: '$41.58', net: '$166.31', desc: 'Tip from', name: 'Grygorchuk V', status: '', selected: false },
    { date: 'May 17, 2025, 9:40 pm', amount: '$175.50', fee: '$35.10', net: '$140.40', desc: 'Payment for message from', name: 'Aditi P', status: '', selected: false },
    { date: 'May 16, 2025, 1:22 pm', amount: '$312.00', fee: '$62.40', net: '$249.60', desc: 'Tip from', name: 'Marcus L', status: '', selected: false },
    { date: 'May 15, 2025, 7:55 am', amount: '$198.45', fee: '$39.69', net: '$158.76', desc: 'Payment for message from', name: 'Yuki T', status: '✓', selected: false },
    { date: 'May 14, 2025, 4:30 pm', amount: '$145.00', fee: '$29.00', net: '$116.00', desc: 'Tip from', name: 'Carla M', status: '', selected: false },
    { date: 'May 13, 2025, 11:10 am', amount: '$289.75', fee: '$57.95', net: '$231.80', desc: 'Payment for message from', name: 'Arjun S', status: '', selected: false },
    { date: 'May 12, 2025, 6:05 pm', amount: '$220.60', fee: '$44.12', net: '$176.48', desc: 'Tip from', name: 'Lena B', status: '✓', selected: false },
  ],
  earningsData: [
    { label: 'Total', amount: '$7,543.44', percent: '138.6%', color: '#000000' },
    { label: 'Subscriptions', amount: '$3,616.27', percent: '192.9%', color: '#b5a642' },
    { label: 'Tips', amount: '$1,414.16', percent: '183.5%', color: '#9370db' },
    { label: 'Messages', amount: '$4,240.45', percent: '111%', color: '#00AFF0' },
  ],
  allTimeTotal: 95569.47,
  breakdownData: [
    { label: 'Subscriptions', gross: '$35,838.55', net: '$28,670.84', color: '#00AFF0' },
    { label: 'Tips', gross: '$17,919.28', net: '$14,335.42', color: '#FF6B35' },
    { label: 'Posts', gross: '$0.00', net: '$0.00', color: '#999999' },
    { label: 'Messages', gross: '$65,704.01', net: '$52,563.21', color: '#00AFF0' },
    { label: 'Referrals', gross: '$0.00', net: '$0.00', color: '#999999' },
  ],
  monthlyData: generateMonthlyData(),
  chartData: generateDailyChartData(),
  allTimeChartData: [
    { date: '11 Apr 24', gross: 20000, net: 15000 },
    { date: '26 Sep 24', gross: 40000, net: 32000 },
    { date: '13 Mar 25', gross: 70000, net: 55000 },
    { date: '22 Aug 25', gross: 90000, net: 75000 },
    { date: '12 Mar 26', gross: 119461, net: 95569 },
  ],
  accountAge: '2 years, 3 months',
  startDate: 'Mar 6, 2024',
  notificationsCount: 11,
  messagesCount: 0,
  maxValue: 0,
  topRated: 'Top 1.8%',
  annualEarnings: 50000,
};

interface AppContextType {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  resetState: () => void;
  isAllTimeEarningsFormOpen: boolean;
  setAllTimeEarningsFormOpen: (open: boolean) => void;
  isChartEditFormOpen: boolean;
  setChartEditFormOpen: (open: boolean) => void;
  isBalanceEditFormOpen: boolean;
  setBalanceEditFormOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('earningsDashboardState');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.startDate && /^\d{4}-\d{2}-\d{2}$/.test(parsed.startDate)) {
          const [y, m, d] = parsed.startDate.split('-').map(Number);
          const dt = new Date(Date.UTC(y, m - 1, d));
          parsed.startDate = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
        }
        const merged = { ...defaultState, ...parsed };
        merged.monthlyData = generateMonthlyData().map((fresh, i) => {
          const saved = parsed.monthlyData?.[i];
          return saved ? { month: fresh.month, amount: saved.amount } : fresh;
        });
        return merged;
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return defaultState;
  });

  const [isAllTimeEarningsFormOpen, setAllTimeEarningsFormOpen] = useState(false);
  const [isChartEditFormOpen, setChartEditFormOpen] = useState(false);
  const [isBalanceEditFormOpen, setBalanceEditFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('earningsDashboardState', JSON.stringify(state));
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState({ ...defaultState, monthlyData: generateMonthlyData(), chartData: generateDailyChartData() });
  };

  return (
    <AppContext.Provider value={{
      state,
      updateState,
      resetState,
      isAllTimeEarningsFormOpen,
      setAllTimeEarningsFormOpen,
      isChartEditFormOpen,
      setChartEditFormOpen,
      isBalanceEditFormOpen,
      setBalanceEditFormOpen
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
