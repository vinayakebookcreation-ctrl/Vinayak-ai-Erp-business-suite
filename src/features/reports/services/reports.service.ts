import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export class ReportsService {

  // =========================================
  // Monthly Sales
  // =========================================

  static async getMonthlySales() {
    const { data, error } = await supabase
      .from('sales_invoices')
      .select('invoice_date, grand_total')
      .eq('status', 'Confirmed');

    if (error) {
      throw new Error(error.message);
    }

    const monthlyMap: Record<string, number> = {};

    (data ?? []).forEach((invoice) => {
      if (!invoice.invoice_date) return;

      const month = new Date(invoice.invoice_date).toLocaleString(
        'en-IN',
        { month: 'short' }
      );

      monthlyMap[month] =
        (monthlyMap[month] || 0) +
        Number(invoice.grand_total || 0);
    });

    return Object.entries(monthlyMap).map(([month, sales]) => ({
      month,
      sales,
    }));
  }

  // =========================================
  // Monthly Purchases
  // =========================================

  static async getMonthlyPurchases() {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('purchase_date, grand_total')
      .eq('status', 'Confirmed');

    if (error) {
      throw new Error(error.message);
    }

    const monthlyMap: Record<string, number> = {};

    (data ?? []).forEach((order) => {
      if (!order.purchase_date) return;

      const month = new Date(order.purchase_date).toLocaleString(
        'en-IN',
        { month: 'short' }
      );

      monthlyMap[month] =
        (monthlyMap[month] || 0) +
        Number(order.grand_total || 0);
    });

    return Object.entries(monthlyMap).map(([month, purchases]) => ({
      month,
      purchases,
    }));
  }

  // =========================================
  // Low Stock Products
  // =========================================

  static async getLowStockProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        product_name,
        current_stock,
        minimum_stock
      `)
      .order('current_stock', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    // Filter products where current_stock <= minimum_stock
    return (data ?? []).filter((product) => {
      const current = Number(product.current_stock || 0);
      const minimum = Number(product.minimum_stock || 0);

      return current <= minimum;
    });
  }

  // =========================================
  // Inventory Valuation
  // =========================================

  static async getInventoryValuation() {
    const { data, error } = await supabase
      .from('products')
      .select('current_stock, purchase_price');

    if (error) {
      throw new Error(error.message);
    }

    const totalValue = (data ?? []).reduce((sum, item) => {
      return (
        sum +
        Number(item.current_stock || 0) *
        Number(item.purchase_price || 0)
      );
    }, 0);

    return totalValue;
  }

  // =========================================
  // Dashboard Summary
  // =========================================

  static async getDashboardSummary() {

    // Sales
    const { data: salesData, error: salesError } = await supabase
      .from('sales_invoices')
      .select('grand_total')
      .eq('status', 'Confirmed');

    if (salesError) {
      throw new Error(salesError.message);
    }

    const totalSales = (salesData ?? []).reduce(
      (sum, item) => sum + Number(item.grand_total || 0),
      0
    );

    // Purchases
    const { data: purchaseData, error: purchaseError } = await supabase
      .from('purchase_orders')
      .select('grand_total')
      .eq('status', 'Confirmed');

    if (purchaseError) {
      throw new Error(purchaseError.message);
    }

    const totalPurchases = (purchaseData ?? []).reduce(
      (sum, item) => sum + Number(item.grand_total || 0),
      0
    );

    // Products count
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Customers count
    const { count: customerCount } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });

    return {
      totalSales,
      totalPurchases,
      totalProfit: totalSales - totalPurchases,
      productCount: productCount || 0,
      customerCount: customerCount || 0,
    };
  }
}