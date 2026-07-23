import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export type UserRole = 'Admin' | 'Manager' | 'Staff';

export type RolePermission = {
  module_name: string;
  can_view: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
};

export class RolesService {

  // =========================================
  // Get current user role
  // =========================================

  static async getCurrentUserRole(): Promise<UserRole> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return 'Staff';
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error || !data?.role) {
      return 'Staff';
    }

    return data.role as UserRole;
  }

  // =========================================
  // Get role permissions
  // =========================================

  static async getPermissions(
    role: UserRole
  ): Promise<RolePermission[]> {

    const { data, error } = await supabase
      .from('role_permissions')
      .select('*')
      .eq('role', role);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as RolePermission[];
  }

  // =========================================
  // Check module access
  // =========================================

  static async canAccess(
    moduleName: string
  ): Promise<boolean> {

    const role = await this.getCurrentUserRole();

    const permissions = await this.getPermissions(role);

    const permission = permissions.find(
      (p) => p.module_name === moduleName
    );

    return permission?.can_view ?? false;
  }
}