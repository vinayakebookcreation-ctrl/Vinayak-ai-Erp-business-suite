'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, UserRound } from 'lucide-react';

import { CustomerService } from '../services/customer.service';
import type { Customer } from '../types';

export function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function loadCustomers() {
    try {
      const data = await CustomerService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load customers');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = confirm(
      'Are you sure you want to delete this customer?'
    );

    if (!confirmed) return;

    try {
      await CustomerService.deleteCustomer(id);

      setCustomers((prev) =>
        prev.filter((customer) => customer.id !== id)
      );

      alert('Customer deleted successfully');
    } catch (error: any) {
      alert(error.message);
    }
  }

  const filteredCustomers = customers.filter((customer) =>
    `${customer.customer_name} ${customer.customer_code} ${
      customer.contact_person || ''
    } ${customer.city || ''} ${customer.state || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className='rounded-xl border bg-white p-8 text-center'>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />
        <p className='mt-3 text-sm text-gray-500'>
          Loading customers...
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
          placeholder='Search customers...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full max-w-sm rounded-lg border border-slate-300 px-4 py-2'
        />

        <div className='text-sm text-gray-500'>
          Total: {filteredCustomers.length}
        </div>
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 ? (
        <div className='rounded-xl border bg-white p-10 text-center'>
          <UserRound className='mx-auto h-12 w-12 text-gray-400' />

          <h3 className='mt-4 text-lg font-semibold text-gray-900'>
            No customers found
          </h3>

          <p className='mt-1 text-sm text-gray-500'>
            Create your first customer to get started.
          </p>
        </div>
      ) : (
        <div className='overflow-hidden rounded-xl border bg-white shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Customer
                  </th>

                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Contact
                  </th>

                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    GST Number
                  </th>

                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Credit Limit
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
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className='hover:bg-gray-50'>

                    {/* Customer */}
                    <td className='px-6 py-4'>
                      <div className='font-semibold text-gray-900'>
                        {customer.customer_name}
                      </div>

                      <div className='text-sm text-gray-500'>
                        Code: {customer.customer_code}
                      </div>

                      <div className='text-sm text-gray-500'>
                        {customer.city || '—'}
                        {customer.state ? `, ${customer.state}` : ''}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className='px-6 py-4'>
                      <div className='font-medium text-gray-900'>
                        {customer.contact_person || '—'}
                      </div>

                      <div className='text-sm text-gray-500'>
                        {customer.phone || 'No phone'}
                      </div>

                      <div className='text-sm text-gray-500'>
                        {customer.email || 'No email'}
                      </div>
                    </td>

                    {/* GST */}
                    <td className='px-6 py-4 font-mono text-sm text-gray-900'>
                      {customer.gst_number || '—'}
                    </td>

                    {/* Credit */}
                    <td className='px-6 py-4 font-semibold text-gray-900'>
                      ₹{Number(customer.credit_limit || 0).toLocaleString('en-IN')}
                    </td>

                    {/* Status */}
                    <td className='px-6 py-4'>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          customer.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {customer.status}
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
                          onClick={() => handleDelete(customer.id)}
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