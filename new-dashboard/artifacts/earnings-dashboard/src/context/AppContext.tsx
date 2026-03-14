import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

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
  // Generate 30 months of data with varied amounts
  for (let i = 0; i < 30; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const name = `${monthNames[d.getMonth()]}, ${d.getFullYear()}`;
    // Generate realistic varying amounts between $2,500 and $5,500
    const baseAmount = 3500 + Math.sin(i * 0.5) * 1200 + Math.cos(i * 0.3) * 800;
    const amount = `${baseAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    months.push({ month: name, amount });
  }
  return months;
}

function generateDailyChartData(): ChartDataPoint[] {
  // Realistic earnings data matching reference: peaks ~$400-500, troughs ~$50-150, general downtrend toward end
  const earningsBase = [
    280, 350, 180, 420, 300, 480, 250, 150, 380, 200,
    450, 320, 160, 390, 280, 120, 350, 270, 400, 180,
    300, 220, 150, 280, 190, 100, 250, 170, 130, 80
  ];
  // Gray curve (interactions/net) follows similar pattern but lower amplitude
  const interactionsBase = [
    180, 230, 120, 280, 200, 320, 160, 100, 250, 130,
    300, 210, 110, 260, 180, 80, 230, 170, 270, 120,
    200, 140, 100, 180, 120, 65, 160, 110, 85, 50
  ];
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
  theme: 'light' as const,
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
    { date: 'May 11, 2025, 2:15 pm', amount: '$185.30', fee: '$37.06', net: '$148.24', desc: 'Payment for message from', name: 'Sofia M', status: '', selected: false },
    { date: 'May 10, 2025, 9:30 am', amount: '$295.00', fee: '$59.00', net: '$236.00', desc: 'Tip from', name: 'James P', status: '✓', selected: false },
    { date: 'May 9, 2025, 7:45 pm', amount: '$178.90', fee: '$35.78', net: '$143.12', desc: 'Payment for message from', name: 'Emma L', status: '', selected: false },
    { date: 'May 8, 2025, 4:20 am', amount: '$245.60', fee: '$49.12', net: '$196.48', desc: 'Tip from', name: 'Chen W', status: '', selected: false },
    { date: 'May 7, 2025, 11:55 pm', amount: '$210.45', fee: '$42.09', net: '$168.36', desc: 'Payment for message from', name: 'Priya S', status: '✓', selected: false },
    { date: 'May 6, 2025, 6:10 pm', amount: '$167.80', fee: '$33.56', net: '$134.24', desc: 'Tip from', name: 'Alex K', status: '', selected: false },
    { date: 'May 5, 2025, 1:35 pm', amount: '$298.50', fee: '$59.70', net: '$238.80', desc: 'Payment for message from', name: 'Maria G', status: '', selected: false },
    { date: 'May 4, 2025, 8:00 am', amount: '$225.75', fee: '$45.15', net: '$180.60', desc: 'Tip from', name: 'David R', status: '✓', selected: false },
    { date: 'May 3, 2025, 3:40 pm', amount: '$188.20', fee: '$37.64', net: '$150.56', desc: 'Payment for message from', name: 'Nina B', status: '', selected: false },
    { date: 'May 2, 2025, 10:25 am', amount: '$275.00', fee: '$55.00', net: '$220.00', desc: 'Tip from', name: 'Omar H', status: '', selected: false },
    { date: 'May 1, 2025, 5:50 pm', amount: '$195.40', fee: '$39.08', net: '$156.32', desc: 'Payment for message from', name: 'Lisa T', status: '✓', selected: false },
    { date: 'Apr 30, 2025, 12:15 pm', amount: '$240.90', fee: '$48.18', net: '$192.72', desc: 'Tip from', name: 'Kevin D', status: '', selected: false },
    { date: 'Apr 29, 2025, 7:30 am', amount: '$205.60', fee: '$41.12', net: '$164.48', desc: 'Payment for message from', name: 'Anna V', status: '', selected: false },
    { date: 'Apr 28, 2025, 2:45 pm', amount: '$285.25', fee: '$57.05', net: '$228.20', desc: 'Tip from', name: 'Ryan C', status: '✓', selected: false },
    { date: 'Apr 27, 2025, 9:20 pm', amount: '$172.35', fee: '$34.47', net: '$137.88', desc: 'Payment for message from', name: 'Zara N', status: '', selected: false },
    { date: 'Apr 26, 2025, 4:05 am', amount: '$255.80', fee: '$51.16', net: '$204.64', desc: 'Tip from', name: 'Tom F', status: '', selected: false },
    { date: 'Apr 25, 2025, 11:40 am', amount: '$218.90', fee: '$43.78', net: '$175.12', desc: 'Payment for message from', name: 'Mia J', status: '✓', selected: false },
    { date: 'Apr 24, 2025, 6:55 pm', amount: '$192.50', fee: '$38.50', net: '$154.00', desc: 'Tip from', name: 'Lucas E', status: '', selected: false },
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
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  loginDate: string | null;
  setLoginDate: (date: string | null) => void;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
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
        // Ensure theme is valid
        if (merged.theme !== 'light' && merged.theme !== 'dark') {
          merged.theme = 'light';
        }
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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginDate, setLoginDate] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Starting auth check...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Auth check:', { hasSession: !!session, user: session?.user?.id });

      if (session?.user) {
        console.log('User found, checking subscription...');
        // Check if user has active subscription
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .maybeSingle();

        console.log('Subscription check:', { hasSubscription: !!subData, data: subData });

        if (subData) {
          console.log('User authenticated with active subscription');
          setIsAuthenticated(true);
          const loginTime = session.user.last_sign_in_at || session.user.created_at;
          setLoginDate(loginTime);

          // Check if we should show welcome screen
          const lastActivity = localStorage.getItem('lastActivity');
          const welcomeShown = sessionStorage.getItem('welcomeShown');
          const now = Date.now();

          // Show welcome only if:
          // 1. Not shown in this session yet
          // 2. Last activity was more than 1 hour ago (or no last activity)
          if (!welcomeShown && (!lastActivity || now - parseInt(lastActivity) > 3600000)) {
            console.log('Showing welcome screen after inactivity');
            setShowWelcome(true);
            sessionStorage.setItem('welcomeShown', 'true');
          } else {
            console.log('Skipping welcome screen');
            setShowWelcome(false);
          }

          // Update last activity
          localStorage.setItem('lastActivity', now.toString());
        } else {
          console.log('No active subscription found');
        }
      } else {
        console.log('No user session found');
      }
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  // Hide loader after auth is checked AND minimum time has passed
  useEffect(() => {
    if (!authChecked) return undefined;

    const loaderShown = sessionStorage.getItem('loaderShown');

    if (loaderShown) {
      // Already shown loader in this session, hide immediately
      setIsLoading(false);
      return undefined;
    } else {
    // First time, show for 1.5 seconds
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('loaderShown', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [authChecked]);

  // Update last activity on any interaction
  useEffect(() => {
    if (!isAuthenticated) return undefined;

    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    // Update on user interactions
    window.addEventListener('click', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('scroll', updateActivity);

    return () => {
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, [isAuthenticated]);

  // Apply theme class immediately on mount and on every state change
  useEffect(() => {
    localStorage.setItem('earningsDashboardState', JSON.stringify(state));
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  // Ensure correct theme class on initial mount
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

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
      setBalanceEditFormOpen,
      isLoading,
      setIsLoading,
      isAuthenticated,
      setIsAuthenticated,
      loginDate,
      setLoginDate,
      showWelcome,
      setShowWelcome
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
