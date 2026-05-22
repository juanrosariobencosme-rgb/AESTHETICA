import { supabase } from '../supabase';
import { PromotionBundle } from '../../types';

export const promotionsApi = {
  async getAll(): Promise<PromotionBundle[]> {
    const { data, error } = await supabase
      .from('promotion_bundles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform snake_case to camelCase
    return data.map(promo => ({
      id: promo.id,
      title: promo.title,
      subtitle: promo.subtitle,
      description: promo.description,
      productIds: promo.product_ids,
      price: promo.price,
      valuePrice: promo.value_price,
      image: promo.image,
      tag: promo.tag
    })) as PromotionBundle[];
  },

  async getById(id: string): Promise<PromotionBundle | null> {
    const { data, error } = await supabase
      .from('promotion_bundles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Transform snake_case to camelCase
    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      productIds: data.product_ids,
      price: data.price,
      valuePrice: data.value_price,
      image: data.image,
      tag: data.tag
    } as PromotionBundle;
  },

  async create(promotion: PromotionBundle): Promise<PromotionBundle> {
    // Transform camelCase to snake_case
    const dbPromotion = {
      id: promotion.id,
      title: promotion.title,
      subtitle: promotion.subtitle,
      description: promotion.description,
      product_ids: promotion.productIds,
      price: promotion.price,
      value_price: promotion.valuePrice,
      image: promotion.image,
      tag: promotion.tag
    };
    
    const { data, error } = await supabase
      .from('promotion_bundles')
      .insert(dbPromotion)
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform back to camelCase
    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      productIds: data.product_ids,
      price: data.price,
      valuePrice: data.value_price,
      image: data.image,
      tag: data.tag
    } as PromotionBundle;
  },

  async update(id: string, promotion: Partial<PromotionBundle>): Promise<PromotionBundle> {
    // Transform camelCase to snake_case
    const dbPromotion: any = {};
    if (promotion.title !== undefined) dbPromotion.title = promotion.title;
    if (promotion.subtitle !== undefined) dbPromotion.subtitle = promotion.subtitle;
    if (promotion.description !== undefined) dbPromotion.description = promotion.description;
    if (promotion.productIds !== undefined) dbPromotion.product_ids = promotion.productIds;
    if (promotion.price !== undefined) dbPromotion.price = promotion.price;
    if (promotion.valuePrice !== undefined) dbPromotion.value_price = promotion.valuePrice;
    if (promotion.image !== undefined) dbPromotion.image = promotion.image;
    if (promotion.tag !== undefined) dbPromotion.tag = promotion.tag;
    
    const { data, error } = await supabase
      .from('promotion_bundles')
      .update(dbPromotion)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform back to camelCase
    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      productIds: data.product_ids,
      price: data.price,
      valuePrice: data.value_price,
      image: data.image,
      tag: data.tag
    } as PromotionBundle;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('promotion_bundles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async upsert(promotions: PromotionBundle[]): Promise<PromotionBundle[]> {
    // Transform camelCase to snake_case
    const dbPromotions = promotions.map(promo => ({
      id: promo.id,
      title: promo.title,
      subtitle: promo.subtitle,
      description: promo.description,
      product_ids: promo.productIds,
      price: promo.price,
      value_price: promo.valuePrice,
      image: promo.image,
      tag: promo.tag
    }));
    
    const { data, error } = await supabase
      .from('promotion_bundles')
      .upsert(dbPromotions, { onConflict: 'id' })
      .select();
    
    if (error) throw error;
    
    // Transform back to camelCase
    return data.map(promo => ({
      id: promo.id,
      title: promo.title,
      subtitle: promo.subtitle,
      description: promo.description,
      productIds: promo.product_ids,
      price: promo.price,
      valuePrice: promo.value_price,
      image: promo.image,
      tag: promo.tag
    })) as PromotionBundle[];
  }
};
