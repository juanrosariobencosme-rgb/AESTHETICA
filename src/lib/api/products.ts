import { supabase } from '../supabase';
import { Product } from '../../types';

export const productsApi = {
  async getAll(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      return data as Product[];
    } catch (error) {
      console.error('Error in productsApi.getAll:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching product by id:', error);
        throw error;
      }
      
      return data as Product;
    } catch (error) {
      console.error('Error in productsApi.getById:', error);
      throw error;
    }
  },

  async create(product: Product): Promise<Product> {
    try {
      console.log('Creating product:', product);
      
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating product:', error);
        throw error;
      }
      
      console.log('Product created successfully:', data);
      return data as Product;
    } catch (error) {
      console.error('Error in productsApi.create:', error);
      throw error;
    }
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    try {
      console.log('Updating product:', id, product);
      
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
      
      console.log('Product updated successfully:', data);
      return data as Product;
    } catch (error) {
      console.error('Error in productsApi.update:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      console.log('Deleting product:', id);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
      
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Error in productsApi.delete:', error);
      throw error;
    }
  },

  async upsert(products: Product[]): Promise<Product[]> {
    try {
      console.log('Upserting products:', products.length);
      
      const { data, error } = await supabase
        .from('products')
        .upsert(products, { onConflict: 'id' })
        .select();
      
      if (error) {
        console.error('Error upserting products:', error);
        throw error;
      }
      
      console.log('Products upserted successfully');
      return data as Product[];
    } catch (error) {
      console.error('Error in productsApi.upsert:', error);
      throw error;
    }
  }
};
