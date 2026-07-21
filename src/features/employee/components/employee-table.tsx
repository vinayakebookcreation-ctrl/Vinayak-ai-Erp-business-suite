'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Users } from 'lucide-react';

import { EmployeeService } from '../services/employee.service';
import type { Employee } from '../types';

export function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function loadEmployees() {
    try {
      const data = await EmployeeService.getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = confirm(
      'Are you sure you want to delete this employee?'
    );

    if (!confirmed) return;

    try {
      await EmployeeService.deleteEmployee(id);

      setEmployees((prev) =>
        prev.filter((employee) => employee.id !== id)
      );

      alert('Employee deleted successfully');
    } catch (error: any) {
      alert(error.message);
    }
  }

  const filteredEmployees = employees.filter((employee) =>
    `${employee.first_name} ${employee.last_name || ''} ${
      employee.employee_code
    } ${employee.companies?.company_name || ''} ${
      employee.branches?.branch_name || ''
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className='rounded-xl border bg-white p-8 text-center'>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent' />

        <p className='mt-3 text-sm text-gray-500'>
          Loading employees...
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
          placeholder='Search employees...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full max-w-sm rounded-lg border border-slate-300 px-4 py-2'
        />

        <div className='text-sm text-gray-500'>
          Total: {filteredEmployees.length}
        </div>
      </div>

      {/* Empty State */} 
      {filteredEmployees.length === 0 ? (
        <div className='rounded-xl border bg-white p-10 text-center'>
          <Users className='mx-auto h-12 w-12 text-gray-400' />

          <h3 className='mt-4 text-lg font-semibold text-gray-900'>
            No employees found
          </h3>

          <p className='mt-1 text-sm text-gray-500'>
            Create your first employee to get started.
          </p>
        </div>
      ) : (
        <div className='overflow-hidden rounded-xl border bg-white shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Employee
                  </th>

                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Company
                  </th>

                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Branch
                  </th>

                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Department
                  </th>

                  <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600'>
                    Salary
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
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className='hover:bg-gray-50'>
                    
                    {/* Employee */} 
                    <td className='px-6 py-4'>
                      <div className='font-semibold text-gray-900'>
                        {employee.first_name} {employee.last_name}
                      </div>

                      <div className='text-sm text-gray-500'>
                        Code: {employee.employee_code}
                      </div>

                      <div className='text-sm text-gray-500'>
                        {employee.designation || '—'}
                      </div>
                    </td>

                    {/* Company */} 
                    <td className='px-6 py-4 font-medium text-gray-900'>
                      {employee.companies?.company_name || '—'}
                    </td>

                    {/* Branch */} 
                    <td className='px-6 py-4 font-medium text-gray-900'>
                      {employee.branches?.branch_name || '—'}
                    </td>

                    {/* Department */} 
                    <td className='px-6 py-4 text-gray-900'>
                      {employee.department || '—'}
                    </td>

                    {/* Salary */} 
                    <td className='px-6 py-4 font-medium text-gray-900'>
                      ₹
                      {employee.salary?.toLocaleString('en-IN') ||
                        '0'}
                    </td>

                    {/* Status */} 
                    <td className='px-6 py-4'>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          employee.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>

                    {/* Actions */} 
                    <td className='px-6 py-4 text-right'>
                      <div className='flex justify-end gap-2'>
                        <button
                          className='rounded-lg border p-2 text-violet-600 hover:bg-violet-50'
                          title='Edit'
                        >
                          <Pencil className='h-4 w-4' />
                        </button>

                        <button
                          onClick={() => handleDelete(employee.id)}
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