'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  GitBranch,
  Users,
  Truck,
  UserRound,
  Package,
  Settings,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Company', href: '/company', icon: Building2 },
  { title: 'Branch', href: '/branch', icon: GitBranch },
  { title: 'Employee', href: '/employee', icon: Users },
  { title: 'Supplier', href: '/supplier', icon: Truck },
  { title: 'Customer', href: '/customer', icon: UserRound },
  { title: 'Inventory', href: '/inventory', icon: Package },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className='flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-900 text-white'>
      {/* Logo */}
      <div className='border-b border-slate-800 p-6'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 font-bold text-lg'>
            V
          </div>

          <div>
            <h1 className='text-lg font-bold'>Vinayak ERP</h1>
            <p className='text-xs text-slate-400'>AI Business Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 space-y-1 p-4'>
        {menuItems.map((item) => {
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
      <div className='border-t border-slate-800 p-4 space-y-2'>
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