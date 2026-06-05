import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

// Guards the dashboard + devotee portal. While the session is being
// restored from a stored token we show a lightweight loader; once
// settled we either render the app or bounce to the login screen.
export default function ProtectedRoute() {
  const { isAuthenticated, booting } = useAuth();
  const location = useLocation();

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-jain-black-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-jain-red-600 border-t-transparent animate-spin" />
          <p className="text-sm text-neutral-500">Loading your session…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Remember where the user was headed so login can return them there.
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
