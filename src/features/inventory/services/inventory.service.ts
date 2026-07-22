import { createClient } from '@/lib/supabase/client';

import type {
  Category,
  Brand,
  Unit,
  Product,
} from '../types';

import type { ProductSchema } from '../inventory-schema';

const supabase = createClient();

export class InventoryService {

  // =========================================
  // Categories
  // =========================================

  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('status', 'Active')
      .order('category_name');

    if (error) throw new Error(error.message);

    return (data ?? []) as Category[];
  }

  // =========================================
  // Brands
  // =========================================

  static async getBrands(): Promise<Brand[]> {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('status', 'Active')
      .order('brand_name');

    if (error) throw new Error(error.message);

    return (data ?? []) as Brand[];
  }

  // =========================================
  // Units
  // =========================================

  static async getUnits(): Promise<Unit[]> {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .order('unit_name');

    if (error) throw new Error(error.message);

    return (data ?? []) as Unit[];
  }

  // =========================================
  // Products
  // =========================================

  static async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        brand:brands(*),
        unit:units(*)
      `)
      .order('product_name');

    if (error) throw new Error(error.message);

    return (data ?? []) as unknown as Product[];
  }

  static async createProduct(values: ProductSchema) {
    const payload = {
      ...values,
      current_stock: values.opening_stock, // initial stock
    };

    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error(
        'Create product error:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(error.message);
    }

    return data;
  }

  static async updateProduct(
    id: string,
    values: ProductSchema
  ) {
    const payload = {
      ...values,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(
        'Update product error:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(error.message);
    }

    return data;
  }

  static async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    return true;
  }
}