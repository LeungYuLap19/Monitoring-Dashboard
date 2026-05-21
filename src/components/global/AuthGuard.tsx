import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

function getAuthUser() {
  const saved = localStorage.getItem('hkbr_current_user');
  if (saved) {
    try { return JSON.parse(saved); } catch { return null; }
  }
  return null;
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const user = getAuthUser();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function GuestGuard({ children }: { children: ReactNode }) {
  const user = getAuthUser();
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}
