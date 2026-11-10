import { Expense } from '../types/expense';

export const formatCurrency = (amount: number, symbol: string = '₹', showDecimals: boolean = false): string => {
  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  let formattedNumber: string;
  if (symbol === '₹') {
    // Indian numbering format (e.g., 1,00,000)
    formattedNumber = abs.toLocaleString('en-IN', {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    });
  } else {
    formattedNumber = abs.toLocaleString('en-US', {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    });
  }

  return `${isNegative ? '-' : ''}${symbol}${formattedNumber}`;
};

export const getFriendlyDateLabel = (dateStr: string): string => {
  if (!dateStr) return '';
  const today = new Date();
  const target = new Date(dateStr + 'T00:00:00');

  const todayStr = today.toISOString().split('T')[0];
  if (dateStr === todayStr) return 'Today';

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  if (dateStr === yesterdayStr) return 'Yesterday';

  const isCurrentYear = target.getFullYear() === today.getFullYear();
  return target.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: isCurrentYear ? undefined : 'numeric',
  });
};

export const formatTimeDisplay = (timeStr?: string): string => {
  if (!timeStr) return '';
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return timeStr;
  }
};

export const getCurrentMonthName = (): string => {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const groupExpensesByDay = (
  expenses: Expense[]
): { label: string; date: string; items: Expense[]; total: number }[] => {
  const groupsMap = new Map<string, Expense[]>();

  expenses.forEach(exp => {
    const key = exp.date;
    if (!groupsMap.has(key)) {
      groupsMap.set(key, []);
    }
    groupsMap.get(key)!.push(exp);
  });

  const sortedDates = Array.from(groupsMap.keys()).sort((a, b) => b.localeCompare(a));

  return sortedDates.map(date => {
    const items = groupsMap.get(date)!;
    const total = items.reduce((acc, curr) => acc + curr.amount, 0);
    return {
      label: getFriendlyDateLabel(date),
      date,
      items,
      total,
    };
  });
};

export const groupIncomesByDay = (
  incomes: import('../types/expense').Income[]
): { label: string; date: string; items: import('../types/expense').Income[]; total: number }[] => {
  const groupsMap = new Map<string, import('../types/expense').Income[]>();

  incomes.forEach(inc => {
    const key = inc.date;
    if (!groupsMap.has(key)) {
      groupsMap.set(key, []);
    }
    groupsMap.get(key)!.push(inc);
  });

  const sortedDates = Array.from(groupsMap.keys()).sort((a, b) => b.localeCompare(a));

  return sortedDates.map(date => {
    const items = groupsMap.get(date)!;
    const total = items.reduce((acc, curr) => acc + curr.amount, 0);
    return {
      label: getFriendlyDateLabel(date),
      date,
      items,
      total,
    };
  });
};
