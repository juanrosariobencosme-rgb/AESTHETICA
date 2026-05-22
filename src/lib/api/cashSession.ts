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
    return data as CashSession || null;
  },

  async getById(id: string): Promise<CashSession | null> {
    const { data, error } = await supabase
      .from('cash_sessions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as CashSession;
  },

  async create(session: CashSession): Promise<CashSession> {
    const { data, error } = await supabase
      .from('cash_sessions')
      .insert(session)
      .select()
      .single();
    
    if (error) throw error;
    return data as CashSession;
  },

  async update(id: string, session: Partial<CashSession>): Promise<CashSession> {
    const { data, error } = await supabase
      .from('cash_sessions')
      .update(session)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as CashSession;
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
    return data as CashSession;
  },

  async getAllHistory(): Promise<CashSession[]> {
    const { data, error } = await supabase
      .from('cash_sessions')
      .select('*')
      .order('opened_at', { ascending: false });
    
    if (error) throw error;
    return data as CashSession[];
  }
};
