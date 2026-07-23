import { Building2 } from 'lucide-react';

import { RouteGuard } from '@/components/auth/route-guard';

import { CompanyForm } from '@/features/company/components/company-form';
import { CompanyTable } from '@/features/company/components/company-table';

export default function CompanyPage() {
  return (
    <RouteGuard module='company'>

      <div className='min-h-screen bg-slate-100 p-6'>

        <div className='mx-auto max-w-7xl space-y-6'>

          {/* Header */}
          <div className='rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-lg'>

            <div className='flex items-center gap-4'>

              <div className='rounded-xl bg-white/10 p-3 backdrop-blur'>
                <Building2 className='h-8 w-8' />
              </div>

              <div>
                <h1 className='text-3xl font-bold'>
                  Company Management
                </h1>

                <p className='mt-1 text-sm text-blue-100'>
                  Create and manage company master data
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>

            <div className='mb-6 border-b border-slate-200 pb-4'>

              <h2 className='text-xl font-semibold text-slate-900'>
                Add Company
              </h2>

              <p className='mt-1 text-sm text-slate-500'>
                Enter company details and regional settings
              </p>
            </div>

            <CompanyForm />
          </div>

          {/* Table */}
          <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>

            <div className='mb-6 border-b border-slate-200 pb-4'>

              <h2 className='text-xl font-semibold text-slate-900'>
                Company List
              </h2>

              <p className='mt-1 text-sm text-slate-500'>
                View, search, and manage all companies
              </p>
            </div>

            <CompanyTable />
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}