import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold'>Dashboard</h1>

      <p className='mt-2 text-gray-600'>
        Current user: {user?.email ?? 'Not logged in'}
      </p>
    </div>
  );
}