import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EarningsChart() {
  const { data, editMode } = useDashboard();
  
  return (
    <div className="bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.3)] h-[420px] flex flex-col hover:border-primary/30 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">Earnings Over Time</h3>
        {editMode && (
          <Button variant="outline" size="sm" className="h-8 bg-[#252525] border-white/10 text-[#b3b3b3] hover:text-white hover:border-white/20">
            <Edit2 className="w-3.5 h-3.5 mr-2" />
            Edit Data
          </Button>
        )}
      </div>
      
      <div className="flex-1 min-h-0 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00AFF0" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#00AFF0" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" strokeOpacity={0.5} vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#666666" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
              tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              stroke="#666666" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dx={-10}
              tickFormatter={(val) => `$${val}`}
            />
            <RechartsTooltip 
              contentStyle={{ backgroundColor: '#252525', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
              itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}
              labelStyle={{ color: '#b3b3b3', marginBottom: '8px', fontSize: '12px' }}
              formatter={(value: number) => [formatCurrency(value), '']}
              labelFormatter={(label) => formatDate(label as string)}
            />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }} iconType="circle" />
            <Line type="monotone" dataKey="total" name="Total Earnings" stroke="#00AFF0" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#00AFF0', stroke: '#1a1a1a', strokeWidth: 2 }} />
            <Line type="monotone" dataKey="subscriptions" name="Subscriptions" stroke="#00D9C0" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="tips" name="Tips" stroke="#4CAF50" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="ppv" name="PPV" stroke="#7C3AED" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function BreakdownChart() {
  const { data, editMode } = useDashboard();
  const COLORS = ['#00AFF0', '#00D9C0', '#7C3AED', '#F59E0B'];
  
  const totalAmount = data.pieData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.3)] h-[420px] flex flex-col hover:border-primary/30 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-white">Revenue Breakdown</h3>
        {editMode && <Edit2 className="w-4 h-4 text-[#666666] cursor-pointer hover:text-white" />}
      </div>
      
      <div className="flex-1 relative" style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.pieData}
              cx="50%"
              cy="42%"
              innerRadius={75}
              outerRadius={108}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip 
              contentStyle={{ backgroundColor: '#252525', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff', fontWeight: 500 }}
              formatter={(value: number) => [`${value}%`, '']}
            />
            <Legend verticalAlign="bottom" height={40} iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '8px' }} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center text overlay */}
        <div className="absolute pointer-events-none" style={{ top: '37%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div className="text-center">
            <div className="text-[#b3b3b3] text-xs">Total</div>
            <div className="text-xl font-bold text-white">{totalAmount}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
