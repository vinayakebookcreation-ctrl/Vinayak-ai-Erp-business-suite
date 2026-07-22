'use client';

import { useEffect, useState } from 'react';
import { Trash2, Receipt } from 'lucide-react';

import { SalesService } from '../services/sales.service';
import type { SalesInvoice } from '../types';

export function SalesTable() {
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadInvoices() {
    try {
      const data = await SalesService.getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = confirm('Delete this invoice?');

    if (!confirmed) return;

    try {
      await SalesService.deleteInvoice(id);

      setInvoices((prev) =>
        prev.filter((invoice) => invoice.id !== id)
      );

      alert('Invoice deleted');
    } catch (error: any) {
      alert(error.message);
    }
  }

  if (loading) {
    return (
      <div className='rounded-xl border bg-white p-8 text-center'>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent' />

        <p className='mt-3 text-sm text-gray-500'>
          Loading invoices...
        </p>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className='rounded-xl border bg-white p-10 text-center'>
        <Receipt className='mx-auto h-12 w-12 text-gray-400' />

        <h3 className='mt-4 text-lg font-semibold text-gray-900'>
          No invoices
        </h3>

        <p className='mt-1 text-sm text-gray-500'>
          Create your first sales invoice.
        </p>
      </div>
    );
  }

  return (
    <div className='overflow-hidden rounded-xl border bg-white shadow-sm'>

      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>

          <thead className='bg-gray-50'>
            <tr>

              <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                Invoice
              </th>

              <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                Customer
              </th>

              <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                Date
              </th>

              <th className='px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600'>
                Grand Total
              </th>

              <th className='px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600'>
                Payment
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

            {invoices.map((invoice) => (
              <tr key={invoice.id} className='hover:bg-gray-50'>

                <td className='px-6 py-4 font-semibold text-gray-900'>
                  {invoice.invoice_number}
                </td>

                <td className='px-6 py-4 text-sm text-gray-900'>
                  <div>{invoice.customer?.customer_name || '—'}</div>

                  <div className='text-xs text-gray-500'>
                    {invoice.customer?.phone || ''}
                  </div>
                </td>

                <td className='px-6 py-4 text-sm text-gray-600'>
                  {new Date(invoice.invoice_date).toLocaleDateString('en-IN')}
                </td>

                <td className='px-6 py-4 text-right font-semibold text-gray-900'>
                  ₹{Number(invoice.grand_total).toLocaleString('en-IN')}
                </td>

                {/* Payment */}
                <td className='px-6 py-4 text-center'>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      invoice.payment_status === 'Paid'
                        ? 'bg-green-100 text-green-700'
                        : invoice.payment_status === 'Partial'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {invoice.payment_status}
                  </span>
                </td>

                {/* Invoice Status */}
                <td className='px-6 py-4 text-center'>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      invoice.status === 'Confirmed'
                        ? 'bg-green-100 text-green-700'
                        : invoice.status === 'Draft'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>

                {/* Actions */}
                <td className='px-6 py-4 text-right'>
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className='rounded-lg border border-red-300 p-2 text-red-600 hover:bg-red-50'
                    title='Delete'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}