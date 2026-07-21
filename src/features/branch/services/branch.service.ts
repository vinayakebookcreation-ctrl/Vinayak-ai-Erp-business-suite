import { createClient } from '@/lib/supabase/client';

import type { Branch } from '../types';
import type { BranchSchema } from '../branch-schema';

const TABLE_NAME = 'branches';

export class BranchService {
  private static supabase = createClient();

  // ================================
  // Get all branches with company
  // ================================
  static async getBranches(): Promise<Branch[]> {
    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .select(
        `
        *,
        companies (
          company_name
        )
      `
      )
      .order('branch_name', { ascending: true });

    if (error) {
      console.error(
        'Error fetching branches:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        error?.message || 'Failed to fetch branches'
      );
    }

    return (data ?? []) as Branch[];
  }

  // ================================
  // Get single branch
  // ================================
  static async getBranchById(
    id: string
  ): Promise<Branch | null> {
    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .select(
        `
        *,
        companies (
          company_name
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error(
        'Error fetching branch:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        error?.message || 'Failed to fetch branch'
      );
    }

    return data as Branch;
  }

  // ================================
  // Create branch
  // ================================
  static async createBranch(values: BranchSchema) {
    const payload = {
      company_id: values.company_id,
      branch_name: values.branch_name,
      branch_code: values.branch_code,
      email: values.email || null,
      phone: values.phone || null,
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
        'Supabase create branch error:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        `${error.message} (${error.code ?? 'NO_CODE'})`
      );
    }

    return data;
  }

  // ================================
  // Update branch
  // ================================
  static async updateBranch(
    id: string,
    values: BranchSchema
  ) {
    const payload = {
      company_id: values.company_id,
      branch_name: values.branch_name,
      branch_code: values.branch_code,
      email: values.email || null,
      phone: values.phone || null,
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
        'Supabase update branch error:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        `${error.message} (${error.code ?? 'NO_CODE'})`
      );
    }

    return data;
  }

  // ================================
  // Delete branch
  // ================================
  static async deleteBranch(id: string) {
    const { error } = await this.supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(
        'Supabase delete branch error:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        `${error.message} (${error.code ?? 'NO_CODE'})`
      );
    }

    return true;
  }

  // ================================
  // Get companies for dropdown
  // ================================
  static async getCompaniesForDropdown() {
    const { data, error } = await this.supabase
      .from('companies')
      .select('id, company_name')
      .eq('status', 'Active')
      .order('company_name');

    if (error) {
      console.error(
        'Error fetching companies:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        error?.message || 'Failed to fetch companies'
      );
    }

    return data ?? [];
  }
}