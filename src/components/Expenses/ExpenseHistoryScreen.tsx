import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Filter,
  ArrowUpDown,
  Calendar,
  CreditCard,
  ReceiptText,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { Expense, CategoryId, PaymentMethod, TimeRangeFilter, SortOption } from '../../types/expense';
import { CATEGORY_LIST, PAYMENT_METHODS } from '../../data/categories';
import { ExpenseItem } from './ExpenseItem';
import { formatCurrency, groupExpensesByDay } from '../../utils/formatters';

interface ExpenseHistoryScreenProps {
  expenses: Expense[];
  currencySymbol: string;
  onSelectExpense: (expense: Expense) => void;
  onAddExpense: () => void;
}

export const ExpenseHistoryScreen: React.FC<ExpenseHistoryScreenProps> = ({
  expenses,
  currencySymbol,
  onSelectExpense,
  onAddExpense,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeFilter>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Calculate start of this week (Monday)
    const dayOfWeek = now.getDay() || 7;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek + 1);
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

    // Start of this month
    const startOfMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

    // Last month
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthStartStr = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}-01`;
    const lastMonthEndStr = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];

    return expenses.filter(exp => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesNote = (exp.note || '').toLowerCase().includes(query);
        const matchesCat = exp.category.toLowerCase().includes(query);
        const matchesMethod = exp.paymentMethod.toLowerCase().includes(query);
        const matchesAmount = exp.amount.toString().includes(query);
        if (!matchesNote && !matchesCat && !matchesMethod && !matchesAmount) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && exp.category !== selectedCategory) {
        return false;
      }

      // Payment Method filter
      if (selectedPaymentMethod !== 'all' && exp.paymentMethod !== selectedPaymentMethod) {
        return false;
      }

      // Time range filter
      if (selectedTimeRange === 'today' && exp.date !== todayStr) {
        return false;
      }
      if (selectedTimeRange === 'week' && exp.date < startOfWeekStr) {
        return false;
      }
      if (selectedTimeRange === 'month' && exp.date < startOfMonthStr) {
        return false;
      }
      if (selectedTimeRange === 'last_month') {
        if (exp.date < lastMonthStartStr || exp.date > lastMonthEndStr) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') {
        const dateCompare = b.date.localeCompare(a.date);
        return dateCompare !== 0 ? dateCompare : b.createdAt - a.createdAt;
      }
      if (sortBy === 'date_asc') {
        const dateCompare = a.date.localeCompare(b.date);
        return dateCompare !== 0 ? dateCompare : a.createdAt - b.createdAt;
      }
      if (sortBy === 'amount_desc') {
        return b.amount - a.amount;
      }
      if (sortBy === 'amount_asc') {
        return a.amount - b.amount;
      }
      return 0;
    });
  }, [expenses, searchQuery, selectedCategory, selectedTimeRange, selectedPaymentMethod, sortBy]);

  const totalFilteredSum = useMemo(() => {
    return filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredExpenses]);

  const groupedDays = useMemo(() => {
    return groupExpensesByDay(filteredExpenses);
  }, [filteredExpenses]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedTimeRange !== 'all' ||
    selectedPaymentMethod !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTimeRange('all');
    setSelectedPaymentMethod('all');
    setSortBy('date_desc');
  };

  const timePills: { id: TimeRangeFilter; label: string }[] = [
    { id: 'all', label: 'All Time' },
    { id: 'month', label: 'This Month' },
    { id: 'week', label: 'This Week' },
    { id: 'today', label: 'Today' },
    { id: 'last_month', label: 'Last Month' },
  ];

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      {/* Search Input Bar - Spec: rounded-full for search rows */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search note, category, or amount..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full rounded-full bg-white border border-slate-200/90 pl-11 pr-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Time Range Pills (Spec: Active state deep slate navy #0F172A, Inactive soft slate tint) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
        {timePills.map(pill => {
          const isActive = selectedTimeRange === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setSelectedTimeRange(pill.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Category Filter Horizontal Slider */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#00685f] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          All Categories
        </button>

        {CATEGORY_LIST.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 flex items-center space-x-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-teal-50 text-teal-800 border-teal-500 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Sorting Options Bar */}
      <div className="flex items-center justify-between text-xs px-1 text-slate-500">
        <div className="flex items-center space-x-2">
          <span className="font-medium">
            Showing <strong className="text-slate-900 font-bold">{filteredExpenses.length}</strong> items
          </span>
          <span>•</span>
          <span className="font-bold text-teal-800 tabular-nums">
            Total {formatCurrency(totalFilteredSum, currencySymbol)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className="rounded-full bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-600"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Spend</option>
            <option value="amount_asc">Lowest Spend</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="rounded-full bg-slate-200/70 hover:bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Transaction List Grouped by Day */}
      {filteredExpenses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center my-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 mb-3">
            <ReceiptText size={24} />
          </div>
          <h4 className="font-display text-sm font-semibold text-slate-800">No matching expenses</h4>
          <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
            {hasActiveFilters
              ? 'Try adjusting your search criteria or resetting the filters.'
              : 'You have not added any expenses yet.'}
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            {hasActiveFilters ? (
              <button
                onClick={clearAllFilters}
                className="rounded-full bg-slate-900 text-white px-4 py-2 text-xs font-bold"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={onAddExpense}
                className="inline-flex items-center space-x-1.5 rounded-full bg-[#00685f] hover:bg-[#005049] text-white px-4 py-2 text-xs font-semibold shadow-sm"
              >
                <PlusCircle size={14} />
                <span>Add Expense</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedDays.map(group => (
            <div key={group.date} className="space-y-2">
              {/* Sticky day header */}
              <div className="flex items-center justify-between px-2 pt-2">
                <span className="font-display text-xs font-bold uppercase tracking-wider text-slate-500">
                  {group.label} ({group.date})
                </span>
                <span className="text-xs font-bold text-slate-700 tabular-nums">
                  -{formatCurrency(group.total, currencySymbol)}
                </span>
              </div>

              {/* Items in that day */}
              <div className="space-y-2">
                {group.items.map(expense => (
                  <ExpenseItem
                    key={expense.id}
                    expense={expense}
                    currencySymbol={currencySymbol}
                    onClick={onSelectExpense}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
