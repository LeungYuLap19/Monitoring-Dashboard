import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useRouteAccess } from '../../hooks/auth';
import icon from '../../assets/icons/PHealth.png';

function FullPageChecking() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6">
      <div className="flex items-center gap-2 animate-pulse">
        <img src={icon} alt="PHealth" className="h-8" />
        <span className="text-2xl font-bold text-[#FF8D1A]">PHealth OS</span>
      </div>
      <div className="w-40 h-1 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full w-1/2 rounded-full bg-teal-500 animate-[shimmer_1.2s_ease-in-out_infinite]" />
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const access = useRouteAccess('auth-only');
  if (access.isChecking) return <FullPageChecking />;
  if (access.deny) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function GuestGuard({ children }: { children: ReactNode }) {
  const access = useRouteAccess('guest-only');
  if (access.isChecking) return <FullPageChecking />;
  if (access.deny) return <Navigate to="/" replace />;
  return <>{children}</>;
}
