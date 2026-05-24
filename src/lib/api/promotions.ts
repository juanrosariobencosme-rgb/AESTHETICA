import { supabase } from '../supabase';
import { PromotionBundle } from '../../types';

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

      return data.map(promo => ({
        id: promo.id,
        title: promo.title,
        subtitle: promo.subtitle,
        description: promo.description,
        productIds: promo.productIds,
        price: promo.price,
        valuePrice: promo.valuePrice,
        image: promo.image,
        tag: promo.tag
      })) as PromotionBundle[];
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

      return {
        id: data.id,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        productIds: data.productIds,
        price: data.price,
        valuePrice: data.valuePrice,
        image: data.image,
        tag: data.tag
      } as PromotionBundle;
    } catch (error) {
      console.error('Error in promotionsApi.getById:', error);
      throw error;
    }
  },

  async create(promotion: PromotionBundle): Promise<PromotionBundle> {
    try {
      const dbPromotion = {
        id: promotion.id,
        title: promotion.title,
        subtitle: promotion.subtitle,
        description: promotion.description,
        productIds: promotion.productIds,
        price: promotion.price,
        valuePrice: promotion.valuePrice,
        image: promotion.image,
        tag: promotion.tag
      };

      console.log('Creating promotion:', dbPromotion);

      const { data, error } = await supabase
        .from('promotions')
        .insert(dbPromotion)
        .select()
        .single();

      if (error) {
        console.error('Error creating promotion:', error);
        throw error;
      }

      console.log('Promotion created successfully');

      return {
        id: data.id,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        productIds: data.productIds,
        price: data.price,
        valuePrice: data.valuePrice,
        image: data.image,
        tag: data.tag
      } as PromotionBundle;
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

      const dbPromotions = promotions.map(promo => ({
        id: promo.id,
        title: promo.title,
        subtitle: promo.subtitle,
        description: promo.description,
        productIds: promo.productIds,
        price: promo.price,
        valuePrice: promo.valuePrice,
        image: promo.image,
        tag: promo.tag
      }));

      const { data, error } = await supabase
        .from('promotions')
        .upsert(dbPromotions, { onConflict: 'id' })
        .select();

      if (error) {
        console.error('Error upserting promotions:', error);
        throw error;
      }

      console.log('Promotions upserted successfully');

      return data.map(promo => ({
        id: promo.id,
        title: promo.title,
        subtitle: promo.subtitle,
        description: promo.description,
        productIds: promo.productIds,
        price: promo.price,
        valuePrice: promo.valuePrice,
        image: promo.image,
        tag: promo.tag
      })) as PromotionBundle[];
    } catch (error) {
      console.error('Error in promotionsApi.upsert:', error);
      throw error;
    }
  }
};
