'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='border-b bg-white px-6 py-4 shadow-sm'>
        <div className='flex items-center justify-between'>
          
          {/* Logo */} 
          <div className='flex items-center gap-4'>
            <Image
              src='/my new logo.png'
              alt='Vinayak ERP'
              width={56}
              height={56}
              className='h-14 w-auto'
              priority
            />

            <div>
              <h1 className='text-xl font-bold text-gray-900'>
                Vinayak ERP
              </h1>

              <p className='text-sm text-gray-500'>
                Smart Solutions • Stronger Business
              </p>
            </div>
          </div>

          {/* Logout */} 
          <button
            onClick={handleLogout}
            className='inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100'
          >
            <LogOut className='h-4 w-4' />
            Logout
          </button>
        </div>
      </header>

      <main className='p-6'>{children}</main>
    </div>
  );
}