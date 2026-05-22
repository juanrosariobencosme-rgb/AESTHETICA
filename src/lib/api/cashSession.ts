import { supabase } from '../supabase';
import { CashSession } from '../../types';

export const cashSessionApi = {
  async getCurrent(): Promise<CashSession | null> {
    const { data, error } = await supabase
      .from('cash_sessions')
      .select('*')
      .eq('is_open', true)
      .order('opened_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) return null;
    
    // Transform snake_case to camelCase
    return {
      id: data.id,
      isOpen: data.is_open,
      openedAt: data.opened_at,
      closedAt: data.closed_at,
      startingBalance: data.starting_balance,
      salesCash: data.sales_cash,
      salesTransfer: data.sales_transfer,
      totalExpenses: data.total_expenses,
      expectedBalance: data.expected_balance,
      actualBalance: data.actual_balance,
      difference: data.difference,
      history: data.history
    } as CashSession;
  },

  async getById(id: string): Promise<CashSession | null> {
    const { data, error } = await supabase
      .from('cash_sessions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Transform snake_case to camelCase
    return {
      id: data.id,
      isOpen: data.is_open,
      openedAt: data.opened_at,
      closedAt: data.closed_at,
      startingBalance: data.starting_balance,
      salesCash: data.sales_cash,
      salesTransfer: data.sales_transfer,
      totalExpenses: data.total_expenses,
      expectedBalance: data.expected_balance,
      actualBalance: data.actual_balance,
      difference: data.difference,
      history: data.history
    } as CashSession;
  },

  async create(session: CashSession): Promise<CashSession> {
    // Transform camelCase to snake_case
    const dbSession = {
      id: session.id,
      is_open: session.isOpen,
      opened_at: session.openedAt,
      closed_at: session.closedAt,
      starting_balance: session.startingBalance,
      sales_cash: session.salesCash,
      sales_transfer: session.salesTransfer,
      total_expenses: session.totalExpenses,
      expected_balance: session.expectedBalance,
      actual_balance: session.actualBalance,
      difference: session.difference,
      history: session.history
    };
    
    const { data, error } = await supabase
      .from('cash_sessions')
      .insert(dbSession)
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform back to camelCase
    return {
      id: data.id,
      isOpen: data.is_open,
      openedAt: data.opened_at,
      closedAt: data.closed_at,
      startingBalance: data.starting_balance,
      salesCash: data.sales_cash,
      salesTransfer: data.sales_transfer,
      totalExpenses: data.total_expenses,
      expectedBalance: data.expected_balance,
      actualBalance: data.actual_balance,
      difference: data.difference,
      history: data.history
    } as CashSession;
  },

  async update(id: string, session: Partial<CashSession>): Promise<CashSession> {
    // Transform camelCase to snake_case
    const dbSession: any = {};
    if (session.isOpen !== undefined) dbSession.is_open = session.isOpen;
    if (session.openedAt !== undefined) dbSession.opened_at = session.openedAt;
    if (session.closedAt !== undefined) dbSession.closed_at = session.closedAt;
    if (session.startingBalance !== undefined) dbSession.starting_balance = session.startingBalance;
    if (session.salesCash !== undefined) dbSession.sales_cash = session.salesCash;
    if (session.salesTransfer !== undefined) dbSession.sales_transfer = session.salesTransfer;
    if (session.totalExpenses !== undefined) dbSession.total_expenses = session.totalExpenses;
    if (session.expectedBalance !== undefined) dbSession.expected_balance = session.expectedBalance;
    if (session.actualBalance !== undefined) dbSession.actual_balance = session.actualBalance;
    if (session.difference !== undefined) dbSession.difference = session.difference;
    if (session.history !== undefined) dbSession.history = session.history;
    
    const { data, error } = await supabase
      .from('cash_sessions')
      .update(dbSession)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform back to camelCase
    return {
      id: data.id,
      isOpen: data.is_open,
      openedAt: data.opened_at,
      closedAt: data.closed_at,
      startingBalance: data.starting_balance,
      salesCash: data.sales_cash,
      salesTransfer: data.sales_transfer,
      totalExpenses: data.total_expenses,
      expectedBalance: data.expected_balance,
      actualBalance: data.actual_balance,
      difference: data.difference,
      history: data.history
    } as CashSession;
  },

  async closeSession(id: string): Promise<CashSession> {
    const { data, error } = await supabase
      .from('cash_sessions')
      .update({ 
        is_open: false, 
        closed_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform back to camelCase
    return {
      id: data.id,
      isOpen: data.is_open,
      openedAt: data.opened_at,
      closedAt: data.closed_at,
      startingBalance: data.starting_balance,
      salesCash: data.sales_cash,
      salesTransfer: data.sales_transfer,
      totalExpenses: data.total_expenses,
      expectedBalance: data.expected_balance,
      actualBalance: data.actual_balance,
      difference: data.difference,
      history: data.history
    } as CashSession;
  },

  async getAllHistory(): Promise<CashSession[]> {
    const { data, error } = await supabase
      .from('cash_sessions')
      .select('*')
      .order('opened_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform snake_case to camelCase
    return data.map(session => ({
      id: session.id,
      isOpen: session.is_open,
      openedAt: session.opened_at,
      closedAt: session.closed_at,
      startingBalance: session.starting_balance,
      salesCash: session.sales_cash,
      salesTransfer: session.sales_transfer,
      totalExpenses: session.total_expenses,
      expectedBalance: session.expected_balance,
      actualBalance: session.actual_balance,
      difference: session.difference,
      history: session.history
    })) as CashSession[];
  }
};
