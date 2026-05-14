'use client';
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';

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
  status: 'Full' | 'Low Stock' | 'Out of Stock';
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
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, businessName: string, phone: string) => Promise<{ error: string | null }>;
  addSale: (amount: number, method: string, item?: string) => Promise<void>;
  addExpense: (amount: number, type: string, method: string) => Promise<void>;
  sendMoney: (recipientCode: string, amount: number, method: string, note?: string) => Promise<{ error: string | null }>;
  addProduct: (name: string, stock: number) => Promise<void>;
  updateStock: (id: string, newStock: number) => Promise<void>;
}

const defaultState: AppState = {
  user: null,
  walletBalance: 0,
  cashBalance: 0,
  mobileBankBalance: 0,
  todaysSales: 0,
  todaysProfit: 0,
  transactions: [],
  inventory: [],
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  addSale: async () => {},
  addExpense: async () => {},
  sendMoney: async () => ({ error: null }),
  addProduct: async () => {},
  updateStock: async () => {},
};

const AppContext = createContext<AppState>(defaultState);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Omit<AppState, 'login' | 'logout' | 'signIn' | 'signUp' | 'addSale' | 'addExpense' | 'sendMoney' | 'addProduct' | 'updateStock'>>({
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
      isLoading: false,
    });
  };

  const createUserProfile = async (
    userId: string,
    email: string,
    businessName?: string,
    phone?: string
  ) => {
    const { data, error } = await supabase.from('users').insert({
      id: userId,
      email,
      business_name: businessName || 'My Business',
      phone,
      wallet_balance: 0,
      dashboard_route: '/inventory',
    }).select().single();

    if (error) {
      console.error('Failed to create user profile', error.message);
      return null;
    }

    return data;
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
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('User query error:', userError.message);
    }

    let profile = userData;
    if (!profile) {
      profile = await createUserProfile(
        userId,
        userEmail,
        userMetadata.business_name || userMetadata.businessName || 'My Business',
        userMetadata.phone || undefined
      );
    }

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
        { id: '1', name: 'Product Name 100', stock: 500, status: 'Full' },
        { id: '2', name: 'Product Name 300', stock: 200, status: 'Low Stock' },
      ],
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
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      return { error: error.message };
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
      return { error: error.message };
    }

    if (!data.session || !data.user) {
      return { error: 'Account created, but email confirmation is enabled in Supabase. Turn off Confirm email for password signup without OTP.' };
    }

    const { error: profileError } = await supabase.from('users').insert({
      id: data.user.id,
      email: normalizedEmail,
      business_name: businessName || 'My Business',
      phone,
      wallet_balance: 0,
      dashboard_route: '/inventory',
    });

    if (profileError) {
      return { error: profileError.message };
    }

    await loadData();
    return { error: null };
  };

  const addSale = async (amount: number, method: string, item?: string) => {
    if (!state.user) return;
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, isLoading: true }));
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return;

    await supabase.from('transactions').insert({
      user_id: userId,
      type: 'sale',
      amount,
      payment_method: method,
      description: item || 'Sale',
    });

    await supabase.from('users').update({ wallet_balance: state.walletBalance + amount }).eq('id', userId);
    await loadData();
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

    await supabase.from('users').update({ wallet_balance: state.walletBalance - amount }).eq('id', userId);
    await loadData();
  };

  const addProduct = async (name: string, stock: number) => {
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
      status: stock >= 50 ? 'Full' : 'Low Stock',
    });
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

    const { data, error } = await supabase.rpc('transfer_funds', {
      sender_id: senderId,
      recipient_ref_code: normalizedCode,
      amount,
      payment_method: method,
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
    await supabase.from('inventory').update({
      stock: newStock,
      status: newStock >= 50 ? 'Full' : 'Low Stock',
    }).eq('id', id);
    await loadData();
  };

  return (
    <AppContext.Provider value={{ ...state, login, logout, signIn, signUp, addSale, addExpense, sendMoney, addProduct, updateStock }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
