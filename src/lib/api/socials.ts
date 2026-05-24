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
        whatsappPhone: data.whatsappPhone,
        whatsAppText: data.whatsAppText,
        instagramUrl: data.instagramUrl,
        facebookUrl: data.facebookUrl
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
        whatsappPhone: config.whatsappPhone,
        whatsAppText: config.whatsAppText,
        instagramUrl: config.instagramUrl,
        facebookUrl: config.facebookUrl
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
        whatsappPhone: data.whatsappPhone,
        whatsAppText: data.whatsAppText,
        instagramUrl: data.instagramUrl,
        facebookUrl: data.facebookUrl
      };
    } catch (error) {
      console.error('Error in socialsApi.update:', error);
      throw error;
    }
  }
};
