import React from 'react';
import { ChevronRight, ArrowDownLeft } from 'lucide-react';
import { Income } from '../../types/expense';
import { INCOME_CATEGORIES } from '../../data/categories';
import { IncomeCategoryIcon, PaymentMethodIcon } from '../Common/CategoryIcon';
import { formatCurrency, formatTimeDisplay } from '../../utils/formatters';

interface IncomeItemProps {
  income: Income;
  currencySymbol: string;
  onClick: (income: Income) => void;
  showDate?: boolean;
}

export const IncomeItem: React.FC<IncomeItemProps> = ({
  income,
  currencySymbol,
  onClick,
  showDate = false,
}) => {
  const category = INCOME_CATEGORIES[income.category] || INCOME_CATEGORIES.other;

  return (
    <div
      onClick={() => onClick(income)}
      className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-emerald-50/40 active:bg-emerald-50/80 transition-all cursor-pointer border border-slate-100/90 hover:border-emerald-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.02)]"
    >
      <div className="flex items-center space-x-3.5 min-w-0 pr-2">
        <IncomeCategoryIcon category={income.category} size="md" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-sm text-slate-900 truncate">
              {income.note ? income.note : category.name}
            </h4>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
            <span className="font-medium text-emerald-800 truncate">{category.name}</span>
            <span>•</span>
            <span className="inline-flex items-center space-x-1 text-slate-500">
              <PaymentMethodIcon method={income.paymentMethod} size={11} className="text-slate-400" />
              <span>{income.paymentMethod}</span>
            </span>
            {income.time && (
              <>
                <span>•</span>
                <span className="text-slate-400">{formatTimeDisplay(income.time)}</span>
              </>
            )}
            {showDate && (
              <>
                <span>•</span>
                <span className="text-slate-400">{income.date}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2.5 shrink-0 pl-2">
        <div className="text-right">
          <span className="font-display font-bold text-sm sm:text-base text-emerald-600 tabular-nums flex items-center justify-end">
            +{formatCurrency(income.amount, currencySymbol)}
          </span>
        </div>
        <div className="text-slate-300 group-hover:text-emerald-600 transition-colors">
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};
