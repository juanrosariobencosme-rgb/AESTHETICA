import { supabase } from '../supabase';
import { CarouselBanner } from '../../types';

function shouldRetryWithLegacyColumns(error: any): boolean {
  return (
    error?.code === 'PGRST204' ||
    error?.code === '42703' ||
    (typeof error?.message === 'string' && error.message.includes('schema cache'))
  );
}

function fromDbBanner(row: any): CarouselBanner {
  return {
    id: row.id,
    image: row.image,
    title: row.title,
    description: row.description,
    buttonText: row.button_text ?? row.buttontext ?? undefined,
    buttonUrl: row.button_url ?? row.buttonurl ?? undefined,
    relatedProductId: row.related_product_id ?? row.relatedproductid ?? undefined,
    active: row.active ?? undefined,
    priority: row.priority ?? undefined,
    category: row.category ?? undefined
  };
}

function toDbBanner(banner: CarouselBanner | Partial<CarouselBanner>): any {
  return {
    ...(banner.id !== undefined ? { id: banner.id } : {}),
    ...(banner.image !== undefined ? { image: banner.image } : {}),
    ...(banner.title !== undefined ? { title: banner.title } : {}),
    ...(banner.description !== undefined ? { description: banner.description } : {}),
    ...(banner.buttonText !== undefined ? { button_text: banner.buttonText } : {}),
    ...(banner.buttonUrl !== undefined ? { button_url: banner.buttonUrl } : {}),
    ...(banner.relatedProductId !== undefined ? { related_product_id: banner.relatedProductId } : {}),
    ...(banner.active !== undefined ? { active: banner.active } : {}),
    ...(banner.priority !== undefined ? { priority: banner.priority } : {}),
    ...(banner.category !== undefined ? { category: banner.category } : {})
  };
}

function toLegacyDbBanner(banner: CarouselBanner | Partial<CarouselBanner>): any {
  return {
    ...(banner.id !== undefined ? { id: banner.id } : {}),
    ...(banner.image !== undefined ? { image: banner.image } : {}),
    ...(banner.title !== undefined ? { title: banner.title } : {}),
    ...(banner.description !== undefined ? { description: banner.description } : {}),
    ...(banner.buttonText !== undefined ? { buttontext: banner.buttonText } : {}),
    ...(banner.buttonUrl !== undefined ? { buttonurl: banner.buttonUrl } : {}),
    ...(banner.relatedProductId !== undefined ? { relatedproductid: banner.relatedProductId } : {}),
    ...(banner.active !== undefined ? { active: banner.active } : {}),
    ...(banner.priority !== undefined ? { priority: banner.priority } : {}),
    ...(banner.category !== undefined ? { category: banner.category } : {})
  };
}

export const carouselApi = {
  async getAll(): Promise<CarouselBanner[]> {
    const { data, error } = await supabase
      .from('carousel_banners')
      .select('*')
      .order('priority', { ascending: true });

    if (error) {
      console.error('Error fetching carousel banners:', error);
      throw error;
    }

    return (data || []).map(fromDbBanner);
  },

  async create(banner: CarouselBanner): Promise<CarouselBanner> {
    let dbBanner = toDbBanner(banner);
    let { data, error } = await supabase
      .from('carousel_banners')
      .insert(dbBanner)
      .select()
      .single();

    if (error && shouldRetryWithLegacyColumns(error) && String(error.message || '').includes('button_text')) {
      dbBanner = toLegacyDbBanner(banner);
      ({ data, error } = await supabase
        .from('carousel_banners')
        .insert(dbBanner)
        .select()
        .single());
    }

    if (error) {
      console.error('Error creating carousel banner:', error);
      throw error;
    }

    return fromDbBanner(data);
  },

  async update(id: string, banner: Partial<CarouselBanner>): Promise<CarouselBanner> {
    let dbBanner = toDbBanner(banner);
    let { data, error } = await supabase
      .from('carousel_banners')
      .update(dbBanner)
      .eq('id', id)
      .select()
      .single();

    if (error && shouldRetryWithLegacyColumns(error) && String(error.message || '').includes('button_text')) {
      dbBanner = toLegacyDbBanner(banner);
      ({ data, error } = await supabase
        .from('carousel_banners')
        .update(dbBanner)
        .eq('id', id)
        .select()
        .single());
    }

    if (error) {
      console.error('Error updating carousel banner:', error);
      throw error;
    }

    return fromDbBanner(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('carousel_banners')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting carousel banner:', error);
      throw error;
    }
  }
};
