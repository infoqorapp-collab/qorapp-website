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

// --- Period insights helpers ---
// Record-sale saves descriptions as "{quantity} x {product name}". Older/manual entries
// may not follow that pattern, in which case we fall back to treating the whole
// description as the product name with an unknown quantity.
export type ParsedSale = { quantity: number | null; product: string | null };

export const parseSaleDescription = (description?: string | null): ParsedSale => {
  const text = (description || '').trim();
  if (!text) return { quantity: null, product: null };

  const match = text.match(/^(\d+(?:\.\d+)?)\s*x\s*(.+)$/i);
  if (match) {
    return { quantity: Number(match[1]), product: match[2].trim() };
  }
  return { quantity: null, product: text };
};

export type BucketGranularity = 'day' | 'week' | 'month';

export const getBucketGranularity = (start: Date, end: Date): BucketGranularity => {
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / DAY_MS));
  if (days <= 31) return 'day';
  if (days <= 183) return 'week';
  return 'month';
};

const bucketStartDate = (date: Date, granularity: BucketGranularity): Date => {
  if (granularity === 'day') return startOfDay(date);
  if (granularity === 'week') {
    const day = startOfDay(date);
    const dayOfWeek = day.getDay(); // 0 = Sunday
    const offsetToMonday = (dayOfWeek + 6) % 7;
    return new Date(day.getTime() - offsetToMonday * DAY_MS);
  }
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const advanceBucket = (date: Date, granularity: BucketGranularity): Date => {
  const next = new Date(date);
  if (granularity === 'day') next.setDate(next.getDate() + 1);
  else if (granularity === 'week') next.setDate(next.getDate() + 7);
  else next.setMonth(next.getMonth() + 1);
  return next;
};

const bucketLabel = (date: Date, granularity: BucketGranularity): string => {
  if (granularity === 'day') return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (granularity === 'week') return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
};

// Buckets a (already period + product filtered) list of transactions into a time
// series suitable for charting, filling in empty buckets so the trend line/bars
// stay continuous even on days with no activity.
export const getPeriodSeries = (transactions: Transaction[], start: Date, end: Date) => {
  const granularity = getBucketGranularity(start, end);
  const buckets = new Map<number, { sales: number; expenses: number }>();

  let cursor = bucketStartDate(start, granularity);
  const lastBucket = bucketStartDate(end, granularity).getTime();
  let safety = 0;
  while (cursor.getTime() <= lastBucket && safety < 400) {
    buckets.set(cursor.getTime(), { sales: 0, expenses: 0 });
    cursor = advanceBucket(cursor, granularity);
    safety += 1;
  }

  transactions.forEach((txn) => {
    const created = new Date(txn.created_at);
    if (created < start || created > end) return;
    const key = bucketStartDate(created, granularity).getTime();
    const entry = buckets.get(key) || { sales: 0, expenses: 0 };
    if (txn.type === 'sale') entry.sales += getAmount(txn);
    if (txn.type === 'expense') entry.expenses += getAmount(txn);
    buckets.set(key, entry);
  });

  return Array.from(buckets.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([key, value]) => ({
      name: bucketLabel(new Date(key), granularity),
      sales: value.sales,
      expenses: value.expenses,
      profit: value.sales - value.expenses,
    }));
};

export type ProductSummary = {
  name: string;
  unitsSold: number;
  revenue: number;
  saleCount: number;
};

// Aggregates an already-filtered list of sale transactions by the product named
// in their description, ranked by revenue.
export const summarizeProductSales = (saleTransactions: Transaction[]): ProductSummary[] => {
  const map = new Map<string, ProductSummary>();

  saleTransactions.forEach((txn) => {
    const { quantity, product } = parseSaleDescription(txn.description);
    const key = product || 'Unspecified';
    const entry = map.get(key) || { name: key, unitsSold: 0, revenue: 0, saleCount: 0 };
    entry.unitsSold += quantity ?? 0;
    entry.revenue += getAmount(txn);
    entry.saleCount += 1;
    map.set(key, entry);
  });

  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
};
