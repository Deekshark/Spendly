import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, Clock, CreditCard, FileText, AlertCircle, ArrowDownLeft, Sparkles } from 'lucide-react';
import { Income, IncomeCategoryId, IncomePaymentMethod } from '../../types/expense';
import { INCOME_CATEGORY_LIST, INCOME_PAYMENT_METHODS } from '../../data/categories';
import { IncomeCategoryIcon, PaymentMethodIcon } from '../Common/CategoryIcon';

interface AddEditIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (incomeData: Omit<Income, 'id' | 'createdAt'>, existingId?: string) => void;
  initialIncome?: Income | null;
  currencySymbol: string;
}

export const AddEditIncomeModal: React.FC<AddEditIncomeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialIncome,
  currencySymbol,
}) => {
  const isEditing = Boolean(initialIncome);

  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<IncomeCategoryId>('salary');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<IncomePaymentMethod>('Bank Transfer');
  const [errors, setErrors] = useState<{ amount?: string; category?: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (initialIncome) {
        setAmount(initialIncome.amount.toString());
        setCategory(initialIncome.category);
        setDate(initialIncome.date);
        setTime(initialIncome.time || '');
        setNote(initialIncome.note || '');
        setPaymentMethod(initialIncome.paymentMethod);
      } else {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        setAmount('');
        setCategory('salary');
        setDate(dateStr);
        setTime(`${hours}:${minutes}`);
        setNote('');
        setPaymentMethod('Bank Transfer');
      }
      setErrors({});
    }
  }, [isOpen, initialIncome]);

  if (!isOpen) return null;

  const handleQuickAddAmount = (addValue: number) => {
    const currentNum = parseFloat(amount) || 0;
    const newTotal = currentNum + addValue;
    setAmount(newTotal.toString());
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: undefined }));
    }
  };

  const handlePresetDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setDate(d.toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    const validationErrors: { amount?: string; category?: string } = {};
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      validationErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (!category) {
      validationErrors.category = 'Please select an income category';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave(
      {
        amount: parsedAmount,
        category,
        date: date || new Date().toISOString().split('T')[0],
        time: time || '10:00',
        note: note.trim(),
        paymentMethod,
      },
      initialIncome ? initialIncome.id : undefined
    );
    onClose();
  };

  const quickIncrements = [1000, 5000, 10000, 25000, 50000];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-100 bg-emerald-50/50">
          <div className="flex items-center space-x-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
              <ArrowDownLeft size={18} />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                {isEditing ? 'Edit Income' : 'Record Income'}
              </h3>
              <p className="text-xs text-emerald-800">
                {isEditing ? 'Update incoming funds transaction' : 'Log received money or revenue'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Amount Hero Input */}
          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 text-center">
            <label className="block text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-1">
              Received Amount
            </label>
            <div className="relative inline-flex items-center justify-center max-w-xs mx-auto">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-700 mr-1.5 font-display">
                +{currencySymbol}
              </span>
              <input
                type="number"
                step="any"
                min="0.01"
                placeholder="0"
                value={amount}
                onChange={e => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }));
                }}
                autoFocus={!isEditing}
                className="w-44 sm:w-56 text-center text-3xl sm:text-4xl font-extrabold font-display bg-transparent text-slate-900 placeholder:text-slate-300 focus:outline-none tabular-nums"
              />
            </div>

            {errors.amount && (
              <p className="mt-1 text-xs text-rose-600 flex items-center justify-center space-x-1">
                <AlertCircle size={13} />
                <span>{errors.amount}</span>
              </p>
            )}

            {/* Quick Add Increment Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 pt-3 border-t border-emerald-200/60">
              <span className="text-[11px] font-medium text-emerald-800 mr-1">Quick add:</span>
              {quickIncrements.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAddAmount(val)}
                  className="rounded-full bg-white hover:bg-emerald-100 active:scale-95 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-300 shadow-xs transition-all"
                >
                  +{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Income Category Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Income Category
              </label>
              <span className="text-xs text-emerald-700 font-semibold">
                {INCOME_CATEGORY_LIST.find(c => c.id === category)?.name}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5">
              {INCOME_CATEGORY_LIST.map(cat => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-100 bg-slate-50/70 hover:bg-slate-100'
                    }`}
                  >
                    <IncomeCategoryIcon category={cat.id} size="sm" />
                    <span
                      className={`text-[11px] mt-1.5 truncate max-w-full font-semibold ${
                        isSelected ? 'text-emerald-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      {cat.name}
                    </span>
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <Check size={10} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                  <Calendar size={13} className="text-slate-400" />
                  <span>Date Received</span>
                </label>
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => handlePresetDate(0)}
                    className="text-[10px] font-semibold text-emerald-700 hover:underline"
                  >
                    Today
                  </button>
                  <span className="text-[10px] text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => handlePresetDate(1)}
                    className="text-[10px] font-semibold text-slate-600 hover:underline"
                  >
                    Yesterday
                  </button>
                </div>
              </div>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Clock size={13} className="text-slate-400" />
                <span>Time (Optional)</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <CreditCard size={13} className="text-slate-400" />
              <span>Payment / Deposit Channel</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {INCOME_PAYMENT_METHODS.map(method => {
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as IncomePaymentMethod)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <PaymentMethodIcon method={method.id as IncomePaymentMethod} size={13} />
                    <span>{method.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note / Source Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <FileText size={13} className="text-slate-400" />
              <span>Note / Payer Description (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. November Base Salary, Design Client Milestone, Dividend Payout"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center space-x-2"
            >
              <Check size={18} />
              <span>{isEditing ? 'Save Income Changes' : 'Save Income'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
