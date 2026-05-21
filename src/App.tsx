import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthenticatedLayout from './components/global/AuthenticatedLayout';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import MonitoringPage from './pages/MonitoringPage';
import PetsPage from './pages/PetsPage';
import ClientViewPage from './pages/ClientViewPage';

export default function App() {
  return (
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
  );
}
