// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Mock RBAC store — roles and users for the dashboard.
//  Mirrors the alqurar-ai shape so this can be swapped for a real
//  backend later without touching the UI.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import {
  ALL_PERMISSION_IDS,
  SYSTEM_ROLE_ADMIN,
  SYSTEM_ROLE_DEVOTEE,
} from './permissions';

// ── Roles ────────────────────────────────────────────────────────
export const rolesList = [
  {
    id: SYSTEM_ROLE_ADMIN,
    name: 'Admin',
    description: 'Full access to every module, including users and roles.',
    color: '#c8102e', // Jain red
    system: true,
    permissionIds: [...ALL_PERMISSION_IDS],
  },
  {
    id: SYSTEM_ROLE_DEVOTEE,
    name: 'Devotee',
    description: 'Logs into the devotee portal. No dashboard access.',
    color: '#00843d', // Jain green
    system: true,
    permissionIds: [],
  },
  {
    id: 'role_accountant',
    name: 'Accountant',
    description: 'Manages donations, income, expenses and reports.',
    color: '#ffc01e', // Jain yellow
    system: false,
    permissionIds: [
      'donations.view', 'donations.create', 'donations.update',
      'income.view',    'income.create',    'income.update',
      'expenses.view',  'expenses.create',  'expenses.update',
      'reports.view',   'reports.export',
    ],
  },
  {
    id: 'role_priest',
    name: 'Priest',
    description: 'Runs pooja bookings, events and the temple inventory.',
    color: '#1a1b22', // Jain black
    system: false,
    permissionIds: [
      'bookings.view',  'bookings.create',  'bookings.update',
      'events.view',    'events.create',    'events.update',
      'inventory.view', 'inventory.update',
    ],
  },
  {
    id: 'role_volunteer',
    name: 'Volunteer',
    description: 'Read-only access to bookings, events and the gallery.',
    color: '#054624', // Jain dark green
    system: false,
    permissionIds: [
      'bookings.view',
      'events.view',
      'media.view',
    ],
  },
];

// ── Users ────────────────────────────────────────────────────────
//   `roleId` references rolesList[].id. The full role document
//   (and its permissionIds) is hydrated at login time.
export const usersList = [
  {
    id: 'usr_001',
    name: 'Bhavin Shah',
    email: 'admin@jinalaya.org',
    roleId: SYSTEM_ROLE_ADMIN,
    status: 'active',
    lastActive: '2026-05-29',
    joinedAt: '2022-01-15',
    avatar: 'https://ui-avatars.com/api/?name=Bhavin+Shah&background=c8102e&color=fff&bold=true',
  },
  {
    id: 'usr_002',
    name: 'Anil Kothari',
    email: 'accountant@jinalaya.org',
    roleId: 'role_accountant',
    status: 'active',
    lastActive: '2026-05-28',
    joinedAt: '2023-03-22',
    avatar: 'https://ui-avatars.com/api/?name=Anil+Kothari&background=ffc01e&color=1a1b22&bold=true',
  },
  {
    id: 'usr_003',
    name: 'Pandit Suresh Mehta',
    email: 'pujari@jinalaya.org',
    roleId: 'role_priest',
    status: 'active',
    lastActive: '2026-05-29',
    joinedAt: '2018-04-10',
    avatar: 'https://ui-avatars.com/api/?name=Suresh+Mehta&background=1a1b22&color=fff&bold=true',
  },
  {
    id: 'usr_004',
    name: 'Sneha Shah',
    email: 'volunteer@jinalaya.org',
    roleId: 'role_volunteer',
    status: 'active',
    lastActive: '2026-05-26',
    joinedAt: '2025-01-15',
    avatar: 'https://ui-avatars.com/api/?name=Sneha+Shah&background=054624&color=fff&bold=true',
  },
  {
    id: 'usr_005',
    name: 'Devansh Mehta',
    email: 'devotee@jinalaya.org',
    roleId: SYSTEM_ROLE_DEVOTEE,
    status: 'active',
    lastActive: '2026-05-29',
    joinedAt: '2024-09-08',
    avatar: 'https://ui-avatars.com/api/?name=Devansh+Mehta&background=00843d&color=fff&bold=true',
  },
  {
    id: 'usr_006',
    name: 'Rekha Parekh',
    email: 'rekha@jinalaya.org',
    roleId: 'role_volunteer',
    status: 'invited',
    lastActive: null,
    joinedAt: '2026-05-20',
    avatar: 'https://ui-avatars.com/api/?name=Rekha+Parekh&background=054624&color=fff&bold=true',
  },
];

// ── Helpers ──────────────────────────────────────────────────────
export function findRoleById(roleId) {
  return rolesList.find((r) => r.id === roleId) ?? null;
}

export function findUserByEmail(email) {
  return usersList.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function permissionsForRole(roleId) {
  const role = findRoleById(roleId);
  return role ? [...role.permissionIds] : [];
}

export function countUsersByRole(roleId) {
  return usersList.filter((u) => u.roleId === roleId).length;
}
