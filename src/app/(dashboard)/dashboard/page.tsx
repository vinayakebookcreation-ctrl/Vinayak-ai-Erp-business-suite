'use client';
import {
  Building2,
  GitBranch,
  Users,
  UserCheck,
} from 'lucide-react';

const stats = [
  {
    title: 'Total Companies',
    value: '1',
    icon: Building2,
    color: 'bg-blue-500',
  },
  {
    title: 'Total Branches',
    value: '1',
    icon: GitBranch,
    color: 'bg-green-500',
  },
  {
    title: 'Total Employees',
    value: '1',
    icon: Users,
    color: 'bg-violet-500',
  },
  {
    title: 'Active Employees',
    value: '1',
    icon: UserCheck,
    color: 'bg-orange-500',
  },
];

export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-slate-900'>
          Dashboard
        </h1>
        <p className='mt-1 text-slate-600'>
          Welcome back! Here is your ERP overview.
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-slate-500'>
                    {stat.title}
                  </p>

                  <p className='mt-2 text-3xl font-bold text-slate-900'>
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon className='h-6 w-6 text-white' />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
          <h2 className='text-lg font-semibold text-slate-900'>
            Quick Actions
          </h2>

          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            <a
              href='/company'
              className='rounded-xl border border-slate-200 p-4 hover:bg-slate-50'
            >
              <p className='font-medium text-slate-900'>
                Add Company
              </p>
              <p className='text-sm text-slate-500'>
                Create a new company
              </p>
            </a>

            <a
              href='/branch'
              className='rounded-xl border border-slate-200 p-4 hover:bg-slate-50'
            >
              <p className='font-medium text-slate-900'>
                Add Branch
              </p>
              <p className='text-sm text-slate-500'>
                Create a company branch
              </p>
            </a>

            <a
              href='/employee'
              className='rounded-xl border border-slate-200 p-4 hover:bg-slate-50'
            >
              <p className='font-medium text-slate-900'>
                Add Employee
              </p>
              <p className='text-sm text-slate-500'>
                Register a new employee
              </p>
            </a>
          </div>
        </div>

        <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
          <h2 className='text-lg font-semibold text-slate-900'>
            System Status
          </h2>

          <div className='mt-4 space-y-3 text-sm'>
            <div className='flex items-center justify-between'>
              <span className='text-slate-600'>Database</span>
              <span className='font-semibold text-green-600'>
                Connected
              </span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-slate-600'>Authentication</span>
              <span className='font-semibold text-green-600'>
                Active
              </span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-slate-600'>API Status</span>
              <span className='font-semibold text-green-600'>
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}