import { LayoutDashboard, Video, Heart, ClipboardCheck } from 'lucide-react';
import { NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'nav.overview', icon: LayoutDashboard },
  { id: 'monitoring', label: 'nav.monitoring', icon: Video, badge: 'pulse' },
  { id: 'pets', label: 'nav.pets', icon: Heart },
  { id: 'client-view', label: 'nav.clientLog', icon: ClipboardCheck, badge: 'dot' },
];
