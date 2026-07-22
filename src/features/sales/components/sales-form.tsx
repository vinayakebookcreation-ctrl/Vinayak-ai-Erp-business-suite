'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';

import {
  salesSchema,
  type SalesSchema,
} from '../sales-schema';

import { SalesService } from '../services/sales.service';

import type { Customer } from '@/features/customer/types';
import type { Product } from '@/features/inventory/types';

export function SalesForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [serverError, setServerError] = useState('');

  const {
    register,
    control,
    watch,
    handleSubmit,
  } = useForm<SalesSchema>({
    resolver: zodResolver(salesSchema) as any,

    defaultValues: {
      invoice_number: `INV-${Date.now()}`,
      invoice_date: new Date().toISOString().split('T')[0],

      discount_amount: 0,
      other_charges: 0,

      payment_status: 'Pending',
      status: 'Confirmed',

      items: [
        {
          product_id: '',
          quantity: 1,
          sale_price: 0,
          gst_percent: 18,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    async function loadData() {
      const [customerData, productData] = await Promise.all([
        SalesService.getCustomers(),
        SalesService.getProducts(),
      ]);

      setCustomers(customerData);
      setProducts(productData);
    }

    loadData();
  }, []);

  const items = watch('items');
  const discountAmount = Number(watch('discount_amount') || 0);
  const otherCharges = Number(watch('other_charges') || 0);

  const totals = useMemo(() => {
    let subtotal = 0;
    let gst = 0;

    items.forEach((item) => {
      const lineSubtotal =
        Number(item.quantity || 0) *
        Number(item.sale_price || 0);

      subtotal += lineSubtotal;

      gst +=
        (lineSubtotal * Number(item.gst_percent || 0)) / 100;
    });

    return {
      subtotal,
      gst,
      grandTotal:
        subtotal + gst - discountAmount + otherCharges,
    };
  }, [items, discountAmount, otherCharges]);

  async function onSubmit(values: SalesSchema) {
    setLoading(true);
    setServerError('');

    try {
      await SalesService.createInvoice(values);

      alert('Sales invoice created successfully');

      router.refresh();
    } catch (error: any) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-4 py-3';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-6'
    >

      {/* Header */}
      <div className='grid gap-4 md:grid-cols-3'>

        <div>
          <label className='mb-2 block text-sm font-semibold'>
            Invoice Number
          </label>

          <input
            {...register('invoice_number')}
            className={inputClass}
          />
        </div>

        <div>
          <label className='mb-2 block text-sm font-semibold'>
            Customer
          </label>

          <select
            {...register('customer_id')}
            className={inputClass}
          >
            <option value=''>Select customer</option>

            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.customer_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='mb-2 block text-sm font-semibold'>
            Invoice Date
          </label>

          <input
            type='date'
            {...register('invoice_date')}
            className={inputClass}
          />
        </div>
      </div>

      {/* Items */}
      <div className='rounded-xl border bg-white p-4'>

        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>Invoice Items</h3>

          <button
            type='button'
            onClick={() =>
              append({
                product_id: '',
                quantity: 1,
                sale_price: 0,
                gst_percent: 18,
              })
            }
            className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
          >
            <Plus className='h-4 w-4' />
            Add Item
          </button>
        </div>

        <div className='space-y-4'>

          {fields.map((field, index) => {
            const qty = Number(items[index]?.quantity || 0);
            const rate = Number(items[index]?.sale_price || 0);
            const gstPercent = Number(
              items[index]?.gst_percent || 0
            );

            const lineSubtotal = qty * rate;
            const lineGst = (lineSubtotal * gstPercent) / 100;
            const lineTotal = lineSubtotal + lineGst;

            return (
              <div
                key={field.id}
                className='grid gap-4 rounded-lg border p-4 md:grid-cols-12'
              >

                <div className='md:col-span-4'>
                  <label className='mb-2 block text-sm font-medium'>
                    Product
                  </label>

                  <select
                    {...register(`items.${index}.product_id`)}
                    className={inputClass}
                  >
                    <option value=''>Select product</option>

                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.product_name} ({product.sku}) - Stock: {product.current_stock}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='md:col-span-2'>
                  <label className='mb-2 block text-sm font-medium'>
                    Qty
                  </label>

                  <input
                    type='number'
                    step='0.01'
                    {...register(`items.${index}.quantity`)}
                    className={inputClass}
                  />
                </div>

                <div className='md:col-span-2'>
                  <label className='mb-2 block text-sm font-medium'>
                    Rate
                  </label>

                  <input
                    type='number'
                    step='0.01'
                    {...register(`items.${index}.sale_price`)}
                    className={inputClass}
                  />
                </div>

                <div className='md:col-span-2'>
                  <label className='mb-2 block text-sm font-medium'>
                    GST %
                  </label>

                  <input
                    type='number'
                    step='0.01'
                    {...register(`items.${index}.gst_percent`)}
                    className={inputClass}
                  />
                </div>

                <div className='flex items-end md:col-span-2'>
                  <button
                    type='button'
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className='inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-3 text-red-600 hover:bg-red-50 disabled:opacity-50'
                  >
                    <Trash2 className='h-4 w-4' />
                    Remove
                  </button>
                </div>

                <div className='md:col-span-12 rounded-lg bg-slate-50 p-3 text-right'>
                  <div className='text-sm text-slate-600'>
                    Line Total
                  </div>

                  <div className='text-lg font-bold text-slate-900'>
                    ₹{lineTotal.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Totals */}
      <div className='grid gap-6 md:grid-cols-2'>

        <div className='rounded-xl border bg-white p-4'>

          <label className='mb-2 block text-sm font-semibold'>
            Discount Amount
          </label>

          <input
            type='number'
            step='0.01'
            {...register('discount_amount')}
            className={inputClass}
          />

          <label className='mb-2 mt-4 block text-sm font-semibold'>
            Other Charges
          </label>

          <input
            type='number'
            step='0.01'
            {...register('other_charges')}
            className={inputClass}
          />

          <label className='mb-2 mt-4 block text-sm font-semibold'>
            Payment Status
          </label>

          <select
            {...register('payment_status')}
            className={inputClass}
          >
            <option value='Pending'>Pending</option>
            <option value='Partial'>Partial</option>
            <option value='Paid'>Paid</option>
          </select>

          <label className='mb-2 mt-4 block text-sm font-semibold'>
            Invoice Status
          </label>

          <select {...register('status')} className={inputClass}>
            <option value='Draft'>Draft</option>
            <option value='Confirmed'>Confirmed</option>
            <option value='Cancelled'>Cancelled</option>
          </select>
        </div>

        <div className='rounded-xl border bg-white p-4'>

          <div className='space-y-3 text-sm'>

            <div className='flex justify-between'>
              <span>Subtotal</span>
              <span>
                ₹{totals.subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div className='flex justify-between'>
              <span>GST Amount</span>
              <span>
                ₹{totals.gst.toLocaleString('en-IN')}
              </span>
            </div>

            <div className='flex justify-between'>
              <span>Discount</span>
              <span>
                - ₹{discountAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className='flex justify-between'>
              <span>Other Charges</span>
              <span>
                ₹{otherCharges.toLocaleString('en-IN')}
              </span>
            </div>

            <div className='border-t pt-3'>
              <div className='flex justify-between text-lg font-bold'>
                <span>Grand Total</span>
                <span>
                  ₹{totals.grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
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
      <div className='flex justify-end'>
        <button
          type='submit'
          disabled={loading}
          className='inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-60'
        >
          {loading ? (
            <>
              <Loader2 className='h-5 w-5 animate-spin' />
              Saving...
            </>
          ) : (
            <>
              <Save className='h-5 w-5' />
              Save Invoice
            </>
          )}
        </button>
      </div>
    </form>
  );
}