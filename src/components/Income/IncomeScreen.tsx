import React, { useState, useMemo } from 'react';
import {
  ArrowDownLeft,
  PlusCircle,
  Search,
  X,
  TrendingUp,
  Calendar,
  Wallet,
  Coins,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Income, IncomeCategoryId, UserBudget } from '../../types/expense';
import { INCOME_CATEGORIES, INCOME_CATEGORY_LIST } from '../../data/categories';
import { IncomeItem } from './IncomeItem';
import { IncomeCategoryIcon } from '../Common/CategoryIcon';
import { formatCurrency, groupIncomesByDay } from '../../utils/formatters';

interface IncomeScreenProps {
  incomes: Income[];
  budget: UserBudget;
  onAddIncome: (prefillCategory?: IncomeCategoryId) => void;
  onSelectIncome: (income: Income) => void;
}

export const IncomeScreen: React.FC<IncomeScreenProps> = ({
  incomes,
  budget,
  onAddIncome,
  onSelectIncome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IncomeCategoryId | 'all'>('all');

  // Key metrics calculation
  const now = new Date();
  const currentMonthKey = now.toISOString().slice(0, 7); // YYYY-MM
  const todayStr = now.toISOString().split('T')[0];

  // Total income this month
  const monthlyIncome = useMemo(() => {
    return incomes
      .filter(inc => inc.date.startsWith(currentMonthKey))
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [incomes, currentMonthKey]);

  // Income received today
  const todayIncome = useMemo(() => {
    return incomes
      .filter(inc => inc.date === todayStr)
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [incomes, todayStr]);

  // All time total income
  const totalAllTimeIncome = useMemo(() => {
    return incomes.reduce((acc, curr) => acc + curr.amount, 0);
  }, [incomes]);

  // Income by category breakdown
  const categoryBreakdown = useMemo(() => {
    const map = new Map<IncomeCategoryId, number>();

    // calculate for this month or all time if this month is 0
    const relevantIncomes = incomes.filter(inc => inc.date.startsWith(currentMonthKey));
    const targetSet = relevantIncomes.length > 0 ? relevantIncomes : incomes;
    const baseTotal = targetSet.reduce((acc, curr) => acc + curr.amount, 0);

    targetSet.forEach(inc => {
      map.set(inc.category, (map.get(inc.category) || 0) + inc.amount);
    });

    const list: {
      category: IncomeCategoryId;
      amount: number;
      percentage: number;
    }[] = [];

    map.forEach((amount, catId) => {
      const percentage = baseTotal > 0 ? (amount / baseTotal) * 100 : 0;
      list.push({ category: catId, amount, percentage });
    });

    return list.sort((a, b) => b.amount - a.amount);
  }, [incomes, currentMonthKey]);

  // Filtered list
  const filteredIncomes = useMemo(() => {
    return incomes
      .filter(inc => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchNote = (inc.note || '').toLowerCase().includes(q);
          const matchCat = inc.category.toLowerCase().includes(q);
          const matchMethod = inc.paymentMethod.toLowerCase().includes(q);
          const matchAmount = inc.amount.toString().includes(q);
          if (!matchNote && !matchCat && !matchMethod && !matchAmount) return false;
        }

        if (selectedCategory !== 'all' && inc.category !== selectedCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        return dateCompare !== 0 ? dateCompare : b.createdAt - a.createdAt;
      });
  }, [incomes, searchQuery, selectedCategory]);

  const groupedDays = useMemo(() => {
    return groupIncomesByDay(filteredIncomes);
  }, [filteredIncomes]);

  return (
    <div className="space-y-4 sm:space-y-5 pb-16 animate-fade-in">
      {/* Income Dashboard Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 p-5 sm:p-6 text-white shadow-xl shadow-emerald-950/20 border border-emerald-500/30">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-teal-300/20 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
              <TrendingUp size={15} className="text-emerald-200" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
              Total Inflow • This Month
            </span>
          </div>

          <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-100 border border-white/10">
            {incomes.length} Deposits
          </span>
        </div>

        {/* Hero Month Income */}
        <div className="relative z-10 mb-4">
          <div className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-white">
            +{formatCurrency(monthlyIncome, budget.currencySymbol)}
          </div>
          <p className="text-xs text-emerald-100/80 mt-1">
            Incoming revenue, payouts, and earnings for this calendar month
          </p>
        </div>

        {/* Sub-Metrics: Today & All-Time */}
        <div className="relative z-10 grid grid-cols-2 gap-2.5 pt-3 border-t border-white/10">
          <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm border border-white/5">
            <div className="flex items-center justify-between text-emerald-100/80 mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider">Received Today</span>
              <Calendar size={13} className="text-emerald-300" />
            </div>
            <div className="font-display text-lg sm:text-xl font-bold tracking-tight tabular-nums text-white">
              +{formatCurrency(todayIncome, budget.currencySymbol)}
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm border border-white/5">
            <div className="flex items-center justify-between text-emerald-100/80 mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider">All-Time Inflow</span>
              <Wallet size={13} className="text-emerald-300" />
            </div>
            <div className="font-display text-lg sm:text-xl font-bold tracking-tight tabular-nums text-white">
              +{formatCurrency(totalAllTimeIncome, budget.currencySymbol)}
            </div>
          </div>
        </div>
      </div>

      {/* Requirement 2: Prominent "Add Income" Button */}
      <button
        onClick={() => onAddIncome()}
        className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-display text-sm font-bold shadow-lg shadow-emerald-900/20 transition-all border border-emerald-500"
      >
        <PlusCircle size={18} />
        <span>Add Income Transaction</span>
      </button>

      {/* Income By Category Breakdown Section */}
      <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-[0_4px_16px_rgba(15,23,42,0.04)] border border-slate-100">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-1.5">
            <Coins size={16} className="text-emerald-600" />
            <h3 className="font-display text-sm font-bold text-slate-800">Income by Category</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Distribution</span>
        </div>

        {categoryBreakdown.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No income categorized yet.
          </div>
        ) : (
          <div className="space-y-3">
            {categoryBreakdown.map(item => {
              const cat = INCOME_CATEGORIES[item.category] || INCOME_CATEGORIES.other;
              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <IncomeCategoryIcon category={item.category} size="sm" />
                      <span className="font-semibold text-slate-800">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700 tabular-nums">
                        +{formatCurrency(item.amount, budget.currencySymbol)}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1.5">
                        ({item.percentage.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-emerald-600"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-2">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search income note, source, amount..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-white border border-slate-200/90 pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            All Sources
          </button>
          {INCOME_CATEGORY_LIST.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 flex items-center space-x-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Income Transactions List */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2">
          <h3 className="font-display text-sm font-bold text-slate-800">
            Income Transactions ({filteredIncomes.length})
          </h3>
          {selectedCategory !== 'all' || searchQuery ? (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Reset filters
            </button>
          ) : null}
        </div>

        {filteredIncomes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center my-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-3">
              <Coins size={24} />
            </div>
            <h4 className="font-display text-sm font-semibold text-slate-800">No income records found</h4>
            <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
              Log salary, freelance milestones, client payments, or dividends to track your total cash flow.
            </p>
            <button
              onClick={() => onAddIncome()}
              className="mt-4 inline-flex items-center space-x-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold shadow-sm transition-all"
            >
              <PlusCircle size={14} />
              <span>Record First Income</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedDays.map(group => (
              <div key={group.date} className="space-y-2">
                <div className="flex items-center justify-between px-2 pt-1">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-slate-500">
                    {group.label} ({group.date})
                  </span>
                  <span className="text-xs font-bold text-emerald-600 tabular-nums">
                    +{formatCurrency(group.total, budget.currencySymbol)}
                  </span>
                </div>

                <div className="space-y-2">
                  {group.items.map(income => (
                    <IncomeItem
                      key={income.id}
                      income={income}
                      currencySymbol={budget.currencySymbol}
                      onClick={onSelectIncome}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
