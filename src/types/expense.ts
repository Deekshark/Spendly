export type CategoryId = 
  | 'food'
  | 'shopping'
  | 'groceries'
  | 'transport'
  | 'bills'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'travel'
  | 'personal'
  | 'other';

export type IncomeCategoryId =
  | 'salary'
  | 'freelance'
  | 'business'
  | 'investments'
  | 'gift'
  | 'other';

export type PaymentMethod = 'UPI' | 'Cash' | 'Credit Card' | 'Debit Card' | 'Net Banking';

export type IncomePaymentMethod = 'Cash' | 'UPI' | 'Bank Transfer' | 'Card' | 'Other';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export interface IncomeCategory {
  id: IncomeCategoryId;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: CategoryId;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  note: string;
  paymentMethod: PaymentMethod;
  createdAt: number;
}

export interface Income {
  id: string;
  amount: number;
  category: IncomeCategoryId;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  note?: string;
  paymentMethod: IncomePaymentMethod;
  createdAt: number;
}

export interface UserBudget {
  monthlyBudget: number;
  monthlyIncome: number;
  currency: string;
  currencySymbol: string;
  month: string; // YYYY-MM
  categoryBudgets?: Partial<Record<CategoryId, number>>;
}

export type TimeRangeFilter = 'all' | 'today' | 'week' | 'month' | 'last_month' | 'year';

export type SortOption = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
