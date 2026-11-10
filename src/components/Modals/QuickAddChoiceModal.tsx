import React from 'react';
import { X, ArrowDownLeft, ArrowDownRight, Plus } from 'lucide-react';

interface QuickAddChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExpense: () => void;
  onSelectIncome: () => void;
}

export const QuickAddChoiceModal: React.FC<QuickAddChoiceModalProps> = ({
  isOpen,
  onClose,
  onSelectExpense,
  onSelectIncome,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden p-5 transition-all duration-300"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-display text-base font-bold text-slate-800">New Transaction</h3>
            <p className="text-xs text-slate-500">Choose transaction type</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4">
          {/* Income Choice */}
          <button
            onClick={() => {
              onClose();
              onSelectIncome();
            }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 active:scale-95 transition-all border border-emerald-200 text-center group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md shadow-emerald-900/20 mb-2 group-hover:scale-105 transition-transform">
              <ArrowDownLeft size={22} />
            </div>
            <span className="font-display text-sm font-bold text-emerald-900">Add Income</span>
            <span className="text-[11px] text-emerald-700/80 mt-0.5">Money received</span>
          </button>

          {/* Expense Choice */}
          <button
            onClick={() => {
              onClose();
              onSelectExpense();
            }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 transition-all border border-slate-200 text-center group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-md shadow-slate-900/20 mb-2 group-hover:scale-105 transition-transform">
              <ArrowDownRight size={22} />
            </div>
            <span className="font-display text-sm font-bold text-slate-900">Add Expense</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Money spent</span>
          </button>
        </div>
      </div>
    </div>
  );
};
