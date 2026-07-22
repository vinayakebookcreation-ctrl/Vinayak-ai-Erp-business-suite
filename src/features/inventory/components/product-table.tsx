'use client';

import { useEffect, useState } from 'react';
import { Package, Pencil, Trash2, AlertTriangle } from 'lucide-react';

import { InventoryService } from '../services/inventory.service';
import type { Product } from '../types';

export function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function loadProducts() {
    try {
      const data = await InventoryService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = confirm(
      'Are you sure you want to delete this product?'
    );

    if (!confirmed) return;

    try {
      await InventoryService.deleteProduct(id);

      setProducts((prev) =>
        prev.filter((product) => product.id !== id)
      );

      alert('Product deleted successfully');
    } catch (error: any) {
      alert(error.message);
    }
  }

  const filteredProducts = products.filter((product) =>
    `${product.product_name} ${product.sku} ${
      product.category?.category_name || ''
    } ${product.brand?.brand_name || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className='rounded-xl border bg-white p-8 text-center'>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />
        <p className='mt-3 text-sm text-gray-500'>
          Loading products...
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>

      {/* Search */}
      <div className='flex items-center justify-between gap-4'>
        <input
          type='text'
          placeholder='Search products...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full max-w-sm rounded-lg border border-slate-300 px-4 py-2'
        />

        <div className='text-sm text-gray-500'>
          Total: {filteredProducts.length}
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className='rounded-xl border bg-white p-10 text-center'>
          <Package className='mx-auto h-12 w-12 text-gray-400' />

          <h3 className='mt-4 text-lg font-semibold text-gray-900'>
            No products found
          </h3>

          <p className='mt-1 text-sm text-gray-500'>
            Create your first product to get started.
          </p>
        </div>
      ) : (
        <div className='overflow-hidden rounded-xl border bg-white shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>

              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Product
                  </th>

                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Category
                  </th>

                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Brand
                  </th>

                  <th className='px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Purchase
                  </th>

                  <th className='px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Sale
                  </th>

                  <th className='px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Stock
                  </th>

                  <th className='px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Status
                  </th>

                  <th className='px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-200 bg-white'>
                {filteredProducts.map((product) => {
                  const isLowStock =
                    Number(product.current_stock) <=
                    Number(product.reorder_level);

                  return (
                    <tr key={product.id} className='hover:bg-gray-50'>

                      {/* Product */}
                      <td className='px-6 py-4'>
                        <div className='font-semibold text-gray-900'>
                          {product.product_name}
                        </div>

                        <div className='text-sm text-gray-500'>
                          SKU: {product.sku}
                        </div>

                        <div className='text-sm text-gray-500'>
                          HSN: {product.hsn_code || '—'}
                        </div>
                      </td>

                      {/* Category */}
                      <td className='px-6 py-4 text-sm text-gray-900'>
                        {product.category?.category_name || '—'}
                      </td>

                      {/* Brand */}
                      <td className='px-6 py-4 text-sm text-gray-900'>
                        {product.brand?.brand_name || '—'}
                      </td>

                      {/* Purchase */}
                      <td className='px-6 py-4 text-right font-medium text-gray-900'>
                        ₹{Number(product.purchase_price).toLocaleString('en-IN')}
                      </td>

                      {/* Sale */}
                      <td className='px-6 py-4 text-right font-semibold text-gray-900'>
                        ₹{Number(product.sale_price).toLocaleString('en-IN')}
                      </td>

                      {/* Stock */}
                      <td className='px-6 py-4 text-center'>
                        <div className='flex items-center justify-center gap-2'>

                          {isLowStock && (
                            <AlertTriangle className='h-4 w-4 text-orange-500' />
                          )}

                          <span
                            className={`font-semibold ${
                              isLowStock
                                ? 'text-orange-600'
                                : 'text-gray-900'
                            }`}
                          >
                            {product.current_stock}
                          </span>

                          <span className='text-sm text-gray-500'>
                            {product.unit?.unit_code}
                          </span>
                        </div>

                        <div className='text-xs text-gray-500'>
                          Reorder: {product.reorder_level}
                        </div>
                      </td>

                      {/* Status */}
                      <td className='px-6 py-4 text-center'>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            product.status === 'Active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className='px-6 py-4 text-right'>
                        <div className='flex justify-end gap-2'>

                          <button
                            className='rounded-lg border p-2 text-blue-600 hover:bg-blue-50'
                            title='Edit'
                          >
                            <Pencil className='h-4 w-4' />
                          </button>

                          <button
                            onClick={() => handleDelete(product.id)}
                            className='rounded-lg border p-2 text-red-600 hover:bg-red-50'
                            title='Delete'
                          >
                            <Trash2 className='h-4 w-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}