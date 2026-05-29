import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './lib/i18n';
import { AuthGuard, GuestGuard } from './components/global/AuthGuard';
import AuthenticatedLayout from './components/global/AuthenticatedLayout';
import RoleGuard from './components/global/RoleGuard';
import RouteScrollReset from './components/global/RouteScrollReset';
import { Toaster } from './components/ui/sonner';
import { setStoredAccessToken, setStoredAuthUser } from './lib/utils/auth';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const OverviewPage = lazy(() => import('./pages/OverviewPage'));
const MonitoringPage = lazy(() => import('./pages/MonitoringPage'));
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
              <Route index element={<OverviewPage />} />
              <Route path="overview" element={<Navigate to="/" replace />} />
              <Route path="monitoring" element={<MonitoringPage />} />
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