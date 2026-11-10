import { Category, CategoryId, IncomeCategory, IncomeCategoryId } from '../types/expense';

export const CATEGORIES: Record<CategoryId, Category> = {
  food: {
    id: 'food',
    name: 'Food & Dining',
    icon: 'UtensilsCrossed',
    color: '#D97706', // Warm amber / dining
    bgColor: '#FFFBEB',
    textColor: '#B45309',
    borderColor: '#FDE68A',
  },
  shopping: {
    id: 'shopping',
    name: 'Shopping',
    icon: 'ShoppingBag',
    color: '#6366F1', // Soft violet
    bgColor: '#EEF2FF',
    textColor: '#4F46E5',
    borderColor: '#C7D2FE',
  },
  groceries: {
    id: 'groceries',
    name: 'Groceries',
    icon: 'ShoppingCart',
    color: '#0D9488', // Emerald Teal
    bgColor: '#F0FDFA',
    textColor: '#0F766E',
    borderColor: '#99F6E4',
  },
  transport: {
    id: 'transport',
    name: 'Transport & Fuel',
    icon: 'Car',
    color: '#0284C7', // Sky blue
    bgColor: '#F0F9FF',
    textColor: '#0369A1',
    borderColor: '#BAE6FD',
  },
  bills: {
    id: 'bills',
    name: 'Bills & Utilities',
    icon: 'Receipt',
    color: '#E11D48', // Rose / Urgent
    bgColor: '#FFF1F2',
    textColor: '#BE123C',
    borderColor: '#FECDD3',
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'Film',
    color: '#EC4899', // Pink
    bgColor: '#FDF2F8',
    textColor: '#BE185D',
    borderColor: '#FBCFE8',
  },
  health: {
    id: 'health',
    name: 'Health & Medical',
    icon: 'HeartPulse',
    color: '#DC2626', // Red
    bgColor: '#FEF2F2',
    textColor: '#B91C1C',
    borderColor: '#FECACA',
  },
  education: {
    id: 'education',
    name: 'Education',
    icon: 'GraduationCap',
    color: '#3B82F6', // Blue
    bgColor: '#EFF6FF',
    textColor: '#1D4ED8',
    borderColor: '#BFDBFE',
  },
  travel: {
    id: 'travel',
    name: 'Travel & Trips',
    icon: 'Plane',
    color: '#059669', // Mint emerald
    bgColor: '#ECFDF5',
    textColor: '#047857',
    borderColor: '#A7F3D0',
  },
  personal: {
    id: 'personal',
    name: 'Personal Care',
    icon: 'Sparkles',
    color: '#8B5CF6', // Purple
    bgColor: '#F5F3FF',
    textColor: '#6D28D9',
    borderColor: '#DDD6FE',
  },
  other: {
    id: 'other',
    name: 'General & Others',
    icon: 'Package',
    color: '#64748B', // Slate gray
    bgColor: '#F1F5F9',
    textColor: '#475569',
    borderColor: '#CBD5E1',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export const PAYMENT_METHODS: { id: string; name: string; icon: string }[] = [
  { id: 'UPI', name: 'UPI / GPay', icon: 'QrCode' },
  { id: 'Credit Card', name: 'Credit Card', icon: 'CreditCard' },
  { id: 'Debit Card', name: 'Debit Card', icon: 'Landmark' },
  { id: 'Cash', name: 'Cash', icon: 'Banknote' },
  { id: 'Net Banking', name: 'Net Banking', icon: 'Building2' },
];

export const INCOME_CATEGORIES: Record<IncomeCategoryId, IncomeCategory> = {
  salary: {
    id: 'salary',
    name: 'Salary',
    icon: 'Briefcase',
    color: '#059669', // Emerald
    bgColor: '#ECFDF5',
    textColor: '#047857',
    borderColor: '#A7F3D0',
  },
  freelance: {
    id: 'freelance',
    name: 'Freelance',
    icon: 'Laptop',
    color: '#0D9488', // Teal
    bgColor: '#F0FDFA',
    textColor: '#0F766E',
    borderColor: '#99F6E4',
  },
  business: {
    id: 'business',
    name: 'Business',
    icon: 'Store',
    color: '#2563EB', // Blue
    bgColor: '#EFF6FF',
    textColor: '#1D4ED8',
    borderColor: '#BFDBFE',
  },
  investments: {
    id: 'investments',
    name: 'Investment Returns',
    icon: 'TrendingUp',
    color: '#7C3AED', // Violet
    bgColor: '#F5F3FF',
    textColor: '#6D28D9',
    borderColor: '#DDD6FE',
  },
  gift: {
    id: 'gift',
    name: 'Gift',
    icon: 'Gift',
    color: '#D97706', // Amber
    bgColor: '#FFFBEB',
    textColor: '#B45309',
    borderColor: '#FDE68A',
  },
  other: {
    id: 'other',
    name: 'Other Income',
    icon: 'Coins',
    color: '#64748B', // Slate
    bgColor: '#F1F5F9',
    textColor: '#475569',
    borderColor: '#CBD5E1',
  },
};

export const INCOME_CATEGORY_LIST = Object.values(INCOME_CATEGORIES);

export const INCOME_PAYMENT_METHODS: { id: string; name: string; icon: string }[] = [
  { id: 'Bank Transfer', name: 'Bank Transfer', icon: 'Building2' },
  { id: 'UPI', name: 'UPI / Online', icon: 'QrCode' },
  { id: 'Card', name: 'Card', icon: 'CreditCard' },
  { id: 'Cash', name: 'Cash', icon: 'Banknote' },
  { id: 'Other', name: 'Other', icon: 'HelpCircle' },
];

export const CURRENCY_OPTIONS = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' },
  { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (£)' },
  { code: 'AED', symbol: 'AED', label: 'UAE Dirham (AED)' },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar (CA$)' },
  { code: 'AUD', symbol: 'AU$', label: 'Australian Dollar (AU$)' },
];
