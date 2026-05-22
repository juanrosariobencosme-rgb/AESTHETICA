import { supabase } from '../supabase';
import { PromotionBundle } from '../../types';

export const promotionsApi = {
  async getAll(): Promise<PromotionBundle[]> {
    const { data, error } = await supabase
      .from('promotion_bundles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as PromotionBundle[];
  },

  async getById(id: string): Promise<PromotionBundle | null> {
    const { data, error } = await supabase
      .from('promotion_bundles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as PromotionBundle;
  },

  async create(promotion: PromotionBundle): Promise<PromotionBundle> {
    const { data, error } = await supabase
      .from('promotion_bundles')
      .insert(promotion)
      .select()
      .single();
    
    if (error) throw error;
    return data as PromotionBundle;
  },

  async update(id: string, promotion: Partial<PromotionBundle>): Promise<PromotionBundle> {
    const { data, error } = await supabase
      .from('promotion_bundles')
      .update(promotion)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as PromotionBundle;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('promotion_bundles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async upsert(promotions: PromotionBundle[]): Promise<PromotionBundle[]> {
    const { data, error } = await supabase
      .from('promotion_bundles')
      .upsert(promotions, { onConflict: 'id' })
      .select();
    
    if (error) throw error;
    return data as PromotionBundle[];
  }
};
