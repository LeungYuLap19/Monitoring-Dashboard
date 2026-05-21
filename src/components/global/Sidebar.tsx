import { LayoutDashboard, Video, Heart, ClipboardCheck, LogOut, LucideIcon } from 'lucide-react';
import { TabId } from '../../types';
import HKBRIcon from './HKBRIcon';
import PHealthIcon from './PHealthIcon';

interface NavItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
  badge?: 'pulse' | 'dot';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: '數據看板 Overview', icon: LayoutDashboard },
  { id: 'monitoring', label: '快速監控 Monitoring', icon: Video, badge: 'pulse' },
  { id: 'pets', label: '寵物數據 Pets', icon: Heart },
  { id: 'client-view', label: '活動日誌 Client Log', icon: ClipboardCheck, badge: 'dot' },
];

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  onLogout?: () => void;
  hasUnsentLogs: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout, hasUnsentLogs, isOpen, onClose }: SidebarProps) {
  const handleTabClick = (tab: TabId) => {
    setActiveTab(tab);
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          id="sidebar-overlay"
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-45 lg:hidden transition-all duration-300"
        />
      )}

      <aside
        id="sidebar-container"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col justify-between h-screen transition-transform duration-300 select-none lg:sticky lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div id="sidebar-upper" className="flex flex-col p-6 space-y-8">
          <div><HKBRIcon /></div>
          <span id="menu-section-label" className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4 px-2">功能欄 MENU</span>

          <nav id="sidebar-nav" className="flex flex-col gap-1.5">
            {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => {
              const isActive = activeTab === id;
              const showBadge = badge === 'dot' && hasUnsentLogs;
              const showPulse = badge === 'pulse';

              return (
                <button
                  key={id}
                  id={`nav-${id}-btn`}
                  onClick={() => handleTabClick(id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#0d9488] text-white shadow-md shadow-teal-900/10'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    <span>{label}</span>
                  </div>
                  {showPulse && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                  {showBadge && (
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" title="今日日誌已生成" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div id="sidebar-footer" className="p-6 flex flex-col items-center justify-center w-full">
          <PHealthIcon size={'small'} />
          <button
            id="logout-btn"
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors w-full text-left"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            <span>登出 Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
