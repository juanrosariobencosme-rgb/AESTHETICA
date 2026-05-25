import { supabase } from '../supabase';
import { ShippingSettings } from '../../types';

function fromDbSettings(row: any): ShippingSettings {
  return {
    id: row.id,
    districtRate: Number(row.district_rate),
    outsideRate: Number(row.outside_rate),
    districtKeywords: row.district_keywords || []
  };
}

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

    return fromDbSettings(data);
  },

  async upsert(settings: ShippingSettings): Promise<ShippingSettings> {
    const dbSettings = {
      id: 'default',
      district_rate: settings.districtRate,
      outside_rate: settings.outsideRate,
      district_keywords: settings.districtKeywords
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

    return fromDbSettings(data);
  }
};
