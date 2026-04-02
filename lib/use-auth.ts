'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

/**
 * Hook tiện ích để dùng trong Client Components
 */
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    token: (session as any)?.apiToken as string | undefined,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isAdmin: session?.user?.role === 'admin',
    signIn: () => signIn('google'),
    signOut: () => signOut({ callbackUrl: '/' }),
  };
}
