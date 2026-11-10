import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Expense } from '../../types/expense';
import { CATEGORIES } from '../../data/categories';
import { CategoryIcon, PaymentMethodIcon } from '../Common/CategoryIcon';
import { formatCurrency, formatTimeDisplay } from '../../utils/formatters';

interface ExpenseItemProps {
  expense: Expense;
  currencySymbol: string;
  onClick: (expense: Expense) => void;
  showDate?: boolean;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
  expense,
  currencySymbol,
  onClick,
  showDate = false,
}) => {
  const category = CATEGORIES[expense.category] || CATEGORIES.other;

  return (
    <div
      onClick={() => onClick(expense)}
      className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-50/80 active:bg-slate-100/90 transition-all cursor-pointer border border-slate-100/80 hover:border-slate-200 shadow-[0_2px_8px_rgba(15,23,42,0.02)]"
    >
      <div className="flex items-center space-x-3.5 min-w-0 pr-2">
        <CategoryIcon category={expense.category} size="md" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-sm text-slate-900 truncate">
              {expense.note ? expense.note : category.name}
            </h4>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
            <span className="font-medium text-slate-600 truncate">{category.name}</span>
            <span>•</span>
            <span className="inline-flex items-center space-x-1 text-slate-500">
              <PaymentMethodIcon method={expense.paymentMethod} size={11} className="text-slate-400" />
              <span>{expense.paymentMethod}</span>
            </span>
            {expense.time && (
              <>
                <span>•</span>
                <span className="text-slate-400">{formatTimeDisplay(expense.time)}</span>
              </>
            )}
            {showDate && (
              <>
                <span>•</span>
                <span className="text-slate-400">{expense.date}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2.5 shrink-0 pl-2">
        <div className="text-right">
          <span className="font-display font-bold text-sm sm:text-base text-slate-900 tabular-nums">
            -{formatCurrency(expense.amount, currencySymbol)}
          </span>
        </div>
        <div className="text-slate-300 group-hover:text-slate-500 transition-colors">
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};
