'use client';

import { useEffect, useState } from 'react';

import { ReportsService } from '@/features/reports/services/reports.service';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

type PurchaseData = {
  month: string;
  purchases: number;
};

export function PurchaseChart() {

  const [data, setData] = useState<PurchaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    async function loadData() {
      try {
        const result = await ReportsService.getMonthlyPurchases();
        setData(result);
      } catch (err: any) {
        console.error('Purchase chart error:', err);
        setError(err.message || 'Failed to load purchases');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className='rounded-2xl border bg-white p-6 shadow-sm'>
        <div className='flex h-80 items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent' />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='rounded-2xl border border-red-200 bg-white p-6 shadow-sm'>
        <h2 className='text-lg font-semibold text-red-700'>
          Purchase Chart Error
        </h2>
        <p className='mt-2 text-sm text-red-600'>{error}</p>
      </div>
    );
  }

  return (
    <div className='rounded-2xl border bg-white p-6 shadow-sm'>

      <div className='mb-4'>
        <h2 className='text-lg font-semibold text-slate-900'>
          Monthly Purchases
        </h2>
        <p className='text-sm text-slate-500'>
          Real purchase data from confirmed orders
        </p>
      </div>

      <div className='h-80'>

        <ResponsiveContainer width='100%' height='100%'>

          <BarChart data={data}>

            <CartesianGrid strokeDasharray='3 3' stroke='#E2E8F0' />

            <XAxis dataKey='month' stroke='#64748B' />

            <YAxis stroke='#64748B' />

            <Tooltip
              formatter={(value) => [
                `₹${Number(value || 0).toLocaleString('en-IN')}`,
                'Purchases',
              ]}
            />

            <Bar
              dataKey='purchases'
              fill='#10B981'
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>
      </div>
    </div>
  );
}