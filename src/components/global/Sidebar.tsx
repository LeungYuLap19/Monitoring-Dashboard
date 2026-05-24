import { TabId, SidebarProps } from '../../types';
import { NAV_ITEMS } from '../../constants';
import { useTranslation } from '../../lib/i18n';
import HKBRIcon from './HKBRIcon';
import PHealthIcon from './PHealthIcon';
import { Button } from '../ui/button';
import { Sheet, SheetContent } from '../ui/sheet';

export default function Sidebar({ activeTab, setActiveTab, hasUnsentLogs, role = 'user', isOpen, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const handleTabClick = (tab: TabId) => {
    setActiveTab(tab);
    if (onClose) onClose();
  };

  const visibleNavItems = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role));

  const sidebarContent = (
    <>
      <div id="sidebar-upper" className="flex flex-col p-6 space-y-8">
        <div>{role === 'user' ? <PHealthIcon size="small" /> : <HKBRIcon />}</div>
        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4 px-2">{t('nav.menu')}</span>

        <nav id="sidebar-nav" className="flex flex-col gap-1.5">
          {visibleNavItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;

            return (
              <Button
                key={id}
                variant="ghost"
                onClick={() => handleTabClick(id)}
                className={`flex items-center justify-between px-4 py-3 h-auto rounded-xl text-sm font-semibold transition-all w-full ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-900/10 hover:bg-[#0c857a] hover:text-white'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="size-4.5 shrink-0" />
                  <span>{t(label)}</span>
                </div>
              </Button>
            );
          })}
        </nav>
      </div>

      <div id="sidebar-footer" className="p-6 flex flex-col items-center justify-center w-full">
        {role === 'ngo' ? <PHealthIcon size={'small'} /> : null}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex-col justify-between h-screen select-none lg:sticky">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar using Sheet */}
      <Sheet open={isOpen} onOpenChange={(open) => { if (!open && onClose) onClose(); }}>
        <SheetContent side="left" className="w-64 p-0 flex flex-col justify-between">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
}
