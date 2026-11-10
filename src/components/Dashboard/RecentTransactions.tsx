import React from 'react';
import { ArrowRight, PlusCircle, ReceiptText } from 'lucide-react';
import { Expense } from '../../types/expense';
import { ExpenseItem } from '../Expenses/ExpenseItem';

interface RecentTransactionsProps {
  expenses: Expense[];
  currencySymbol: string;
  onSelectExpense: (expense: Expense) => void;
  onViewAll: () => void;
  onAddExpense: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  expenses,
  currencySymbol,
  onSelectExpense,
  onViewAll,
  onAddExpense,
}) => {
  const recent = expenses.slice(0, 5);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-1.5">
          <ReceiptText size={16} className="text-teal-700" />
          <h3 className="font-display text-base font-bold text-slate-800">Recent Expenses</h3>
        </div>
        {expenses.length > 0 && (
          <button
            onClick={onViewAll}
            className="flex items-center space-x-1 text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
          >
            <span>View All ({expenses.length})</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 mb-3">
            <ReceiptText size={24} />
          </div>
          <h4 className="font-display text-sm font-semibold text-slate-800">No expenses recorded yet</h4>
          <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
            Start tracking your daily purchases, bills, and spending to see your automated analytics.
          </p>
          <button
            onClick={onAddExpense}
            className="mt-4 inline-flex items-center space-x-1.5 rounded-full bg-[#00685f] hover:bg-[#005049] active:scale-95 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all"
          >
            <PlusCircle size={15} />
            <span>Add First Expense</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map(exp => (
            <ExpenseItem
              key={exp.id}
              expense={exp}
              currencySymbol={currencySymbol}
              onClick={onSelectExpense}
              showDate={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
