import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export class ReportsService {

  static async getDashboardStats() {

    // Total Sales
    const { data: sales } = await supabase
      .from('sales_invoices')
      .select('grand_total');

    // Total Purchase
    const { data: purchases } = await supabase
      .from('purchase_invoices')
      .select('grand_total');

    // Total Customers
    const { count: customerCount } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });

    // Total Products
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    const totalSales =
      sales?.reduce(
        (sum, item) => sum + Number(item.grand_total || 0),
        0
      ) || 0;

    const totalPurchase =
      purchases?.reduce(
        (sum, item) => sum + Number(item.grand_total || 0),
        0
      ) || 0;

      // Low Stock Products
const { data: lowStockProducts } = await supabase
  .from('products')
  .select('product_name, current_stock')
  .lte('current_stock', 5)
  .order('current_stock', { ascending: true });

    return {
  totalSales,
  totalPurchase,
  totalCustomers: customerCount || 0,
  totalProducts: productCount || 0,
  lowStockProducts: lowStockProducts || [],
};
  }
}