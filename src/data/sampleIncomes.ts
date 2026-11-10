import { Income } from '../types/expense';

const getRelativeDate = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const INITIAL_SAMPLE_INCOMES: Income[] = [
  {
    id: 'inc_1',
    amount: 55000,
    category: 'salary',
    date: getRelativeDate(9),
    time: '10:00',
    note: 'Monthly salary deposit from Tech Corp',
    paymentMethod: 'Bank Transfer',
    createdAt: Date.now() - 1000 * 60 * 60 * 220,
  },
  {
    id: 'inc_2',
    amount: 14500,
    category: 'freelance',
    date: getRelativeDate(4),
    time: '16:30',
    note: 'Mobile app UI design consultation payout',
    paymentMethod: 'UPI',
    createdAt: Date.now() - 1000 * 60 * 60 * 96,
  },
  {
    id: 'inc_3',
    amount: 4200,
    category: 'investments',
    date: getRelativeDate(2),
    time: '11:15',
    note: 'Quarterly index fund dividend',
    paymentMethod: 'Bank Transfer',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: 'inc_4',
    amount: 2500,
    category: 'gift',
    date: getRelativeDate(0),
    time: '12:00',
    note: 'Family festival celebration gift',
    paymentMethod: 'UPI',
    createdAt: Date.now() - 1000 * 60 * 60 * 4,
  },
  {
    id: 'inc_5',
    amount: 8000,
    category: 'business',
    date: getRelativeDate(12),
    time: '14:20',
    note: 'Ecommerce store revenue distribution',
    paymentMethod: 'Bank Transfer',
    createdAt: Date.now() - 1000 * 60 * 60 * 290,
  },
];
