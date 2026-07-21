import { createClient } from '@/lib/supabase/client';

import type { Customer } from '../types';
import type { CustomerSchema } from '../customer-schema';

const TABLE_NAME = 'customers';

export class CustomerService {
  private static supabase = createClient();

  // ================================
  // Get all customers
  // ================================
  static async getCustomers(): Promise<Customer[]> {
    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .select('*')
      .order('customer_name', { ascending: true });

    if (error) {
      console.error(
        'Error fetching customers:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        error?.message || 'Failed to fetch customers'
      );
    }

    return (data ?? []) as Customer[];
  }

  // ================================
  // Get single customer
  // ================================
  static async getCustomerById(
    id: string
  ): Promise<Customer | null> {
    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(
        'Error fetching customer:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        error?.message || 'Failed to fetch customer'
      );
    }

    return data as Customer;
  }

  // ================================
  // Create customer
  // ================================
  static async createCustomer(values: CustomerSchema) {
    const payload = {
      customer_code: values.customer_code,
      customer_name: values.customer_name,
      contact_person: values.contact_person || null,
      email: values.email || null,
      phone: values.phone || null,
      gst_number: values.gst_number || null,
      billing_address: values.billing_address || null,
      shipping_address: values.shipping_address || null,
      city: values.city || null,
      state: values.state || null,
      credit_limit: values.credit_limit,
      status: values.status,
    };

    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error(
        'Supabase create customer error:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        `${error.message} (${error.code ?? 'NO_CODE'})`
      );
    }

    return data;
  }

  // ================================
  // Update customer
  // ================================
  static async updateCustomer(
    id: string,
    values: CustomerSchema
  ) {
    const payload = {
      customer_code: values.customer_code,
      customer_name: values.customer_name,
      contact_person: values.contact_person || null,
      email: values.email || null,
      phone: values.phone || null,
      gst_number: values.gst_number || null,
      billing_address: values.billing_address || null,
      shipping_address: values.shipping_address || null,
      city: values.city || null,
      state: values.state || null,
      credit_limit: values.credit_limit,
      status: values.status,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(
        'Supabase update customer error:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        `${error.message} (${error.code ?? 'NO_CODE'})`
      );
    }

    return data;
  }

  // ================================
  // Delete customer
  // ================================
  static async deleteCustomer(id: string) {
    const { error } = await this.supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(
        'Supabase delete customer error:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        `${error.message} (${error.code ?? 'NO_CODE'})`
      );
    }

    return true;
  }
}