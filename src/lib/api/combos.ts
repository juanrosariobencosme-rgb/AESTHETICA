import { supabase } from '../supabase';
import { Combo } from '../../types';

export const combosApi = {
  async getAll(): Promise<Combo[]> {
    const { data, error } = await supabase
      .from('combos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching combos:', error);
      throw error;
    }

    return (data || []) as Combo[];
  },

  async create(combo: Combo): Promise<Combo> {
    const { data, error } = await supabase
      .from('combos')
      .insert(combo)
      .select()
      .single();

    if (error) {
      console.error('Error creating combo:', error);
      throw error;
    }

    return data as Combo;
  },

  async update(id: string, combo: Partial<Combo>): Promise<Combo> {
    const { data, error } = await supabase
      .from('combos')
      .update(combo)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating combo:', error);
      throw error;
    }

    return data as Combo;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('combos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting combo:', error);
      throw error;
    }
  }
};
