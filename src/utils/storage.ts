import { Expense, Income, UserBudget } from '../types/expense';
import { INITIAL_SAMPLE_EXPENSES } from '../data/sampleExpenses';
import { INITIAL_SAMPLE_INCOMES } from '../data/sampleIncomes';
import { CATEGORIES, INCOME_CATEGORIES } from '../data/categories';

const EXPENSES_STORAGE_KEY = 'spendly_expenses_v2';
const INCOMES_STORAGE_KEY = 'spendly_incomes_v2';
const BUDGET_STORAGE_KEY = 'spendly_budget_v2';

export const DEFAULT_BUDGET: UserBudget = {
  monthlyBudget: 25000,
  monthlyIncome: 65000,
  currency: 'INR',
  currencySymbol: '₹',
  month: new Date().toISOString().slice(0, 7), // YYYY-MM
};

export const loadStoredExpenses = (): Expense[] => {
  try {
    const raw = localStorage.getItem(EXPENSES_STORAGE_KEY);
    if (!raw) {
      saveStoredExpenses(INITIAL_SAMPLE_EXPENSES);
      return INITIAL_SAMPLE_EXPENSES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_SAMPLE_EXPENSES;
  } catch (err) {
    console.error('Failed to load expenses from localStorage:', err);
    return INITIAL_SAMPLE_EXPENSES;
  }
};

export const saveStoredExpenses = (expenses: Expense[]): void => {
  try {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
  } catch (err) {
    console.error('Failed to save expenses to localStorage:', err);
  }
};

export const loadStoredIncomes = (): Income[] => {
  try {
    const raw = localStorage.getItem(INCOMES_STORAGE_KEY);
    if (!raw) {
      saveStoredIncomes(INITIAL_SAMPLE_INCOMES);
      return INITIAL_SAMPLE_INCOMES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_SAMPLE_INCOMES;
  } catch (err) {
    console.error('Failed to load incomes from localStorage:', err);
    return INITIAL_SAMPLE_INCOMES;
  }
};

export const saveStoredIncomes = (incomes: Income[]): void => {
  try {
    localStorage.setItem(INCOMES_STORAGE_KEY, JSON.stringify(incomes));
  } catch (err) {
    console.error('Failed to save incomes to localStorage:', err);
  }
};

export const loadStoredBudget = (): UserBudget => {
  try {
    const raw = localStorage.getItem(BUDGET_STORAGE_KEY);
    if (!raw) {
      saveStoredBudget(DEFAULT_BUDGET);
      return DEFAULT_BUDGET;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_BUDGET,
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to load budget from localStorage:', err);
    return DEFAULT_BUDGET;
  }
};

export const saveStoredBudget = (budget: UserBudget): void => {
  try {
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budget));
  } catch (err) {
    console.error('Failed to save budget to localStorage:', err);
  }
};

export const resetAllData = (): { expenses: Expense[]; incomes: Income[]; budget: UserBudget } => {
  localStorage.removeItem(EXPENSES_STORAGE_KEY);
  localStorage.removeItem(INCOMES_STORAGE_KEY);
  localStorage.removeItem(BUDGET_STORAGE_KEY);
  saveStoredExpenses(INITIAL_SAMPLE_EXPENSES);
  saveStoredIncomes(INITIAL_SAMPLE_INCOMES);
  saveStoredBudget(DEFAULT_BUDGET);
  return {
    expenses: INITIAL_SAMPLE_EXPENSES,
    incomes: INITIAL_SAMPLE_INCOMES,
    budget: DEFAULT_BUDGET,
  };
};

export const clearAllData = (): { expenses: Expense[]; incomes: Income[]; budget: UserBudget } => {
  const emptyExp: Expense[] = [];
  const emptyInc: Income[] = [];
  saveStoredExpenses(emptyExp);
  saveStoredIncomes(emptyInc);
  return {
    expenses: emptyExp,
    incomes: emptyInc,
    budget: loadStoredBudget(),
  };
};

export const downloadFinancesCSV = (
  expenses: Expense[],
  incomes: Income[],
  currencySymbol: string
) => {
  const headers = ['Type', 'ID', 'Date', 'Time', 'Category', 'Note', 'Payment Method', `Amount (${currencySymbol})`];

  const expRows = expenses.map(exp => [
    'EXPENSE',
    exp.id,
    exp.date,
    exp.time || '',
    CATEGORIES[exp.category]?.name || exp.category,
    `"${(exp.note || '').replace(/"/g, '""')}"`,
    exp.paymentMethod,
    `-${exp.amount.toFixed(2)}`,
  ]);

  const incRows = incomes.map(inc => [
    'INCOME',
    inc.id,
    inc.date,
    inc.time || '',
    INCOME_CATEGORIES[inc.category]?.name || inc.category,
    `"${(inc.note || '').replace(/"/g, '""')}"`,
    inc.paymentMethod,
    `+${inc.amount.toFixed(2)}`,
  ]);

  const allRows = [...expRows, ...incRows].sort((a, b) => b[2].localeCompare(a[2]));

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...allRows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `spendly_financial_statement_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
