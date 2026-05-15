import type { Transaction } from '../app/context/AppContext';

const DAY_MS = 24 * 60 * 60 * 1000;
const CHART_COLORS = ['#008751', '#004aad', '#001a4d', '#f59e0b', '#ef4444', '#7c3aed'];

const startOfDay = (date: Date) => {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
};

const isSameDay = (firstDate: Date, secondDate: Date) => {
  return startOfDay(firstDate).getTime() === startOfDay(secondDate).getTime();
};

const getAmount = (txn: Transaction) => Number(txn.amount || 0);

export const getTodaysTransactions = (transactions: Transaction[]) => {
  const today = new Date();
  return transactions.filter((txn) => isSameDay(new Date(txn.created_at), today));
};

export const getDailySalesExpenseData = (transactions: Transaction[], days = 7) => {
  const todayStart = startOfDay(new Date());

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(todayStart.getTime() - (days - 1 - index) * DAY_MS);
    const dayTransactions = transactions.filter((txn) => isSameDay(new Date(txn.created_at), date));
    const sales = dayTransactions
      .filter((txn) => txn.type === 'sale')
      .reduce((sum, txn) => sum + getAmount(txn), 0);
    const expenses = dayTransactions
      .filter((txn) => txn.type === 'expense')
      .reduce((sum, txn) => sum + getAmount(txn), 0);

    return {
      name: date.toLocaleDateString('en-US', { weekday: 'short' }),
      sales,
      expenses,
      profit: sales - expenses,
    };
  });
};

export const getWeeklyProfitData = (transactions: Transaction[], weeks = 4) => {
  const todayStart = startOfDay(new Date());

  return Array.from({ length: weeks }, (_, index) => {
    const weekStart = new Date(todayStart.getTime() - (weeks - 1 - index) * 7 * DAY_MS);
    const weekEnd = new Date(weekStart.getTime() + 7 * DAY_MS);
    const weekTransactions = transactions.filter((txn) => {
      const createdAt = new Date(txn.created_at);
      return createdAt >= weekStart && createdAt < weekEnd;
    });
    const sales = weekTransactions
      .filter((txn) => txn.type === 'sale')
      .reduce((sum, txn) => sum + getAmount(txn), 0);
    const expenses = weekTransactions
      .filter((txn) => txn.type === 'expense')
      .reduce((sum, txn) => sum + getAmount(txn), 0);

    return {
      name: `Week ${index + 1}`,
      profit: sales - expenses,
    };
  });
};

export const getExpenseBreakdownData = (transactions: Transaction[]) => {
  const expenseMap = transactions
    .filter((txn) => txn.type === 'expense')
    .reduce<Record<string, number>>((acc, txn) => {
      const key = txn.description?.trim() || 'Other';
      acc[key] = (acc[key] || 0) + getAmount(txn);
      return acc;
    }, {});

  return Object.entries(expenseMap)
    .map(([name, value], index) => ({
      name,
      value,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);
};
