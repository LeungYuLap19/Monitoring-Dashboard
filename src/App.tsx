import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './lib/i18n';
import AuthenticatedLayout from './components/global/AuthenticatedLayout';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import MonitoringPage from './pages/MonitoringPage';
import PetsPage from './pages/PetsPage';
import ClientViewPage from './pages/ClientViewPage';

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AuthenticatedLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="overview" element={<Navigate to="/" replace />} />
            <Route path="monitoring" element={<MonitoringPage />} />
            <Route path="pets" element={<PetsPage />} />
            <Route path="client-view" element={<ClientViewPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
}
