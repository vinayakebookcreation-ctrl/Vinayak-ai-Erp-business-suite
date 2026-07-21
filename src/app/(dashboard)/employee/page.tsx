import { Users } from 'lucide-react';

import { EmployeeForm } from '@/features/employee/components/employee-form';
import { EmployeeTable } from '@/features/employee/components/employee-table';

export default function EmployeePage() {
  return (
    <div className='min-h-screen bg-slate-100 p-6'>
      <div className='mx-auto max-w-7xl space-y-6'>

        {/* Header */} 
        <div className='rounded-2xl bg-gradient-to-r from-violet-700 via-violet-600 to-purple-700 p-6 text-white shadow-lg'>
          <div className='flex items-center gap-4'>
            <div className='rounded-xl bg-white/10 p-3 backdrop-blur'>
              <Users className='h-8 w-8' />
            </div>

            <div>
              <h1 className='text-3xl font-bold'>
                Employee Management
              </h1>

              <p className='mt-1 text-sm text-violet-100'>
                Create and manage employees across companies and branches
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */} 
        <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
          <div className='mb-6 border-b border-slate-200 pb-4'>
            <h2 className='text-xl font-semibold text-slate-900'>
              Add Employee
            </h2>

            <p className='mt-1 text-sm text-slate-500'>
              Enter employee details and assign company and branch
            </p>
          </div>

          <EmployeeForm />
        </div>

        {/* Table Card */} 
        <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
          <div className='mb-6 border-b border-slate-200 pb-4'>
            <h2 className='text-xl font-semibold text-slate-900'>
              Employee List
            </h2>

            <p className='mt-1 text-sm text-slate-500'>
              View, search, and manage all employees
            </p>
          </div>

          <EmployeeTable />
        </div>
      </div>
    </div>
  );
}