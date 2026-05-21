/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import MonitoringDetailTab from './components/MonitoringDetailTab';
import ClientActivityLogView from './components/ClientActivityLogView';
import ActivityLogPreviewModal from './components/ActivityLogPreviewModal';
import ClipSelectorModal from './components/ClipSelectorModal';
import PetsTab from './components/PetsTab';
import LoginView from './components/LoginView';
import { TabId } from './types';
import { BUNNY_GUESTS } from './data';
import { Bell, Heart, Sparkles, CheckCircle, Smartphone } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [petsList, setPetsList] = useState(BUNNY_GUESTS);
  const [selectedBunnyId, setSelectedBunnyId] = useState<string>('momo');
  
  // Authentication State
  const [currentUser, setCurrentUser] = useState<{ emailOrPhone: string; firstName: string; lastName: string; role: string } | null>(() => {
    const saved = localStorage.getItem('hkbr_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });
  
  // Modals management
  const [isClipsOpen, setIsClipsOpen] = useState(false);
  const [isLogPreviewOpen, setIsLogPreviewOpen] = useState(false);

  // Mobile sidebar open state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Unsent/Pending logs indicators
  const [hasUnsentLogs, setHasUnsentLogs] = useState(true);

  // Notifications systems
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const activeBunnyObj = petsList.find(b => b.id === selectedBunnyId) || petsList[0];

  const handleSelectCameraFromOverview = (camId: string) => {
    // cam-1/cam-2/cam-4 represents momo/koko/pipi
    if (camId === 'cam-1' || camId === 'cam-4') {
      setSelectedBunnyId('momo');
    } else if (camId === 'cam-2') {
      setSelectedBunnyId('koko');
    } else if (camId === 'cam-3') {
      setSelectedBunnyId('pipi');
    }
    setActiveTab('monitoring');
    showToast(`已自動打開監測鏡頭並載入對應兔兔住客數據`);
  };

  const handleSelectBunnyFromOverview = (bunnyId: string) => {
    setSelectedBunnyId(bunnyId);
    setActiveTab('monitoring');
  };

  const handleLogSendSuccess = (id: string) => {
    setIsLogPreviewOpen(false);
    setHasUnsentLogs(false);
    showToast(`✨ 發送成功！已將對 ${activeBunnyObj.name} 的今日智慧活動日誌成功推播予家長。`);
    // Automatically navigate to the customer preview screen to view details!
    setTimeout(() => {
      setActiveTab('client-view');
    }, 400);
  };

  if (!currentUser) {
    return (
      <div id="hotel-app-login-wrapper" className="w-full h-screen">
        <LoginView
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            localStorage.setItem('hkbr_current_user', JSON.stringify(user));
          }}
          onToast={showToast}
        />
        {/* Toast success indicator bubble on bottom-right */}
        {toastMessage && (
          <div
            id="global-alert-toast"
            className="fixed bottom-6 right-6 max-w-md bg-[#0f172a] text-white p-4 rounded-2xl shadow-2xl border border-slate-850 z-50 flex items-start gap-3"
          >
            <div className="w-5 h-5 bg-[#0d9488] rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="block text-xs font-black text-teal-400">系統通知 System Toast</span>
              <p className="text-xs text-slate-200 mt-0.5 leading-normal font-semibold">{toastMessage}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="hotel-app-root" className="flex bg-[#f8fafc] w-full h-screen text-slate-800 font-sans leading-relaxed text-sm antialiased overflow-x-hidden">
      
      {/* 1. Sidebar Left */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasUnsentLogs={hasUnsentLogs}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem('hkbr_current_user');
          showToast('已成功登出 HKBR 觀察管理系統');
          setIsSidebarOpen(false);
        }}
      />

      {/* 2. Main content container */}
      <div id="main-scroller" className="flex-1 flex flex-col min-h-screen min-w-0 relative">
        
        {/* Top Header navbar */}
        <Header 
          adminName={currentUser ? `${currentUser.lastName}${currentUser.firstName} (${currentUser.role})` : '護理師 Admin User'} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />

        {/* Scrollable Main body content layout */}
        <main id="app-main-viewport" className="flex-1 overflow-y-auto pb-16">
          {activeTab === 'overview' && (
            <OverviewTab
              onSelectBunny={handleSelectBunnyFromOverview}
              onSelectCamera={handleSelectCameraFromOverview}
            />
          )}

          {activeTab === 'monitoring' && (
            <MonitoringDetailTab
              selectedBunnyId={selectedBunnyId}
              setSelectedBunnyId={setSelectedBunnyId}
              onOpenClipsModal={() => setIsClipsOpen(true)}
              onGenerateLog={() => setIsLogPreviewOpen(true)}
            />
          )}

          {activeTab === 'pets' && (
            <PetsTab
              pets={petsList}
              onAddPet={(newPet) => {
                BUNNY_GUESTS.push(newPet);
                setPetsList([...BUNNY_GUESTS]);
              }}
              onEditPet={(updatedPet) => {
                const idx = BUNNY_GUESTS.findIndex(b => b.id === updatedPet.id);
                if (idx !== -1) {
                  BUNNY_GUESTS[idx] = updatedPet;
                }
                setPetsList([...BUNNY_GUESTS]);
              }}
              onDeletePet={(id) => {
                const idx = BUNNY_GUESTS.findIndex(b => b.id === id);
                if (idx !== -1) {
                  BUNNY_GUESTS.splice(idx, 1);
                }
                setPetsList([...BUNNY_GUESTS]);
                if (selectedBunnyId === id) {
                  const fallback = BUNNY_GUESTS[0]?.id || '';
                  setSelectedBunnyId(fallback);
                }
              }}
              onRedirectToMonitoring={(id) => {
                setSelectedBunnyId(id);
                setActiveTab('monitoring');
                showToast(`已成功切換！正在加載 ${BUNNY_GUESTS.find(b => b.id === id)?.name || '兔兔'} 籠位之智慧觀測影像相機。`);
              }}
              onToast={showToast}
            />
          )}

          {activeTab === 'client-view' && (
            <ClientActivityLogView selectedBunnyId={selectedBunnyId} />
          )}
        </main>

        {/* Toast success indicator bubble on bottom-right */}
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

      {/* 3. Modal Layer: Interactive AI playback clips selector */}
      {isClipsOpen && (
        <ClipSelectorModal
          bunnyName={activeBunnyObj.name}
          onClose={() => setIsClipsOpen(false)}
        />
      )}

      {/* 4. Modal Layer: Daily Activity log invoice generator preview */}
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
