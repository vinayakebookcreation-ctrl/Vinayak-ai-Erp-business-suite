'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';

import { createClient } from '@/lib/supabase/client';

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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

    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    setLoading(false);

    if (error) {
      setServerError(error.message);
      return;
    }

    setSuccess('Password updated successfully! Redirecting...');

    setTimeout(() => {
      router.push('/login');
    }, 2000);
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
            Reset Password
          </h1>

          <p className='mt-2 text-sm text-slate-400'>
            Create a new secure password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          
          {/* New Password */} 
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-200'>
              New Password
            </label>

            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter new password'
                {...register('password')}
                className='w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-12 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
              />

              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white'
              >
                {showPassword ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            </div>

            {errors.password && (
              <p className='mt-2 text-sm text-red-400'>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */} 
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-200'>
              Confirm Password
            </label>

            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />

              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Confirm new password'
                {...register('confirmPassword')}
                className='w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-12 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
              />

              <button
                type='button'
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white'
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className='mt-2 text-sm text-red-400'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Error */} 
          {serverError && (
            <div className='rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300'>
              {serverError}
            </div>
          )}

          {/* Success */} 
          {success && (
            <div className='flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300'>
              <CheckCircle className='h-5 w-5' />
              {success}
            </div>
          )}

          {/* Submit */} 
          <button
            type='submit'
            disabled={loading}
            className='flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {loading ? (
              <>
                <Loader2 className='h-5 w-5 animate-spin' />
                Updating password...
              </>
            ) : (
              'Update Password'
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