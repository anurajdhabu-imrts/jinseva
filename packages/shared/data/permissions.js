// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Permission catalog for the Jinalaya dashboard.
//  Permissions are string codes of the form  "<module>.<action>".
//  The role create/edit UI renders these grouped by module, with
//  one checkbox per (module, action) pair.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CRUD = ['view', 'create', 'update', 'delete'];

function crud(module, label, actions = CRUD) {
  return {
    module,
    label,
    permissions: actions.map((a) => ({
      id: `${module}.${a}`,
      label: `${a[0].toUpperCase()}${a.slice(1)} ${label.toLowerCase()}`,
    })),
  };
}

export const PERMISSION_GROUPS = [
  crud('donations',     'Donations'),
  crud('events',        'Events'),
  crud('income',        'Income'),
  crud('expenses',      'Expenses'),
  crud('bookings',      'Pooja bookings'),
  crud('inventory',     'Inventory'),
  crud('staff',         'Staff'),
  crud('communication', 'Communication'),
  crud('media',         'Media'),
  {
    module: 'reports',
    label: 'Reports',
    permissions: [
      { id: 'reports.view',   label: 'View reports'   },
      { id: 'reports.export', label: 'Export reports' },
    ],
  },
  {
    module: 'settings',
    label: 'Settings',
    permissions: [
      { id: 'settings.view',   label: 'View settings'   },
      { id: 'settings.update', label: 'Update settings' },
    ],
  },
  {
    module: 'admin',
    label: 'Administration',
    permissions: [
      { id: 'admin.users', label: 'Manage users' },
      { id: 'admin.roles', label: 'Manage roles' },
    ],
  },
];

export const ALL_PERMISSION_IDS = PERMISSION_GROUPS.flatMap((g) =>
  g.permissions.map((p) => p.id),
);

export const PERMISSION_LABEL = Object.fromEntries(
  PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => [p.id, p.label])),
);

export const MODULE_LABEL = Object.fromEntries(
  PERMISSION_GROUPS.map((g) => [g.module, g.label]),
);

// Fixed system role identifiers — these two roles can never be deleted.
export const SYSTEM_ROLE_ADMIN   = 'role_admin';
export const SYSTEM_ROLE_DEVOTEE = 'role_devotee';
