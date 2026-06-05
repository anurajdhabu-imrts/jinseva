import { useAuth } from '../context/AuthContext';

/**
 * Conditionally renders children based on the current user's permissions.
 *
 *   <Can permission="donations.create"> ...      </Can>
 *   <Can any={['admin.users','admin.roles']}> .. </Can>
 *
 * When neither prop is supplied, `Can` is transparent (always renders).
 */
export default function Can({ permission, any, children, fallback = null }) {
  const { hasPermission, hasAnyPermission } = useAuth();
  let allowed = true;
  if (permission)        allowed = hasPermission(permission);
  else if (any?.length)  allowed = hasAnyPermission(any);
  return allowed ? children : fallback;
}
