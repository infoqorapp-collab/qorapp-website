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
  user: { name: string; businessName: string; phone: string } | null;
  walletBalance: number;
  todaysSales: number;
  todaysProfit: number;
  transactions: Transaction[];
  inventory: InventoryItem[];
  isLoading: boolean;
  login: (phone: string, businessName: string) => Promise<void>;
  logout: () => void;
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
  logout: () => {},
  addSale: async () => {},
  addExpense: async () => {},
  addProduct: async () => {},
  updateStock: async () => {},
};

const AppContext = createContext<AppState>(defaultState);

// Hardcoded test user id for the prototype
const TEST_USER_ID = '00000000-0000-0000-0000-000000000000';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Omit<AppState, 'login' | 'logout' | 'addSale' | 'addExpense' | 'addProduct' | 'updateStock'>>({
    ...defaultState
  });

  const loadData = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // 1. Load User
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', TEST_USER_ID)
      .single();

    // 2. Load Transactions
    const { data: txns } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', TEST_USER_ID)
      .order('created_at', { ascending: false });

    // 3. Load Inventory
    const { data: invData } = await supabase
      .from('inventory')
      .select('*')
      .eq('user_id', TEST_USER_ID);

    const safeTxns: Transaction[] = txns || [];
    
    // Calculate metrics
    const sales = safeTxns.filter(t => t.type === 'sale').reduce((sum, t) => sum + Number(t.amount), 0);
    const expenses = safeTxns.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    const profit = sales - expenses;

    setState({
      user: userData ? { name: '', phone: userData.phone, businessName: userData.business_name } : null,
      walletBalance: userData?.wallet_balance || 23100,
      todaysSales: sales, // For prototype, assuming all loaded are "today"
      todaysProfit: profit,
      transactions: safeTxns,
      inventory: invData || [
        // Fallback dummy inventory if table is completely empty
        { id: '1', name: 'Product Name 100', stock: 500, status: 'Full' },
        { id: '2', name: 'Product Name 300', stock: 200, status: 'Low Stock' },
      ],
      isLoading: false
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const login = async (phone: string, businessName: string) => {
    // Attempt mock login updates
    await supabase.from('users').update({ phone, business_name: businessName }).eq('id', TEST_USER_ID);
    await loadData();
  };

  const logout = () => {
    setState({ ...defaultState, isLoading: false });
  };

  const addSale = async (amount: number, method: string, item?: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    await supabase.from('transactions').insert({
      user_id: TEST_USER_ID,
      type: 'sale',
      amount: amount,
      payment_method: method,
      description: item || 'Sale'
    });
    // Add to wallet balance if Mobile Money? Simple mock:
    if (method === 'Mobile Money') {
      await supabase.from('users').update({ wallet_balance: state.walletBalance + amount }).eq('id', TEST_USER_ID);
    }
    await loadData();
  };

  const addExpense = async (amount: number, type: string, method: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    await supabase.from('transactions').insert({
      user_id: TEST_USER_ID,
      type: 'expense',
      amount: amount,
      payment_method: method,
      description: type
    });
    // Reduce wallet balance if needed
    if (method === 'Mobile money') {
      await supabase.from('users').update({ wallet_balance: state.walletBalance - amount }).eq('id', TEST_USER_ID);
    }
    await loadData();
  };

  const addProduct = async (name: string, stock: number) => {
    setState(prev => ({ ...prev, isLoading: true }));
    await supabase.from('inventory').insert({
      user_id: TEST_USER_ID,
      name,
      stock,
      status: stock >= 50 ? 'Full' : 'Low Stock'
    });
    await loadData();
  };

  const updateStock = async (id: string, newStock: number) => {
    setState(prev => ({ ...prev, isLoading: true }));
    await supabase.from('inventory').update({
      stock: newStock,
      status: newStock >= 50 ? 'Full' : 'Low Stock'
    }).eq('id', id);
    await loadData();
  };

  return (
    <AppContext.Provider value={{ ...state, login, logout, addSale, addExpense, addProduct, updateStock }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
