'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';

import {
  companySchema,
  type CompanySchema,
} from '../company-schema';
import type { Company } from '../types';
import { CompanyService } from '../services/company.service';

type CompanyFormProps = {
  company?: Company;
};

export function CompanyForm({ company }: CompanyFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanySchema>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      company_name: company?.company_name ?? '',
      legal_name: company?.legal_name ?? '',
      gst_number: company?.gst_number ?? '',
      pan_number: company?.pan_number ?? '',
      email: company?.email ?? '',
      phone: company?.phone ?? '',
      website: company?.website ?? '',
      address: company?.address ?? '',
      city: company?.city ?? '',
      state: company?.state ?? '',
      country: company?.country ?? 'India',
      pincode: company?.pincode ?? '',
      timezone: company?.timezone ?? 'Asia/Kolkata',
      currency: company?.currency ?? 'INR',
      status: company?.status ?? 'Active',
    },
  });

  const onSubmit: SubmitHandler<CompanySchema> = async (
    values
  ) => {
    setLoading(true);
    setServerError('');

    try {
      if (company?.id) {
        await CompanyService.updateCompany(company.id, values);
        alert('Company updated successfully');
      } else {
        await CompanyService.createCompany(values);
        alert('Company created successfully');
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
      
      {/* Basic Information */} 
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Basic Information
        </h3>

        <div className='grid gap-5 md:grid-cols-2'>
          
          {/* Company Name */} 
          <div>
            <label className={labelClass}>Company Name *</label>

            <input
              {...register('company_name')}
              className={inputClass}
              placeholder='Vinayak AI Pvt Ltd'
            />

            {errors.company_name && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.company_name.message}
              </p>
            )}
          </div>

          {/* Legal Name */} 
          <div>
            <label className={labelClass}>Legal Name</label>

            <input
              {...register('legal_name')}
              className={inputClass}
              placeholder='Vinayak AI Private Limited'
            />
          </div>

          {/* GST */} 
          <div>
            <label className={labelClass}>GST Number</label>

            <input
              {...register('gst_number')}
              className={inputClass}
              placeholder='24ABCDE1234F1Z5'
            />

            {errors.gst_number && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.gst_number.message}
              </p>
            )}
          </div>

          {/* PAN */} 
          <div>
            <label className={labelClass}>PAN Number</label>

            <input
              {...register('pan_number')}
              className={inputClass}
              placeholder='ABCDE1234F'
            />

            {errors.pan_number && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.pan_number.message}
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
              placeholder='info@vinayakerp.com'
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

          <div className='md:col-span-2'>
            <label className={labelClass}>Website</label>

            <input
              {...register('website')}
              className={inputClass}
              placeholder='https://vinayakerp.com'
            />

            {errors.website && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.website.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Address */} 
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Address Details
        </h3>

        <div className='space-y-5'>
          
          <div>
            <label className={labelClass}>Address</label>

            <textarea
              {...register('address')}
              rows={3}
              className={inputClass}
              placeholder='Enter company address'
            />
          </div>

          <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-4'>
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

            <input
              {...register('country')}
              className={inputClass}
              placeholder='Country'
            />

            <input
              {...register('pincode')}
              className={inputClass}
              placeholder='Pincode'
            />
          </div>
        </div>
      </div>

      {/* Regional Settings */} 
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Regional Settings
        </h3>

        <div className='grid gap-5 md:grid-cols-3'>
          
          <div>
            <label className={labelClass}>Timezone</label>

            <input
              {...register('timezone')}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Currency</label>

            <input
              {...register('currency')}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Status</label>

            <select
              {...register('status')}
              className={inputClass}
            >
              <option value='Active'>🟢 Active</option>
              <option value='Inactive'>🔴 Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */} 
      {serverError && (
        <div className='rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700'>
          {serverError}
        </div>
      )}

      {/* Submit Button */} 
      <div className='flex justify-end border-t border-slate-200 pt-6'>
        <button
          type='submit'
          disabled={loading}
          className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {loading ? (
            <>
              <Loader2 className='h-5 w-5 animate-spin' />
              Saving...
            </>
          ) : (
            <>
              <Save className='h-5 w-5' />
              {company?.id ? 'Update Company' : 'Save Company'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}