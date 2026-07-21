'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';

import {
  customerSchema,
  type CustomerSchema,
} from '../customer-schema';

import type { Customer } from '../types';
import { CustomerService } from '../services/customer.service';

type CustomerFormProps = {
  customer?: Customer;
};

export function CustomerForm({
  customer,
}: CustomerFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema) as any,
    defaultValues: {
      customer_code: customer?.customer_code ?? '',
      customer_name: customer?.customer_name ?? '',
      contact_person: customer?.contact_person ?? '',
      email: customer?.email ?? '',
      phone: customer?.phone ?? '',
      gst_number: customer?.gst_number ?? '',
      billing_address: customer?.billing_address ?? '',
      shipping_address: customer?.shipping_address ?? '',
      city: customer?.city ?? '',
      state: customer?.state ?? '',
      credit_limit: customer?.credit_limit ?? 0,
      status: customer?.status ?? 'Active',
    },
  });

  const onSubmit: SubmitHandler<CustomerSchema> = async (
    values
  ) => {
    setLoading(true);
    setServerError('');

    try {
      if (customer?.id) {
        await CustomerService.updateCustomer(customer.id, values);
        alert('Customer updated successfully');
      } else {
        await CustomerService.createCustomer(values);
        alert('Customer created successfully');
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

      {/* Customer Information */}
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Customer Information
        </h3>

        <div className='grid gap-5 md:grid-cols-2'>

          <div>
            <label className={labelClass}>Customer Code *</label>
            <input
              {...register('customer_code')}
              className={inputClass}
              placeholder='CUST001'
            />
            {errors.customer_code && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.customer_code.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Customer Name *</label>
            <input
              {...register('customer_name')}
              className={inputClass}
              placeholder='XYZ Enterprises'
            />
            {errors.customer_name && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.customer_name.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Contact Person</label>
            <input
              {...register('contact_person')}
              className={inputClass}
              placeholder='Mahesh Shah'
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
              placeholder='customer@example.com'
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

      {/* Addresses */}
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Address Details
        </h3>

        <div className='grid gap-5 md:grid-cols-2'>

          <div>
            <label className={labelClass}>Billing Address</label>
            <textarea
              {...register('billing_address')}
              rows={3}
              className={inputClass}
              placeholder='Enter billing address'
            />
          </div>

          <div>
            <label className={labelClass}>Shipping Address</label>
            <textarea
              {...register('shipping_address')}
              rows={3}
              className={inputClass}
              placeholder='Enter shipping address'
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

      {/* Credit & Status */}
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Credit & Status
        </h3>

        <div className='grid gap-5 md:grid-cols-2'>

          <div>
            <label className={labelClass}>Credit Limit (₹)</label>
            <input
              type='number'
              step='0.01'
              {...register('credit_limit')}
              className={inputClass}
              placeholder='50000'
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
              {customer?.id ? 'Update Customer' : 'Save Customer'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}