'use client';

import { useEffect, useState } from 'react';
import { Boxes, Package, AlertTriangle } from 'lucide-react';

import { InventoryService } from '../services/inventory.service';

type Stats = {
  totalProducts: number;
  totalStock: number;
  totalValue: number;
  lowStock: number;
};

export function InventoryStats() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalStock: 0,
    totalValue: 0,
    lowStock: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const products = await InventoryService.getProducts();

        const totalProducts = products.length;

        const totalStock = products.reduce(
          (sum, p) => sum + Number(p.current_stock || 0),
          0
        );

        const totalValue = products.reduce(
          (sum, p) =>
            sum +
            Number(p.current_stock || 0) *
              Number(p.purchase_price || 0),
          0
        );

        const lowStock = products.filter(
          (p) =>
            Number(p.current_stock || 0) <=
            Number(p.reorder_level || 0)
        ).length;

        setStats({
          totalProducts,
          totalStock,
          totalValue,
          lowStock,
        });
      } catch (error) {
        console.error('Failed to load inventory stats:', error);
      }
    }

    loadStats();
  }, []);

  return (
    <div className='grid gap-4 md:grid-cols-3'>

      {/* Total Products */}
      <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
        <div className='flex items-center gap-3'>
          <div className='rounded-lg bg-blue-100 p-3 text-blue-600'>
            <Boxes className='h-6 w-6' />
          </div>

          <div>
            <p className='text-sm text-slate-500'>Total Products</p>
            <p className='text-2xl font-bold text-slate-900'>
              {stats.totalProducts}
            </p>
          </div>
        </div>
      </div>

      {/* Stock Value */}
      <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
        <div className='flex items-center gap-3'>
          <div className='rounded-lg bg-green-100 p-3 text-green-600'>
            <Package className='h-6 w-6' />
          </div>

          <div>
            <p className='text-sm text-slate-500'>Stock Value</p>
            <p className='text-2xl font-bold text-slate-900'>
              ₹{stats.totalValue.toLocaleString('en-IN')}
            </p>

            <p className='text-xs text-slate-500'>
              Qty: {stats.totalStock}
            </p>
          </div>
        </div>
      </div>

      {/* Low Stock */}
      <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
        <div className='flex items-center gap-3'>
          <div className='rounded-lg bg-orange-100 p-3 text-orange-600'>
            <AlertTriangle className='h-6 w-6' />
          </div>

          <div>
            <p className='text-sm text-slate-500'>Low Stock Items</p>
            <p className='text-2xl font-bold text-slate-900'>
              {stats.lowStock}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}