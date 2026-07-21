import { GitBranch } from 'lucide-react';

import { BranchForm } from '@/features/branch/components/branch-form';
import { BranchTable } from '@/features/branch/components/branch-table';

export default function BranchPage() {
  return (
    <div className='min-h-screen bg-slate-100 p-6'>
      <div className='mx-auto max-w-7xl space-y-6'>

        {/* Header */} 
        <div className='rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 p-6 text-white shadow-lg'>
          <div className='flex items-center gap-4'>
            <div className='rounded-xl bg-white/10 p-3 backdrop-blur'>
              <GitBranch className='h-8 w-8' />
            </div>

            <div>
              <h1 className='text-3xl font-bold'>
                Branch Management
              </h1>

              <p className='mt-1 text-sm text-emerald-100'>
                Create and manage company branches and locations
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */} 
        <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
          <div className='mb-6 border-b border-slate-200 pb-4'>
            <h2 className='text-xl font-semibold text-slate-900'>
              Add Branch
            </h2>

            <p className='mt-1 text-sm text-slate-500'>
              Enter branch details and link it to a company
            </p>
          </div>

          <BranchForm />
        </div>

        {/* Table Card */} 
        <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
          <div className='mb-6 border-b border-slate-200 pb-4'>
            <h2 className='text-xl font-semibold text-slate-900'>
              Branch List
            </h2>

            <p className='mt-1 text-sm text-slate-500'>
              View, search, and manage all company branches
            </p>
          </div>

          <BranchTable />
        </div>
      </div>
    </div>
  );
}