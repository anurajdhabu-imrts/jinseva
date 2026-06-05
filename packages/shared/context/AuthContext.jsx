import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { authApi, getToken, setToken, apiError } from '../services/rbacService';
import { SYSTEM_ROLE_DEVOTEE } from '../data/permissions';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // `loading` covers in-flight auth actions (login/register).
  const [loading, setLoading] = useState(false);
  // `booting` is the one-time session restore on first mount.
  const [booting, setBooting] = useState(true);

  // On first load, restore the session from a stored token (if any).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!getToken()) {
        setBooting(false);
        return;
      }
      try {
        const me = await authApi.me();
        if (!cancelled) setUser(me);
      } catch {
        setToken(null); // token invalid/expired — drop it
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const me = await authApi.login(email, password);
      setUser(me);
      return me;
    } catch (err) {
      // Surface the backend message to the caller; return null = failure.
      throw new Error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      // Returns { success, pending, message } — the account awaits admin
      // approval, so we intentionally do NOT set the user / log them in.
      return await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      throw new Error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  // Let pages refresh the principal after a self-profile change.
  const refresh = useCallback(async () => {
    try {
      const me = await authApi.me();
      setUser(me);
      return me;
    } catch {
      return null;
    }
  }, []);

  const hasPermission = useCallback(
    (code) => !!user && (user.permissions || []).includes(code),
    [user],
  );

  const hasAnyPermission = useCallback(
    (codes = []) =>
      !!user && codes.some((c) => (user.permissions || []).includes(c)),
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      booting,
      login,
      logout,
      register,
      refresh,
      isAuthenticated: !!user,
      isDevotee: user?.roleId === SYSTEM_ROLE_DEVOTEE,
      permissions: user?.permissions ?? [],
      hasPermission,
      hasAnyPermission,
    }),
    [user, loading, booting, login, logout, register, refresh, hasPermission, hasAnyPermission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
