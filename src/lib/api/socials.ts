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
    
    if (!data) return null;
    
    // Transform snake_case to camelCase
    return {
      whatsAppPhone: data.whatsapp_phone,
      whatsAppText: data.whatsapp_text,
      instagramUrl: data.instagram_url,
      facebookUrl: data.facebook_url
    };
  },

  async update(config: SocialConfig): Promise<SocialConfig> {
    // Transform camelCase to snake_case
    const dbConfig = {
      id: 'default',
      whatsapp_phone: config.whatsAppPhone,
      whatsapp_text: config.whatsAppText,
      instagram_url: config.instagramUrl,
      facebook_url: config.facebookUrl
    };
    
    const { data, error } = await supabase
      .from('social_config')
      .upsert(dbConfig, { onConflict: 'id' })
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform back to camelCase
    return {
      whatsAppPhone: data.whatsapp_phone,
      whatsAppText: data.whatsapp_text,
      instagramUrl: data.instagram_url,
      facebookUrl: data.facebook_url
    };
  }
};
