import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './lib/i18n';
import { AuthGuard, GuestGuard } from './components/global/AuthGuard';
import AuthenticatedLayout from './components/global/AuthenticatedLayout';
import RouteScrollReset from './components/global/RouteScrollReset';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import MonitoringPage from './pages/MonitoringPage';
import PetsPage from './pages/PetsPage';
import ClientViewPage from './pages/ClientViewPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <RouteScrollReset />
        <Routes>
          <Route path="/login" element={<GuestGuard><LoginPage /></GuestGuard>} />
          <Route element={<AuthGuard><AuthenticatedLayout /></AuthGuard>}>
            <Route index element={<OverviewPage />} />
            <Route path="overview" element={<Navigate to="/" replace />} />
            <Route path="monitoring" element={<MonitoringPage />} />
            <Route path="pets" element={<PetsPage />} />
            <Route path="client-view" element={<ClientViewPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </I18nProvider>
  );
}
