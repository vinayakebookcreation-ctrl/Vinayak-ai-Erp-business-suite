import { createClient } from '@/lib/supabase/client';

import type { Supplier } from '../types';
import type { SupplierSchema } from '../supplier-schema';

const TABLE_NAME = 'suppliers';

export class SupplierService {
  private static supabase = createClient();

  // ================================
  // Get all suppliers
  // ================================
  static async getSuppliers(): Promise<Supplier[]> {
    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .select('*')
      .order('supplier_name', { ascending: true });

    if (error) {
      console.error(
        'Error fetching suppliers:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        error?.message || 'Failed to fetch suppliers'
      );
    }

    return (data ?? []) as Supplier[];
  }

  // ================================
  // Get single supplier
  // ================================
  static async getSupplierById(
    id: string
  ): Promise<Supplier | null> {
    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(
        'Error fetching supplier:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        error?.message || 'Failed to fetch supplier'
      );
    }

    return data as Supplier;
  }

  // ================================
  // Create supplier
  // ================================
  static async createSupplier(values: SupplierSchema) {
    const payload = {
      supplier_code: values.supplier_code,
      supplier_name: values.supplier_name,
      contact_person: values.contact_person || null,
      email: values.email || null,
      phone: values.phone || null,
      gst_number: values.gst_number || null,
      address: values.address || null,
      city: values.city || null,
      state: values.state || null,
      status: values.status,
    };

    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error(
        'Supabase create supplier error:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        `${error.message} (${error.code ?? 'NO_CODE'})`
      );
    }

    return data;
  }

  // ================================
  // Update supplier
  // ================================
  static async updateSupplier(
    id: string,
    values: SupplierSchema
  ) {
    const payload = {
      supplier_code: values.supplier_code,
      supplier_name: values.supplier_name,
      contact_person: values.contact_person || null,
      email: values.email || null,
      phone: values.phone || null,
      gst_number: values.gst_number || null,
      address: values.address || null,
      city: values.city || null,
      state: values.state || null,
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
        'Supabase update supplier error:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        `${error.message} (${error.code ?? 'NO_CODE'})`
      );
    }

    return data;
  }

  // ================================
  // Delete supplier
  // ================================
  static async deleteSupplier(id: string) {
    const { error } = await this.supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(
        'Supabase delete supplier error:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        `${error.message} (${error.code ?? 'NO_CODE'})`
      );
    }

    return true;
  }
}