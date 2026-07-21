import { Truck } from 'lucide-react';

import { SupplierForm } from '@/features/supplier/components/supplier-form';
import { SupplierTable } from '@/features/supplier/components/supplier-table';

export default function SupplierPage() {
  return (
    <div className='space-y-6'>
      
      {/* Header */} 
      <div className='rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 p-6 text-white shadow-lg'>
        <div className='flex items-center gap-4'>
          <div className='rounded-xl bg-white/10 p-3 backdrop-blur'>
            <Truck className='h-8 w-8' />
          </div>

          <div>
            <h1 className='text-3xl font-bold'>
              Supplier Management
            </h1>

            <p className='mt-1 text-sm text-blue-100'>
              Manage suppliers, vendors, and purchase partners
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */} 
      <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
        <div className='mb-6 border-b border-slate-200 pb-4'>
          <h2 className='text-xl font-semibold text-slate-900'>
            Add Supplier
          </h2>

          <p className='mt-1 text-sm text-slate-500'>
            Enter supplier details and GST information
          </p>
        </div>

        <SupplierForm />
      </div>

      {/* Table Card */} 
      <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
        <div className='mb-6 border-b border-slate-200 pb-4'>
          <h2 className='text-xl font-semibold text-slate-900'>
            Supplier List
          </h2>

          <p className='mt-1 text-sm text-slate-500'>
            View, search, and manage all suppliers
          </p>
        </div>

        <SupplierTable />
      </div>
    </div>
  );
}