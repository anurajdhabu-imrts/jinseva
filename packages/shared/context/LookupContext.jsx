import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { lookupsApi } from '../services/rbacService';
import { useAuth } from './AuthContext';

const LookupContext = createContext(null);

/**
 * Loads admin-managed dropdown options once and exposes them to the app.
 * Consumers read a category's options via `useLookups(category, fallback)`.
 * On failure (e.g. unauthenticated public pages) it stays empty and callers
 * fall back to their hardcoded defaults, so nothing breaks.
 */
export function LookupProvider({ children }) {
  const { user } = useAuth();
  const [data, setData] = useState({}); // { category: [{ id, label, … }] }
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const grouped = await lookupsApi.all();
      setData(grouped || {});
    } catch {
      // Not authenticated / endpoint unavailable — leave empty, callers fall back.
    } finally {
      setLoaded(true);
    }
  }, []);

  // (Re)load whenever the signed-in user changes, so options appear right after
  // login and reset on logout.
  useEffect(() => {
    if (user) refresh();
    else setData({});
  }, [user, refresh]);

  return (
    <LookupContext.Provider value={{ data, loaded, refresh }}>
      {children}
    </LookupContext.Provider>
  );
}

function useLookupStore() {
  const ctx = useContext(LookupContext);
  if (!ctx) throw new Error('useLookups must be used within a LookupProvider');
  return ctx;
}

/**
 * Returns the active option labels for a category, or `fallback` when none have
 * been configured / loaded yet.
 */
export function useLookups(category, fallback = []) {
  const { data } = useLookupStore();
  const rows = data[category];
  if (rows && rows.length) return rows.map((r) => r.label);
  return fallback;
}

/** Full store access for the management screen (refresh after edits). */
export function useLookupAdmin() {
  return useLookupStore();
}
