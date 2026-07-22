import { Package } from 'lucide-react';

import { InventoryStats } from '@/features/inventory/components/inventory-stats';
import { ProductForm } from '@/features/inventory/components/product-form';
import { ProductTable } from '@/features/inventory/components/product-table';

export default function InventoryPage() {
  return (
    <div className='space-y-6'>

      {/* Header */}
      <div className='rounded-2xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-600 p-6 text-white shadow-lg'>
        <div className='flex items-center gap-4'>

          <div className='rounded-xl bg-white/10 p-3 backdrop-blur'>
            <Package className='h-8 w-8' />
          </div>

          <div>
            <h1 className='text-3xl font-bold'>
              Inventory Management
            </h1>

            <p className='mt-1 text-sm text-blue-100'>
              Manage products, stock levels, pricing, and reorder alerts
            </p>
          </div>
        </div>
      </div>

      {/* Live Stats */}
      <InventoryStats />

      {/* Product Form */}
      <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>

        <div className='mb-6 border-b border-slate-200 pb-4'>
          <h2 className='text-xl font-semibold text-slate-900'>
            Add Product
          </h2>

          <p className='mt-1 text-sm text-slate-500'>
            Create a new inventory item with pricing and stock details
          </p>
        </div>

        <ProductForm />
      </div>

      {/* Product Table */}
      <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>

        <div className='mb-6 border-b border-slate-200 pb-4'>
          <h2 className='text-xl font-semibold text-slate-900'>
            Product List
          </h2>

          <p className='mt-1 text-sm text-slate-500'>
            Search, monitor stock levels, and manage inventory items
          </p>
        </div>

        <ProductTable />
      </div>
    </div>
  );
}