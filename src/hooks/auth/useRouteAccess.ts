import { useEffect, useState } from 'react';
import { ensureAuthenticatedSession } from '../../lib/services/authService';

type GuardStatus = 'checking' | 'authed' | 'unauth';
type GuardMode = 'auth-only' | 'guest-only';

export function useRouteAccess(mode: GuardMode) {
  const [status, setStatus] = useState<GuardStatus>('checking');

  useEffect(() => {
    let mounted = true;

    (async () => {
      const user = await ensureAuthenticatedSession();
      if (!mounted) return;
      setStatus(user ? 'authed' : 'unauth');
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (mode === 'auth-only') {
    return {
      status,
      isChecking: status === 'checking',
      allow: status === 'authed',
      deny: status === 'unauth',
    };
  }

  return {
    status,
    isChecking: status === 'checking',
    allow: status === 'unauth',
    deny: status === 'authed',
  };
}
