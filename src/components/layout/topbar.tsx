'use client';

import { Bell, Search, User } from 'lucide-react';

export function Topbar() {
  return (
    <header className='flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm'>
      {/* Search */}
      <div className='flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 w-96'>
        <Search className='h-4 w-4 text-slate-400' />

        <input
          type='text'
          placeholder='Search anything...'
          className='w-full bg-transparent text-sm outline-none placeholder:text-slate-400'
        />
      </div>

      {/* Right */}
      <div className='flex items-center gap-4'>
        <button className='relative rounded-xl p-2 hover:bg-slate-100'>
          <Bell className='h-5 w-5 text-slate-600' />
          <span className='absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500' />
        </button>

        <div className='flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2'>
          <div className='flex h-9 w-9 items-center justify-center rounded-full bg-violet-100'>
            <User className='h-4 w-4 text-violet-700' />
          </div>

          <div className='text-sm'>
            <div className='font-semibold text-slate-900'>Kautik Nai</div>
            <div className='text-xs text-slate-500'>Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}