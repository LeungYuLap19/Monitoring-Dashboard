import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ClipSelectorModal from '../pages/monitoring/ClipSelectorModal';
import ActivityLogPreviewModal from '../pages/monitoring/ActivityLogPreviewModal';
import { TabId, AuthUser } from '../../types';
import { BUNNY_GUESTS } from '../../constants';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

export default function AuthenticatedLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('hkbr_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  const [petsList, setPetsList] = useState(BUNNY_GUESTS);
  const [selectedBunnyId, setSelectedBunnyId] = useState<string>('momo');
  const [isClipsOpen, setIsClipsOpen] = useState(false);
  const [isLogPreviewOpen, setIsLogPreviewOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasUnsentLogs, setHasUnsentLogs] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const activeBunnyObj = petsList.find(b => b.id === selectedBunnyId) || petsList[0];

  const getActiveTab = (): TabId => {
    const path = location.pathname;
    if (path.startsWith('/monitoring')) return 'monitoring';
    if (path.startsWith('/pets')) return 'pets';
    if (path.startsWith('/client-view')) return 'client-view';
    return 'overview';
  };

  const handleNavigateTab = (tab: TabId) => {
    navigate(`/${tab === 'overview' ? '' : tab}`);
  };

  const handleSelectCameraFromOverview = (camId: string) => {
    if (camId === 'cam-1' || camId === 'cam-4') {
      setSelectedBunnyId('momo');
    } else if (camId === 'cam-2') {
      setSelectedBunnyId('koko');
    } else if (camId === 'cam-3') {
      setSelectedBunnyId('pipi');
    }
    navigate('/monitoring');
    showToast(t('monitoring.toasts.cameraSwitch'));
  };

  const handleSelectBunnyFromOverview = (bunnyId: string) => {
    setSelectedBunnyId(bunnyId);
    navigate('/monitoring');
  };

  const handleLogSendSuccess = (_id: string) => {
    setIsLogPreviewOpen(false);
    setHasUnsentLogs(false);
    showToast(t('monitoring.logPreview.sendSuccess', { name: activeBunnyObj.name }));
    setTimeout(() => navigate('/client-view'), 400);
  };

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div id="hotel-app-root" className="flex bg-[#f8fafc] w-full h-screen text-slate-800 font-sans leading-relaxed text-sm antialiased overflow-x-hidden">
      <Sidebar
        activeTab={getActiveTab()}
        setActiveTab={handleNavigateTab}
        hasUnsentLogs={hasUnsentLogs}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem('hkbr_current_user');
          showToast(t('auth.toasts.loggedOut'));
          setIsSidebarOpen(false);
          navigate('/login');
        }}
      />

      <div id="main-scroller" className="flex-1 flex flex-col min-h-screen min-w-0 relative">
        <Header
          adminName={`${currentUser.lastName}${currentUser.firstName} (${currentUser.role})`}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main id="app-main-viewport" className="flex-1 overflow-y-auto pb-16">
          <Outlet context={{
            selectedBunnyId,
            setSelectedBunnyId,
            petsList,
            setPetsList,
            onSelectCamera: handleSelectCameraFromOverview,
            onSelectBunny: handleSelectBunnyFromOverview,
            onOpenClipsModal: () => setIsClipsOpen(true),
            onGenerateLog: () => setIsLogPreviewOpen(true),
            showToast,
            navigate,
          }} />
        </main>

        {toastMessage && (
          <div
            id="global-alert-toast"
            className="fixed bottom-6 right-6 max-w-md bg-[#0f172a] text-white p-4 rounded-2xl shadow-2xl border border-slate-850 z-50 flex items-start gap-3 animate-bounce"
          >
            <div className="w-5 h-5 bg-teal-500 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="block text-xs font-black text-teal-400">系統通知 System Toast</span>
              <p className="text-xs text-slate-200 mt-0.5 leading-normal font-semibold">{toastMessage}</p>
            </div>
          </div>
        )}
      </div>

      {isClipsOpen && (
        <ClipSelectorModal
          bunnyName={activeBunnyObj.name}
          onClose={() => setIsClipsOpen(false)}
        />
      )}

      {isLogPreviewOpen && (
        <ActivityLogPreviewModal
          bunnyId={selectedBunnyId}
          onClose={() => setIsLogPreviewOpen(false)}
          onSendSuccess={handleLogSendSuccess}
        />
      )}
    </div>
  );
}
