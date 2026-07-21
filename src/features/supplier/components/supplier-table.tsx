'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Truck } from 'lucide-react';

import { SupplierService } from '../services/supplier.service';
import type { Supplier } from '../types';

export function SupplierTable() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function loadSuppliers() {
    try {
      const data = await SupplierService.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = confirm(
      'Are you sure you want to delete this supplier?'
    );

    if (!confirmed) return;

    try {
      await SupplierService.deleteSupplier(id);

      setSuppliers((prev) =>
        prev.filter((supplier) => supplier.id !== id)
      );

      alert('Supplier deleted successfully');
    } catch (error: any) {
      alert(error.message);
    }
  }

  const filteredSuppliers = suppliers.filter((supplier) =>
    `${supplier.supplier_name} ${supplier.supplier_code} ${
      supplier.contact_person || ''
    } ${supplier.city || ''} ${supplier.state || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className='rounded-xl border bg-white p-8 text-center'>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />

        <p className='mt-3 text-sm text-gray-500'>
          Loading suppliers...
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
          placeholder='Search suppliers...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full max-w-sm rounded-lg border border-slate-300 px-4 py-2'
        />

        <div className='text-sm text-gray-500'>
          Total: {filteredSuppliers.length}
        </div>
      </div>

      {/* Empty State */} 
      {filteredSuppliers.length === 0 ? (
        <div className='rounded-xl border bg-white p-10 text-center'>
          <Truck className='mx-auto h-12 w-12 text-gray-400' />

          <h3 className='mt-4 text-lg font-semibold text-gray-900'>
            No suppliers found
          </h3>

          <p className='mt-1 text-sm text-gray-500'>
            Create your first supplier to get started.
          </p>
        </div>
      ) : (
        <div className='overflow-hidden rounded-xl border bg-white shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Supplier
                  </th>

                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Contact
                  </th>

                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    GST Number
                  </th>

                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Location
                  </th>

                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Status
                  </th>

                  <th className='px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-200 bg-white'>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className='hover:bg-gray-50'>
                    
                    {/* Supplier */} 
                    <td className='px-6 py-4'>
                      <div className='font-semibold text-gray-900'>
                        {supplier.supplier_name}
                      </div>

                      <div className='text-sm text-gray-500'>
                        Code: {supplier.supplier_code}
                      </div>
                    </td>

                    {/* Contact */} 
                    <td className='px-6 py-4'>
                      <div className='font-medium text-gray-900'>
                        {supplier.contact_person || '—'}
                      </div>

                      <div className='text-sm text-gray-500'>
                        {supplier.phone || 'No phone'}
                      </div>

                      <div className='text-sm text-gray-500'>
                        {supplier.email || 'No email'}
                      </div>
                    </td>

                    {/* GST */} 
                    <td className='px-6 py-4 font-mono text-sm text-gray-900'>
                      {supplier.gst_number || '—'}
                    </td>

                    {/* Location */} 
                    <td className='px-6 py-4 text-gray-900'>
                      {supplier.city || '—'}
                      {supplier.state
                        ? `, ${supplier.state}`
                        : ''}
                    </td>

                    {/* Status */} 
                    <td className='px-6 py-4'>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          supplier.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {supplier.status}
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
                          onClick={() => handleDelete(supplier.id)}
                          className='rounded-lg border p-2 text-red-600 hover:bg-red-50'
                          title='Delete'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}