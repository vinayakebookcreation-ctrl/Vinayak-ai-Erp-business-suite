'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';

import {
  branchSchema,
  type BranchSchema,
} from '../branch-schema';
import type { Branch } from '../types';
import { BranchService } from '../services/branch.service';

type CompanyOption = {
  id: string;
  company_name: string;
};

type BranchFormProps = {
  branch?: Branch;
};

export function BranchForm({ branch }: BranchFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BranchSchema>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      company_id: branch?.company_id ?? '',
      branch_name: branch?.branch_name ?? '',
      branch_code: branch?.branch_code ?? '',
      email: branch?.email ?? '',
      phone: branch?.phone ?? '',
      address: branch?.address ?? '',
      city: branch?.city ?? '',
      state: branch?.state ?? '',
      status: branch?.status ?? 'Active',
    },
  });

  // Load companies for dropdown
  useEffect(() => {
    async function loadCompanies() {
      try {
        const data =
          await BranchService.getCompaniesForDropdown();
        setCompanies(data);
      } catch (error) {
        console.error(error);
        setServerError('Failed to load companies');
      }
    }

    loadCompanies();
  }, []);

  const onSubmit: SubmitHandler<BranchSchema> = async (
    values
  ) => {
    setLoading(true);
    setServerError('');

    try {
      if (branch?.id) {
        await BranchService.updateBranch(branch.id, values);
        alert('Branch updated successfully');
      } else {
        await BranchService.createBranch(values);
        alert('Branch created successfully');
      }

      router.refresh();
    } catch (error: any) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20';

  const labelClass =
    'mb-2 block text-sm font-semibold text-slate-800';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
      
      {/* Company Selection */} 
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Company Selection
        </h3>

        <div>
          <label className={labelClass}>
            Select Company *
          </label>

          <select
            {...register('company_id')}
            className={inputClass}
          >
            <option value=''>Choose a company</option>

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
      </div>

      {/* Branch Information */} 
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Branch Information
        </h3>

        <div className='grid gap-5 md:grid-cols-2'>
          
          <div>
            <label className={labelClass}>Branch Name *</label>

            <input
              {...register('branch_name')}
              className={inputClass}
              placeholder='Main Branch'
            />

            {errors.branch_name && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.branch_name.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Branch Code *</label>

            <input
              {...register('branch_code')}
              className={inputClass}
              placeholder='BR001'
            />

            {errors.branch_code && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.branch_code.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */} 
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Contact Information
        </h3>

        <div className='grid gap-5 md:grid-cols-2'>
          
          <div>
            <label className={labelClass}>Email</label>

            <input
              type='email'
              {...register('email')}
              className={inputClass}
              placeholder='branch@company.com'
            />

            {errors.email && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.email.message}
              </p>
            )}
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

      {/* Address */} 
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Address Details
        </h3>

        <div className='space-y-5'>
          
          <textarea
            {...register('address')}
            rows={3}
            className={inputClass}
            placeholder='Enter branch address'
          />

          <div className='grid gap-5 md:grid-cols-2'>
            <input
              {...register('city')}
              className={inputClass}
              placeholder='City'
            />

            <input
              {...register('state')}
              className={inputClass}
              placeholder='State'
            />
          </div>
        </div>
      </div>

      {/* Status */} 
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Branch Status
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
          className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60'
        >
          {loading ? (
            <>
              <Loader2 className='h-5 w-5 animate-spin' />
              Saving...
            </>
          ) : (
            <>
              <Save className='h-5 w-5' />
              {branch?.id ? 'Update Branch' : 'Save Branch'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}