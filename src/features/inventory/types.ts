export type Category = {
  id: string;
  category_name: string;
  category_code?: string;
  description?: string;
  status: 'Active' | 'Inactive';
};

export type Brand = {
  id: string;
  brand_name: string;
  brand_code?: string;
  description?: string;
  status: 'Active' | 'Inactive';
};

export type Unit = {
  id: string;
  unit_name: string;
  unit_code: string;
};

export type Product = {
  id: string;

  sku: string;
  product_name: string;

  category_id: string;
  brand_id: string;
  unit_id: string;

  hsn_code?: string;

  purchase_price: number;
  sale_price: number;

  opening_stock: number;
  current_stock: number;
  reorder_level: number;

  description?: string;

  status: 'Active' | 'Inactive';

  created_at?: string;
  updated_at?: string;

  // Joined data
  category?: Category;
  brand?: Brand;
  unit?: Unit;
};