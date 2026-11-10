import React, { useState, useMemo } from 'react';
import {
  PieChart as PieChartIcon,
  TrendingUp,
  CreditCard,
  Calendar,
  BarChart2,
  Receipt,
  Coins,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowLeftRight,
  Layers,
} from 'lucide-react';
import { Expense, Income, UserBudget, CategoryId, IncomeCategoryId } from '../../types/expense';
import { CATEGORIES, INCOME_CATEGORIES } from '../../data/categories';
import { CategoryIcon, IncomeCategoryIcon, PaymentMethodIcon } from '../Common/CategoryIcon';
import { formatCurrency } from '../../utils/formatters';

interface StatisticsScreenProps {
  expenses: Expense[];
  incomes: Income[];
  budget: UserBudget;
}

type StatPeriod = 'month' | 'last_month' | 'year' | 'all';
type StatTab = 'overview' | 'income' | 'expenses';

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({
  expenses,
  incomes,
  budget,
}) => {
  const [period, setPeriod] = useState<StatPeriod>('month');
  const [activeTab, setActiveTab] = useState<StatTab>('overview');
  const [activeExpCatIdx, setActiveExpCatIdx] = useState<number | null>(null);
  const [activeIncCatIdx, setActiveIncCatIdx] = useState<number | null>(null);
  const [activeMonthIdx, setActiveMonthIdx] = useState<number | null>(null);

  // Filter records by period
  const { filteredExpenses, filteredIncomes } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const startOfMonth = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const lastMonthStart = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}-01`;
    const lastMonthEnd = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];
    const startOfYear = `${currentYear}-01-01`;

    const filterFn = (item: { date: string }) => {
      if (period === 'month') return item.date >= startOfMonth;
      if (period === 'last_month') return item.date >= lastMonthStart && item.date <= lastMonthEnd;
      if (period === 'year') return item.date >= startOfYear;
      return true;
    };

    return {
      filteredExpenses: expenses.filter(filterFn),
      filteredIncomes: incomes.filter(filterFn),
    };
  }, [expenses, incomes, period]);

  const totalPeriodSpend = useMemo(() => {
    return filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredExpenses]);

  const totalPeriodIncome = useMemo(() => {
    return filteredIncomes.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredIncomes]);

  const netSavings = totalPeriodIncome - totalPeriodSpend;
  const savingsRate = totalPeriodIncome > 0 ? (netSavings / totalPeriodIncome) * 100 : 0;

  // Category breakdown for Expenses
  const expenseCategoryStats = useMemo(() => {
    const map = new Map<CategoryId, { total: number; count: number }>();
    filteredExpenses.forEach(exp => {
      const existing = map.get(exp.category) || { total: 0, count: 0 };
      map.set(exp.category, {
        total: existing.total + exp.amount,
        count: existing.count + 1,
      });
    });

    const list: {
      categoryId: CategoryId;
      total: number;
      count: number;
      percentage: number;
    }[] = [];

    map.forEach((val, catId) => {
      const percentage = totalPeriodSpend > 0 ? (val.total / totalPeriodSpend) * 100 : 0;
      list.push({
        categoryId: catId,
        total: val.total,
        count: val.count,
        percentage,
      });
    });

    return list.sort((a, b) => b.total - a.total);
  }, [filteredExpenses, totalPeriodSpend]);

  // Category breakdown for Incomes
  const incomeCategoryStats = useMemo(() => {
    const map = new Map<IncomeCategoryId, { total: number; count: number }>();
    filteredIncomes.forEach(inc => {
      const existing = map.get(inc.category) || { total: 0, count: 0 };
      map.set(inc.category, {
        total: existing.total + inc.amount,
        count: existing.count + 1,
      });
    });

    const list: {
      categoryId: IncomeCategoryId;
      total: number;
      count: number;
      percentage: number;
    }[] = [];

    map.forEach((val, catId) => {
      const percentage = totalPeriodIncome > 0 ? (val.total / totalPeriodIncome) * 100 : 0;
      list.push({
        categoryId: catId,
        total: val.total,
        count: val.count,
        percentage,
      });
    });

    return list.sort((a, b) => b.total - a.total);
  }, [filteredIncomes, totalPeriodIncome]);

  // 6-Month Comparison Trends
  const monthlyTrends = useMemo(() => {
    const months: {
      label: string;
      yearMonth: string;
      income: number;
      expense: number;
      net: number;
    }[] = [];

    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short' });

      const incomeSum = incomes
        .filter(inc => inc.date.startsWith(yearMonth))
        .reduce((acc, curr) => acc + curr.amount, 0);

      const expenseSum = expenses
        .filter(exp => exp.date.startsWith(yearMonth))
        .reduce((acc, curr) => acc + curr.amount, 0);

      months.push({
        label,
        yearMonth,
        income: incomeSum,
        expense: expenseSum,
        net: incomeSum - expenseSum,
      });
    }

    return months;
  }, [expenses, incomes]);

  const maxMonthVal = useMemo(() => {
    let m = 1000;
    monthlyTrends.forEach(item => {
      if (item.income > m) m = item.income;
      if (item.expense > m) m = item.expense;
    });
    return m;
  }, [monthlyTrends]);

  // SVG Donut calculation helper
  const createDonutSlices = (
    items: { categoryId: string; percentage: number }[],
    getColor: (id: string) => string
  ) => {
    let currentCumulativePercent = 0;
    const slices: {
      id: string;
      color: string;
      strokeDasharray: string;
      strokeDashoffset: number;
    }[] = [];
    const circumference = 2 * Math.PI * 40;

    items.forEach(item => {
      const color = getColor(item.categoryId);
      const percent = item.percentage / 100;
      const strokeLength = percent * circumference;
      const offset = -(currentCumulativePercent * circumference);

      slices.push({
        id: item.categoryId,
        color,
        strokeDasharray: `${strokeLength} ${circumference - strokeLength}`,
        strokeDashoffset: offset,
      });

      currentCumulativePercent += percent;
    });

    return slices;
  };

  const expDonutSlices = useMemo(() => {
    return createDonutSlices(expenseCategoryStats, id => CATEGORIES[id as CategoryId]?.color || '#94a3b8');
  }, [expenseCategoryStats]);

  const incDonutSlices = useMemo(() => {
    return createDonutSlices(incomeCategoryStats, id => INCOME_CATEGORIES[id as IncomeCategoryId]?.color || '#059669');
  }, [incomeCategoryStats]);

  const activeExpCat = activeExpCatIdx !== null ? expenseCategoryStats[activeExpCatIdx] : null;
  const activeIncCat = activeIncCatIdx !== null ? incomeCategoryStats[activeIncCatIdx] : null;
  const activeMonth = activeMonthIdx !== null ? monthlyTrends[activeMonthIdx] : null;

  return (
    <div className="space-y-4 sm:space-y-5 pb-16 animate-fade-in">
      {/* Period Filter Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-200/60">
        {[
          { id: 'month' as StatPeriod, label: 'This Month' },
          { id: 'last_month' as StatPeriod, label: 'Last Month' },
          { id: 'year' as StatPeriod, label: 'This Year' },
          { id: 'all' as StatPeriod, label: 'All Time' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setPeriod(tab.id)}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              period === tab.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-Tab Navigation: Overview (Cash Flow) | Income | Expenses */}
      <div className="flex items-center space-x-1 p-1 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'overview'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cash Flow & Trends
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'income'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Income Breakdown
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'expenses'
              ? 'bg-[#00685f] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Expense Breakdown
        </button>
      </div>

      {/* OVERVIEW TAB: Cash Flow, Income vs Expense, Savings */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-fade-in">
          {/* Cash Flow Summary Card */}
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(15,23,42,0.04)] border border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Net Savings Balance
            </span>
            <div className="flex items-baseline space-x-2">
              <span
                className={`font-display text-3xl sm:text-4xl font-extrabold tabular-nums ${
                  netSavings >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {netSavings >= 0 ? '+' : ''}{formatCurrency(netSavings, budget.currencySymbol)}
              </span>
            </div>
            <div className="mt-1 flex items-center space-x-2 text-xs text-slate-500">
              <span
                className={`font-semibold px-2 py-0.5 rounded-full ${
                  savingsRate >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {savingsRate.toFixed(1)}% savings rate
              </span>
              <span>•</span>
              <span>Selected period</span>
            </div>

            {/* Split Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
              <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-3">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase block">
                  Total Income
                </span>
                <span className="font-display text-lg font-bold text-emerald-700 tabular-nums mt-0.5 block">
                  +{formatCurrency(totalPeriodIncome, budget.currencySymbol)}
                </span>
                <span className="text-[10px] text-emerald-600">{filteredIncomes.length} deposits</span>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                <span className="text-[11px] font-semibold text-slate-700 uppercase block">
                  Total Expenses
                </span>
                <span className="font-display text-lg font-bold text-slate-900 tabular-nums mt-0.5 block">
                  -{formatCurrency(totalPeriodSpend, budget.currencySymbol)}
                </span>
                <span className="text-[10px] text-slate-500">{filteredExpenses.length} transactions</span>
              </div>
            </div>
          </div>

          {/* Monthly Income vs Expense Comparison Bar Chart */}
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(15,23,42,0.04)] border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                  <ArrowLeftRight size={14} />
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold text-slate-800">
                    Monthly Income vs Expenses
                  </h3>
                  <p className="text-xs text-slate-400">Past 6 months cash flow</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-slate-600 font-medium">Income</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <span className="text-slate-600 font-medium">Expense</span>
                </div>
              </div>
            </div>

            {/* Tooltip Card */}
            <div className="h-8 mb-2 flex items-center justify-between px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              {activeMonth ? (
                <>
                  <span className="font-bold text-slate-700">{activeMonth.label}:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-700 font-bold tabular-nums">
                      +{formatCurrency(activeMonth.income, budget.currencySymbol)}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="text-rose-600 font-bold tabular-nums">
                      -{formatCurrency(activeMonth.expense, budget.currencySymbol)}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="font-semibold text-slate-700 tabular-nums">
                      Net {activeMonth.net >= 0 ? '+' : ''}
                      {formatCurrency(activeMonth.net, budget.currencySymbol)}
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-slate-400">Tap any month bar to inspect cash flow numbers</span>
              )}
            </div>

            {/* Dual Bars */}
            <div className="pt-2">
              <div className="flex items-end justify-between gap-3 h-40 px-1">
                {monthlyTrends.map((m, idx) => {
                  const incHeight = maxMonthVal > 0 ? (m.income / maxMonthVal) * 100 : 0;
                  const expHeight = maxMonthVal > 0 ? (m.expense / maxMonthVal) * 100 : 0;
                  const isHovered = activeMonthIdx === idx;

                  return (
                    <div
                      key={m.yearMonth}
                      className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                      onMouseEnter={() => setActiveMonthIdx(idx)}
                      onMouseLeave={() => setActiveMonthIdx(null)}
                      onClick={() => setActiveMonthIdx(idx === activeMonthIdx ? null : idx)}
                    >
                      <div className="w-full flex justify-center items-end gap-1.5 h-[115px]">
                        <div
                          className={`w-3.5 sm:w-4 rounded-t-full transition-all duration-300 ${
                            isHovered
                              ? 'bg-emerald-500 ring-2 ring-emerald-300'
                              : 'bg-emerald-600 group-hover:bg-emerald-500'
                          }`}
                          style={{ height: `${Math.max(6, incHeight)}%` }}
                        />
                        <div
                          className={`w-3.5 sm:w-4 rounded-t-full transition-all duration-300 ${
                            isHovered
                              ? 'bg-slate-700 ring-2 ring-slate-300'
                              : 'bg-slate-800 group-hover:bg-slate-700'
                          }`}
                          style={{ height: `${Math.max(6, expHeight)}%` }}
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
        </div>
      )}

      {/* INCOME TAB: Category-wise breakdown & trends */}
      {activeTab === 'income' && (
        <div className="space-y-4 animate-fade-in">
          {/* Income Donut Card */}
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(15,23,42,0.04)] border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1.5">
                <Coins size={16} className="text-emerald-600" />
                <h3 className="font-display text-sm font-bold text-slate-800">
                  Income Category Breakdown
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-800">
                {incomeCategoryStats.length} Sources
              </span>
            </div>

            {incomeCategoryStats.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No income recorded for this period.
              </div>
            ) : (
              <div>
                {/* SVG Donut */}
                <div className="relative flex items-center justify-center py-4">
                  <svg className="w-48 h-48 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ECFDF5" strokeWidth="12" />
                    {incDonutSlices.map((slice, idx) => {
                      const isHovered = activeIncCatIdx === idx;
                      return (
                        <circle
                          key={slice.id}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke={slice.color}
                          strokeWidth={isHovered ? '15' : '12'}
                          strokeDasharray={slice.strokeDasharray}
                          strokeDashoffset={slice.strokeDashoffset}
                          className="cursor-pointer transition-all duration-300"
                          onMouseEnter={() => setActiveIncCatIdx(idx)}
                          onMouseLeave={() => setActiveIncCatIdx(null)}
                          onClick={() => setActiveIncCatIdx(idx === activeIncCatIdx ? null : idx)}
                        />
                      );
                    })}
                  </svg>

                  {/* Center Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                    {activeIncCat ? (
                      <>
                        <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[100px]">
                          {INCOME_CATEGORIES[activeIncCat.categoryId]?.name}
                        </span>
                        <span className="font-display text-base font-extrabold text-emerald-700 tabular-nums">
                          {activeIncCat.percentage.toFixed(1)}%
                        </span>
                        <span className="text-[10px] font-medium text-slate-600 tabular-nums">
                          +{formatCurrency(activeIncCat.total, budget.currencySymbol)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] font-medium text-slate-400">Total Inflow</span>
                        <span className="font-display text-base font-extrabold text-emerald-700 tabular-nums">
                          +{formatCurrency(totalPeriodIncome, budget.currencySymbol)}
                        </span>
                        <span className="text-[10px] text-slate-400">Tap slice for details</span>
                      </>
                    )}
                  </div>
                </div>

                {/* List of Income Categories */}
                <div className="mt-4 space-y-2.5">
                  {incomeCategoryStats.map((item, idx) => {
                    const cat = INCOME_CATEGORIES[item.categoryId] || INCOME_CATEGORIES.other;
                    const isSelected = activeIncCatIdx === idx;

                    return (
                      <div
                        key={item.categoryId}
                        onMouseEnter={() => setActiveIncCatIdx(idx)}
                        onMouseLeave={() => setActiveIncCatIdx(null)}
                        onClick={() => setActiveIncCatIdx(idx === activeIncCatIdx ? null : idx)}
                        className={`p-3 rounded-2xl transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-200'
                            : 'bg-white hover:bg-slate-50 border-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center space-x-2.5">
                            <IncomeCategoryIcon category={item.categoryId} size="sm" />
                            <div>
                              <div className="text-xs font-bold text-slate-900">{cat.name}</div>
                              <div className="text-[10px] text-slate-400">{item.count} deposits</div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xs font-display font-bold text-emerald-700 tabular-nums">
                              +{formatCurrency(item.total, budget.currencySymbol)}
                            </div>
                            <div className="text-[10px] font-semibold text-slate-500 tabular-nums">
                              {item.percentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: cat.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EXPENSES TAB: Category-wise breakdown */}
      {activeTab === 'expenses' && (
        <div className="space-y-4 animate-fade-in">
          {/* Expense Donut Card */}
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(15,23,42,0.04)] border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1.5">
                <PieChartIcon size={16} className="text-teal-700" />
                <h3 className="font-display text-sm font-bold text-slate-800">
                  Expense Category Breakdown
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {expenseCategoryStats.length} Categories
              </span>
            </div>

            {expenseCategoryStats.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No expenses recorded for this period.
              </div>
            ) : (
              <div>
                <div className="relative flex items-center justify-center py-4">
                  <svg className="w-48 h-48 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1F5F9" strokeWidth="12" />
                    {expDonutSlices.map((slice, idx) => {
                      const isHovered = activeExpCatIdx === idx;
                      return (
                        <circle
                          key={slice.id}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke={slice.color}
                          strokeWidth={isHovered ? '15' : '12'}
                          strokeDasharray={slice.strokeDasharray}
                          strokeDashoffset={slice.strokeDashoffset}
                          className="cursor-pointer transition-all duration-300"
                          onMouseEnter={() => setActiveExpCatIdx(idx)}
                          onMouseLeave={() => setActiveExpCatIdx(null)}
                          onClick={() => setActiveExpCatIdx(idx === activeExpCatIdx ? null : idx)}
                        />
                      );
                    })}
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                    {activeExpCat ? (
                      <>
                        <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[100px]">
                          {CATEGORIES[activeExpCat.categoryId]?.name}
                        </span>
                        <span className="font-display text-base font-extrabold text-slate-900 tabular-nums">
                          {activeExpCat.percentage.toFixed(1)}%
                        </span>
                        <span className="text-[10px] font-medium text-teal-700 tabular-nums">
                          -{formatCurrency(activeExpCat.total, budget.currencySymbol)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] font-medium text-slate-400">Total Spent</span>
                        <span className="font-display text-base font-extrabold text-slate-900 tabular-nums">
                          -{formatCurrency(totalPeriodSpend, budget.currencySymbol)}
                        </span>
                        <span className="text-[10px] text-slate-400">Tap slice for details</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  {expenseCategoryStats.map((item, idx) => {
                    const cat = CATEGORIES[item.categoryId] || CATEGORIES.other;
                    const isSelected = activeExpCatIdx === idx;

                    return (
                      <div
                        key={item.categoryId}
                        onMouseEnter={() => setActiveExpCatIdx(idx)}
                        onMouseLeave={() => setActiveExpCatIdx(null)}
                        onClick={() => setActiveExpCatIdx(idx === activeExpCatIdx ? null : idx)}
                        className={`p-3 rounded-2xl transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-slate-50 border-teal-300 ring-1 ring-teal-200'
                            : 'bg-white hover:bg-slate-50 border-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center space-x-2.5">
                            <CategoryIcon category={item.categoryId} size="sm" />
                            <div>
                              <div className="text-xs font-bold text-slate-900">{cat.name}</div>
                              <div className="text-[10px] text-slate-400">{item.count} items</div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xs font-display font-bold text-slate-900 tabular-nums">
                              -{formatCurrency(item.total, budget.currencySymbol)}
                            </div>
                            <div className="text-[10px] font-semibold text-slate-500 tabular-nums">
                              {item.percentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: cat.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
