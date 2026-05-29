import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './lib/i18n';
import { AuthGuard, GuestGuard } from './components/global/AuthGuard';
import AuthenticatedLayout from './components/global/AuthenticatedLayout';
import RoleGuard from './components/global/RoleGuard';
import RouteScrollReset from './components/global/RouteScrollReset';
import { Toaster } from './components/ui/sonner';
import { setStoredAccessToken, setStoredAuthUser, getStoredAccessToken, getStoredAuthUser } from './lib/utils/auth';
import { LOCAL_FRONTEND_BASE } from './constants/navigation';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const PetsPage = lazy(() => import('./pages/PetsPage'));
const ClientViewPage = lazy(() => import('./pages/ClientViewPage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));

function useHashToken() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const params = new URLSearchParams(hash.slice(1));
    const token = params.get('access_token');
    const userJson = params.get('user');
    if (token) {
      setStoredAccessToken(token);
      if (userJson) {
        try {
          setStoredAuthUser(JSON.parse(userJson));
        } catch { /* ignore */ }
      }
    }
    history.replaceState(null, '', window.location.pathname);
  }, []);
}

function RedirectToLocal({ path }: { path: string }) {
  useEffect(() => {
    const token = getStoredAccessToken();
    const user = getStoredAuthUser();
    let url = `${LOCAL_FRONTEND_BASE}${path}`;
    if (token) {
      const hash = new URLSearchParams();
      hash.set('access_token', token);
      if (user) hash.set('user', JSON.stringify(user));
      if (sessionStorage.getItem('_fresh_login')) {
        hash.set('fresh_login', '1');
        sessionStorage.removeItem('_fresh_login');
      }
      url += `#${hash.toString()}`;
    }
    window.location.href = url;
  }, [path]);
  return null;
}

export default function App() {
  useHashToken();
  return (
    <I18nProvider>
      <BrowserRouter>
        <RouteScrollReset />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/login" element={<GuestGuard><LoginPage /></GuestGuard>} />
            <Route element={<AuthGuard><AuthenticatedLayout /></AuthGuard>}>
              <Route index element={<RedirectToLocal path="/" />} />
              <Route path="overview" element={<RedirectToLocal path="/" />} />
              <Route path="monitoring" element={<RedirectToLocal path="/monitoring" />} />
              <Route path="pets" element={<PetsPage />} />
              <Route path="subscription" element={<RoleGuard allow={['user']}><SubscriptionPage /></RoleGuard>} />
              <Route path="client-view" element={<RoleGuard allow={['ngo']}><ClientViewPage /></RoleGuard>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster />
    </I18nProvider>
  );
}