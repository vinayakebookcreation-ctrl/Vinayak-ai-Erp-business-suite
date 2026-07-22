'use client';

import { useEffect, useState } from 'react';

import { ReportsService } from '@/features/reports/reports.service';

type DashboardStats = {
  totalSales: number;
  totalPurchase: number;
  totalCustomers: number;
  totalProducts: number;
};

export default function ReportsPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalPurchase: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await ReportsService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className='rounded-xl border bg-white p-8 text-center'>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent' />

        <p className='mt-3 text-sm text-gray-500'>
          Loading reports...
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>

      <div>
        <h1 className='text-2xl font-bold text-slate-900'>
          Reports Dashboard
        </h1>

        <p className='text-slate-600'>
          Real-time business analytics
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-4'>

        <div className='rounded-xl border bg-white p-6'>
          <div className='text-sm text-slate-500'>
            Total Sales
          </div>

          <div className='mt-2 text-2xl font-bold text-green-600'>
            ₹{stats.totalSales.toLocaleString('en-IN')}
          </div>
        </div>

        <div className='rounded-xl border bg-white p-6'>
          <div className='text-sm text-slate-500'>
            Total Purchase
          </div>

          <div className='mt-2 text-2xl font-bold text-blue-600'>
            ₹{stats.totalPurchase.toLocaleString('en-IN')}
          </div>
        </div>

        <div className='rounded-xl border bg-white p-6'>
          <div className='text-sm text-slate-500'>
            Total Customers
          </div>

          <div className='mt-2 text-2xl font-bold text-indigo-600'>
            {stats.totalCustomers}
          </div>
        </div>

        <div className='rounded-xl border bg-white p-6'>
          <div className='text-sm text-slate-500'>
            Total Products
          </div>

          <div className='mt-2 text-2xl font-bold text-orange-600'>
            {stats.totalProducts}
          </div>
        </div>

      </div>

      <div className='rounded-xl border bg-white p-6'>
        <h2 className='text-lg font-semibold'>
          Monthly Sales Chart
        </h2>

        <div className='mt-4 flex h-64 items-center justify-center rounded-lg bg-slate-50 text-slate-400'>
          Chart integration (next step)
        </div>
      </div>

    </div>
  );
}