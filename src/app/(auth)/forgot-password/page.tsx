'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setServerError('');
    setSuccess('');

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setServerError(error.message);
      return;
    }

    setSuccess('Password reset link has been sent to your email.');
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4'>
      <div className='w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl backdrop-blur'>
        
        {/* Logo */} 
        <div className='mb-8 flex flex-col items-center text-center'>
          <Image
            src='/logo.png'
            alt='Vinayak ERP'
            width={140}
            height={140}
            className='mb-4 h-auto w-auto'
            priority
          />

          <h1 className='text-2xl font-bold text-white'>
            Forgot Password
          </h1>

          <p className='mt-2 text-sm text-slate-400'>
            Enter your email address and we’ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-200'>
              Email address
            </label>

            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />

              <input
                type='email'
                placeholder='you@company.com'
                {...register('email')}
                className='w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
              />
            </div>

            {errors.email && (
              <p className='mt-2 text-sm text-red-400'>
                {errors.email.message}
              </p>
            )}
          </div>

          {serverError && (
            <div className='rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300'>
              {serverError}
            </div>
          )}

          {success && (
            <div className='flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300'>
              <CheckCircle className='h-5 w-5' />
              {success}
            </div>
          )}

          <button
            type='submit'
            disabled={loading}
            className='flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {loading ? (
              <>
                <Loader2 className='h-5 w-5 animate-spin' />
                Sending reset link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <Link
            href='/login'
            className='inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}