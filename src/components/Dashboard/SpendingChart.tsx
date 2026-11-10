import React, { useState, useMemo } from 'react';
import { BarChart3, ChevronRight, TrendingUp } from 'lucide-react';
import { Expense, UserBudget } from '../../types/expense';
import { formatCurrency } from '../../utils/formatters';

interface SpendingChartProps {
  expenses: Expense[];
  budget: UserBudget;
  onViewAllExpenses?: () => void;
}

export const SpendingChart: React.FC<SpendingChartProps> = ({
  expenses,
  budget,
  onViewAllExpenses,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);

  // Calculate last 7 days metrics
  const last7DaysData = useMemo(() => {
    const days: { dateStr: string; label: string; fullDate: string; amount: number; count: number }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const fullDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Sum expenses for this date
      const dayExpenses = expenses.filter(e => e.date === dateStr);
      const sum = dayExpenses.reduce((acc, curr) => acc + curr.amount, 0);

      days.push({
        dateStr,
        label: i === 0 ? 'Today' : dayLabel,
        fullDate,
        amount: sum,
        count: dayExpenses.length,
      });
    }

    return days;
  }, [expenses]);

  const maxSpend = useMemo(() => {
    const amounts = last7DaysData.map(d => d.amount);
    return Math.max(...amounts, 500); // minimum scale of 500
  }, [last7DaysData]);

  const total7Days = useMemo(() => {
    return last7DaysData.reduce((acc, curr) => acc + curr.amount, 0);
  }, [last7DaysData]);

  const avgDaily = total7Days / 7;

  const activeDay = activeDayIndex !== null ? last7DaysData[activeDayIndex] : null;

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-[0_4px_16px_rgba(15,23,42,0.04)] border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 text-teal-700">
              <BarChart3 size={14} />
            </span>
            <h3 className="font-display text-sm font-bold text-slate-800">Weekly Activity</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {formatCurrency(total7Days, budget.currencySymbol)} spent past 7 days
          </p>
        </div>

        {onViewAllExpenses && (
          <button
            onClick={onViewAllExpenses}
            className="group flex items-center space-x-1 text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
          >
            <span>All history</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Interactive Tooltip Card */}
      <div className="h-8 mb-2 flex items-center justify-between px-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
        {activeDay ? (
          <>
            <span className="font-medium text-slate-600">
              {activeDay.fullDate} ({activeDay.label}):
            </span>
            <span className="font-bold text-teal-800 tabular-nums">
              {formatCurrency(activeDay.amount, budget.currencySymbol)} ({activeDay.count} items)
            </span>
          </>
        ) : (
          <>
            <span className="text-slate-500 flex items-center space-x-1">
              <TrendingUp size={12} className="text-teal-600 mr-1" />
              <span>7-Day Daily Avg:</span>
            </span>
            <span className="font-bold text-slate-700 tabular-nums">
              {formatCurrency(avgDaily, budget.currencySymbol)}/day
            </span>
          </>
        )}
      </div>

      {/* Bar Chart Container */}
      <div className="pt-2">
        <div className="flex items-end justify-between gap-2 h-36 px-1">
          {last7DaysData.map((day, idx) => {
            const heightPercent = maxSpend > 0 ? (day.amount / maxSpend) * 100 : 0;
            const isToday = idx === 6;
            const isSelected = activeDayIndex === idx;
            const hasSpending = day.amount > 0;

            return (
              <div
                key={day.dateStr}
                className="group relative flex-1 flex flex-col items-center h-full justify-end cursor-pointer"
                onMouseEnter={() => setActiveDayIndex(idx)}
                onMouseLeave={() => setActiveDayIndex(null)}
                onClick={() => setActiveDayIndex(idx === activeDayIndex ? null : idx)}
              >
                {/* Visual bar */}
                <div className="w-full flex justify-center items-end h-[105px]">
                  <div
                    className={`w-full max-w-[28px] rounded-t-xl transition-all duration-300 relative ${
                      isSelected
                        ? 'bg-[#00685f] shadow-md shadow-teal-700/30 ring-2 ring-teal-500/40'
                        : isToday
                        ? 'bg-[#0D9488]'
                        : hasSpending
                        ? 'bg-slate-200 group-hover:bg-teal-400'
                        : 'bg-slate-100'
                    }`}
                    style={{
                      height: `${Math.max(6, heightPercent)}%`,
                    }}
                  >
                    {/* Amount tooltip above bar when active or hovered */}
                    {isSelected && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white whitespace-nowrap shadow-md z-20">
                        {formatCurrency(day.amount, budget.currencySymbol)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Day label */}
                <div className="mt-2 text-center">
                  <span
                    className={`text-[11px] block transition-colors ${
                      isSelected
                        ? 'font-bold text-teal-800'
                        : isToday
                        ? 'font-bold text-slate-800'
                        : 'font-medium text-slate-400 group-hover:text-slate-700'
                    }`}
                  >
                    {day.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
