import { supabase } from '../supabase';
import { Combo } from '../../types';

function fromDbCombo(row: any): Combo {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    description: row.description,
    productIds: row.productids,
    price: row.price,
    valuePrice: row.valueprice ?? undefined,
    image: row.image,
    tag: row.tag ?? undefined,
    active: row.active ?? undefined,
    category: row.category ?? undefined
  };
}

function toDbCombo(combo: Combo | Partial<Combo>): any {
  return {
    ...(combo.id !== undefined ? { id: combo.id } : {}),
    ...(combo.title !== undefined ? { title: combo.title } : {}),
    ...(combo.subtitle !== undefined ? { subtitle: combo.subtitle } : {}),
    ...(combo.description !== undefined ? { description: combo.description } : {}),
    ...(combo.productIds !== undefined ? { productids: combo.productIds } : {}),
    ...(combo.price !== undefined ? { price: combo.price } : {}),
    ...(combo.valuePrice !== undefined ? { valueprice: combo.valuePrice } : {}),
    ...(combo.image !== undefined ? { image: combo.image } : {}),
    ...(combo.tag !== undefined ? { tag: combo.tag } : {}),
    ...(combo.active !== undefined ? { active: combo.active } : {}),
    ...(combo.category !== undefined ? { category: combo.category } : {})
  };
}

export const combosApi = {
  async getAll(): Promise<Combo[]> {
    const { data, error } = await supabase
      .from('combos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching combos:', error);
      throw error;
    }

    return (data || []).map(fromDbCombo);
  },

  async create(combo: Combo): Promise<Combo> {
    const dbCombo = toDbCombo(combo);
    const { data, error } = await supabase
      .from('combos')
      .insert(dbCombo)
      .select()
      .single();

    if (error) {
      console.error('Error creating combo:', error);
      throw error;
    }

    return fromDbCombo(data);
  },

  async update(id: string, combo: Partial<Combo>): Promise<Combo> {
    const dbCombo = toDbCombo(combo);
    const { data, error } = await supabase
      .from('combos')
      .update(dbCombo)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating combo:', error);
      throw error;
    }

    return fromDbCombo(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('combos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting combo:', error);
      throw error;
    }
  }
};
