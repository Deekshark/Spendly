import React, { useState } from 'react';
import { X, Download, RotateCcw, Trash2, Shield, Sparkles } from 'lucide-react';
import { Expense, Income, UserBudget } from '../../types/expense';
import { downloadFinancesCSV } from '../../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  incomes: Income[];
  budget: UserBudget;
  onResetSampleData: () => void;
  onClearAll: () => void;
  onShowToast: (message: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  expenses,
  incomes,
  budget,
  onResetSampleData,
  onClearAll,
  onShowToast,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    downloadFinancesCSV(expenses, incomes, budget.currencySymbol);
    onShowToast('Financial statement CSV downloaded');
  };

  const handleReset = () => {
    onResetSampleData();
    onShowToast('Reset to demo sample dataset');
    onClose();
  };

  const handleClear = () => {
    onClearAll();
    setShowClearConfirm(false);
    onShowToast('All expense and income records cleared');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <h3 className="font-display text-base font-bold text-slate-800">Settings & Data</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Storage & Privacy Note */}
          <div className="rounded-2xl bg-teal-50/70 border border-teal-100 p-3.5 flex items-start space-x-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-teal-800 shrink-0 mt-0.5">
              <Shield size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-teal-900">100% Local Device Storage</h4>
              <p className="text-[11px] text-teal-700/90 mt-0.5">
                All expenses, incomes, and budgets are securely encrypted in your browser storage. Zero server tracking.
              </p>
            </div>
          </div>

          {/* Action List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              Data Management
            </h4>

            {/* Export CSV Statement */}
            <button
              onClick={handleExportCSV}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-all text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
                  <Download size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Export Financial Statement</div>
                  <div className="text-[11px] text-slate-500">
                    Download {expenses.length} expenses & {incomes.length} incomes
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-700">Export CSV</span>
            </button>

            {/* Reset Sample Data */}
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-all text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <RotateCcw size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Restore Sample Data</div>
                  <div className="text-[11px] text-slate-500">
                    Populate demo salaries, freelance, & expenses
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-700">Restore</span>
            </button>

            {/* Clear All Data */}
            {showClearConfirm ? (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 animate-fade-in space-y-2">
                <div className="text-xs font-bold text-rose-800">
                  Are you sure you want to clear all {expenses.length} expenses and {incomes.length} incomes?
                </div>
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={handleClear}
                    className="flex-1 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
                  >
                    Confirm Clear All
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/50 hover:bg-rose-50 border border-rose-200/60 transition-all text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                    <Trash2 size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-rose-800">Clear All Transactions</div>
                    <div className="text-[11px] text-rose-600/80">Wipe clean to zero transactions</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-600">Clear</span>
              </button>
            )}
          </div>

          {/* App Info Footer */}
          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-100">
            <p className="font-semibold text-slate-600 font-display">Spendly Personal Finance Tracker</p>
            <p className="text-[10px] mt-0.5">Automated Balance • Income • Expenses • Cash Flow</p>
          </div>
        </div>
      </div>
    </div>
  );
};
