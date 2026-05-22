import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ClipSelectorModal from '../pages/monitoring/ClipSelectorModal';
import ActivityLogPreviewModal from '../pages/monitoring/ActivityLogPreviewModal';
import { useAuthenticatedLayout } from '../../hooks/layout';

export default function AuthenticatedLayout() {
  const state = useAuthenticatedLayout();

  if (!state.currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div id="hotel-app-root" className="flex bg-slate-50 w-full h-screen text-slate-800 font-sans leading-relaxed text-sm antialiased overflow-x-hidden">
      <Sidebar
        activeTab={state.activeTab}
        setActiveTab={state.handleNavigateTab}
        hasUnsentLogs={state.hasUnsentLogs}
        role={state.currentUser.role}
        isOpen={state.isSidebarOpen}
        onClose={() => state.setIsSidebarOpen(false)}
      />

      <div id="main-scroller" className="flex-1 flex flex-col min-h-screen min-w-0 relative">
        <Header
          adminName={`${state.currentUser.lastName}${state.currentUser.firstName} (${state.currentUser.role})`}
          userEmail={state.currentUser.email ?? state.currentUser.phoneNumber ?? state.currentUser.emailOrPhone}
          role={state.currentUser.role}
          onMenuClick={() => state.setIsSidebarOpen(true)}
          onLogout={state.handleLogout}
        />

        <main id="app-main-viewport" className="flex-1 overflow-y-auto pb-16">
          <Outlet
            context={{
              selectedPetId: state.selectedPetId,
              setSelectedPetId: state.setSelectedPetId,
              petsList: state.petsList,
              setPetsList: state.setPetsList,
              onSelectCamera: state.handleSelectCameraFromOverview,
              onSelectPet: state.handleSelectPetFromOverview,
              onOpenClipsModal: () => state.setIsClipsOpen(true),
              onGenerateLog: () => state.setIsLogPreviewOpen(true),
              showToast: state.showToast,
              navigate: state.navigate,
            }}
          />
        </main>
      </div>

      {state.isClipsOpen && (
        <ClipSelectorModal
          petName={state.activePetObj.name}
          clips={state.monitorClips}
          getVideoUrl={(clip) => clip.videoUrl ? state.getMonitorClipVideoUrl(clip.videoUrl) : null}
          onClose={() => state.setIsClipsOpen(false)}
        />
      )}

      {state.isLogPreviewOpen && (
        <ActivityLogPreviewModal
          petId={state.selectedPetId}
          onClose={() => state.setIsLogPreviewOpen(false)}
          onSendSuccess={() => state.handleLogSendSuccess()}
        />
      )}
    </div>
  );
}
