import { LucideIcon } from 'lucide-react';
import { TabId, BunnyGuest } from '../constants/domain';

export interface NavItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
  badge?: 'pulse' | 'dot';
}

export interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  hasUnsentLogs: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export interface HeaderProps {
  userEmail?: string;
  adminName?: string;
  onNotificationClick?: () => void;
  onMenuClick?: () => void;
  onLogout?: () => void;
}
