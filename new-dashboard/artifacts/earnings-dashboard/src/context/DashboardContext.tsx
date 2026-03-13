import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Types
export type TransactionType = 'Subscription' | 'Tip' | 'PPV' | 'Refund' | 'Referral';
export type TransactionStatus = 'Completed' | 'Pending' | 'Refunded';

export interface Statement {
  id: string;
  date: string;
  description: string;
  fan: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
}

export interface SummaryStats {
  totalEarnings: number;
  thisMonth: number;
  pending: number;
  netEarnings: number;
}

export interface ChartDataPoint {
  date: string;
  total: number;
  subscriptions: number;
  tips: number;
  ppv: number;
}

export interface PieDataPoint {
  name: string;
  value: number;
}

export interface TopSubscriber {
  id: string;
  username: string;
  spent: number;
  since: string;
  status: string;
}

export interface DashboardData {
  stats: SummaryStats;
  chartData: ChartDataPoint[];
  pieData: PieDataPoint[];
  statements: Statement[];
  topSubscribers: TopSubscriber[];
}

// Initial Mock Data
const INITIAL_DATA: DashboardData = {
  stats: {
    totalEarnings: 12847.50,
    thisMonth: 2340.00,
    pending: 456.75,
    netEarnings: 9638.63,
  },
  chartData: Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return {
      date: d.toISOString().split('T')[0],
      total: Math.floor(Math.random() * 500) + 100,
      subscriptions: Math.floor(Math.random() * 200) + 50,
      tips: Math.floor(Math.random() * 100) + 10,
      ppv: Math.floor(Math.random() * 150) + 20,
    };
  }),
  pieData: [
    { name: 'Subscriptions', value: 58 },
    { name: 'Tips', value: 22 },
    { name: 'PPV', value: 15 },
    { name: 'DMs', value: 5 },
  ],
  topSubscribers: [
    { id: '1', username: '@bigfan99', spent: 1250.00, since: '2023-01-15', status: 'Active' },
    { id: '2', username: '@crypto_king', spent: 850.50, since: '2023-03-22', status: 'Active' },
    { id: '3', username: '@sweet_dreams', spent: 620.00, since: '2023-06-10', status: 'Active' },
    { id: '4', username: '@anon_user', spent: 450.00, since: '2023-08-05', status: 'Active' },
    { id: '5', username: '@loyal_sub', spent: 390.00, since: '2023-09-12', status: 'Active' },
  ],
  statements: Array.from({ length: 20 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const types: TransactionType[] = ['Subscription', 'Tip', 'PPV', 'Refund'];
    const type = types[Math.floor(Math.random() * 3.1)]; // Favor non-refunds
    return {
      id: uuidv4(),
      date: d.toISOString().split('T')[0],
      description: type === 'Subscription' ? 'Monthly Subscription' : type === 'Tip' ? 'Message Tip' : type === 'PPV' ? 'Unlocked Video' : 'Refund Processed',
      fan: `@user_${Math.floor(Math.random() * 1000)}`,
      type,
      amount: type === 'Refund' ? -14.99 : [14.99, 5.00, 25.00, 50.00][Math.floor(Math.random() * 4)],
      status: type === 'Refund' ? 'Refunded' : Math.random() > 0.8 ? 'Pending' : 'Completed',
    }
  })
};

// Context setup
interface DashboardContextType {
  data: DashboardData;
  editMode: boolean;
  setEditMode: (val: boolean) => void;
  updateStats: (stats: SummaryStats) => void;
  addStatement: (stmt: Omit<Statement, 'id'>) => void;
  updateStatement: (id: string, stmt: Partial<Statement>) => void;
  deleteStatement: (id: string) => void;
  updateChartData: (data: ChartDataPoint[]) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DashboardData>(INITIAL_DATA);
  const [editMode, setEditMode] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ofDashboardData');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('ofDashboardData', JSON.stringify(data));
  }, [data]);

  const updateStats = (newStats: SummaryStats) => {
    setData(prev => ({ ...prev, stats: newStats }));
  };

  const addStatement = (stmt: Omit<Statement, 'id'>) => {
    setData(prev => ({
      ...prev,
      statements: [{ ...stmt, id: uuidv4() }, ...prev.statements]
    }));
  };

  const updateStatement = (id: string, updates: Partial<Statement>) => {
    setData(prev => ({
      ...prev,
      statements: prev.statements.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const deleteStatement = (id: string) => {
    setData(prev => ({
      ...prev,
      statements: prev.statements.filter(s => s.id !== id)
    }));
  };
  
  const updateChartData = (chartData: ChartDataPoint[]) => {
    setData(prev => ({ ...prev, chartData }));
  };

  return (
    <DashboardContext.Provider value={{
      data,
      editMode,
      setEditMode,
      updateStats,
      addStatement,
      updateStatement,
      deleteStatement,
      updateChartData
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within DashboardProvider");
  return context;
}
