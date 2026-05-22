import { Navigate } from 'react-router-dom';
import type { AppRole } from '../../types/lib/auth';
import { getCurrentSessionUser } from '../../lib/services/authService';

interface RoleGuardProps {
  allow: AppRole[];
  children: React.ReactNode;
}

export default function RoleGuard({ allow, children }: RoleGuardProps) {
  const user = getCurrentSessionUser();
  if (!user || !allow.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
