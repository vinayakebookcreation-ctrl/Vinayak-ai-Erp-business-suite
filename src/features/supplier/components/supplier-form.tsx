'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';

import {
  supplierSchema,
  type SupplierSchema,
} from '../supplier-schema';

import type { Supplier } from '../types';
import { SupplierService } from '../services/supplier.service';

type SupplierFormProps = {
  supplier?: Supplier;
};

export function SupplierForm({
  supplier,
}: SupplierFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierSchema>({
    resolver: zodResolver(supplierSchema) as any,
    defaultValues: {
      supplier_code: supplier?.supplier_code ?? '',
      supplier_name: supplier?.supplier_name ?? '',
      contact_person: supplier?.contact_person ?? '',
      email: supplier?.email ?? '',
      phone: supplier?.phone ?? '',
      gst_number: supplier?.gst_number ?? '',
      address: supplier?.address ?? '',
      city: supplier?.city ?? '',
      state: supplier?.state ?? '',
      status: supplier?.status ?? 'Active',
    },
  });

  const onSubmit: SubmitHandler<SupplierSchema> = async (
    values
  ) => {
    setLoading(true);
    setServerError('');

    try {
      if (supplier?.id) {
        await SupplierService.updateSupplier(supplier.id, values);
        alert('Supplier updated successfully');
      } else {
        await SupplierService.createSupplier(values);
        alert('Supplier created successfully');
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
      
      {/* Supplier Information */} 
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Supplier Information
        </h3>

        <div className='grid gap-5 md:grid-cols-2'>
          
          <div>
            <label className={labelClass}>Supplier Code *</label>

            <input
              {...register('supplier_code')}
              className={inputClass}
              placeholder='SUP001'
            />

            {errors.supplier_code && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.supplier_code.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Supplier Name *</label>

            <input
              {...register('supplier_name')}
              className={inputClass}
              placeholder='ABC Traders'
            />

            {errors.supplier_name && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.supplier_name.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Contact Person</label>

            <input
              {...register('contact_person')}
              className={inputClass}
              placeholder='Ramesh Patel'
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

          <div>
            <label className={labelClass}>Email</label>

            <input
              type='email'
              {...register('email')}
              className={inputClass}
              placeholder='supplier@example.com'
            />
          </div>

          <div>
            <label className={labelClass}>GST Number</label>

            <input
              {...register('gst_number')}
              className={inputClass}
              placeholder='24ABCDE1234F1Z5'
            />
          </div>
        </div>
      </div>

      {/* Address */} 
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Address Details
        </h3>

        <div className='grid gap-5 md:grid-cols-2'>
          
          <div className='md:col-span-2'>
            <label className={labelClass}>Address</label>

            <textarea
              {...register('address')}
              rows={3}
              className={inputClass}
              placeholder='Enter supplier address'
            />
          </div>

          <div>
            <label className={labelClass}>City</label>

            <input
              {...register('city')}
              className={inputClass}
              placeholder='Vadodara'
            />
          </div>

          <div>
            <label className={labelClass}>State</label>

            <input
              {...register('state')}
              className={inputClass}
              placeholder='Gujarat'
            />
          </div>
        </div>
      </div>

      {/* Status */} 
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Supplier Status
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
              {supplier?.id
                ? 'Update Supplier'
                : 'Save Supplier'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}