from dataclasses import dataclass

import jwt
from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.permissions import SYSTEM_ROLE_ADMIN
from app.core.security import decode_access_token
from app.models.role import Role
from app.models.user import User


@dataclass
class Principal:
    """The authenticated caller plus their resolved role/permissions."""

    user: User
    role: Role | None
    permissions: list[str]
    is_admin: bool


def get_current_principal(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> Principal:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED, "Missing authentication token"
        )
    token = authorization.split(" ", 1)[1]

    try:
        payload = decode_access_token(token)
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")

    user_id = payload.get("sub")
    user = db.get(User, user_id) if user_id else None
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User no longer exists")
    if user.status == "suspended":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Your account is suspended")

    role = db.scalar(select(Role).where(Role.key == user.role_id))
    return Principal(
        user=user,
        role=role,
        permissions=list(role.permission_ids or []) if role else [],
        is_admin=user.role_id == SYSTEM_ROLE_ADMIN,
    )


def require_permissions(*codes: str, mode: str = "any"):
    """Dependency factory gating a route behind permission codes.
    mode="any" (default) grants if the caller holds any code; "all" requires every code.
    The Admin role always passes."""

    def checker(principal: Principal = Depends(get_current_principal)) -> Principal:
        if principal.is_admin:
            return principal
        granted = principal.permissions
        ok = (
            all(c in granted for c in codes)
            if mode == "all"
            else any(c in granted for c in codes)
        )
        if not ok:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                "You do not have permission to do that",
            )
        return principal

    return checker


def require_admin(principal: Principal = Depends(get_current_principal)) -> Principal:
    if not principal.is_admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Admin access required")
    return principal
