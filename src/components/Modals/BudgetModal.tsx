import React, { useState, useEffect } from 'react';
import { X, Check, SlidersHorizontal, DollarSign, Wallet, ArrowUpCircle } from 'lucide-react';
import { UserBudget } from '../../types/expense';
import { CURRENCY_OPTIONS } from '../../data/categories';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget: UserBudget;
  onSaveBudget: (budget: UserBudget) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  currentBudget,
  onSaveBudget,
}) => {
  const [budgetVal, setBudgetVal] = useState<string>('');
  const [incomeVal, setIncomeVal] = useState<string>('');
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('INR');

  useEffect(() => {
    if (isOpen) {
      setBudgetVal(currentBudget.monthlyBudget.toString());
      setIncomeVal(currentBudget.monthlyIncome.toString());
      setSelectedCurrencyCode(currentBudget.currency || 'INR');
    }
  }, [isOpen, currentBudget]);

  if (!isOpen) return null;

  const handleCurrencyChange = (code: string) => {
    setSelectedCurrencyCode(code);
  };

  const selectedCurrencyObj = CURRENCY_OPTIONS.find(c => c.code === selectedCurrencyCode) || CURRENCY_OPTIONS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBudget = parseFloat(budgetVal) || 0;
    const parsedIncome = parseFloat(incomeVal) || 0;

    onSaveBudget({
      ...currentBudget,
      monthlyBudget: parsedBudget,
      monthlyIncome: parsedIncome,
      currency: selectedCurrencyCode,
      currencySymbol: selectedCurrencyObj.symbol,
    });
    onClose();
  };

  const budgetPresetsINR = [15000, 25000, 40000, 60000];
  const budgetPresetsUSD = [500, 1000, 2000, 3500];
  const presets = selectedCurrencyCode === 'INR' ? budgetPresetsINR : budgetPresetsUSD;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 text-teal-700">
              <SlidersHorizontal size={15} />
            </span>
            <h3 className="font-display text-base font-bold text-slate-800">Budget & Currency</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Currency Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Currency
            </label>
            <div className="grid grid-cols-4 gap-2">
              {CURRENCY_OPTIONS.slice(0, 4).map(curr => (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => handleCurrencyChange(curr.code)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all border text-center ${
                    selectedCurrencyCode === curr.code
                      ? 'bg-[#00685f] text-white border-[#00685f] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-sm">{curr.symbol}</span>
                  <span className="text-[10px] opacity-80">{curr.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Budget Target */}
          <div className="rounded-2xl bg-teal-50/50 border border-teal-100 p-4">
            <label className="block text-xs font-bold text-teal-800 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
              <Wallet size={14} className="text-teal-700" />
              <span>Monthly Budget Cap</span>
            </label>
            <p className="text-[11px] text-teal-700/80 mb-2.5">
              Your maximum intended spending limit for each calendar month.
            </p>
            <div className="relative flex items-center rounded-xl bg-white border border-teal-200/80 px-3 py-2 shadow-xs">
              <span className="font-display font-bold text-teal-900 mr-2 text-base">
                {selectedCurrencyObj.symbol}
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={budgetVal}
                onChange={e => setBudgetVal(e.target.value)}
                className="w-full font-display text-lg font-bold text-slate-900 focus:outline-none tabular-nums"
                placeholder="25000"
                required
              />
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <span className="text-[10px] text-teal-700/80 self-center mr-1">Presets:</span>
              {presets.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setBudgetVal(val.toString())}
                  className="rounded-full bg-white hover:bg-teal-100 px-2 py-0.5 text-[11px] font-semibold text-teal-800 border border-teal-200 transition-colors"
                >
                  {selectedCurrencyObj.symbol}{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Income / Total Balance */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
              <ArrowUpCircle size={14} className="text-emerald-600" />
              <span>Monthly Income / Balance</span>
            </label>
            <p className="text-[11px] text-slate-500 mb-2.5">
              Used to calculate your real-time total net balance (Income - Expenses).
            </p>
            <div className="relative flex items-center rounded-xl bg-white border border-slate-300 px-3 py-2 shadow-xs">
              <span className="font-display font-bold text-slate-700 mr-2 text-base">
                {selectedCurrencyObj.symbol}
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={incomeVal}
                onChange={e => setIncomeVal(e.target.value)}
                className="w-full font-display text-lg font-bold text-slate-900 focus:outline-none tabular-nums"
                placeholder="65000"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-full bg-[#00685f] hover:bg-[#005049] active:scale-[0.98] py-3 text-sm font-bold text-white shadow-md shadow-teal-900/20 transition-all flex items-center justify-center space-x-2"
            >
              <Check size={16} />
              <span>Apply Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
