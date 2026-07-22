import { createClient } from '@/lib/supabase/client';

import type { Customer } from '@/features/customer/types';
import type { Product } from '@/features/inventory/types';

import type { SalesSchema } from '../sales-schema';
import type { SalesInvoice } from '../types';

const supabase = createClient();

export class SalesService {

  // =========================================
  // Customers
  // =========================================

  static async getCustomers(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('status', 'Active')
      .order('customer_name');

    if (error) throw new Error(error.message);

    return (data ?? []) as Customer[];
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
  // Create Invoice
  // =========================================

  static async createInvoice(values: SalesSchema) {

    // Calculate totals
    let subtotal = 0;
    let gstAmount = 0;

    const items = values.items.map((item) => {
      const lineSubtotal =
        item.quantity * item.sale_price;

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
      subtotal +
      gstAmount -
      values.discount_amount +
      values.other_charges;

    // =========================================
    // STOCK VALIDATION
    // =========================================

    if (values.status === 'Confirmed') {
      for (const item of items) {

        const { data: product, error: stockError } =
          await supabase
            .from('products')
            .select('product_name, current_stock')
            .eq('id', item.product_id)
            .single();

        if (stockError) {
          throw new Error(stockError.message);
        }

        const currentStock = Number(product.current_stock || 0);

        if (currentStock < Number(item.quantity)) {
          throw new Error(
            `Insufficient stock for ${product.product_name}. Available: ${currentStock}`
          );
        }
      }
    }

    // =========================================
    // CREATE INVOICE
    // =========================================

    const { data: invoice, error: invoiceError } =
      await supabase
        .from('sales_invoices')
        .insert([
          {
            invoice_number: values.invoice_number,
            customer_id: values.customer_id,
            invoice_date: values.invoice_date,

            subtotal,
            gst_amount: gstAmount,
            discount_amount: values.discount_amount,
            other_charges: values.other_charges,
            grand_total: grandTotal,

            notes: values.notes,

            payment_status: values.payment_status,
            status: values.status,
          },
        ])
        .select()
        .single();

    if (invoiceError) {
      console.error(invoiceError);
      throw new Error(invoiceError.message);
    }

    // =========================================
    // CREATE INVOICE ITEMS
    // =========================================

    const salesItems = items.map((item) => ({
      sales_invoice_id: invoice.id,
      product_id: item.product_id,
      quantity: item.quantity,
      sale_price: item.sale_price,
      gst_percent: item.gst_percent,
      line_total: item.line_total,
    }));

    const { error: itemsError } = await supabase
      .from('sales_items')
      .insert(salesItems);

    if (itemsError) {
      console.error(itemsError);
      throw new Error(itemsError.message);
    }

    // =========================================
    // AUTO STOCK DECREASE
    // =========================================

    if (values.status === 'Confirmed') {
      for (const item of items) {

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
          Number(product.current_stock || 0) -
          Number(item.quantity);

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

    return invoice;
  }

  // =========================================
  // Get Invoices
  // =========================================

  static async getInvoices(): Promise<SalesInvoice[]> {
    const { data, error } = await supabase
      .from('sales_invoices')
      .select(`
        *,
        customer:customers(
          id,
          customer_name,
          gst_number,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []) as unknown as SalesInvoice[];
  }

  // =========================================
  // Delete Invoice
  // =========================================

  static async deleteInvoice(id: string) {
    const { error } = await supabase
      .from('sales_invoices')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    return true;
  }
}