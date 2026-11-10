import React, { useState } from 'react';
import { X, Edit3, Trash2, Calendar, Clock, CreditCard, FileText, AlertTriangle, ArrowDownLeft, ShieldCheck } from 'lucide-react';
import { Income } from '../../types/expense';
import { INCOME_CATEGORIES } from '../../data/categories';
import { IncomeCategoryIcon, PaymentMethodIcon } from '../Common/CategoryIcon';
import { formatCurrency, formatTimeDisplay, getFriendlyDateLabel } from '../../utils/formatters';

interface IncomeDetailModalProps {
  income: Income | null;
  currencySymbol: string;
  onClose: () => void;
  onEdit: (income: Income) => void;
  onDelete: (incomeId: string) => void;
}

export const IncomeDetailModal: React.FC<IncomeDetailModalProps> = ({
  income,
  currencySymbol,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!income) return null;

  const category = INCOME_CATEGORIES[income.category] || INCOME_CATEGORIES.other;

  const handleDelete = () => {
    onDelete(income.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-100 bg-emerald-50/50">
          <div className="flex items-center space-x-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <ShieldCheck size={14} />
            </span>
            <h3 className="font-display text-sm font-bold text-slate-800">Income Deposit Receipt</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6">
          {/* Main Hero Amount & Category Badge */}
          <div className="flex flex-col items-center text-center pb-6 border-b border-dashed border-slate-200">
            <IncomeCategoryIcon category={income.category} size="lg" className="mb-3 ring-4 ring-emerald-50" />

            <div className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-600 tabular-nums">
              +{formatCurrency(income.amount, currencySymbol)}
            </div>

            <div className="mt-1 text-sm font-semibold text-slate-700">
              {income.note || category.name}
            </div>

            <span
              className="mt-2.5 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: category.bgColor,
                color: category.textColor,
                border: `1px solid ${category.borderColor}`,
              }}
            >
              {category.name}
            </span>
          </div>

          {/* Key-Value Details List */}
          <div className="py-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center space-x-1.5">
                <Calendar size={14} className="text-slate-400" />
                <span>Date Received</span>
              </span>
              <span className="font-semibold text-slate-800">
                {getFriendlyDateLabel(income.date)} ({income.date})
              </span>
            </div>

            {income.time && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <Clock size={14} className="text-slate-400" />
                  <span>Time</span>
                </span>
                <span className="font-semibold text-slate-800">
                  {formatTimeDisplay(income.time)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center space-x-1.5">
                <CreditCard size={14} className="text-slate-400" />
                <span>Deposit Channel</span>
              </span>
              <span className="font-semibold text-slate-800 flex items-center space-x-1.5">
                <PaymentMethodIcon method={income.paymentMethod} size={14} className="text-emerald-700" />
                <span>{income.paymentMethod}</span>
              </span>
            </div>

            {income.note && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-400 block mb-1 flex items-center space-x-1">
                  <FileText size={12} />
                  <span>Payer Note / Source</span>
                </span>
                <p className="text-xs text-slate-700 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  {income.note}
                </p>
              </div>
            )}
          </div>

          {/* Delete Confirmation prompt */}
          {showConfirmDelete ? (
            <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-200 p-4 animate-fade-in">
              <div className="flex items-start space-x-2 text-rose-800 mb-3">
                <AlertTriangle size={18} className="shrink-0 mt-0.5 text-rose-600" />
                <div>
                  <h4 className="text-xs font-bold">Delete this income transaction?</h4>
                  <p className="text-[11px] text-rose-700 mt-0.5">
                    This will permanently remove this income record and adjust your total net balance.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 rounded-full bg-rose-600 hover:bg-rose-700 py-2 text-xs font-bold text-white transition-colors"
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 rounded-full bg-white hover:bg-slate-100 border border-slate-200 py-2 text-xs font-bold text-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex items-center space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  onEdit(income);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center space-x-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
              >
                <Edit3 size={14} />
                <span>Edit Income</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="flex items-center justify-center space-x-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-3 text-xs font-bold transition-all active:scale-[0.98]"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
