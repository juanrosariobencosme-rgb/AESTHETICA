import { supabase } from '../supabase';
import { ShippingSettings } from '../../types';

function fromDbSettings(row: any): ShippingSettings {
  return {
    id: row.id,
    districtRate: Number(row.districtrate),
    outsideRate: Number(row.outsiderate),
    districtKeywords: row.districtkeywords || []
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
      districtrate: settings.districtRate,
      outsiderate: settings.outsideRate,
      districtkeywords: settings.districtKeywords
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
