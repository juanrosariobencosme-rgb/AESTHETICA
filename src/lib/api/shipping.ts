import { supabase } from '../supabase';
import { ShippingSettings } from '../../types';

export const shippingApi = {
  async get(): Promise<ShippingSettings | null> {
    const { data, error } = await supabase
      .from('shipping_settings')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching shipping settings:', error);
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      districtRate: Number(data.districtRate),
      outsideRate: Number(data.outsideRate),
      districtKeywords: data.districtKeywords || []
    } as ShippingSettings;
  },

  async upsert(settings: ShippingSettings): Promise<ShippingSettings> {
    const dbSettings = {
      id: 'default',
      districtRate: settings.districtRate,
      outsideRate: settings.outsideRate,
      districtKeywords: settings.districtKeywords
    };

    const { data, error } = await supabase
      .from('shipping_settings')
      .upsert(dbSettings, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving shipping settings:', error);
      throw error;
    }

    return {
      id: data.id,
      districtRate: Number(data.districtRate),
      outsideRate: Number(data.outsideRate),
      districtKeywords: data.districtKeywords || []
    } as ShippingSettings;
  }
};
