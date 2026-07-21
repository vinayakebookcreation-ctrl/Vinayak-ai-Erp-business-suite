import { createClient } from '@/lib/supabase/client';

import type { Employee } from '../types';
import type { EmployeeSchema } from '../employee-schema';

const TABLE_NAME = 'employees';

export class EmployeeService {
  private static supabase = createClient();

  // ================================
  // Get all employees with company & branch
  // ================================
  static async getEmployees(): Promise<Employee[]> {
    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .select(
        `
        *,
        companies (
          company_name
        ),
        branches (
          branch_name
        )
      `
      )
      .order('first_name', { ascending: true });

    if (error) {
      console.error(
        'Error fetching employees:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        error?.message || 'Failed to fetch employees'
      );
    }

    return (data ?? []) as Employee[];
  }

  // ================================
  // Get single employee
  // ================================
  static async getEmployeeById(
    id: string
  ): Promise<Employee | null> {
    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .select(
        `
        *,
        companies (
          company_name
        ),
        branches (
          branch_name
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error(
        'Error fetching employee:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        error?.message || 'Failed to fetch employee'
      );
    }

    return data as Employee;
  }

  // ================================
  // Create employee
  // ================================
  static async createEmployee(values: EmployeeSchema) {
    const payload = {
      company_id: values.company_id,
      branch_id: values.branch_id,
      employee_code: values.employee_code,
      first_name: values.first_name,
      last_name: values.last_name || null,
      email: values.email || null,
      phone: values.phone || null,
      department: values.department || null,
      designation: values.designation || null,
      joining_date: values.joining_date || null,
      salary: values.salary,
      status: values.status,
    };

    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error(
        'Supabase create employee error:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        `${error.message} (${error.code ?? 'NO_CODE'})`
      );
    }

    return data;
  }

  // ================================
  // Update employee
  // ================================
  static async updateEmployee(
    id: string,
    values: EmployeeSchema
  ) {
    const payload = {
      company_id: values.company_id,
      branch_id: values.branch_id,
      employee_code: values.employee_code,
      first_name: values.first_name,
      last_name: values.last_name || null,
      email: values.email || null,
      phone: values.phone || null,
      department: values.department || null,
      designation: values.designation || null,
      joining_date: values.joining_date || null,
      salary: values.salary,
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
        'Supabase update employee error:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        `${error.message} (${error.code ?? 'NO_CODE'})`
      );
    }

    return data;
  }

  // ================================
  // Delete employee
  // ================================
  static async deleteEmployee(id: string) {
    const { error } = await this.supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(
        'Supabase delete employee error:',
        JSON.stringify(error, null, 2)
      );

      throw new Error(
        `${error.message} (${error.code ?? 'NO_CODE'})`
      );
    }

    return true;
  }

  // ================================
  // Dropdown data
  // ================================
  static async getCompaniesForDropdown() {
    const { data, error } = await this.supabase
      .from('companies')
      .select('id, company_name')
      .eq('status', 'Active')
      .order('company_name');

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  }

  static async getBranchesForDropdown(companyId?: string) {
    let query = this.supabase
      .from('branches')
      .select('id, branch_name, company_id')
      .eq('status', 'Active')
      .order('branch_name');

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  }
}