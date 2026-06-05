import re

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.role import Role
from app.models.user import User


def generate_role_key(db: Session, name: str) -> str:
    """Turn a role name into a stable, unique key (e.g. "Temple Trustee" -> "role_temple_trustee")."""
    slug = re.sub(r"[^a-z0-9]+", "_", name.lower().strip()).strip("_")
    base = f"role_{slug}" if slug else "role_custom"
    key = base
    n = 1
    while db.scalar(select(Role).where(Role.key == key)) is not None:
        key = f"{base}_{n}"
        n += 1
    return key


def hydrate_user(db: Session, user: User) -> dict:
    """Build the dashboard-friendly principal: the user plus its hydrated role,
    role name and flattened permission list. Mirrors AuthContext.hydrate()."""
    role = db.scalar(select(Role).where(Role.key == user.role_id))
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "roleId": user.role_id,
        "status": user.status,
        "avatar": user.avatar or user.avatar_url(),
        "lastActive": user.last_active.isoformat() if user.last_active else None,
        "joinedAt": user.created_at.isoformat() if user.created_at else None,
        "role": role.to_dict() if role else None,
        "roleName": role.name if role else "Unknown",
        "permissions": list(role.permission_ids or []) if role else [],
    }
