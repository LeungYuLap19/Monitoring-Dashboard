import { useEffect, useState } from 'react';
import { ensureAuthenticatedSession, logoutAuthSession } from '../../lib/services/authService';
import type { RouteGuardMode, RouteGuardStatus } from '../../types';

export function useRouteAccess(mode: RouteGuardMode) {
  const [status, setStatus] = useState<RouteGuardStatus>('checking');

  useEffect(() => {
    let mounted = true;

    // Handle ?logout=true from local frontend
    const params = new URLSearchParams(window.location.search);
    if (params.get('logout') === 'true') {
      logoutAuthSession();
      window.history.replaceState(null, '', window.location.pathname);
      if (mounted) setStatus('unauth');
      return;
    }

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
