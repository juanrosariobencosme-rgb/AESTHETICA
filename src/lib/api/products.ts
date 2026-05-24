import { supabase } from '../supabase';
import { Product } from '../../types';

function toDbProduct(product: Product | Partial<Product>): any {
  // Mantener solo columnas que existen en `supabase-schema.sql` (evita errores "column ... does not exist")
  return {
    ...(product.id !== undefined ? { id: product.id } : {}),
    ...(product.name !== undefined ? { name: product.name } : {}),
    ...(product.subtitle !== undefined ? { subtitle: product.subtitle } : {}),
    ...(product.description !== undefined ? { description: product.description } : {}),
    ...(product.price !== undefined ? { price: product.price } : {}),
    ...(product.size !== undefined ? { size: product.size } : {}),
    ...(product.ingredients !== undefined ? { ingredients: product.ingredients } : {}),
    ...(product.benefits !== undefined ? { benefits: product.benefits } : {}),
    ...(product.usage !== undefined ? { usage: product.usage } : {}),
    ...(product.image !== undefined ? { image: product.image } : {}),
    ...(product.concern !== undefined ? { concern: product.concern } : {}),
    ...(product.rating !== undefined ? { rating: product.rating } : {}),
    ...(product.texture !== undefined ? { texture: product.texture } : {}),
    ...(product.stock !== undefined ? { stock: product.stock } : {})
  };
}

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
      const dbProduct = toDbProduct(product);
      
      const { data, error } = await supabase
        .from('products')
        .insert(dbProduct)
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
      const dbProduct = toDbProduct(product);
      
      const { data, error } = await supabase
        .from('products')
        .update(dbProduct)
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
      const dbProducts = products.map(toDbProduct);
      
      const { data, error } = await supabase
        .from('products')
        .upsert(dbProducts, { onConflict: 'id' })
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
