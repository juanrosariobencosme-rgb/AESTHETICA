import { supabase } from '../supabase';
import { CashSession } from '../../types';

export const cashSessionApi = {
  async getCurrent(): Promise<CashSession | null> {
    try {
      const { data, error } = await supabase
        .from('cash_sessions')
        .select('*')
        .eq('is_open', true)
        .order('opened_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching current cash session:', error);
        throw error;
      }
      
      if (!data) return null;
      
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
    } catch (error) {
      console.error('Error in cashSessionApi.getCurrent:', error);
      throw error;
    }
  },

  async create(session: CashSession): Promise<CashSession> {
    try {
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
      
      console.log('Creating cash session:', dbSession);
      
      const { data, error } = await supabase
        .from('cash_sessions')
        .insert(dbSession)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating cash session:', error);
        throw error;
      }
      
      console.log('Cash session created successfully');
      
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
    } catch (error) {
      console.error('Error in cashSessionApi.create:', error);
      throw error;
    }
  },

  async closeSession(id: string): Promise<CashSession> {
    try {
      console.log('Closing cash session:', id);
      
      const { data, error } = await supabase
        .from('cash_sessions')
        .update({ 
          is_open: false, 
          closed_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error closing cash session:', error);
        throw error;
      }
      
      console.log('Cash session closed successfully');
      
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
    } catch (error) {
      console.error('Error in cashSessionApi.closeSession:', error);
      throw error;
    }
  }
};
