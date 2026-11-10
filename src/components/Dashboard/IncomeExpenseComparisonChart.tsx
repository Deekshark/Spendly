import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { Expense, Income, UserBudget } from '../../types/expense';
import { formatCurrency } from '../../utils/formatters';

interface IncomeExpenseComparisonChartProps {
  expenses: Expense[];
  incomes: Income[];
  budget: UserBudget;
  onViewStats?: () => void;
}

export const IncomeExpenseComparisonChart: React.FC<IncomeExpenseComparisonChartProps> = ({
  expenses,
  incomes,
  budget,
  onViewStats,
}) => {
  const [activeMonthIndex, setActiveMonthIndex] = useState<number | null>(null);

  // Calculate comparison for past 5 months
  const monthlyData = useMemo(() => {
    const list: {
      label: string;
      yearMonth: string;
      income: number;
      expense: number;
      net: number;
    }[] = [];

    const now = new Date();

    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short' });

      const incomeSum = incomes
        .filter(inc => inc.date.startsWith(yearMonth))
        .reduce((acc, curr) => acc + curr.amount, 0);

      const expenseSum = expenses
        .filter(exp => exp.date.startsWith(yearMonth))
        .reduce((acc, curr) => acc + curr.amount, 0);

      list.push({
        label,
        yearMonth,
        income: incomeSum,
        expense: expenseSum,
        net: incomeSum - expenseSum,
      });
    }

    return list;
  }, [expenses, incomes]);

  const maxVal = useMemo(() => {
    let m = 1000;
    monthlyData.forEach(item => {
      if (item.income > m) m = item.income;
      if (item.expense > m) m = item.expense;
    });
    return m;
  }, [monthlyData]);

  const activeData = activeMonthIndex !== null ? monthlyData[activeMonthIndex] : null;

  // Current month net calculation
  const currentMonthData = monthlyData[monthlyData.length - 1];

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-[0_4px_16px_rgba(15,23,42,0.04)] border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <ArrowLeftRight size={14} />
            </span>
            <h3 className="font-display text-sm font-bold text-slate-800">
              Income vs Expense
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monthly cash flow & net savings comparison
          </p>
        </div>

        {onViewStats && (
          <button
            onClick={onViewStats}
            className="flex items-center space-x-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <span>Full Stats</span>
            <ChevronRight size={13} />
          </button>
        )}
      </div>

      {/* Legend & Tooltip Header */}
      <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-3">
        {activeData ? (
          <div className="flex items-center justify-between w-full">
            <span className="font-bold text-slate-700">{activeData.label}:</span>
            <div className="flex items-center space-x-3">
              <span className="text-emerald-700 font-bold tabular-nums">
                +{formatCurrency(activeData.income, budget.currencySymbol)}
              </span>
              <span className="text-slate-400">vs</span>
              <span className="text-rose-600 font-bold tabular-nums">
                -{formatCurrency(activeData.expense, budget.currencySymbol)}
              </span>
              <span
                className={`font-semibold tabular-nums text-[11px] ${
                  activeData.net >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                (Net {activeData.net >= 0 ? '+' : ''}
                {formatCurrency(activeData.net, budget.currencySymbol)})
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-slate-600 font-medium">Income</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                <span className="text-slate-600 font-medium">Expenses</span>
              </div>
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              {currentMonthData?.net >= 0 ? (
                <span className="text-emerald-700 font-bold">
                  +{formatCurrency(currentMonthData.net, budget.currencySymbol)} saved this month
                </span>
              ) : (
                <span className="text-rose-600 font-bold">
                  Deficit: {formatCurrency(currentMonthData?.net || 0, budget.currencySymbol)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Side-by-Side Dual Bar Chart */}
      <div className="pt-2">
        <div className="flex items-end justify-between gap-3 h-36 px-1">
          {monthlyData.map((m, idx) => {
            const incomeHeight = maxVal > 0 ? (m.income / maxVal) * 100 : 0;
            const expenseHeight = maxVal > 0 ? (m.expense / maxVal) * 100 : 0;
            const isHovered = activeMonthIndex === idx;

            return (
              <div
                key={m.yearMonth}
                className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                onMouseEnter={() => setActiveMonthIndex(idx)}
                onMouseLeave={() => setActiveMonthIndex(null)}
                onClick={() => setActiveMonthIndex(idx === activeMonthIndex ? null : idx)}
              >
                <div className="w-full flex justify-center items-end gap-1 h-[105px]">
                  {/* Income Bar (Emerald Green) */}
                  <div
                    className={`w-3 sm:w-3.5 rounded-t-full transition-all duration-300 ${
                      isHovered
                        ? 'bg-emerald-500 ring-2 ring-emerald-300'
                        : 'bg-emerald-600 group-hover:bg-emerald-500'
                    }`}
                    style={{ height: `${Math.max(6, incomeHeight)}%` }}
                    title={`Income: +${m.income}`}
                  />

                  {/* Expense Bar (Deep Slate Navy / Rose) */}
                  <div
                    className={`w-3 sm:w-3.5 rounded-t-full transition-all duration-300 ${
                      isHovered
                        ? 'bg-slate-700 ring-2 ring-slate-300'
                        : 'bg-slate-800 group-hover:bg-slate-700'
                    }`}
                    style={{ height: `${Math.max(6, expenseHeight)}%` }}
                    title={`Expense: -${m.expense}`}
                  />
                </div>

                <span
                  className={`text-[11px] mt-2 block ${
                    isHovered ? 'font-bold text-slate-900' : 'font-medium text-slate-500'
                  }`}
                >
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
