'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Building2 } from 'lucide-react';

import { CompanyService } from '../services/company.service';
import type { Company } from '../types';

export function CompanyTable() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function loadCompanies() {
    try {
      const data = await CompanyService.getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load companies');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = confirm(
      'Are you sure you want to delete this company?'
    );

    if (!confirmed) return;

    try {
      await CompanyService.deleteCompany(id);
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      alert('Company deleted successfully');
    } catch (error: any) {
      alert(error.message);
    }
  }

  const filteredCompanies = companies.filter((company) =>
    company.company_name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className='rounded-xl border bg-white p-8 text-center'>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />
        <p className='mt-3 text-sm text-gray-500'>
          Loading companies...
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
          placeholder='Search companies...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full max-w-sm rounded-lg border px-4 py-2'
        />

        <div className='text-sm text-gray-500'>
          Total: {filteredCompanies.length}
        </div>
      </div>

      {/* Empty State */} 
      {filteredCompanies.length === 0 ? (
        <div className='rounded-xl border bg-white p-10 text-center'>
          <Building2 className='mx-auto h-12 w-12 text-gray-400' />

          <h3 className='mt-4 text-lg font-semibold text-gray-900'>
            No companies found
          </h3>

          <p className='mt-1 text-sm text-gray-500'>
            Create your first company to get started.
          </p>
        </div>
      ) : (
        <div className='overflow-hidden rounded-xl border bg-white shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Company
                  </th>

                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    GST
                  </th>

                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Contact
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
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className='hover:bg-gray-50'>
                    
                    {/* Company */} 
                    <td className='px-6 py-4'>
                      <div className='font-semibold text-gray-900'>
                        {company.company_name}
                      </div>

                      <div className='text-sm text-gray-500'>
                        {company.city || '—'}
                        {company.state
                          ? `, ${company.state}`
                          : ''}
                      </div>
                    </td>

                    {/* GST */} 
                    <td className='px-6 py-4 text-sm text-gray-700'>
                      {company.gst_number || '—'}
                    </td>

                    {/* Contact */} 
                    <td className='px-6 py-4'>
                      <div className='text-sm text-gray-900'>
                        {company.email || '—'}
                      </div>

                      <div className='text-sm text-gray-500'>
                        {company.phone || '—'}
                      </div>
                    </td>

                    {/* Status */} 
                    <td className='px-6 py-4'>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          company.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {company.status}
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
                          onClick={() => handleDelete(company.id)}
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