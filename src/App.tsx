import React, { useState, useEffect, useMemo } from 'react';
import { Expense, Income, UserBudget, CategoryId, IncomeCategoryId } from './types/expense';
import {
  loadStoredExpenses,
  saveStoredExpenses,
  loadStoredIncomes,
  saveStoredIncomes,
  loadStoredBudget,
  saveStoredBudget,
  resetAllData,
  clearAllData,
} from './utils/storage';
import { Header } from './components/Navigation/Header';
import { BottomNav, TabId } from './components/Navigation/BottomNav';
import { DashboardScreen } from './components/Dashboard/DashboardScreen';
import { ExpenseHistoryScreen } from './components/Expenses/ExpenseHistoryScreen';
import { IncomeScreen } from './components/Income/IncomeScreen';
import { StatisticsScreen } from './components/Statistics/StatisticsScreen';
import { AddEditExpenseModal } from './components/Modals/AddEditExpenseModal';
import { ExpenseDetailModal } from './components/Modals/ExpenseDetailModal';
import { AddEditIncomeModal } from './components/Modals/AddEditIncomeModal';
import { IncomeDetailModal } from './components/Modals/IncomeDetailModal';
import { QuickAddChoiceModal } from './components/Modals/QuickAddChoiceModal';
import { BudgetModal } from './components/Modals/BudgetModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { Toast } from './components/Common/Toast';

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadStoredExpenses());
  const [incomes, setIncomes] = useState<Income[]>(() => loadStoredIncomes());
  const [budget, setBudget] = useState<UserBudget>(() => loadStoredBudget());
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  // Modals state
  const [isAddEditExpenseModalOpen, setIsAddEditExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedExpenseForDetail, setSelectedExpenseForDetail] = useState<Expense | null>(null);

  const [isAddEditIncomeModalOpen, setIsAddEditIncomeModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [selectedIncomeForDetail, setSelectedIncomeForDetail] = useState<Income | null>(null);

  const [isQuickAddChoiceOpen, setIsQuickAddChoiceOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Desktop Android frame toggle
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  // Persist expenses, incomes, and budget to localStorage
  useEffect(() => {
    saveStoredExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    saveStoredIncomes(incomes);
  }, [incomes]);

  useEffect(() => {
    saveStoredBudget(budget);
  }, [budget]);

  // Current month key YYYY-MM
  const currentMonthKey = useMemo(() => {
    return new Date().toISOString().slice(0, 7);
  }, []);

  // Automatic calculation of totals
  // Requirement 5: Total Balance = Total Income - Total Expenses
  const totalIncomeAllTime = useMemo(() => {
    return incomes.reduce((acc, curr) => acc + curr.amount, 0);
  }, [incomes]);

  const totalExpensesAllTime = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const totalBalance = useMemo(() => {
    return totalIncomeAllTime - totalExpensesAllTime;
  }, [totalIncomeAllTime, totalExpensesAllTime]);

  // Monthly metrics
  const monthlySpending = useMemo(() => {
    return expenses
      .filter(exp => exp.date.startsWith(currentMonthKey))
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses, currentMonthKey]);

  const monthlyIncome = useMemo(() => {
    return incomes
      .filter(inc => inc.date.startsWith(currentMonthKey))
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [incomes, currentMonthKey]);

  // Expense Handlers
  const handleOpenAddExpense = (prefillCategory?: CategoryId) => {
    if (prefillCategory) {
      setEditingExpense({
        id: '',
        amount: 0,
        category: prefillCategory,
        date: new Date().toISOString().split('T')[0],
        time: '',
        note: '',
        paymentMethod: 'UPI',
        createdAt: Date.now(),
      });
    } else {
      setEditingExpense(null);
    }
    setIsAddEditExpenseModalOpen(true);
  };

  const handleOpenEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsAddEditExpenseModalOpen(true);
  };

  const handleSaveExpense = (
    expenseData: Omit<Expense, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      setExpenses(prev =>
        prev.map(item =>
          item.id === existingId
            ? { ...item, ...expenseData }
            : item
        )
      );
      setToastMessage('Expense updated successfully');
    } else {
      const newExpense: Expense = {
        ...expenseData,
        id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        createdAt: Date.now(),
      };
      setExpenses(prev => [newExpense, ...prev]);
      setToastMessage('Expense recorded');
    }
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(item => item.id !== expenseId));
    setToastMessage('Expense deleted');
  };

  // Income Handlers
  const handleOpenAddIncome = (prefillCategory?: IncomeCategoryId) => {
    if (prefillCategory) {
      setEditingIncome({
        id: '',
        amount: 0,
        category: prefillCategory,
        date: new Date().toISOString().split('T')[0],
        time: '',
        note: '',
        paymentMethod: 'Bank Transfer',
        createdAt: Date.now(),
      });
    } else {
      setEditingIncome(null);
    }
    setIsAddEditIncomeModalOpen(true);
  };

  const handleOpenEditIncome = (income: Income) => {
    setEditingIncome(income);
    setIsAddEditIncomeModalOpen(true);
  };

  const handleSaveIncome = (
    incomeData: Omit<Income, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      setIncomes(prev =>
        prev.map(item =>
          item.id === existingId
            ? { ...item, ...incomeData }
            : item
        )
      );
      setToastMessage('Income updated successfully');
    } else {
      const newIncome: Income = {
        ...incomeData,
        id: `inc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        createdAt: Date.now(),
      };
      setIncomes(prev => [newIncome, ...prev]);
      setToastMessage('Income recorded');
    }
  };

  const handleDeleteIncome = (incomeId: string) => {
    setIncomes(prev => prev.filter(item => item.id !== incomeId));
    setToastMessage('Income record deleted');
  };

  const handleSaveBudget = (newBudget: UserBudget) => {
    setBudget(newBudget);
    setToastMessage('Budget preferences updated');
  };

  const handleResetSampleData = () => {
    const reset = resetAllData();
    setExpenses(reset.expenses);
    setIncomes(reset.incomes);
    setBudget(reset.budget);
  };

  const handleClearAll = () => {
    const cleared = clearAllData();
    setExpenses(cleared.expenses);
    setIncomes(cleared.incomes);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex justify-center selection:bg-teal-100 selection:text-teal-900">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Main container: simulated mobile frame on desktop, fluid edge-to-edge on mobile */}
      <div
        className={`w-full min-h-screen transition-all duration-300 flex flex-col ${
          isMobileFrame
            ? 'max-w-[480px] bg-[#F8FAFC] shadow-2xl shadow-slate-900/10 sm:my-4 sm:rounded-[36px] sm:border-[6px] sm:border-slate-800/80 sm:overflow-hidden relative'
            : 'max-w-2xl bg-[#F8FAFC] shadow-sm'
        }`}
      >
        {/* Android simulated status bar when frame mode is active on larger screens */}
        {isMobileFrame && (
          <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-slate-700 bg-[#F8FAFC]">
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px]">5G</span>
              <div className="w-5 h-2.5 rounded-sm border border-slate-700 flex items-center p-0.5">
                <div className="w-3 h-full bg-slate-700 rounded-2xs" />
              </div>
            </div>
          </div>
        )}

        {/* Top Header */}
        <Header
          budget={budget}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenBudget={() => setIsBudgetModalOpen(true)}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(prev => !prev)}
        />

        {/* Main Content Area based on Active Tab */}
        <main className="flex-1 px-4 py-4 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardScreen
              expenses={expenses}
              incomes={incomes}
              budget={budget}
              totalBalance={totalBalance}
              monthlyIncome={monthlyIncome}
              monthlySpending={monthlySpending}
              onOpenAddExpense={handleOpenAddExpense}
              onOpenAddIncome={handleOpenAddIncome}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              onSelectExpense={exp => setSelectedExpenseForDetail(exp)}
              onViewAllExpenses={() => setActiveTab('expenses')}
              onNavigateToIncome={() => setActiveTab('income')}
              onViewStats={() => setActiveTab('statistics')}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpenseHistoryScreen
              expenses={expenses}
              currencySymbol={budget.currencySymbol}
              onSelectExpense={exp => setSelectedExpenseForDetail(exp)}
              onAddExpense={() => handleOpenAddExpense()}
            />
          )}

          {activeTab === 'income' && (
            <IncomeScreen
              incomes={incomes}
              budget={budget}
              onAddIncome={handleOpenAddIncome}
              onSelectIncome={inc => setSelectedIncomeForDetail(inc)}
            />
          )}

          {activeTab === 'statistics' && (
            <StatisticsScreen
              expenses={expenses}
              incomes={incomes}
              budget={budget}
            />
          )}
        </main>

        {/* Bottom Navigation with Home, Expenses, (+), Income, Stats */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={tab => setActiveTab(tab)}
          onOpenAddChoice={() => setIsQuickAddChoiceOpen(true)}
        />

        {/* Quick Add Choice Modal (Expense or Income) */}
        <QuickAddChoiceModal
          isOpen={isQuickAddChoiceOpen}
          onClose={() => setIsQuickAddChoiceOpen(false)}
          onSelectExpense={() => handleOpenAddExpense()}
          onSelectIncome={() => handleOpenAddIncome()}
        />

        {/* Add / Edit Expense Modal */}
        <AddEditExpenseModal
          isOpen={isAddEditExpenseModalOpen}
          onClose={() => {
            setIsAddEditExpenseModalOpen(false);
            setEditingExpense(null);
          }}
          onSave={handleSaveExpense}
          initialExpense={editingExpense}
          currencySymbol={budget.currencySymbol}
        />

        {/* Expense Detail Receipt Modal */}
        <ExpenseDetailModal
          expense={selectedExpenseForDetail}
          currencySymbol={budget.currencySymbol}
          onClose={() => setSelectedExpenseForDetail(null)}
          onEdit={exp => handleOpenEditExpense(exp)}
          onDelete={handleDeleteExpense}
        />

        {/* Add / Edit Income Modal */}
        <AddEditIncomeModal
          isOpen={isAddEditIncomeModalOpen}
          onClose={() => {
            setIsAddEditIncomeModalOpen(false);
            setEditingIncome(null);
          }}
          onSave={handleSaveIncome}
          initialIncome={editingIncome}
          currencySymbol={budget.currencySymbol}
        />

        {/* Income Detail Receipt Modal */}
        <IncomeDetailModal
          income={selectedIncomeForDetail}
          currencySymbol={budget.currencySymbol}
          onClose={() => setSelectedIncomeForDetail(null)}
          onEdit={inc => handleOpenEditIncome(inc)}
          onDelete={handleDeleteIncome}
        />

        {/* Budget & Currency Modal */}
        <BudgetModal
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          currentBudget={budget}
          onSaveBudget={handleSaveBudget}
        />

        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          expenses={expenses}
          incomes={incomes}
          budget={budget}
          onResetSampleData={handleResetSampleData}
          onClearAll={handleClearAll}
          onShowToast={msg => setToastMessage(msg)}
        />
      </div>
    </div>
  );
}
