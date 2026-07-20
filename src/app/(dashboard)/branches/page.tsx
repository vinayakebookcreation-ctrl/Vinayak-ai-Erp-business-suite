'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Company = {
  id: string;
  company_name: string;
  status: string;
};

export default function BranchesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompanies() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('companies')
        .select('*');

      console.log('Companies:', data);
      console.log('Error:', error);

      if (!error) {
        setCompanies(data || []);
      }

      setLoading(false);
    }

    loadCompanies();
  }, []);

  return (
    <div className='space-y-6 p-6'>
      <div>
        <h1 className='text-3xl font-bold text-green-600'>
          Branches Working ✅
        </h1>
        <p className='text-gray-600'>
          Supabase connection test page
        </p>
      </div>

      <div className='rounded-xl border bg-white p-6 shadow-sm'>
        <h2 className='mb-4 text-xl font-semibold'>
          Companies from Supabase
        </h2>

        {loading ? (
          <p>Loading companies...</p>
        ) : companies.length === 0 ? (
          <p className='text-red-600'>No companies found</p>
        ) : (
          <div className='space-y-3'>
            {companies.map((company) => (
              <div
                key={company.id}
                className='rounded-lg border p-4'
              >
                <p className='font-semibold'>
                  {company.company_name}
                </p>
                <p className='text-sm text-gray-500'>
                  Status: {company.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}