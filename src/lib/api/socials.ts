import { supabase } from '../supabase';
import { SocialConfig } from '../../types';

export const socialsApi = {
  async get(): Promise<SocialConfig | null> {
    const { data, error } = await supabase
      .from('social_config')
      .select('*')
      .eq('id', 'default')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data as SocialConfig || null;
  },

  async update(config: SocialConfig): Promise<SocialConfig> {
    const { data, error } = await supabase
      .from('social_config')
      .upsert({ ...config, id: 'default' }, { onConflict: 'id' })
      .select()
      .single();
    
    if (error) throw error;
    return data as SocialConfig;
  }
};
