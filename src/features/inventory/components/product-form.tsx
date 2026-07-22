'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';

import {
  productSchema,
  type ProductSchema,
} from '../inventory-schema';

import { InventoryService } from '../services/inventory.service';
import type {
  Category,
  Brand,
  Unit,
  Product,
} from '../types';

type ProductFormProps = {
  product?: Product;
};

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    async function loadMasters() {
      const [catData, brandData, unitData] = await Promise.all([
        InventoryService.getCategories(),
        InventoryService.getBrands(),
        InventoryService.getUnits(),
      ]);

      setCategories(catData);
      setBrands(brandData);
      setUnits(unitData);
    }

    loadMasters();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      sku: product?.sku ?? '',
      product_name: product?.product_name ?? '',
      category_id: product?.category_id ?? '',
      brand_id: product?.brand_id ?? '',
      unit_id: product?.unit_id ?? '',
      hsn_code: product?.hsn_code ?? '',
      purchase_price: product?.purchase_price ?? 0,
      sale_price: product?.sale_price ?? 0,
      opening_stock: product?.opening_stock ?? 0,
      current_stock: product?.current_stock ?? 0,
      reorder_level: product?.reorder_level ?? 0,
      description: product?.description ?? '',
      status: product?.status ?? 'Active',
    },
  });

  const onSubmit: SubmitHandler<ProductSchema> = async (
    values
  ) => {
    setLoading(true);
    setServerError('');

    try {
      if (product?.id) {
        await InventoryService.updateProduct(product.id, values);
        alert('Product updated successfully');
      } else {
        await InventoryService.createProduct(values);
        alert('Product created successfully');
      }

      router.refresh();
    } catch (error: any) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20';

  const labelClass =
    'mb-2 block text-sm font-semibold text-slate-800';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>

      {/* Product Info */}
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Product Information
        </h3>

        <div className='grid gap-5 md:grid-cols-2'>

          <div>
            <label className={labelClass}>SKU *</label>
            <input
              {...register('sku')}
              className={inputClass}
              placeholder='PRD001'
            />
            {errors.sku && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.sku.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Product Name *</label>
            <input
              {...register('product_name')}
              className={inputClass}
              placeholder='Samsung 32 Inch LED TV'
            />
            {errors.product_name && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.product_name.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Category *</label>
            <select {...register('category_id')} className={inputClass}>
              <option value=''>Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Brand *</label>
            <select {...register('brand_id')} className={inputClass}>
              <option value=''>Select brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.brand_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Unit *</label>
            <select {...register('unit_id')} className={inputClass}>
              <option value=''>Select unit</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.unit_name} ({unit.unit_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>HSN Code</label>
            <input
              {...register('hsn_code')}
              className={inputClass}
              placeholder='8528'
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Pricing
        </h3>

        <div className='grid gap-5 md:grid-cols-2'>

          <div>
            <label className={labelClass}>Purchase Price (₹)</label>
            <input
              type='number'
              step='0.01'
              {...register('purchase_price')}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Sale Price (₹)</label>
            <input
              type='number'
              step='0.01'
              {...register('sale_price')}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Stock */}
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-6 text-lg font-semibold text-slate-900'>
          Stock Details
        </h3>

        <div className='grid gap-5 md:grid-cols-3'>

          <div>
            <label className={labelClass}>Opening Stock</label>
            <input
              type='number'
              step='0.01'
              {...register('opening_stock')}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Current Stock</label>
            <input
              type='number'
              step='0.01'
              {...register('current_stock')}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Reorder Level</label>
            <input
              type='number'
              step='0.01'
              {...register('reorder_level')}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <h3 className='mb-4 text-lg font-semibold text-slate-900'>
          Description
        </h3>

        <textarea
          {...register('description')}
          rows={4}
          className={inputClass}
          placeholder='Product description...'
        />
      </div>

      {/* Status */}
      <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
        <label className={labelClass}>Status</label>

        <select {...register('status')} className={inputClass}>
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
          className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60'
        >
          {loading ? (
            <>
              <Loader2 className='h-5 w-5 animate-spin' />
              Saving...
            </>
          ) : (
            <>
              <Save className='h-5 w-5' />
              {product?.id ? 'Update Product' : 'Save Product'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}