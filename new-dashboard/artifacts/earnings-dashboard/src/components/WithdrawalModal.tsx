import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

type ModalState = 'form' | 'loading' | 'success';

export default function WithdrawalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, updateState } = useAppContext();
  const [amount, setAmount] = useState('');
  const [modalState, setModalState] = useState<ModalState>('form');

  if (!open) return null;

  const numAmount = parseFloat(amount) || 0;
  const maxAmount = state.currentBalance;
  const isValid = numAmount >= 20 && numAmount <= maxAmount;

  const handleSubmit = () => {
    if (!isValid) return;
    setModalState('loading');
    setTimeout(() => {
      // Subtract amount from balance
      updateState({
        currentBalance: Math.max(0, state.currentBalance - numAmount),
        currentBalanceStats: Math.max(0, state.currentBalanceStats - numAmount),
      });
      setModalState('success');
    }, 1800);
  };

  const handleClose = () => {
    setAmount('');
    setModalState('form');
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="absolute inset-0 bg-black/30 dark:bg-black/60" />
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl w-full max-w-sm relative z-10 border border-[#e5e5e5] dark:border-[#333] mb-16 md:mb-0">
        {modalState === 'success' ? (
          <div className="p-6 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#00AFF0]/10 flex items-center justify-center">
              <span className="text-[#00AFF0] text-2xl">✓</span>
            </div>
            <p className="text-[15px] font-bold text-black dark:text-white text-center">
              Payout request is being processed
            </p>
            <button
              onClick={handleClose}
              className="mt-2 w-8 h-8 rounded-full border border-[#e5e5e5] dark:border-[#333] flex items-center justify-center text-[#666] dark:text-[#999] hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="p-5 pb-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[13px] font-bold text-[#666] dark:text-[#999] uppercase tracking-wider">Manual Payouts</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-[12px] text-[#999] uppercase">Max:</span>
                    <span className="text-[18px] font-bold text-black dark:text-white">
                      ${maxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-[#666] dark:text-[#999] hover:text-black dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-[12px] text-[#999] mb-4">Minimum $20 USD</p>

              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={modalState === 'loading'}
                className="w-full border border-[#e5e5e5] dark:border-[#333] rounded-lg px-4 py-3 text-[15px] bg-transparent text-black dark:text-white outline-none focus:border-[#00AFF0] transition-colors placeholder:text-[#ccc] dark:placeholder:text-[#555] disabled:opacity-50"
              />

              {amount && !isValid && numAmount > 0 && (
                <p className="text-[11px] text-red-500 mt-1.5">
                  {numAmount < 20 ? 'Minimum withdrawal is $20' : `Maximum is $${maxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                </p>
              )}
            </div>

            <div className="p-5 pt-4 flex gap-3">
              <button
                onClick={handleClose}
                disabled={modalState === 'loading'}
                className="flex-1 py-3 text-[13px] font-bold uppercase tracking-wide text-[#999] hover:text-black dark:hover:text-white rounded-full border border-[#e5e5e5] dark:border-[#333] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isValid || modalState === 'loading'}
                className={`flex-1 py-3 text-[13px] font-bold uppercase tracking-wide rounded-full transition-colors flex items-center justify-center gap-2 ${
                  isValid && modalState !== 'loading'
                    ? 'bg-[#00AFF0] hover:bg-[#0099D6] text-white'
                    : 'bg-[#e5e5e5] dark:bg-[#333] text-[#999] cursor-not-allowed'
                }`}
              >
                {modalState === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Request Withdrawal'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
