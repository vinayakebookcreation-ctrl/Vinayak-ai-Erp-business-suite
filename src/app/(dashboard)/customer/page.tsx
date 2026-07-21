import { UserRound } from 'lucide-react';

import { CustomerForm } from '@/features/customer/components/customer-form';
import { CustomerTable } from '@/features/customer/components/customer-table';

export default function CustomerPage() {
  return (
    <div className='space-y-6'>

      {/* Header */}
      <div className='rounded-2xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-600 p-6 text-white shadow-lg'>
        <div className='flex items-center gap-4'>
          <div className='rounded-xl bg-white/10 p-3 backdrop-blur'>
            <UserRound className='h-8 w-8' />
          </div>

          <div>
            <h1 className='text-3xl font-bold'>
              Customer Management
            </h1>

            <p className='mt-1 text-sm text-blue-100'>
              Manage customers, billing details, and credit limits
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
        <div className='mb-6 border-b border-slate-200 pb-4'>
          <h2 className='text-xl font-semibold text-slate-900'>
            Add Customer
          </h2>

          <p className='mt-1 text-sm text-slate-500'>
            Enter customer details, GST information, and credit limit
          </p>
        </div>

        <CustomerForm />
      </div>

      {/* Table Card */}
      <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
        <div className='mb-6 border-b border-slate-200 pb-4'>
          <h2 className='text-xl font-semibold text-slate-900'>
            Customer List
          </h2>

          <p className='mt-1 text-sm text-slate-500'>
            View, search, and manage all customers
          </p>
        </div>

        <CustomerTable />
      </div>
    </div>
  );
}