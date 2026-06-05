"""
Permission catalog — the single source of truth on the backend.
Mirrors packages/shared/data/permissions.js so role.permissionIds validate
against exactly the codes the dashboard UI renders.
Permission codes have the form "<module>.<action>".
"""

CRUD = ["view", "create", "update", "delete"]


def _crud(module: str, label: str, actions: list[str] = CRUD) -> dict:
    return {
        "module": module,
        "label": label,
        "permissions": [
            {"id": f"{module}.{a}", "label": f"{a.capitalize()} {label.lower()}"}
            for a in actions
        ],
    }


PERMISSION_GROUPS: list[dict] = [
    _crud("donations", "Donations"),
    _crud("events", "Events"),
    _crud("income", "Income"),
    _crud("expenses", "Expenses"),
    _crud("bookings", "Pooja bookings"),
    _crud("inventory", "Inventory"),
    _crud("staff", "Staff"),
    _crud("communication", "Communication"),
    _crud("media", "Media"),
    {
        "module": "reports",
        "label": "Reports",
        "permissions": [
            {"id": "reports.view", "label": "View reports"},
            {"id": "reports.export", "label": "Export reports"},
        ],
    },
    {
        "module": "settings",
        "label": "Settings",
        "permissions": [
            {"id": "settings.view", "label": "View settings"},
            {"id": "settings.update", "label": "Update settings"},
        ],
    },
    {
        "module": "admin",
        "label": "Administration",
        "permissions": [
            {"id": "admin.users", "label": "Manage users"},
            {"id": "admin.roles", "label": "Manage roles"},
        ],
    },
]

ALL_PERMISSION_IDS: list[str] = [
    p["id"] for g in PERMISSION_GROUPS for p in g["permissions"]
]

_PERMISSION_SET = set(ALL_PERMISSION_IDS)


def is_valid_permission(code: str) -> bool:
    return code in _PERMISSION_SET


def invalid_permissions(codes: list[str]) -> list[str]:
    """Return the subset of codes that are not in the catalog (empty = all valid)."""
    return [c for c in codes if c not in _PERMISSION_SET]


# Fixed system role keys — these two roles can never be deleted.
SYSTEM_ROLE_ADMIN = "role_admin"
SYSTEM_ROLE_DEVOTEE = "role_devotee"
