import { supabase } from '../supabase';
import { SocialConfig } from '../../types';

function shouldRetryWithLegacyColumns(error: any): boolean {
  return (
    error?.code === 'PGRST204' ||
    error?.code === '42703' ||
    (typeof error?.message === 'string' && error.message.includes('schema cache'))
  );
}

function fromDbSocials(row: any): SocialConfig {
  return {
    whatsAppPhone: row.whatsapp_phone ?? row.whatsapp ?? row.whatsappphone ?? '',
    whatsAppText: row.whatsapp_text ?? row.whatsapptext ?? '',
    instagramUrl: row.instagram_url ?? row.instagram ?? '',
    facebookUrl: row.facebook_url ?? row.facebook ?? ''
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
      // Si el form viene con undefined por datos incompletos, normalizamos a string.
      const normalized: SocialConfig = {
        whatsAppPhone: config.whatsAppPhone ?? '',
        whatsAppText: config.whatsAppText ?? '',
        instagramUrl: config.instagramUrl ?? '',
        facebookUrl: config.facebookUrl ?? ''
      };

      let dbConfig: any = {
        id: 'default',
        whatsapp_phone: normalized.whatsAppPhone,
        whatsapp_text: normalized.whatsAppText,
        instagram_url: normalized.instagramUrl,
        facebook_url: normalized.facebookUrl
      };

      console.log('Updating social config:', dbConfig);

      let { data, error } = await supabase
        .from('social_config')
        .upsert(dbConfig, { onConflict: 'id' })
        .select()
        .single();

      // Fallback si el esquema viejo no tiene whatsapp_phone (ej: "whatsapp")
      if (error && shouldRetryWithLegacyColumns(error) && String(error.message || '').includes('whatsapp_phone')) {
        dbConfig = {
          id: 'default',
          whatsapp: normalized.whatsAppPhone,
          whatsapptext: normalized.whatsAppText,
          instagram: normalized.instagramUrl,
          facebook: normalized.facebookUrl
        };
        console.log('Retry updating social config with legacy columns:', dbConfig);
        ({ data, error } = await supabase
          .from('social_config')
          .upsert(dbConfig, { onConflict: 'id' })
          .select()
          .single());
      }

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
