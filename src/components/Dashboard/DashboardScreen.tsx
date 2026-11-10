import React from 'react';
import { Plus, ArrowDownLeft, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Expense, Income, UserBudget, CategoryId } from '../../types/expense';
import { BalanceCard } from './BalanceCard';
import { IncomeExpenseComparisonChart } from './IncomeExpenseComparisonChart';
import { BudgetProgressBar } from './BudgetProgressBar';
import { SpendingChart } from './SpendingChart';
import { RecentTransactions } from './RecentTransactions';
import { CATEGORIES } from '../../data/categories';
import { CategoryIcon } from '../Common/CategoryIcon';

interface DashboardScreenProps {
  expenses: Expense[];
  incomes: Income[];
  budget: UserBudget;
  totalBalance: number;
  monthlyIncome: number;
  monthlySpending: number;
  onOpenAddExpense: (prefillCategory?: CategoryId) => void;
  onOpenAddIncome: () => void;
  onOpenBudgetModal: () => void;
  onSelectExpense: (expense: Expense) => void;
  onViewAllExpenses: () => void;
  onNavigateToIncome: () => void;
  onViewStats: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  expenses,
  incomes,
  budget,
  totalBalance,
  monthlyIncome,
  monthlySpending,
  onOpenAddExpense,
  onOpenAddIncome,
  onOpenBudgetModal,
  onSelectExpense,
  onViewAllExpenses,
  onNavigateToIncome,
  onViewStats,
}) => {
  const quickCategories: CategoryId[] = ['food', 'groceries', 'transport', 'shopping'];

  return (
    <div className="space-y-4 sm:space-y-5 pb-16 animate-fade-in">
      {/* Neo-Banking Balance Card with Total Balance, Monthly Income, Spending & Remaining Budget */}
      <BalanceCard
        totalBalance={totalBalance}
        monthlyIncome={monthlyIncome}
        monthlySpending={monthlySpending}
        budget={budget}
        onOpenBudgetModal={onOpenBudgetModal}
        onNavigateToIncome={onNavigateToIncome}
      />

      {/* Quick Inflow & Outflow Action Bar */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onOpenAddIncome}
          className="flex items-center justify-center space-x-2 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 active:scale-95 transition-all border border-emerald-200/90 text-emerald-800 font-bold text-xs shadow-2xs"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
            <ArrowDownLeft size={14} />
          </div>
          <span>+ Add Income</span>
        </button>

        <button
          onClick={() => onOpenAddExpense()}
          className="flex items-center justify-center space-x-2 p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 transition-all text-white font-bold text-xs shadow-sm"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white">
            <Plus size={14} />
          </div>
          <span>- Add Expense</span>
        </button>
      </div>

      {/* Requirement 5: Income vs Expense comparison chart */}
      <IncomeExpenseComparisonChart
        expenses={expenses}
        incomes={incomes}
        budget={budget}
        onViewStats={onViewStats}
      />

      {/* Real-time Budget Progress Bar */}
      <BudgetProgressBar
        monthlySpending={monthlySpending}
        budget={budget}
      />

      {/* 7-Day Spending Activity Chart */}
      <SpendingChart
        expenses={expenses}
        budget={budget}
        onViewAllExpenses={onViewAllExpenses}
      />

      {/* Quick Category Record Shortcuts */}
      <div className="rounded-2xl bg-white p-3.5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] border border-slate-100">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Quick Expense
          </span>
          <span className="text-[10px] text-teal-700 font-medium">1-tap log</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {quickCategories.map(catId => {
            const cat = CATEGORIES[catId];
            return (
              <button
                key={catId}
                onClick={() => onOpenAddExpense(catId)}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 active:scale-95 transition-all border border-slate-100"
              >
                <CategoryIcon category={catId} size="sm" />
                <span className="text-[11px] font-semibold text-slate-700 mt-1 truncate max-w-full">
                  {cat.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Ledger Transactions */}
      <RecentTransactions
        expenses={expenses}
        currencySymbol={budget.currencySymbol}
        onSelectExpense={onSelectExpense}
        onViewAll={onViewAllExpenses}
        onAddExpense={() => onOpenAddExpense()}
      />
    </div>
  );
};
