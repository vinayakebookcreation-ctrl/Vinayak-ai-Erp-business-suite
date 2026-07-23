'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

import { ReportsService } from '@/features/reports/services/reports.service';

type Product = {
  id: string;
  product_name: string;
  current_stock: number | null;
  minimum_stock: number | null;
};

export function LowStockCard() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await ReportsService.getLowStockProducts();
        setProducts(data as Product[]);
      } catch (error) {
        console.error('Failed to load low stock products', error);
      }
    }

    loadData();
  }, []);

  return (
    <div className='rounded-2xl border border-red-200 bg-white p-6 shadow-sm'>

      <div className='mb-4 flex items-center gap-3'>

        <div className='rounded-xl bg-red-100 p-2'>
          <AlertTriangle className='h-5 w-5 text-red-600' />
        </div>

        <div>
          <h2 className='text-lg font-semibold text-slate-900'>
            Low Stock Alert
          </h2>

          <p className='text-sm text-slate-500'>
            Products that need restocking
          </p>
        </div>
      </div>

      {products.length === 0 ? (

        <div className='rounded-xl bg-green-50 p-4 text-sm text-green-700'>
          All products have sufficient stock 🎉
        </div>

      ) : (

        <div className='space-y-3'>

          {products.slice(0, 5).map((product) => (

            <div
              key={product.id}
              className='flex items-center justify-between rounded-xl border border-slate-200 p-4'
            >

              <div>
                <p className='font-medium text-slate-900'>
                  {product.product_name}
                </p>

                <p className='text-sm text-slate-500'>
                  Min: {product.minimum_stock ?? 0}
                </p>
              </div>

              <span className='rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700'>

                {product.current_stock ?? 0} left
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}