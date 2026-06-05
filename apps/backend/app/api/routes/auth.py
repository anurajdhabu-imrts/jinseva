from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import Principal, get_current_principal
from app.core.database import get_db
from app.core.permissions import SYSTEM_ROLE_DEVOTEE
from app.core.security import create_access_token, hash_password, verify_password
from app.models.role import Role
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest
from app.services.rbac import hydrate_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == body.email.lower()))
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    if user.status == "suspended":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Your account is suspended")
    # Self-registered / invited accounts must be approved by an admin first.
    if user.status == "invited":
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            "Your account is awaiting admin approval. You'll be able to sign in once approved.",
        )

    user.last_active = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)

    token = create_access_token(str(user.id), {"roleId": user.role_id})
    return {"success": True, "token": token, "user": hydrate_user(db, user)}


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.scalar(select(User).where(User.email == body.email.lower()))
    if existing is not None:
        raise HTTPException(
            status.HTTP_409_CONFLICT, "A user with that email already exists"
        )

    devotee = db.scalar(select(Role).where(Role.key == SYSTEM_ROLE_DEVOTEE))
    if devotee is None:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Devotee role not provisioned — run the seed script",
        )

    # New devotees are created pending approval ("invited") — NOT logged in.
    user = User(
        name=body.name,
        email=body.email.lower(),
        password_hash=hash_password(body.password),
        role_id=SYSTEM_ROLE_DEVOTEE,
        status="invited",
        last_active=None,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "pending": True,
        "message": "Registration received. An admin will review and approve your account, then you can sign in.",
    }


@router.get("/me")
def me(
    principal: Principal = Depends(get_current_principal),
    db: Session = Depends(get_db),
):
    return {"success": True, "user": hydrate_user(db, principal.user)}
