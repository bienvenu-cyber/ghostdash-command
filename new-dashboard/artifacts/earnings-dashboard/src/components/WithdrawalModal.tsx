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
      <div className="absolute inset-0 bg-black/30" />
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-sm relative z-10 border border-border mb-16 md:mb-0">
        {modalState === 'success' ? (
          <div className="p-6 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-2xl">✓</span>
            </div>
            <p className="text-[15px] font-bold text-foreground text-center">
              Payout request is being processed
            </p>
            <button
              onClick={handleClose}
              className="mt-2 w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="p-5 pb-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Manual Payouts</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-[12px] text-muted-foreground uppercase">Max:</span>
                      <span className="text-[18px] font-bold text-foreground">
                      ${maxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                    className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

                <p className="text-[12px] text-muted-foreground mb-4">Minimum $20 USD</p>

              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={modalState === 'loading'}
                  className="w-full border border-border rounded-lg px-4 py-3 text-[15px] bg-background text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground disabled:opacity-50"
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
                  className="flex-1 py-3 text-[13px] font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground rounded-full border border-border transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isValid || modalState === 'loading'}
                  className={`flex-1 py-3 text-[11px] md:text-[12px] font-bold uppercase tracking-wide rounded-full transition-colors flex items-center justify-center gap-2 ${
                  isValid && modalState !== 'loading'
                  ? 'bg-primary hover:bg-primary/90 text-white'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {modalState === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Processing...</span>
                      <span className="sm:hidden">...</span>
                  </>
                ) : (
                      <>
                        <span className="hidden sm:inline">Request Withdrawal</span>
                        <span className="sm:hidden">Withdraw</span>
                      </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
