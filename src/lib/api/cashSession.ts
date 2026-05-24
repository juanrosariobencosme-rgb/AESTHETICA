import { supabase } from '../supabase';
import { CashSession } from '../../types';

export const cashSessionApi = {
  async getCurrent(): Promise<CashSession | null> {
    try {
      const { data, error } = await supabase
        .from('cash_sessions')
        .select('*')
        .eq('isOpen', true)
        .order('openedAt', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching current cash session:', error);
        throw error;
      }

      if (!data) return null;

      return {
        id: data.id,
        isOpen: data.isOpen,
        openedAt: data.openedAt,
        closedAt: data.closedAt,
        startingBalance: data.startingBalance,
        salesCash: data.salesCash,
        salesTransfer: data.salesTransfer,
        totalExpenses: data.totalExpenses,
        expectedBalance: data.expectedBalance,
        actualBalance: data.actualBalance,
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
        isOpen: session.isOpen,
        openedAt: session.openedAt,
        closedAt: session.closedAt,
        startingBalance: session.startingBalance,
        salesCash: session.salesCash,
        salesTransfer: session.salesTransfer,
        totalExpenses: session.totalExpenses,
        expectedBalance: session.expectedBalance,
        actualBalance: session.actualBalance,
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
        isOpen: data.isOpen,
        openedAt: data.openedAt,
        closedAt: data.closedAt,
        startingBalance: data.startingBalance,
        salesCash: data.salesCash,
        salesTransfer: data.salesTransfer,
        totalExpenses: data.totalExpenses,
        expectedBalance: data.expectedBalance,
        actualBalance: data.actualBalance,
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
          isOpen: false,
          closedAt: new Date().toISOString()
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
        isOpen: data.isOpen,
        openedAt: data.openedAt,
        closedAt: data.closedAt,
        startingBalance: data.startingBalance,
        salesCash: data.salesCash,
        salesTransfer: data.salesTransfer,
        totalExpenses: data.totalExpenses,
        expectedBalance: data.expectedBalance,
        actualBalance: data.actualBalance,
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
      if (session.isOpen !== undefined) dbSession.isOpen = session.isOpen;
      if (session.openedAt !== undefined) dbSession.openedAt = session.openedAt;
      if (session.closedAt !== undefined) dbSession.closedAt = session.closedAt;
      if (session.startingBalance !== undefined) dbSession.startingBalance = session.startingBalance;
      if (session.salesCash !== undefined) dbSession.salesCash = session.salesCash;
      if (session.salesTransfer !== undefined) dbSession.salesTransfer = session.salesTransfer;
      if (session.totalExpenses !== undefined) dbSession.totalExpenses = session.totalExpenses;
      if (session.expectedBalance !== undefined) dbSession.expectedBalance = session.expectedBalance;
      if (session.actualBalance !== undefined) dbSession.actualBalance = session.actualBalance;
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
        isOpen: data.isOpen,
        openedAt: data.openedAt,
        closedAt: data.closedAt,
        startingBalance: data.startingBalance,
        salesCash: data.salesCash,
        salesTransfer: data.salesTransfer,
        totalExpenses: data.totalExpenses,
        expectedBalance: data.expectedBalance,
        actualBalance: data.actualBalance,
        difference: data.difference,
        history: data.history
      } as CashSession;
    } catch (error) {
      console.error('Error in cashSessionApi.update:', error);
      throw error;
    }
  }
};
