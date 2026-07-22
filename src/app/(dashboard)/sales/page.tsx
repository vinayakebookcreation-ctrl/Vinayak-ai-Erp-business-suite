import { Receipt } from 'lucide-react';


import { SalesForm } from '@/features/sales/components/sales-form';
import { SalesTable } from '@/features/sales/components/sales-table';

export default function SalesPage() {
  return (
    <div className='space-y-6'>

      {/* Header */}
      <div className='rounded-2xl bg-gradient-to-r from-indigo-700 via-purple-600 to-fuchsia-600 p-6 text-white shadow-lg'>
        <div className='flex items-center gap-4'>

          <div className='rounded-xl bg-white/10 p-3 backdrop-blur'>
            <Receipt className='h-8 w-8' />
          </div>

          <div>
            <h1 className='text-3xl font-bold'>
              Sales & GST Invoices
            </h1>

            <p className='mt-1 text-sm text-indigo-100'>
              Create invoices, manage customer billing, and reduce stock automatically
            </p>
          </div>
        </div>
      </div>

      {/* Sales Form */}
      <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>

        <div className='mb-6 border-b border-slate-200 pb-4'>
          <h2 className='text-xl font-semibold text-slate-900'>
            Create Sales Invoice
          </h2>

          <p className='mt-1 text-sm text-slate-500'>
            Add products, apply GST, and generate customer invoices
          </p>
        </div>

        <SalesForm />
      </div>

      {/* Sales History */}
      <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>

        <div className='mb-6 border-b border-slate-200 pb-4'>
          <h2 className='text-xl font-semibold text-slate-900'>
            Invoice History
          </h2>

          <p className='mt-1 text-sm text-slate-500'>
            View all invoices, payment status, and confirmed sales transactions
          </p>
        </div>

        <SalesTable />
      </div>
    </div>
  );
}