import { useEffect } from 'react';
import { useAuthStore } from '../lib/services/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { getSession } = useAuthStore();

  useEffect(() => {
    // Initial session check
    getSession();
    // Supabase auth change logic removed.
  }, [getSession]);

  return <>{children}</>;
} 