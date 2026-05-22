import { supabase } from '../supabase';
import { SocialConfig } from '../../types';

export const socialsApi = {
  async get(): Promise<SocialConfig | null> {
    try {
      const { data, error } = await supabase
        .from('social_config')
        .select('*')
        .eq('id', 'default')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching social config:', error);
        throw error;
      }
      
      if (!data) return null;
      
      return {
        whatsAppPhone: data.whatsapp_phone,
        whatsAppText: data.whatsapp_text,
        instagramUrl: data.instagram_url,
        facebookUrl: data.facebook_url
      };
    } catch (error) {
      console.error('Error in socialsApi.get:', error);
      throw error;
    }
  },

  async update(config: SocialConfig): Promise<SocialConfig> {
    try {
      const dbConfig = {
        id: 'default',
        whatsapp_phone: config.whatsAppPhone,
        whatsapp_text: config.whatsAppText,
        instagram_url: config.instagramUrl,
        facebook_url: config.facebookUrl
      };
      
      console.log('Updating social config:', dbConfig);
      
      const { data, error } = await supabase
        .from('social_config')
        .upsert(dbConfig, { onConflict: 'id' })
        .select()
        .single();
      
      if (error) {
        console.error('Error updating social config:', error);
        throw error;
      }
      
      console.log('Social config updated successfully');
      
      return {
        whatsAppPhone: data.whatsapp_phone,
        whatsAppText: data.whatsapp_text,
        instagramUrl: data.instagram_url,
        facebookUrl: data.facebook_url
      };
    } catch (error) {
      console.error('Error in socialsApi.update:', error);
      throw error;
    }
  }
};
