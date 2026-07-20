'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
  });

  async function onSubmit(values: LoginSchema) {
    setServerError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    setLoading(false);

    if (error) {
      setServerError(error.message);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      {/* Email */} 
      <div>
        <label className='mb-2 block text-sm font-medium text-slate-200'>
          Email address
        </label>

        <input
          type='email'
          placeholder='you@company.com'
          autoComplete='email'
          {...register('email')}
          className='w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
        />

        {errors.email && (
          <p className='mt-2 text-sm text-red-400'>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */} 
      <div>
        <label className='mb-2 block text-sm font-medium text-slate-200'>
          Password
        </label>

        <div className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter your password'
            autoComplete='current-password'
            {...register('password')}
            className='w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
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

      {/* Remember + Forgot */} 
      <div className='flex items-center justify-between'>
        <label className='flex items-center gap-2 text-sm text-slate-300'>
          <input
            type='checkbox'
            {...register('remember')}
            className='h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500'
          />
          Remember me
        </label>

        <a
          href='/forgot-password'
          className='text-sm text-blue-400 hover:text-blue-300'
        >
          Forgot password?
        </a>
      </div>

      {/* Server Error */} 
      {serverError && (
        <div className='rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300'>
          {serverError}
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
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
}