import { LayoutDashboard, Video, Heart, ClipboardCheck } from 'lucide-react';
import { NavItem } from '../types';

export const LOCAL_TABS = new Set(['overview', 'monitoring']);

export const LOCAL_FRONTEND_BASE = 'http://127.0.0.1:9527';

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'nav.overview', icon: LayoutDashboard },
  { id: 'monitoring', label: 'nav.monitoring', icon: Video, badge: 'pulse' },
  { id: 'pets', label: 'nav.pets', icon: Heart },
  { id: 'client-view', label: 'nav.clientLog', icon: ClipboardCheck, badge: 'dot', roles: ['ngo'] },
];

export function getLocalRedirectUrl(tab: string): string {
  const path = tab === 'overview' ? '/' : `/${tab}`;
  return `${LOCAL_FRONTEND_BASE}${path}`;
}
