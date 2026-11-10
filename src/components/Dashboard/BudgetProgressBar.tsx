import React from 'react';
import { AlertCircle, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { UserBudget } from '../../types/expense';

interface BudgetProgressBarProps {
  monthlySpending: number;
  budget: UserBudget;
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  monthlySpending,
  budget,
}) => {
  const totalBudget = budget.monthlyBudget;
  const remaining = Math.max(0, totalBudget - monthlySpending);
  const percentage = totalBudget > 0 ? (monthlySpending / totalBudget) * 100 : 0;
  const clampedProgress = Math.min(100, percentage);

  // Calculate days remaining in the current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDate = now.getDate();
  const daysLeft = Math.max(1, daysInMonth - todayDate + 1);

  // Recommended daily spend
  const safeDailySpend = remaining > 0 ? remaining / daysLeft : 0;

  // Determine status color and copy
  let statusBadge = {
    label: 'On Track',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    barColor: 'bg-[#0D9488]',
    icon: <CheckCircle2 size={13} className="text-emerald-600 mr-1" />,
  };

  if (percentage >= 100) {
    statusBadge = {
      label: 'Budget Exceeded',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      barColor: 'bg-[#E11D48]',
      icon: <AlertCircle size={13} className="text-rose-600 mr-1" />,
    };
  } else if (percentage >= 85) {
    statusBadge = {
      label: 'Near Limit',
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      barColor: 'bg-[#E11D48]',
      icon: <AlertCircle size={13} className="text-rose-600 mr-1" />,
    };
  } else if (percentage >= 65) {
    statusBadge = {
      label: 'Pacing Fast',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      barColor: 'bg-[#D97706]',
      icon: <TrendingUp size={13} className="text-amber-600 mr-1" />,
    };
  }

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-[0_4px_16px_rgba(15,23,42,0.04)] border border-slate-100 transition-all">
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <h3 className="font-display text-sm font-bold text-slate-800">Monthly Budget Status</h3>
          <p className="text-xs text-slate-500">
            {formatCurrency(monthlySpending, budget.currencySymbol)} spent of {formatCurrency(totalBudget, budget.currencySymbol)}
          </p>
        </div>
        <div
          className={`flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge.color}`}
        >
          {statusBadge.icon}
          {statusBadge.label}
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100 my-3">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${statusBadge.barColor}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      {/* Progress Metrics & Daily Safe Allowance */}
      <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
        <div className="flex items-center space-x-1">
          <Calendar size={13} className="text-slate-400" />
          <span>{daysLeft} days remaining</span>
        </div>
        <div>
          <span className="font-medium text-slate-700">
            {percentage >= 100 ? (
              <span className="text-rose-600 font-semibold">Over by {formatCurrency(monthlySpending - totalBudget, budget.currencySymbol)}</span>
            ) : (
              <span>Safe daily: <strong className="text-slate-900 font-semibold">{formatCurrency(safeDailySpend, budget.currencySymbol)}/day</strong></span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
