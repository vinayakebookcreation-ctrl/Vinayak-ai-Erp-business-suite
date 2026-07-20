import Image from 'next/image';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { LoginForm } from '@/components/auth/login-form';

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4'>
      <div className='w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl backdrop-blur'>
        
        {/* Logo */} 
        <div className='mb-8 flex flex-col items-center text-center'>
          <Image
            src='/my new logo.png'
            alt='Vinayak ERP'
            width={100}
            height={100}
            className='mb-4 h-auto w-auto'
            priority
          />

          <h1 className='text-2xl font-bold text-white'>
            Welcome Back
          </h1>

          <p className='mt-2 text-sm text-slate-400'>
            Sign in to continue to your ERP dashboard
          </p>
        </div>

        {/* Login Form */} 
        <LoginForm />

        {/* Footer */} 
        <div className='mt-8 border-t border-slate-700 pt-4 text-center'>
          <p className='text-xs text-slate-500'>
            Smart Solutions • Stronger Business
          </p>
        </div>
      </div>
    </div>
  );
}