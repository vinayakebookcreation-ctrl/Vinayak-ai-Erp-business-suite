import { createClient } from '@/lib/supabase/client';
import type { Company } from '../types';
import type { CompanySchema } from '../company-schema';

const TABLE_NAME = 'companies';

export class CompanyService {
  private static supabase = createClient();

  // Get all companies
  static async getCompanies() {
    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .select('*')
      .order('company_name', { ascending: true });

    if (error) {
      console.error('Error fetching companies:', error);
      throw new Error(error?.message || 'Failed to fetch companies');
    }

    return (data ?? []) as Company[];
  }

  // Get company by ID
  static async getCompanyById(id: string) {
    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching company:', error);
      throw new Error(error.message);
    }

    return data as Company;
  }

  // Create company
  static async createCompany(values: CompanySchema) {
    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .insert(values)
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      throw new Error(error.message);
    }

    return data as Company;
  }

  // Update company
  static async updateCompany(
    id: string,
    values: Partial<CompanySchema>
  ) {
    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .update({
        ...values,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating company:', error);
      throw new Error(error.message);
    }

    return data as Company;
  }

  // Delete company
  static async deleteCompany(id: string) {
    const { error } = await this.supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting company:', error);
      throw new Error(error.message);
    }

    return true;
  }
}