import React from 'react';
import { ArrowUpRight, ArrowDownRight, ArrowDownLeft, SlidersHorizontal, ShieldCheck, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { UserBudget } from '../../types/expense';

interface BalanceCardProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlySpending: number;
  budget: UserBudget;
  onOpenBudgetModal: () => void;
  onNavigateToIncome?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  totalBalance,
  monthlyIncome,
  monthlySpending,
  budget,
  onOpenBudgetModal,
  onNavigateToIncome,
}) => {
  const remainingBudget = budget.monthlyBudget - monthlySpending;
  const isOverBudget = remainingBudget < 0;
  const netSavingsThisMonth = monthlyIncome - monthlySpending;
  const savingsRate = monthlyIncome > 0 ? Math.max(0, (netSavingsThisMonth / monthlyIncome) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00685f] via-[#00524a] to-[#0F172A] p-5 sm:p-6 text-white shadow-xl shadow-teal-950/25 border border-teal-500/30">
      {/* Background radial glows */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-[#6366F1]/20 blur-3xl" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
            <ShieldCheck size={16} className="text-emerald-200" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-100">
            Total Net Balance
          </span>
        </div>

        <button
          onClick={onOpenBudgetModal}
          className="flex items-center space-x-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 px-3 py-1 text-xs font-medium text-teal-50 transition-all backdrop-blur-md border border-white/10"
          title="Configure Budget & Currency"
        >
          <SlidersHorizontal size={13} />
          <span>Edit Budget</span>
        </button>
      </div>

      {/* Main Calculated Total Balance (Total Income - Total Expenses) */}
      <div className="relative z-10 mb-4">
        <div className="flex items-baseline space-x-2">
          <span className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-white">
            {formatCurrency(totalBalance, budget.currencySymbol)}
          </span>
        </div>
        <div className="mt-1 flex items-center space-x-2 text-xs text-teal-100/90">
          <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-bold text-emerald-200 border border-emerald-400/20">
            {netSavingsThisMonth >= 0 ? '+' : ''}{formatCurrency(netSavingsThisMonth, budget.currencySymbol)} net this month
          </span>
          {monthlyIncome > 0 && (
            <span className="text-teal-200/80">• {savingsRate.toFixed(0)}% saved</span>
          )}
        </div>
      </div>

      {/* 3 Metric Badges: Monthly Income, Monthly Expenses, Remaining Budget */}
      <div className="relative z-10 grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-left">
        {/* Monthly Income */}
        <div
          onClick={onNavigateToIncome}
          className="rounded-2xl bg-white/10 hover:bg-white/15 p-2.5 sm:p-3 backdrop-blur-sm border border-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-emerald-200 mb-1">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">Income</span>
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
              <ArrowDownLeft size={11} />
            </div>
          </div>
          <div className="font-display text-xs sm:text-sm font-bold tracking-tight tabular-nums text-emerald-100 truncate">
            +{formatCurrency(monthlyIncome, budget.currencySymbol)}
          </div>
          <div className="text-[10px] text-teal-200/70 truncate mt-0.5">
            This month
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="rounded-2xl bg-white/10 p-2.5 sm:p-3 backdrop-blur-sm border border-white/5">
          <div className="flex items-center justify-between text-rose-200 mb-1">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">Expenses</span>
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500/20 text-rose-300">
              <ArrowDownRight size={11} />
            </div>
          </div>
          <div className="font-display text-xs sm:text-sm font-bold tracking-tight tabular-nums text-rose-100 truncate">
            -{formatCurrency(monthlySpending, budget.currencySymbol)}
          </div>
          <div className="text-[10px] text-teal-200/70 truncate mt-0.5">
            Spent
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="rounded-2xl bg-white/10 p-2.5 sm:p-3 backdrop-blur-sm border border-white/5">
          <div className="flex items-center justify-between text-teal-200 mb-1">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">Budget Left</span>
            <div
              className={`flex h-4 w-4 items-center justify-center rounded-full ${
                isOverBudget ? 'bg-rose-500/30 text-rose-300' : 'bg-emerald-400/20 text-emerald-200'
              }`}
            >
              {isOverBudget ? <ArrowDownRight size={11} /> : <ArrowUpRight size={11} />}
            </div>
          </div>
          <div
            className={`font-display text-xs sm:text-sm font-bold tracking-tight tabular-nums truncate ${
              isOverBudget ? 'text-rose-200' : 'text-white'
            }`}
          >
            {formatCurrency(remainingBudget, budget.currencySymbol)}
          </div>
          <div className="text-[10px] text-teal-200/70 truncate mt-0.5">
            Cap: {formatCurrency(budget.monthlyBudget, budget.currencySymbol)}
          </div>
        </div>
      </div>
    </div>
  );
};
