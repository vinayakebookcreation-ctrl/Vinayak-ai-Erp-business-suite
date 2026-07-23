'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { RolesService, UserRole } from '@/features/auth/services/roles.service';

import {
  LayoutDashboard,
  Building2,
  GitBranch,
  Users,
  Truck,
  UserRound,
  Package,
  ShoppingCart,
  Receipt,
  Settings,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, module: 'dashboard' },
  { title: 'Company', href: '/company', icon: Building2, module: 'company' },
  { title: 'Branch', href: '/branch', icon: GitBranch, module: 'branch' },
  { title: 'Employee', href: '/employee', icon: Users, module: 'employee' },
  { title: 'Supplier', href: '/supplier', icon: Truck, module: 'supplier' },
  { title: 'Customer', href: '/customer', icon: UserRound, module: 'customer' },
  { title: 'Inventory', href: '/inventory', icon: Package, module: 'inventory' },
  { title: 'Purchase', href: '/purchase', icon: ShoppingCart, module: 'purchase' },
  { title: 'Sales', href: '/sales', icon: Receipt, module: 'sales' },
  { title: 'Reports', href: '/reports', icon: Receipt, module: 'reports' },
];

export function Sidebar() {
  const pathname = usePathname();

  // 🔐 Role state
  const [role, setRole] = useState<UserRole>('Staff');
  const [allowedModules, setAllowedModules] = useState<string[]>([]);

  // 🔐 Load permissions
  useEffect(() => {
    async function loadPermissions() {
      try {
        const currentRole = await RolesService.getCurrentUserRole();

        setRole(currentRole);

        const permissions = await RolesService.getPermissions(currentRole);

        const modules = permissions
          .filter((p) => p.can_view)
          .map((p) => p.module_name);

        setAllowedModules(modules);
      } catch (error) {
        console.error('Failed to load permissions', error);
      }
    }

    loadPermissions();
  }, []);

  return (
    <aside className='flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-900 text-white'>

      {/* Logo */}
      <div className='border-b border-slate-800 p-6'>
        <div className='flex items-center gap-3'>

          {/* Company Logo */}
          <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-1 shadow-lg'>
            <Image
              src='/my new logo.png'
              alt='Vinayak ERP Logo'
              width={46}
              height={46}
              className='object-contain'
              priority
            />
          </div>

          <div>
            <h1 className='text-lg font-bold tracking-wide'>
              Vinayak ERP
            </h1>

            <p className='text-xs text-slate-400'>
              AI Business Suite
            </p>

            {/* Role Badge */}
            <div className='mt-2'>
              <span className='inline-flex rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300'>
                {role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 space-y-1 p-4'>

        {menuItems
          .filter((item) => allowedModules.includes(item.module))
          .map((item) => {

            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? 'bg-violet-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className='h-5 w-5' />
                {item.title}
              </Link>
            );
          })}
      </nav>

      {/* Footer */}
      <div className='space-y-2 border-t border-slate-800 p-4'>

        <button className='flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white'>
          <Settings className='h-5 w-5' />
          Settings
        </button>

        <button className='flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300'>
          <LogOut className='h-5 w-5' />
          Logout
        </button>
      </div>
    </aside>
  );
}