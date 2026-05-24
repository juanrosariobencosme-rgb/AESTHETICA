import { supabase } from '../supabase';
import { SocialConfig } from '../../types';

function fromDbSocials(row: any): SocialConfig {
  return {
    whatsAppPhone: row.whatsappphone,
    whatsAppText: row.whatsapptext,
    instagramUrl: row.instagramurl,
    facebookUrl: row.facebookurl
  };
}

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

      return fromDbSocials(data);
    } catch (error) {
      console.error('Error in socialsApi.get:', error);
      throw error;
    }
  },

  async update(config: SocialConfig): Promise<SocialConfig> {
    try {
      const dbConfig = {
        id: 'default',
        whatsappphone: config.whatsAppPhone,
        whatsapptext: config.whatsAppText,
        instagramurl: config.instagramUrl,
        facebookurl: config.facebookUrl
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

      return fromDbSocials(data);
    } catch (error) {
      console.error('Error in socialsApi.update:', error);
      throw error;
    }
  }
};
