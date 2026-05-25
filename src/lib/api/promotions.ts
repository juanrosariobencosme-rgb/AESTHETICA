import { supabase } from '../supabase';
import { PromotionBundle } from '../../types';

function shouldRetryWithLegacyColumns(error: any): boolean {
  const message = String(error?.message || '').toLowerCase();
  return (
    error?.code === 'PGRST204' ||
    error?.code === '42703' ||
    error?.code === '406' ||
    message.includes('schema cache') ||
    message.includes('could not find') ||
    message.includes('does not exist') ||
    message.includes('not acceptable')
  );
}

function fromDbPromotion(promo: any): PromotionBundle {
  return {
    id: promo.id,
    title: promo.title,
    subtitle: promo.subtitle,
    description: promo.description,
    productIds: promo.product_ids ?? promo.productids ?? [],
    price: promo.price,
    valuePrice: promo.value_price ?? promo.valueprice ?? undefined,
    image: promo.image,
    tag: promo.tag ?? undefined,
    active: promo.active ?? undefined,
    category: promo.category ?? undefined
  } as PromotionBundle;
}

function toDbPromotion(promotion: PromotionBundle): any {
  return {
    id: promotion.id,
    title: promotion.title,
    subtitle: promotion.subtitle,
    description: promotion.description,
    product_ids: promotion.productIds,
    price: promotion.price,
    value_price: promotion.valuePrice ?? null,
    image: promotion.image,
    tag: promotion.tag ?? null,
    active: promotion.active ?? true,
    category: promotion.category ?? 'Promoción'
  };
}

function toLegacyDbPromotion(promotion: PromotionBundle): any {
  return {
    id: promotion.id,
    title: promotion.title,
    subtitle: promotion.subtitle,
    description: promotion.description,
    productids: promotion.productIds,
    price: promotion.price,
    valueprice: promotion.valuePrice ?? null,
    image: promotion.image,
    tag: promotion.tag ?? null,
    active: promotion.active ?? true,
    category: promotion.category ?? 'Promoción'
  };
}

export const promotionsApi = {
  async getAll(): Promise<PromotionBundle[]> {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching promotions:', error);
        throw error;
      }

      return (data || []).map(fromDbPromotion);
    } catch (error) {
      console.error('Error in promotionsApi.getAll:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<PromotionBundle | null> {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching promotion by id:', error);
        throw error;
      }

      if (!data) return null;

      return fromDbPromotion(data);
    } catch (error) {
      console.error('Error in promotionsApi.getById:', error);
      throw error;
    }
  },

  async create(promotion: PromotionBundle): Promise<PromotionBundle> {
    try {
      let dbPromotion = toDbPromotion(promotion);
      console.log('Creating promotion:', dbPromotion);

      let { data, error } = await supabase
        .from('promotions')
        .insert(dbPromotion)
        .select()
        .single();

      if (error && shouldRetryWithLegacyColumns(error) && String(error.message || '').match(/product_ids|productids|value_price|valueprice/)) {
        dbPromotion = toLegacyDbPromotion(promotion);
        ({ data, error } = await supabase
          .from('promotions')
          .insert(dbPromotion)
          .select()
          .single());
      }

      if (error) {
        console.error('Error creating promotion:', error);
        throw error;
      }

      console.log('Promotion created successfully');
      return fromDbPromotion(data);
    } catch (error) {
      console.error('Error in promotionsApi.create:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      console.log('Deleting promotion:', id);
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting promotion:', error);
        throw error;
      }

      console.log('Promotion deleted successfully');
    } catch (error) {
      console.error('Error in promotionsApi.delete:', error);
      throw error;
    }
  },

  async upsert(promotions: PromotionBundle[]): Promise<PromotionBundle[]> {
    try {
      console.log('Upserting promotions:', promotions.length);
      let dbPromotions = promotions.map(toDbPromotion);

      let { data, error } = await supabase
        .from('promotions')
        .upsert(dbPromotions, { onConflict: 'id' })
        .select();

      if (error && shouldRetryWithLegacyColumns(error) && String(error.message || '').match(/product_ids|productids|value_price|valueprice/)) {
        dbPromotions = promotions.map(toLegacyDbPromotion);
        ({ data, error } = await supabase
          .from('promotions')
          .upsert(dbPromotions, { onConflict: 'id' })
          .select());
      }

      if (error) {
        console.error('Error upserting promotions:', error);
        throw error;
      }

      console.log('Promotions upserted successfully');
      return (data || []).map(fromDbPromotion);
    } catch (error) {
      console.error('Error in promotionsApi.upsert:', error);
      throw error;
    }
  }
};
