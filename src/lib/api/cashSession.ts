import { supabase } from '../supabase';
import { CashSession } from '../../types';

function isUndefinedColumnError(error: any): boolean {
  const message = String(error?.message || '').toLowerCase();
  return (
    error?.code === '42703' ||
    error?.code === '406' ||
    (typeof error?.message === 'string' && message.includes('does not exist')) ||
    message.includes('not acceptable')
  );
}

function normalizeNumber(value: any, fallback: number): number {
  if (value === null || value === undefined) return fallback;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeSessionForDb(session: CashSession | Partial<CashSession>): CashSession | Partial<CashSession> {
  // Evita enviar `null`/NaN a columnas NOT NULL del esquema (ej: sales_cash)
  return {
    ...session,
    startingBalance:
      (session as any).startingBalance === undefined
        ? (session as any).startingBalance
        : normalizeNumber((session as any).startingBalance, 0),
    salesCash:
      (session as any).salesCash === undefined
        ? (session as any).salesCash
        : normalizeNumber((session as any).salesCash, 0),
    salesTransfer:
      (session as any).salesTransfer === undefined
        ? (session as any).salesTransfer
        : normalizeNumber((session as any).salesTransfer, 0),
    totalExpenses:
      (session as any).totalExpenses === undefined
        ? (session as any).totalExpenses
        : normalizeNumber((session as any).totalExpenses, 0),
    expectedBalance:
      (session as any).expectedBalance === undefined
        ? (session as any).expectedBalance
        : normalizeNumber((session as any).expectedBalance, 0),
    history:
      (session as any).history === undefined
        ? (session as any).history
        : ((session as any).history ?? [])
  };
}

function fromDbSession(row: any): CashSession {
  return {
    id: row.id,
    isOpen: row.isopen ?? row.is_open,
    openedAt: row.openedat ?? row.opened_at,
    closedAt: row.closedat ?? row.closed_at ?? null,
    startingBalance: Number(row.startingbalance ?? row.starting_balance),
    salesCash: Number(row.salescash ?? row.sales_cash),
    salesTransfer: Number(row.salestransfer ?? row.sales_transfer),
    totalExpenses: Number(row.totalexpenses ?? row.total_expenses),
    expectedBalance: Number(row.expectedbalance ?? row.expected_balance),
    history: row.history ?? []
  };
}

function toDbSession(session: CashSession | Partial<CashSession>): any {
  return {
    ...(session.id ? { id: session.id } : {}),
    ...(session.isOpen !== undefined ? { is_open: session.isOpen } : {}),
    ...(session.openedAt !== undefined ? { opened_at: session.openedAt } : {}),
    ...(session.closedAt !== undefined ? { closed_at: session.closedAt } : {}),
    ...(session.startingBalance !== undefined ? { starting_balance: session.startingBalance } : {}),
    ...(session.salesCash !== undefined ? { sales_cash: session.salesCash } : {}),
    ...(session.salesTransfer !== undefined ? { sales_transfer: session.salesTransfer } : {}),
    ...(session.totalExpenses !== undefined ? { total_expenses: session.totalExpenses } : {}),
    ...(session.expectedBalance !== undefined ? { expected_balance: session.expectedBalance } : {}),
    ...(session.history !== undefined ? { history: session.history } : {})
  };
}

function toLegacyDbSession(session: CashSession | Partial<CashSession>): any {
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
      // Primero probamos con el esquema "snake_case" (supabase-schema.sql).
      // Si el proyecto tiene un esquema viejo (ej: isopen/openedat), hacemos fallback automático.
      let { data, error } = await supabase
        .from('cash_sessions')
        .select('*')
        .eq('is_open', true)
        .order('opened_at', { ascending: false })
        .limit(1)
        .single();

      if (error && isUndefinedColumnError(error)) {
        ({ data, error } = await supabase
          .from('cash_sessions')
          .select('*')
          .eq('isopen', true)
          .order('openedat', { ascending: false })
          .limit(1)
          .single());
      }

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
      const normalized = normalizeSessionForDb(session) as CashSession;
      // Intento 1: esquema nuevo; si falla por columnas, reintenta con esquema legado.
      let dbSession = toDbSession(normalized);
      console.log('Creating cash session:', dbSession);

      let { data, error } = await supabase
        .from('cash_sessions')
        .insert(dbSession)
        .select()
        .single();

      if (error && isUndefinedColumnError(error)) {
        dbSession = toLegacyDbSession(normalized);
        console.log('Retry creating cash session with legacy columns:', dbSession);
        ({ data, error } = await supabase
          .from('cash_sessions')
          .insert(dbSession)
          .select()
          .single());
      }

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

      let { data, error } = await supabase
        .from('cash_sessions')
        .update({
          is_open: false,
          closed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error && isUndefinedColumnError(error)) {
        ({ data, error } = await supabase
          .from('cash_sessions')
          .update({
            isopen: false,
            closedat: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single());
      }

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
      const normalized = normalizeSessionForDb(session) as Partial<CashSession>;
      let dbSession: any = toDbSession(normalized);

      let { data, error } = await supabase
        .from('cash_sessions')
        .update(dbSession)
        .eq('id', id)
        .select()
        .single();

      if (error && isUndefinedColumnError(error)) {
        dbSession = toLegacyDbSession(normalized);
        ({ data, error } = await supabase
          .from('cash_sessions')
          .update(dbSession)
          .eq('id', id)
          .select()
          .single());
      }

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
