'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import {
  employeeSchema,
  type EmployeeSchema,
} from '../employee-schema';

import type { Employee } from '../types';
import { EmployeeService } from '../services/employee.service';
type CompanyOption = {
  id: string;
  company_name: string;
};

type BranchOption = {
  id: string;
  branch_name: string;
  company_id: string;
};

type EmployeeFormProps = {
  employee?: Employee;
};

export function EmployeeForm({ employee }: EmployeeFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [selectedCompany, setSelectedCompany] = useState(
    employee?.company_id ?? ''
  );
  const [serverError, setServerError] = useState('');

  const {
  register,
  handleSubmit,
  watch,
  setValue,
  formState: { errors },
} = useForm<EmployeeSchema>({
  resolver: zodResolver(employeeSchema) as any,
  defaultValues: {
    company_id: employee?.company_id ?? '',
    branch_id: employee?.branch_id ?? '',
    employee_code: employee?.employee_code ?? '',
    first_name: employee?.first_name ?? '',
    last_name: employee?.last_name ?? '',
    email: employee?.email ?? '',
    phone: employee?.phone ?? '',
    department: employee?.department ?? '',
    designation: employee?.designation ?? '',
    joining_date: employee?.joining_date ?? '',
    salary: employee?.salary ?? 0,
    status: employee?.status ?? 'Active',
  },
});

  // Watch company selection
  const companyId = watch('company_id');

  // Load companies
  useEffect(() => {
    async function loadCompanies() {
      try {
        const data =
          await EmployeeService.getCompaniesForDropdown();
        setCompanies(data);
      } catch (error) {
        console.error(error);
        setServerError('Failed to load companies');
      }
    }

    loadCompanies();
  }, []);

  // Load branches when company changes
  useEffect(() => {
    async function loadBranches() {
      try {
        const data =
          await EmployeeService.getBranchesForDropdown(
            companyId || selectedCompany
          );

        setBranches(data as BranchOption[]);

        // Reset branch if company changed
        if (companyId !== selectedCompany) {
          setValue('branch_id', '');
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (companyId || selectedCompany) {
      loadBranches();
    }
  }, [companyId, selectedCompany, setValue]);

  const onSubmit: SubmitHandler<EmployeeSchema> = async (
    values
  ) => {
    setLoading(true);
    setServerError('');

    try {
      if (employee?.id) {
        await EmployeeService.updateEmployee(employee.id, values);
        alert('Employee updated successfully');
      } else {
        await EmployeeService.createEmployee(values);
        alert('Employee created successfully');
      }

      router.refresh();
    } catch (error: any) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20';

  const labelClass =
    'mb-2 block text-sm font-semibold text-slate-800';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
      
      {/* Company & Branch */} 
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Company & Branch
        </h3>

        <div className='grid gap-5 md:grid-cols-2'>
          
          <div>
            <label className={labelClass}>Company *</label>

            <select
              {...register('company_id')}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setValue('company_id', e.target.value);
              }}
              className={inputClass}
            >
              <option value=''>Select company</option>

              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.company_name}
                </option>
              ))}
            </select>

            {errors.company_id && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.company_id.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Branch *</label>

            <select
              {...register('branch_id')}
              className={inputClass}
            >
              <option value=''>Select branch</option>

              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.branch_name}
                </option>
              ))}
            </select>

            {errors.branch_id && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.branch_id.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Employee Details */} 
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Employee Details
        </h3>

        <div className='grid gap-5 md:grid-cols-2'>
          
          <div>
            <label className={labelClass}>Employee Code *</label>

            <input
              {...register('employee_code')}
              className={inputClass}
              placeholder='EMP001'
            />
          </div>

          <div>
            <label className={labelClass}>First Name *</label>

            <input
              {...register('first_name')}
              className={inputClass}
              placeholder='Kautik'
            />
          </div>

          <div>
            <label className={labelClass}>Last Name</label>

            <input
              {...register('last_name')}
              className={inputClass}
              placeholder='Nai'
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>

            <input
              type='email'
              {...register('email')}
              className={inputClass}
              placeholder='employee@company.com'
            />
          </div>

          <div>
            <label className={labelClass}>Phone</label>

            <input
              {...register('phone')}
              className={inputClass}
              placeholder='9876543210'
            />
          </div>
        </div>
      </div>

      {/* Job Information */} 
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Job Information
        </h3>

        <div className='grid gap-5 md:grid-cols-2'>
          
          <input
            {...register('department')}
            className={inputClass}
            placeholder='Department (IT, Sales, HR)'
          />

          <input
            {...register('designation')}
            className={inputClass}
            placeholder='Designation'
          />

          <div>
            <label className={labelClass}>Joining Date</label>

            <input
              type='date'
              {...register('joining_date')}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Salary</label>

            <input
              type='number'
              step='0.01'
              {...register('salary')}
              className={inputClass}
              placeholder='25000'
            />
          </div>
        </div>
      </div>

      {/* Status */} 
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Employee Status
        </h3>

        <select
          {...register('status')}
          className={inputClass}
        >
          <option value='Active'>🟢 Active</option>
          <option value='Inactive'>🔴 Inactive</option>
        </select>
      </div>

      {/* Error */} 
      {serverError && (
        <div className='rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700'>
          {serverError}
        </div>
      )}

      {/* Submit */} 
      <div className='flex justify-end border-t border-slate-200 pt-6'>
        <button
          type='submit'
          disabled={loading}
          className='inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-700 disabled:opacity-60'
        >
          {loading ? (
            <>
              <Loader2 className='h-5 w-5 animate-spin' />
              Saving...
            </>
          ) : (
            <>
              <Save className='h-5 w-5' />
              {employee?.id
                ? 'Update Employee'
                : 'Save Employee'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}