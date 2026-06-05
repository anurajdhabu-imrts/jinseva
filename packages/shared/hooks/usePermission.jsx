import { useAuth } from '../context/AuthContext';

export function useUserPermissions() {
  const { permissions } = useAuth();
  return permissions ?? [];
}

export function useHasPermission(code) {
  const { hasPermission } = useAuth();
  return hasPermission(code);
}

export function useHasAnyPermission(codes = []) {
  const { hasAnyPermission } = useAuth();
  return hasAnyPermission(codes);
}
