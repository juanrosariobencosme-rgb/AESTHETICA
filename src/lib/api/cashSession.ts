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
  },

  async update(id: string, session: Partial<CashSession>): Promise<CashSession> {
    try {
      console.log('Updating cash session:', id, session);
      
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
      
      if (error) {
        console.error('Error updating cash session:', error);
        throw error;
      }
      
      console.log('Cash session updated successfully');
      
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
      console.error('Error in cashSessionApi.update:', error);
      throw error;
    }
  }
};
