import { ShoppingCart } from 'lucide-react';

import { PurchaseForm } from '@/features/purchase/components/purchase-form';
import { PurchaseTable } from '@/features/purchase/components/purchase-table';

export default function PurchasePage() {
  return (
    <div className='space-y-6'>

      {/* Header */}
      <div className='rounded-2xl bg-gradient-to-r from-emerald-700 via-green-600 to-teal-600 p-6 text-white shadow-lg'>
        <div className='flex items-center gap-4'>

          <div className='rounded-xl bg-white/10 p-3 backdrop-blur'>
            <ShoppingCart className='h-8 w-8' />
          </div>

          <div>
            <h1 className='text-3xl font-bold'>
              Purchase Management
            </h1>

            <p className='mt-1 text-sm text-green-100'>
              Create purchase orders, receive goods, and update inventory automatically
            </p>
          </div>
        </div>
      </div>

      {/* Purchase Form */}
      <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>

        <div className='mb-6 border-b border-slate-200 pb-4'>
          <h2 className='text-xl font-semibold text-slate-900'>
            Create Purchase Order
          </h2>

          <p className='mt-1 text-sm text-slate-500'>
            Add products, quantities, GST, and receive stock into inventory
          </p>
        </div>

        <PurchaseForm />
      </div>

      {/* Purchase History */}
      <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>

        <div className='mb-6 border-b border-slate-200 pb-4'>
          <h2 className='text-xl font-semibold text-slate-900'>
            Purchase History
          </h2>

          <p className='mt-1 text-sm text-slate-500'>
            View all purchase orders and received inventory transactions
          </p>
        </div>

        <PurchaseTable />
      </div>
    </div>
  );
}