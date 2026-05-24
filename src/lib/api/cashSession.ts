import { supabase } from '../supabase';
import { CashSession } from '../../types';

function fromDbSession(row: any): CashSession {
  return {
    id: row.id,
    isOpen: row.isopen,
    openedAt: row.openedat,
    closedAt: row.closedat ?? null,
    startingBalance: Number(row.startingbalance),
    salesCash: Number(row.salescash),
    salesTransfer: Number(row.salestransfer),
    totalExpenses: Number(row.totalexpenses),
    expectedBalance: Number(row.expectedbalance),
    history: row.history ?? []
  };
}

function toDbSession(session: CashSession | Partial<CashSession>): any {
  // Nota: el esquema actual NO incluye actual_balance/difference, así que no los enviamos.
  return {
    ...(session.id ? { id: session.id } : {}),
    ...(session.isOpen !== undefined ? { isopen: session.isOpen } : {}),
    ...(session.openedAt !== undefined ? { openedat: session.openedAt } : {}),
    ...(session.closedAt !== undefined ? { closedat: session.closedAt } : {}),
    ...(session.startingBalance !== undefined ? { startingbalance: session.startingBalance } : {}),
    ...(session.salesCash !== undefined ? { salescash: session.salesCash } : {}),
    ...(session.salesTransfer !== undefined ? { salestransfer: session.salesTransfer } : {}),
    ...(session.totalExpenses !== undefined ? { totalexpenses: session.totalExpenses } : {}),
    ...(session.expectedBalance !== undefined ? { expectedbalance: session.expectedBalance } : {}),
    ...(session.history !== undefined ? { history: session.history } : {})
  };
}

export const cashSessionApi = {
  async getCurrent(): Promise<CashSession | null> {
    try {
      const { data, error } = await supabase
        .from('cash_sessions')
        .select('*')
        .eq('isopen', true)
        .order('openedat', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching current cash session:', error);
        throw error;
      }

      if (!data) return null;

      return fromDbSession(data);
    } catch (error) {
      console.error('Error in cashSessionApi.getCurrent:', error);
      throw error;
    }
  },

  async create(session: CashSession): Promise<CashSession> {
    try {
      const dbSession = toDbSession(session);

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

      return fromDbSession(data);
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
          isopen: false,
          closedat: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error closing cash session:', error);
        throw error;
      }

      console.log('Cash session closed successfully');

      return fromDbSession(data);
    } catch (error) {
      console.error('Error in cashSessionApi.closeSession:', error);
      throw error;
    }
  },

  async update(id: string, session: Partial<CashSession>): Promise<CashSession> {
    try {
      console.log('Updating cash session:', id, session);

      const dbSession: any = toDbSession(session);

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

      return fromDbSession(data);
    } catch (error) {
      console.error('Error in cashSessionApi.update:', error);
      throw error;
    }
  }
};
