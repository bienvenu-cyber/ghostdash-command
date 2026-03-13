import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import EditableValue from '@/components/EditableValue';

export default function ChartEditForm() {
  const { state, updateState, isChartEditFormOpen, setChartEditFormOpen } = useAppContext();
  
  const [localAnnual, setLocalAnnual] = useState(state.annualEarnings.toString());
  const [localTheme, setLocalTheme] = useState(state.theme);
  const [localAllTime, setLocalAllTime] = useState(state.allTimeChartData);

  if (!isChartEditFormOpen) return null;

  const handleDistributeEvenly = () => {
    const annual = parseFloat(localAnnual) || 0;
    const monthly = annual / 12;
    
    const newChartData = state.chartData.map(item => ({
      ...item,
      earnings: Math.round(monthly / 4) // approximation for weekly points
    }));
    
    updateState({ chartData: newChartData, annualEarnings: annual });
  };

  const handleDistributeProportionally = () => {
    const annual = parseFloat(localAnnual) || 0;
    // Implementation placeholder for proportional distribution
    // For simplicity, just scaling existing data
    const currentSum = state.chartData.reduce((acc, curr) => acc + curr.earnings, 0);
    const scale = currentSum > 0 ? (annual / 12 / 4) / (currentSum / state.chartData.length) : 1;
    
    const newChartData = state.chartData.map(item => ({
      ...item,
      earnings: Math.round(item.earnings * scale)
    }));
    
    updateState({ chartData: newChartData, annualEarnings: annual });
  };

  const handleApply = () => {
    updateState({ 
      theme: localTheme,
      allTimeChartData: localAllTime,
      annualEarnings: parseFloat(localAnnual) || state.annualEarnings
    });
    setChartEditFormOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-[#e5e5e5] dark:border-[#333]">
          <h2 className="text-lg font-bold text-black dark:text-white">Edit Chart Data</h2>
          <button onClick={() => setChartEditFormOpen(false)} className="text-[#666] hover:text-black dark:text-[#aaa] dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-6">
          {/* Theme Toggle */}
          <div>
            <h3 className="text-sm font-bold text-[#666] dark:text-[#999] uppercase tracking-wider mb-3">Theme</h3>
            <div className="flex items-center gap-3">
              <span className={`text-sm ${localTheme === 'light' ? 'font-bold text-black dark:text-white' : 'text-[#666] dark:text-[#aaa]'}`}>Light</span>
              <button 
                onClick={() => setLocalTheme(localTheme === 'light' ? 'dark' : 'light')}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${localTheme === 'dark' ? 'bg-[#00AFF0]' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${localTheme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <span className={`text-sm ${localTheme === 'dark' ? 'font-bold text-black dark:text-white' : 'text-[#666] dark:text-[#aaa]'}`}>Dark</span>
            </div>
          </div>

          {/* Annual Distribution */}
          <div>
            <h3 className="text-sm font-bold text-[#666] dark:text-[#999] uppercase tracking-wider mb-3">Annual Earnings Distribution</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-[#666] dark:text-[#aaa] mb-1">Annual total ($)</label>
                <input 
                  type="number" 
                  value={localAnnual}
                  onChange={(e) => setLocalAnnual(e.target.value)}
                  className="w-full border border-[#e5e5e5] dark:border-[#333] rounded px-3 py-2 text-sm bg-transparent dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleDistributeEvenly} className="flex-1 bg-[#f5f5f5] dark:bg-[#333] hover:bg-[#e5e5e5] dark:hover:bg-[#444] text-black dark:text-white text-xs py-2 rounded transition-colors">
                  Distribute evenly
                </button>
                <button onClick={handleDistributeProportionally} className="flex-1 bg-[#f5f5f5] dark:bg-[#333] hover:bg-[#e5e5e5] dark:hover:bg-[#444] text-black dark:text-white text-xs py-2 rounded transition-colors">
                  Distribute proportionally
                </button>
              </div>
            </div>
          </div>

          {/* All Time Chart Data */}
          <div>
            <h3 className="text-sm font-bold text-[#666] dark:text-[#999] uppercase tracking-wider mb-3">All Time Chart Data</h3>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-2 text-xs text-[#666] dark:text-[#aaa] font-medium pb-1 border-b border-[#e5e5e5] dark:border-[#333]">
                <div>Date</div>
                <div>Gross ($)</div>
                <div>Net ($)</div>
              </div>
              {localAllTime.map((point, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm text-black dark:text-white truncate">{point.date}</div>
                  <input 
                    type="number"
                    value={point.gross}
                    onChange={(e) => {
                      const newAllTime = [...localAllTime];
                      newAllTime[idx] = { ...point, gross: parseFloat(e.target.value) || 0 };
                      setLocalAllTime(newAllTime);
                    }}
                    className="w-full border border-[#e5e5e5] dark:border-[#333] rounded px-2 py-1 text-sm bg-transparent dark:text-white"
                  />
                  <input 
                    type="number"
                    value={point.net}
                    onChange={(e) => {
                      const newAllTime = [...localAllTime];
                      newAllTime[idx] = { ...point, net: parseFloat(e.target.value) || 0 };
                      setLocalAllTime(newAllTime);
                    }}
                    className="w-full border border-[#e5e5e5] dark:border-[#333] rounded px-2 py-1 text-sm bg-transparent dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#e5e5e5] dark:border-[#333] flex justify-end gap-3">
          <button 
            onClick={() => setChartEditFormOpen(false)}
            className="px-4 py-2 text-sm font-medium text-[#666] hover:text-black dark:text-[#aaa] dark:hover:text-white"
          >
            Close
          </button>
          <button 
            onClick={handleApply}
            className="px-6 py-2 bg-[#00AFF0] hover:bg-[#0099D6] text-white text-sm font-bold rounded-full transition-colors"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}
