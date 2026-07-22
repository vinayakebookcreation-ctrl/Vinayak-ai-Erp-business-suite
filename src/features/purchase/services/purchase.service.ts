import { createClient } from '@/lib/supabase/client';

import type { Supplier } from '@/features/supplier/types';
import type { Product } from '@/features/inventory/types';

import type { PurchaseSchema } from '../purchase-schema';
import type { PurchaseOrder } from '../types';

const supabase = createClient();

export class PurchaseService {

  // =========================================
  // Suppliers
  // =========================================

  static async getSuppliers(): Promise<Supplier[]> {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('status', 'Active')
      .order('supplier_name');

    if (error) throw new Error(error.message);

    return (data ?? []) as Supplier[];
  }

  // =========================================
  // Products
  // =========================================

  static async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'Active')
      .order('product_name');

    if (error) throw new Error(error.message);

    return (data ?? []) as Product[];
  }

  // =========================================
  // Create Purchase
  // =========================================

  static async createPurchase(values: PurchaseSchema) {

    // Calculate totals
    let subtotal = 0;
    let gstAmount = 0;

    const items = values.items.map((item) => {
      const lineSubtotal =
        item.quantity * item.purchase_price;

      const lineGst =
        (lineSubtotal * item.gst_percent) / 100;

      subtotal += lineSubtotal;
      gstAmount += lineGst;

      return {
        ...item,
        line_total: lineSubtotal + lineGst,
      };
    });

    const grandTotal =
      subtotal + gstAmount + values.other_charges;

    // Create purchase order
    const { data: order, error: orderError } = await supabase
      .from('purchase_orders')
      .insert([
        {
          po_number: values.po_number,
          supplier_id: values.supplier_id,
          purchase_date: values.purchase_date,
          subtotal,
          gst_amount: gstAmount,
          other_charges: values.other_charges,
          grand_total: grandTotal,
          notes: values.notes,
          status: values.status,
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error(orderError);
      throw new Error(orderError.message);
    }

    // Create purchase items
    const purchaseItems = items.map((item) => ({
      purchase_order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      purchase_price: item.purchase_price,
      gst_percent: item.gst_percent,
      line_total: item.line_total,
    }));

    const { error: itemsError } = await supabase
      .from('purchase_items')
      .insert(purchaseItems);

    if (itemsError) {
      console.error(itemsError);
      throw new Error(itemsError.message);
    }

    // =========================================
    // AUTO STOCK UPDATE
    // =========================================

    if (values.status === 'Received') {
      for (const item of items) {

        // Get current stock
        const { data: product, error: productError } =
          await supabase
            .from('products')
            .select('current_stock')
            .eq('id', item.product_id)
            .single();

        if (productError) {
          throw new Error(productError.message);
        }

        const newStock =
          Number(product.current_stock || 0) +
          Number(item.quantity);

        // Update stock
        const { error: updateError } = await supabase
          .from('products')
          .update({
            current_stock: newStock,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.product_id);

        if (updateError) {
          throw new Error(updateError.message);
        }
      }
    }

    return order;
  }

  // =========================================
  // Get Purchase Orders
  // =========================================

  static async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select(`
        *,
        supplier:suppliers(
          id,
          supplier_name,
          gst_number
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []) as unknown as PurchaseOrder[];
  }

  // =========================================
  // Delete Purchase Order
  // =========================================

  static async deletePurchaseOrder(id: string) {
    const { error } = await supabase
      .from('purchase_orders')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    return true;
  }
}