'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Building2 } from 'lucide-react';

import { BranchService } from '../services/branch.service';
import type { Branch } from '../types';

export function BranchTable() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function loadBranches() {
    try {
      const data = await BranchService.getBranches();
      setBranches(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load branches');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBranches();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = confirm(
      'Are you sure you want to delete this branch?'
    );

    if (!confirmed) return;

    try {
      await BranchService.deleteBranch(id);

      setBranches((prev) =>
        prev.filter((branch) => branch.id !== id)
      );

      alert('Branch deleted successfully');
    } catch (error: any) {
      alert(error.message);
    }
  }

  const filteredBranches = branches.filter((branch) =>
    `${branch.branch_name} ${branch.branch_code} ${
      branch.companies?.company_name || ''
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className='rounded-xl border bg-white p-8 text-center'>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />

        <p className='mt-3 text-sm text-gray-500'>
          Loading branches...
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
          placeholder='Search branches...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full max-w-sm rounded-lg border border-slate-300 px-4 py-2'
        />

        <div className='text-sm text-gray-500'>
          Total: {filteredBranches.length}
        </div>
      </div>

      {/* Empty State */} 
      {filteredBranches.length === 0 ? (
        <div className='rounded-xl border bg-white p-10 text-center'>
          <Building2 className='mx-auto h-12 w-12 text-gray-400' />

          <h3 className='mt-4 text-lg font-semibold text-gray-900'>
            No branches found
          </h3>

          <p className='mt-1 text-sm text-gray-500'>
            Create your first branch to get started.
          </p>
        </div>
      ) : (
        <div className='overflow-hidden rounded-xl border bg-white shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Branch
                  </th>

                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Company
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
                {filteredBranches.map((branch) => (
                  <tr key={branch.id} className='hover:bg-gray-50'>
                    
                    {/* Branch */} 
                    <td className='px-6 py-4'>
                      <div className='font-semibold text-gray-900'>
                        {branch.branch_name}
                      </div>

                      <div className='text-sm text-gray-500'>
                        Code: {branch.branch_code}
                      </div>

                      <div className='text-sm text-gray-500'>
                        {branch.city || '—'}
                        {branch.state ? `, ${branch.state}` : ''}
                      </div>
                    </td>

                    {/* Company */} 
                    <td className='px-6 py-4'>
                      <div className='font-medium text-gray-900'>
                        {branch.companies?.company_name || '—'}
                      </div>
                    </td>

                    {/* Contact */} 
                    <td className='px-6 py-4'>
                      <div className='text-sm text-gray-900'>
                        {branch.email || '—'}
                      </div>

                      <div className='text-sm text-gray-500'>
                        {branch.phone || '—'}
                      </div>
                    </td>

                    {/* Status */} 
                    <td className='px-6 py-4'>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          branch.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {branch.status}
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
                          onClick={() => handleDelete(branch.id)}
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