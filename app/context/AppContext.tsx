'use client';
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { formatMarketMoney, useMarket } from '@/lib/market';

type AuthStartResult = {
  error: string | null;
  otpSent?: boolean;
};

const getAuthErrorMessage = (message: string) => {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes('error sending') || normalizedMessage.includes('magic link')) {
    return 'Supabase could not send the verification email. Check your SMTP settings and email OTP template in Supabase, then try again.';
  }

  return message;
};

export type Transaction = {
  id: string;
  type: 'sale' | 'expense' | 'transfer_in' | 'transfer_out';
  amount: number;
  description: string;
  payment_method: string;
  created_at: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  stock: number;
  price: number;
  status: 'Full' | 'Low Stock' | 'Out of Stock';
};

const getStockStatus = (stock: number): InventoryItem['status'] => {
  if (stock <= 0) return 'Out of Stock';
  if (stock < 50) return 'Low Stock';
  return 'Full';
};

export type AppNotification = {
  id: string;
  user_id: string;
  type: 'money_sent' | 'money_received' | 'sale_recorded' | 'expense_recorded' | 'inventory' | 'system';
  title: string;
  message: string;
  href?: string | null;
  is_read: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
};

export type NotificationSettings = {
  money_sent: boolean;
  money_received: boolean;
  sales: boolean;
  expenses: boolean;
  inventory: boolean;
};

interface AppState {
  user: { email: string; businessName: string; phone?: string; dashboardRoute?: string; refCode?: string } | null;
  walletBalance: number;
  cashBalance: number;
  mobileBankBalance: number;
  todaysSales: number;
  todaysProfit: number;
  transactions: Transaction[];
  inventory: InventoryItem[];
  notifications: AppNotification[];
  notificationSettings: NotificationSettings;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<AuthStartResult>;
  signUp: (email: string, password: string, businessName: string, phone: string) => Promise<AuthStartResult>;
  verifyEmailOtp: (email: string, token: string) => Promise<{ error: string | null }>;
  addSale: (productId: string, quantity: number, method: string) => Promise<{ error: string | null }>;
  addExpense: (amount: number, type: string, method: string) => Promise<void>;
  sendMoney: (recipientCode: string, amount: number, method: string, note?: string) => Promise<{ error: string | null }>;
  addProduct: (name: string, stock: number, price: number) => Promise<void>;
  updateStock: (id: string, newStock: number) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  updateNotificationSettings: (settings: NotificationSettings) => Promise<{ error: string | null }>;
}

const defaultNotificationSettings: NotificationSettings = {
  money_sent: true,
  money_received: true,
  sales: true,
  expenses: true,
  inventory: true,
};

const defaultState: AppState = {
  user: null,
  walletBalance: 0,
  cashBalance: 0,
  mobileBankBalance: 0,
  todaysSales: 0,
  todaysProfit: 0,
  transactions: [],
  inventory: [],
  notifications: [],
  notificationSettings: defaultNotificationSettings,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  verifyEmailOtp: async () => ({ error: null }),
  addSale: async () => ({ error: null }),
  addExpense: async () => {},
  sendMoney: async () => ({ error: null }),
  addProduct: async () => {},
  updateStock: async () => {},
  markNotificationRead: async () => {},
  markAllNotificationsRead: async () => {},
  updateNotificationSettings: async () => ({ error: null }),
};

const AppContext = createContext<AppState>(defaultState);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { market } = useMarket();
  const [state, setState] = useState<Omit<AppState, 'login' | 'logout' | 'signIn' | 'signUp' | 'verifyEmailOtp' | 'addSale' | 'addExpense' | 'sendMoney' | 'addProduct' | 'updateStock' | 'markNotificationRead' | 'markAllNotificationsRead' | 'updateNotificationSettings'>>({
    ...defaultState
  });

  const isMountedRef = useRef(true);

  const resetState = () => {
    setState({
      user: null,
      walletBalance: 0,
      cashBalance: 0,
      mobileBankBalance: 0,
      todaysSales: 0,
      todaysProfit: 0,
      transactions: [],
      inventory: [],
      notifications: [],
      notificationSettings: defaultNotificationSettings,
      isLoading: false,
    });
  };

  const loadData = async () => {
    if (!isMountedRef.current) return;
    setState(prev => ({ ...prev, isLoading: true }));

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Session error:', sessionError.message);
    }
    const session = sessionData?.session;

    if (!isMountedRef.current) return;

    if (!session?.user) {
      resetState();
      return;
    }

    const userId = session.user.id;
    const userEmail = session.user.email || '';
    const userMetadata = session.user.user_metadata || {};

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (userError && userError.code !== 'PGRST116') {
      console.error('User query error:', userError.message);
    }

    const profile = userData || {
      email: userEmail,
      business_name: userMetadata.business_name || userMetadata.businessName || 'My Business',
      phone: userMetadata.phone || undefined,
      wallet_balance: 0,
      dashboard_route: '/inventory',
      ref_code: undefined,
    };

    if (!isMountedRef.current) return;

    const { data: txns, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (txError) {
      console.error('Transactions query error:', txError.message);
    }

    if (!isMountedRef.current) return;

    const { data: invData, error: invError } = await supabase
      .from('inventory')
      .select('*')
      .eq('user_id', userId);

    if (invError) {
      console.error('Inventory query error:', invError.message);
    }

    if (!isMountedRef.current) return;

    const { data: notificationData, error: notificationError } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (notificationError) {
      console.error('Notifications query error:', notificationError.message);
    }

    if (!isMountedRef.current) return;

    const { data: notificationSettingsData, error: notificationSettingsError } = await supabase
      .from('notification_settings')
      .select('money_sent, money_received, sales, expenses, inventory')
      .eq('user_id', userId)
      .maybeSingle();

    if (notificationSettingsError) {
      console.error('Notification settings query error:', notificationSettingsError.message);
    }

    if (!notificationSettingsData) {
      await supabase.from('notification_settings').upsert({ user_id: userId }, { onConflict: 'user_id' });
    }

    if (!isMountedRef.current) return;

    const safeTxns: Transaction[] = txns || [];
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const todaysTxns = safeTxns.filter((txn) => {
      const createdAt = txn.created_at ? new Date(txn.created_at) : new Date(0);
      return createdAt >= startOfDay && createdAt < endOfDay;
    });

    const sales = todaysTxns.filter(t => t.type === 'sale').reduce((sum, t) => sum + Number(t.amount), 0);
    const expenses = todaysTxns.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    const profit = sales - expenses;

    const normalizeMethod = (method: string) => method?.trim().toLowerCase();
    const cashBalance = safeTxns.reduce((sum, txn) => {
      const method = normalizeMethod(txn.payment_method || '');
      if (method !== 'cash') return sum;
      const amount = Number(txn.amount);
      return sum + (txn.type === 'sale' || txn.type === 'transfer_in' ? amount : -amount);
    }, 0);

    const mobileBankBalance = safeTxns.reduce((sum, txn) => {
      const method = normalizeMethod(txn.payment_method || '');
      if (!method.includes('mobile')) return sum;
      const amount = Number(txn.amount);
      return sum + (txn.type === 'sale' || txn.type === 'transfer_in' ? amount : -amount);
    }, 0);

    setState({
      user: {
        email: profile?.email || userEmail,
        businessName: profile?.business_name || userMetadata.business_name || userMetadata.businessName || 'My Business',
        phone: profile?.phone || userMetadata.phone || undefined,
        dashboardRoute: profile?.dashboard_route || '/inventory',
        refCode: profile?.ref_code || undefined,
      },
      walletBalance: Number(profile?.wallet_balance || 0),
      cashBalance,
      mobileBankBalance,
      todaysSales: sales,
      todaysProfit: profit,
      transactions: safeTxns,
      inventory: invData || [
        { id: '1', name: 'Product Name 100', stock: 500, price: 1, status: 'Full' },
        { id: '2', name: 'Product Name 300', stock: 200, price: 3, status: 'Low Stock' },
      ],
      notifications: notificationData || [],
      notificationSettings: notificationSettingsData || defaultNotificationSettings,
      isLoading: false,
    });
  };

  useEffect(() => {
    isMountedRef.current = true;
    loadData();

    const { data } = supabase.auth.onAuthStateChange(() => {
      loadData();
    });

    return () => {
      isMountedRef.current = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const login = async () => {
    await loadData();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    if (isMountedRef.current) {
      resetState();
    }
  };

  const signIn = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      return { error: getAuthErrorMessage(error.message) };
    }

    await loadData();
    return { error: null };
  };

  const signUp = async (email: string, password: string, businessName: string, phone: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          business_name: businessName || 'My Business',
          phone,
        },
      },
    });

    if (error) {
      return { error: getAuthErrorMessage(error.message) };
    }

    if (!data?.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (signInError) {
        return { error: getAuthErrorMessage(signInError.message) };
      }
    }

    await loadData();
    return { error: null };
  };

  const verifyEmailOtp = async (email: string, token: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: token.trim(),
      type: 'email',
    });

    if (error) {
      return { error: getAuthErrorMessage(error.message) };
    }

    if (!data.session || !data.user) {
      return { error: 'Verification succeeded, but Supabase did not return a session.' };
    }

    await loadData();
    return { error: null };
  };

  const addSale = async (productId: string, quantity: number, method: string) => {
    if (!state.user) return { error: 'You must be signed in to record a sale.' };

    if (!productId) {
      return { error: 'Choose which product was sold.' };
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return { error: 'Enter a quantity greater than zero.' };
    }

    const product = state.inventory.find((p) => p.id === productId);
    if (!product) {
      return { error: 'That product could not be found in your inventory.' };
    }

    if (quantity > product.stock) {
      return { error: `Only ${product.stock} unit(s) of ${product.name} left in stock.` };
    }

    if (isMountedRef.current) {
      setState(prev => ({ ...prev, isLoading: true }));
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) {
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, isLoading: false }));
      }
      return { error: 'Unable to identify your account. Please sign in again.' };
    }

    const amount = product.price * quantity;
    const newStock = product.stock - quantity;
    const newStatus = getStockStatus(newStock);

    const { error: txError } = await supabase.from('transactions').insert({
      user_id: userId,
      type: 'sale',
      amount,
      payment_method: method,
      description: `${quantity} x ${product.name}`,
    });

    if (txError) {
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, isLoading: false }));
      }
      return { error: txError.message };
    }

    const { error: stockError } = await supabase
      .from('inventory')
      .update({ stock: newStock, status: newStatus })
      .eq('id', productId);

    if (stockError) {
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, isLoading: false }));
      }
      return { error: stockError.message };
    }

    if (state.notificationSettings.sales) {
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'sale_recorded',
        title: 'Sale recorded',
        message: `You recorded a ${formatMarketMoney(amount, market)} sale for ${quantity} x ${product.name}.`,
        href: '/transactions',
        metadata: { amount, method, item: product.name, quantity, product_id: productId },
      });
    }

    if (newStatus === 'Low Stock' || newStatus === 'Out of Stock') {
      if (state.notificationSettings.inventory) {
        await supabase.from('notifications').insert({
          user_id: userId,
          type: 'inventory',
          title: newStatus === 'Out of Stock' ? 'Out of stock' : 'Low stock warning',
          message: `${product.name} now has ${newStock} unit(s) in stock.`,
          href: '/inventory',
          metadata: { inventory_id: productId, stock: newStock },
        });
      }
    }

    await supabase.from('users').update({ wallet_balance: state.walletBalance + amount }).eq('id', userId);
    await loadData();
    return { error: null };
  };

  const addExpense = async (amount: number, type: string, method: string) => {
    if (!state.user) return;
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, isLoading: true }));
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return;

    await supabase.from('transactions').insert({
      user_id: userId,
      type: 'expense',
      amount,
      payment_method: method,
      description: type,
    });

    if (state.notificationSettings.expenses) {
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'expense_recorded',
        title: 'Expense recorded',
        message: `You recorded a ${formatMarketMoney(amount, market)} expense for ${type}.`,
        href: '/transactions',
        metadata: { amount, method, category: type },
      });
    }

    await supabase.from('users').update({ wallet_balance: state.walletBalance - amount }).eq('id', userId);
    await loadData();
  };

  const addProduct = async (name: string, stock: number, price: number) => {
    if (!state.user) return;
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, isLoading: true }));
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return;

    await supabase.from('inventory').insert({
      user_id: userId,
      name,
      stock,
      price,
      status: getStockStatus(stock),
    });

    if (state.notificationSettings.inventory) {
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'inventory',
        title: 'Product added',
        message: `${name} was added with ${stock} units in stock.`,
        href: '/inventory',
        metadata: { name, stock },
      });
    }
    await loadData();
  };

  const sendMoney = async (recipientCode: string, amount: number, method: string, note?: string) => {
    if (!state.user) {
      return { error: 'You must be signed in to transfer funds.' };
    }

    const normalizedCode = recipientCode.trim();
    if (!normalizedCode || normalizedCode.length !== 6) {
      return { error: 'Enter a valid 6-digit recipient code.' };
    }

    if (amount <= 0) {
      return { error: 'Transfer amount must be greater than zero.' };
    }

    if (amount > state.walletBalance) {
      return { error: 'Insufficient balance to complete this transfer.' };
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const senderId = sessionData?.session?.user?.id;
    if (!senderId) {
      return { error: 'Unable to identify sender account.' };
    }

    const transferMethod = method.trim().toLowerCase() === 'wallet' ? 'Mobile Money' : method;

    const { data, error } = await supabase.rpc('transfer_funds', {
      sender_id: senderId,
      recipient_ref_code: normalizedCode,
      amount,
      payment_method: transferMethod,
      note: note || 'Wallet transfer',
    });

    if (error) {
      return { error: error.message };
    }

    await loadData();
    return { error: null };
  };

  const updateStock = async (id: string, newStock: number) => {
    if (!state.user) return;
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, isLoading: true }));
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return;

    await supabase.from('inventory').update({
      stock: newStock,
      status: getStockStatus(newStock),
    }).eq('id', id);

    if (state.notificationSettings.inventory) {
      const itemName = state.inventory.find((item) => item.id === id)?.name || 'Product';
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'inventory',
        title: newStock <= 0 ? 'Out of stock' : newStock < 50 ? 'Low stock warning' : 'Stock updated',
        message: `${itemName} now has ${newStock} units in stock.`,
        href: '/inventory',
        metadata: { inventory_id: id, stock: newStock },
      });
    }
    await loadData();
  };

  const markNotificationRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map((notification) =>
        notification.id === id ? { ...notification, is_read: true } : notification
      ),
    }));
  };

  const markAllNotificationsRead = async () => {
    const unreadIds = state.notifications.filter((notification) => !notification.is_read).map((notification) => notification.id);
    if (unreadIds.length === 0) return;

    await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map((notification) => ({ ...notification, is_read: true })),
    }));
  };

  const updateNotificationSettings = async (settings: NotificationSettings) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) {
      return { error: 'You must be signed in to update settings.' };
    }

    const { error } = await supabase.from('notification_settings').upsert({
      user_id: userId,
      ...settings,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    if (error) {
      return { error: error.message };
    }

    setState(prev => ({ ...prev, notificationSettings: settings }));
    return { error: null };
  };

  return (
    <AppContext.Provider value={{ ...state, login, logout, signIn, signUp, verifyEmailOtp, addSale, addExpense, sendMoney, addProduct, updateStock, markNotificationRead, markAllNotificationsRead, updateNotificationSettings }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
