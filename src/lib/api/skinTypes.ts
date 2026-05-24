import { supabase } from '../supabase';
import { SkinType } from '../../types';

export const skinTypesApi = {
  async getAll(): Promise<SkinType[]> {
    try {
      const { data, error } = await supabase
        .from('skin_types')
        .select('name')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching skin types:', error);
        throw error;
      }

      return (data || []).map((item: any) => item.name) as SkinType[];
    } catch (error) {
      console.error('Error in skinTypesApi.getAll:', error);
      throw error;
    }
  }
};
