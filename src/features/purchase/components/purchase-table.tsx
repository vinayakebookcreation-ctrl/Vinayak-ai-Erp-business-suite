'use client';

import { useEffect, useState } from 'react';
import { Trash2, ShoppingCart } from 'lucide-react';

import { PurchaseService } from '../services/purchase.service';
import type { PurchaseOrder } from '../types';

export function PurchaseTable() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      const data = await PurchaseService.getPurchaseOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load purchase orders');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = confirm(
      'Delete this purchase order?'
    );

    if (!confirmed) return;

    try {
      await PurchaseService.deletePurchaseOrder(id);

      setOrders((prev) =>
        prev.filter((order) => order.id !== id)
      );

      alert('Purchase order deleted');
    } catch (error: any) {
      alert(error.message);
    }
  }

  if (loading) {
    return (
      <div className='rounded-xl border bg-white p-8 text-center'>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />

        <p className='mt-3 text-sm text-gray-500'>
          Loading purchase orders...
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className='rounded-xl border bg-white p-10 text-center'>
        <ShoppingCart className='mx-auto h-12 w-12 text-gray-400' />

        <h3 className='mt-4 text-lg font-semibold text-gray-900'>
          No purchase orders
        </h3>

        <p className='mt-1 text-sm text-gray-500'>
          Create your first purchase order.
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
                PO Number
              </th>

              <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                Supplier
              </th>

              <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                Date
              </th>

              <th className='px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600'>
                Grand Total
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

            {orders.map((order) => (
              <tr key={order.id} className='hover:bg-gray-50'>

                <td className='px-6 py-4 font-semibold text-gray-900'>
                  {order.po_number}
                </td>

                <td className='px-6 py-4 text-sm text-gray-900'>
                  {order.supplier?.supplier_name || '—'}
                </td>

                <td className='px-6 py-4 text-sm text-gray-600'>
                  {new Date(order.purchase_date).toLocaleDateString('en-IN')}
                </td>

                <td className='px-6 py-4 text-right font-semibold text-gray-900'>
                  ₹{Number(order.grand_total).toLocaleString('en-IN')}
                </td>

                <td className='px-6 py-4 text-center'>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      order.status === 'Received'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'Ordered'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'Draft'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className='px-6 py-4 text-right'>
                  <button
                    onClick={() => handleDelete(order.id)}
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