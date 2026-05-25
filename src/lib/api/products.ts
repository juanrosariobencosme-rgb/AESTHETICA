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
    ...(product.stock !== undefined && product.stock !== null ? { stock: product.stock } : {})
  };
}

function isSchemaCacheMissingColumn(error: any): boolean {
  const msg = String(error?.message || '');
  return error?.code === 'PGRST204' || msg.includes('schema cache') || msg.includes('Could not find the');
}

function extractMissingColumnName(error: any): string | null {
  const msg = String(error?.message || '');
  const match = msg.match(/Could not find the '([^']+)' column/i);
  return match?.[1] ?? null;
}

function omitKey(obj: any, key: string): any {
  if (!obj || typeof obj !== 'object') return obj;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: _ignored, ...rest } = obj;
  return rest;
}

async function retryWithoutMissingColumns<T>(
  exec: (payload: any) => Promise<{ data: T; error: any }>,
  payload: any,
  maxIterations = 6
): Promise<{ data: T; error: any; payload: any }> {
  let currentPayload = payload;
  let last = await exec(currentPayload);

  for (let i = 0; i < maxIterations && last.error && isSchemaCacheMissingColumn(last.error); i++) {
    const missing = extractMissingColumnName(last.error);
    if (!missing) break;

    if (Array.isArray(currentPayload)) {
      currentPayload = currentPayload.map((row) => omitKey(row, missing));
    } else {
      currentPayload = omitKey(currentPayload, missing);
    }

    last = await exec(currentPayload);
  }

  return { ...last, payload: currentPayload };
}

function shouldRetryWithStockDefault(error: any): boolean {
  return (
    error?.code === '23502' ||
    (typeof error?.message === 'string' && error.message.includes('null value in column "stock"'))
  );
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
      let dbProduct = toDbProduct(product);
      
      let { data, error, payload } = await retryWithoutMissingColumns(
        async (p) => supabase.from('products').insert(p).select().single(),
        dbProduct
      );
      dbProduct = payload;

      if (error && shouldRetryWithStockDefault(error)) {
        dbProduct = { ...dbProduct, stock: product.stock ?? 0 };
        ({ data, error } = await supabase.from('products').insert(dbProduct).select().single());
      }
      
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
      let dbProduct = toDbProduct(product);
      
      const { data, error, payload } = await retryWithoutMissingColumns(
        async (p) => supabase.from('products').update(p).eq('id', id).select().single(),
        dbProduct
      );
      dbProduct = payload;
      
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
      let dbProducts = products.map(toDbProduct);
      
      let result = await retryWithoutMissingColumns(
        async (p) => supabase.from('products').upsert(p, { onConflict: 'id' }).select(),
        dbProducts
      );
      let { data, error, payload } = result;
      dbProducts = payload;

      if (error && shouldRetryWithStockDefault(error)) {
        dbProducts = dbProducts.map((product) => ({
          ...product,
          stock: product.stock ?? 0
        }));
        ({ data, error } = await supabase.from('products').upsert(dbProducts, { onConflict: 'id' }).select());
      }
      
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
