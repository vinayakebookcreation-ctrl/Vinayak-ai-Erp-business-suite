'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';

import {
  purchaseSchema,
  type PurchaseSchema,
} from '../purchase-schema';

import { PurchaseService } from '../services/purchase.service';

import type { Supplier } from '@/features/supplier/types';
import type { Product } from '@/features/inventory/types';

export function PurchaseForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [serverError, setServerError] = useState('');

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<PurchaseSchema>({
    resolver: zodResolver(purchaseSchema) as any,

    defaultValues: {
      po_number: `PO-${Date.now()}`,
      purchase_date: new Date().toISOString().split('T')[0],
      other_charges: 0,
      status: 'Received',

      items: [
        {
          product_id: '',
          quantity: 1,
          purchase_price: 0,
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
      const [supplierData, productData] = await Promise.all([
        PurchaseService.getSuppliers(),
        PurchaseService.getProducts(),
      ]);

      setSuppliers(supplierData);
      setProducts(productData);
    }

    loadData();
  }, []);

  const items = watch('items');
  const otherCharges = Number(watch('other_charges') || 0);

  const totals = useMemo(() => {
    let subtotal = 0;
    let gst = 0;

    items.forEach((item) => {
      const lineSubtotal =
        Number(item.quantity || 0) *
        Number(item.purchase_price || 0);

      subtotal += lineSubtotal;

      gst +=
        (lineSubtotal * Number(item.gst_percent || 0)) / 100;
    });

    return {
      subtotal,
      gst,
      grandTotal: subtotal + gst + otherCharges,
    };
  }, [items, otherCharges]);

  async function onSubmit(values: PurchaseSchema) {
    setLoading(true);
    setServerError('');

    try {
      await PurchaseService.createPurchase(values);

      alert('Purchase order created successfully');

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
            PO Number
          </label>

          <input
            {...register('po_number')}
            className={inputClass}
          />
        </div>

        <div>
          <label className='mb-2 block text-sm font-semibold'>
            Supplier
          </label>

          <select
            {...register('supplier_id')}
            className={inputClass}
          >
            <option value=''>Select supplier</option>

            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.supplier_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='mb-2 block text-sm font-semibold'>
            Purchase Date
          </label>

          <input
            type='date'
            {...register('purchase_date')}
            className={inputClass}
          />
        </div>
      </div>

      {/* Items */}
      <div className='rounded-xl border bg-white p-4'>

        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>Purchase Items</h3>

          <button
            type='button'
            onClick={() =>
              append({
                product_id: '',
                quantity: 1,
                purchase_price: 0,
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
            const rate = Number(items[index]?.purchase_price || 0);
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

                {/* Product */}
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
                        {product.product_name} ({product.sku})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Qty */}
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

                {/* Rate */}
                <div className='md:col-span-2'>
                  <label className='mb-2 block text-sm font-medium'>
                    Rate
                  </label>

                  <input
                    type='number'
                    step='0.01'
                    {...register(`items.${index}.purchase_price`)}
                    className={inputClass}
                  />
                </div>

                {/* GST */}
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

                {/* Remove */}
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

                {/* Line Total */}
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
            Other Charges
          </label>

          <input
            type='number'
            step='0.01'
            {...register('other_charges')}
            className={inputClass}
          />

          <label className='mb-2 mt-4 block text-sm font-semibold'>
            Status
          </label>

          <select {...register('status')} className={inputClass}>
            <option value='Draft'>Draft</option>
            <option value='Ordered'>Ordered</option>
            <option value='Received'>Received</option>
            <option value='Cancelled'>Cancelled</option>
          </select>

          <label className='mb-2 mt-4 block text-sm font-semibold'>
            Notes
          </label>

          <textarea
            {...register('notes')}
            rows={4}
            className={inputClass}
            placeholder='Optional notes'
          />
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
          className='inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-60'
        >
          {loading ? (
            <>
              <Loader2 className='h-5 w-5 animate-spin' />
              Saving...
            </>
          ) : (
            <>
              <Save className='h-5 w-5' />
              Save Purchase
            </>
          )}
        </button>
      </div>
    </form>
  );
}