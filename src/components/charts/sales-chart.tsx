'use client';

import { useEffect, useState } from 'react';

import { ReportsService } from '@/features/reports/services/reports.service';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

type SalesData = {
  month: string;
  sales: number;
};

export function SalesChart() {

  // 📊 Real sales data state
  const [data, setData] = useState<SalesData[]>([]);

  // ⏳ Loading state
  const [loading, setLoading] = useState(true);

  // 🚀 Load data from Supabase
  useEffect(() => {

    async function loadData() {
      try {
        const result = await ReportsService.getMonthlySales();

        setData(result);
      } catch (error) {
        console.error('Failed to load sales chart', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className='rounded-2xl border bg-white p-6 shadow-sm'>

      <div className='mb-4'>

        <h2 className='text-lg font-semibold text-slate-900'>
          Monthly Sales
        </h2>

        <p className='text-sm text-slate-500'>
          Real sales data from confirmed invoices
        </p>
      </div>

      <div className='h-80'>

        {loading ? (

          <div className='flex h-full items-center justify-center'>

            <div className='h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent' />
          </div>

        ) : data.length === 0 ? (

          <div className='flex h-full items-center justify-center text-sm text-slate-400'>

            No confirmed sales invoices found
          </div>

        ) : (

          <ResponsiveContainer width='100%' height='100%'>

            <LineChart data={data}>

              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#E2E8F0'
              />

              <XAxis
                dataKey='month'
                stroke='#64748B'
              />

              <YAxis
                stroke='#64748B'
                tickFormatter={(value) => `₹${value}`}
              />

              {/* ✅ TypeScript-safe Tooltip */}
              <Tooltip
                formatter={(value) => [
                  `₹${Number(value || 0).toLocaleString('en-IN')}`,
                  'Sales',
                ]}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                }}
              />

              <Line
                type='monotone'
                dataKey='sales'
                stroke='#7C3AED'
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />

            </LineChart>

          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}