'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { RolesService } from '@/features/auth/services/roles.service';

type RouteGuardProps = {
  module: string;
  children: React.ReactNode;
};

export function RouteGuard({
  module,
  children,
}: RouteGuardProps) {

  const router = useRouter();

  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAccess() {
      const canAccess = await RolesService.canAccess(module);

      if (!canAccess) {
        router.replace('/dashboard');
        return;
      }

      setAllowed(true);
    }

    checkAccess();
  }, [module, router]);

  if (allowed === null) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent' />
      </div>
    );
  }

  return <>{children}</>;
}