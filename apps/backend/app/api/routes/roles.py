from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import require_permissions
from app.core.database import get_db
from app.core.permissions import (
    ALL_PERMISSION_IDS,
    PERMISSION_GROUPS,
    SYSTEM_ROLE_ADMIN,
    invalid_permissions,
)
from app.models.role import Role
from app.models.user import User
from app.schemas.role import RoleCreate, RoleUpdate
from app.services.rbac import generate_role_key

router = APIRouter(prefix="/roles", tags=["roles"])

# Reusable guards.
can_read = require_permissions("admin.roles", "settings.view")
can_manage = require_permissions("admin.roles")


def _assert_permissions_valid(codes: list[str]) -> None:
    bad = invalid_permissions(codes)
    if bad:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"Unknown permission codes: {', '.join(bad)}",
        )


def _user_counts(db: Session) -> dict[str, int]:
    rows = db.execute(
        select(User.role_id, func.count()).group_by(User.role_id)
    ).all()
    return {role_id: count for role_id, count in rows}


@router.get("/permissions", dependencies=[Depends(can_read)])
def permission_catalog():
    return {
        "success": True,
        "data": {"groups": PERMISSION_GROUPS, "all": ALL_PERMISSION_IDS},
    }


@router.get("", dependencies=[Depends(can_read)])
def list_roles(db: Session = Depends(get_db)):
    roles = db.scalars(
        select(Role).order_by(Role.system.desc(), Role.created_at.asc())
    ).all()
    counts = _user_counts(db)
    data = [r.to_dict(user_count=counts.get(r.key, 0)) for r in roles]
    return {"success": True, "count": len(data), "data": data}


@router.get("/{key}", dependencies=[Depends(can_read)])
def get_role(key: str, db: Session = Depends(get_db)):
    role = db.scalar(select(Role).where(Role.key == key))
    if role is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Role not found")
    return {"success": True, "data": role.to_dict()}


@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_manage)])
def create_role(body: RoleCreate, db: Session = Depends(get_db)):
    _assert_permissions_valid(body.permissionIds)

    clash = db.scalar(select(Role).where(func.lower(Role.name) == body.name.lower()))
    if clash is not None:
        raise HTTPException(
            status.HTTP_409_CONFLICT, "A role with that name already exists"
        )

    role = Role(
        key=generate_role_key(db, body.name),
        name=body.name,
        description=body.description or "",
        color=body.color or "#FF9644",
        system=False,
        permission_ids=body.permissionIds,
    )
    db.add(role)
    db.commit()
    db.refresh(role)
    return {"success": True, "data": role.to_dict()}


@router.put("/{key}", dependencies=[Depends(can_manage)])
def update_role(key: str, body: RoleUpdate, db: Session = Depends(get_db)):
    role = db.scalar(select(Role).where(Role.key == key))
    if role is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Role not found")

    # The Admin role is permission-locked — it must always hold every permission.
    if role.key == SYSTEM_ROLE_ADMIN and body.permissionIds is not None:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            "The Admin role always has full access and cannot be modified",
        )

    if body.permissionIds is not None:
        _assert_permissions_valid(body.permissionIds)
        role.permission_ids = body.permissionIds
    if body.name is not None:
        role.name = body.name
    if body.description is not None:
        role.description = body.description
    if body.color is not None:
        role.color = body.color

    db.commit()
    db.refresh(role)
    return {"success": True, "data": role.to_dict()}


@router.delete("/{key}", dependencies=[Depends(can_manage)])
def delete_role(key: str, db: Session = Depends(get_db)):
    role = db.scalar(select(Role).where(Role.key == key))
    if role is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Role not found")
    if role.system:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "System roles cannot be deleted"
        )

    in_use = db.scalar(select(func.count()).select_from(User).where(User.role_id == role.key))
    if in_use:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            f"Cannot delete: {in_use} user(s) still assigned to this role",
        )

    db.delete(role)
    db.commit()
    return {"success": True, "message": "Role deleted"}
