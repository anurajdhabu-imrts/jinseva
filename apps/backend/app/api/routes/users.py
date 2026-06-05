from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.api.deps import Principal, require_permissions
from app.core.database import get_db
from app.core.security import hash_password
from app.models.role import Role
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.rbac import hydrate_user

router = APIRouter(prefix="/users", tags=["users"])

can_manage = require_permissions("admin.users")


def _assert_role_exists(db: Session, role_id: str) -> None:
    if db.scalar(select(Role).where(Role.key == role_id)) is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Unknown role: {role_id}")


@router.get("", dependencies=[Depends(can_manage)])
def list_users(
    q: str | None = None,
    status_filter: str | None = Query(default=None, alias="status"),
    roleId: str | None = None,
    db: Session = Depends(get_db),
):
    stmt = select(User).order_by(User.created_at.desc())
    if status_filter:
        stmt = stmt.where(User.status == status_filter)
    if roleId:
        stmt = stmt.where(User.role_id == roleId)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(or_(User.name.ilike(like), User.email.ilike(like)))

    users = db.scalars(stmt).all()
    data = [hydrate_user(db, u) for u in users]
    return {"success": True, "count": len(data), "data": data}


@router.get("/{user_id}", dependencies=[Depends(can_manage)])
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    return {"success": True, "data": hydrate_user(db, user)}


@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_manage)])
def create_user(body: UserCreate, db: Session = Depends(get_db)):
    _assert_role_exists(db, body.roleId)

    if db.scalar(select(User).where(User.email == body.email.lower())) is not None:
        raise HTTPException(
            status.HTTP_409_CONFLICT, "A user with that email already exists"
        )

    user = User(
        name=body.name,
        email=body.email.lower(),
        password_hash=hash_password(body.password),
        role_id=body.roleId,
        status=body.status,
        avatar=body.avatar or "",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"success": True, "data": hydrate_user(db, user)}


@router.put("/{user_id}", dependencies=[Depends(can_manage)])
def update_user(user_id: str, body: UserUpdate, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    if body.roleId is not None:
        _assert_role_exists(db, body.roleId)

    if body.email is not None and body.email.lower() != user.email:
        taken = db.scalar(select(User).where(User.email == body.email.lower()))
        if taken is not None:
            raise HTTPException(
                status.HTTP_409_CONFLICT, "A user with that email already exists"
            )
        user.email = body.email.lower()

    if body.name is not None:
        user.name = body.name
    if body.roleId is not None:
        user.role_id = body.roleId
    if body.status is not None:
        user.status = body.status
    if body.avatar is not None:
        user.avatar = body.avatar
    if body.password:
        user.password_hash = hash_password(body.password)

    db.commit()
    db.refresh(user)
    return {"success": True, "data": hydrate_user(db, user)}


@router.delete("/{user_id}", dependencies=[Depends(can_manage)])
def delete_user(
    user_id: str,
    principal: Principal = Depends(can_manage),
    db: Session = Depends(get_db),
):
    if str(principal.user.id) == user_id:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "You cannot delete your own account"
        )
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    db.delete(user)
    db.commit()
    return {"success": True, "message": "User deleted"}
