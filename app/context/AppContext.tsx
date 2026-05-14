'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  user: { email: string; businessName: string } | null;
  walletBalance: number;
  todaysSales: number;
  todaysProfit: number;
  transactions: Transaction[];
  inventory: InventoryItem[];
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  sendOtp: (email: string) => Promise<{ error: string | null }>;
  verifyOtp: (email: string, token: string, businessName: string) => Promise<{ error: string | null }>;
  addSale: (amount: number, method: string, item?: string) => Promise<void>;
  addExpense: (amount: number, type: string, method: string) => Promise<void>;
  addProduct: (name: string, stock: number) => Promise<void>;
  updateStock: (id: string, newStock: number) => Promise<void>;
}

const defaultState: AppState = {
  user: null,
  walletBalance: 0,
  todaysSales: 0,
  todaysProfit: 0,
  transactions: [],
  inventory: [],
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  sendOtp: async () => ({ error: null }),
  verifyOtp: async () => ({ error: null }),
  addSale: async () => {},
  addExpense: async () => {},
  addProduct: async () => {},
  updateStock: async () => {},
};

const AppContext = createContext<AppState>(defaultState);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Omit<AppState, 'login' | 'logout' | 'sendOtp' | 'verifyOtp' | 'addSale' | 'addExpense' | 'addProduct' | 'updateStock'>>({
    ...defaultState
  });

  const loadData = async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;

    if (!session?.user) {
      setState({
        user: null,
        walletBalance: 0,
        todaysSales: 0,
        todaysProfit: 0,
        transactions: [],
        inventory: [],
        isLoading: false,
      });
      return;
    }

    const userId = session.user.id;

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: txns } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const { data: invData } = await supabase
      .from('inventory')
      .select('*')
      .eq('user_id', userId);

    const safeTxns: Transaction[] = txns || [];
    const sales = safeTxns.filter(t => t.type === 'sale').reduce((sum, t) => sum + Number(t.amount), 0);
    const expenses = safeTxns.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    const profit = sales - expenses;

    setState({
      user: {
        email: userData?.email || session.user.email || '',
        businessName: userData?.business_name || '',
      },
      walletBalance: userData?.wallet_balance || 23100,
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
    loadData();
  }, []);

  const login = async () => {
    await loadData();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setState({ ...defaultState, isLoading: false });
  };

  const sendOtp = async (email: string) => {
    const redirectTo = typeof window !== 'undefined'
      ? `${window.location.origin}/login`
      : process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')}/login`
      : undefined;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo,
      },
    });

    return { error: error?.message ?? null };
  };

  const verifyOtp = async (email: string, token: string, businessName: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      return { error: error.message };
    }

    const user = data?.user;
    if (!user) {
      return { error: 'Unable to verify OTP. Please try again.' };
    }

    const { error: upsertError } = await supabase.from('users').upsert({
      id: user.id,
      email: user.email,
      business_name: businessName || 'My Business',
    });

    if (upsertError) {
      return { error: upsertError.message };
    }

    await loadData();
    return { error: null };
  };

  const addSale = async (amount: number, method: string, item?: string) => {
    if (!state.user) return;
    setState(prev => ({ ...prev, isLoading: true }));
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return;

    await supabase.from('transactions').insert({
      user_id: userId,
      type: 'sale',
      amount: amount,
      payment_method: method,
      description: item || 'Sale',
    });
    if (method === 'Mobile Money') {
      await supabase.from('users').update({ wallet_balance: state.walletBalance + amount }).eq('id', userId);
    }
    await loadData();
  };

  const addExpense = async (amount: number, type: string, method: string) => {
    if (!state.user) return;
    setState(prev => ({ ...prev, isLoading: true }));
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return;

    await supabase.from('transactions').insert({
      user_id: userId,
      type: 'expense',
      amount: amount,
      payment_method: method,
      description: type,
    });
    if (method === 'Mobile money') {
      await supabase.from('users').update({ wallet_balance: state.walletBalance - amount }).eq('id', userId);
    }
    await loadData();
  };

  const addProduct = async (name: string, stock: number) => {
    if (!state.user) return;
    setState(prev => ({ ...prev, isLoading: true }));
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

  const updateStock = async (id: string, newStock: number) => {
    if (!state.user) return;
    setState(prev => ({ ...prev, isLoading: true }));
    await supabase.from('inventory').update({
      stock: newStock,
      status: newStock >= 50 ? 'Full' : 'Low Stock',
    }).eq('id', id);
    await loadData();
  };

  return (
    <AppContext.Provider value={{ ...state, login, logout, sendOtp, verifyOtp, addSale, addExpense, addProduct, updateStock }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
