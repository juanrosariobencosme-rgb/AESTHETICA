import { supabase } from '../supabase';
import { CarouselBanner } from '../../types';

export const carouselApi = {
  async getAll(): Promise<CarouselBanner[]> {
    const { data, error } = await supabase
      .from('carousel_banners')
      .select('*')
      .order('priority', { ascending: true });

    if (error) {
      console.error('Error fetching carousel banners:', error);
      throw error;
    }

    return (data || []) as CarouselBanner[];
  },

  async create(banner: CarouselBanner): Promise<CarouselBanner> {
    const { data, error } = await supabase
      .from('carousel_banners')
      .insert(banner)
      .select()
      .single();

    if (error) {
      console.error('Error creating carousel banner:', error);
      throw error;
    }

    return data as CarouselBanner;
  },

  async update(id: string, banner: Partial<CarouselBanner>): Promise<CarouselBanner> {
    const { data, error } = await supabase
      .from('carousel_banners')
      .update(banner)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating carousel banner:', error);
      throw error;
    }

    return data as CarouselBanner;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('carousel_banners')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting carousel banner:', error);
      throw error;
    }
  }
};
