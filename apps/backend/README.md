# Shree Jinalaya — Backend API (FastAPI + PostgreSQL)

RBAC backend for the dashboard: authentication, role-wise permissions, role
management and user management. Exposes everything under `/api`.

## Stack

- **FastAPI** + Uvicorn
- **PostgreSQL** via SQLAlchemy 2.0 (sync) + `psycopg` v3
- **PyJWT** for tokens, **bcrypt** for password hashing
- **Pydantic v2** schemas

## Setup

```bash
# 1. From the repo root, create + activate a virtualenv (recommended)
python -m venv .venv
.venv\Scripts\activate            # Windows
# source .venv/bin/activate       # macOS/Linux

# 2. Install dependencies
pip install -r apps/backend/requirements.txt

# 3. Configure — copy and edit the env file
copy apps\backend\.env.example apps\backend\.env     # Windows
#   then set DATABASE_URL to your real Postgres user/password

# 4. Create the database (once)
#   psql -U postgres -c "CREATE DATABASE temple_local_db;"

# 5. Seed system roles + the bootstrap admin
python apps/backend/seed.py        # or: npm run seed:backend

# 6. Run the API (port 5000)
npm run dev:backend
#   or: python -m uvicorn app.main:app --app-dir apps/backend --port 5000 --reload
```

Tables are auto-created on startup (`Base.metadata.create_all`). For production,
switch to Alembic migrations.

## Default admin

After seeding, log in at the dashboard with:

- **email:** value of `SEED_ADMIN_EMAIL` (default `admin@jinalaya.org`)
- **password:** value of `SEED_ADMIN_PASSWORD` (default `ChangeMe@123`)

## Endpoints (all under `/api`)

| Method | Path | Guard |
| --- | --- | --- |
| POST | `/auth/login` | public |
| POST | `/auth/register` | public (creates a Devotee) |
| GET  | `/auth/me` | authenticated |
| GET  | `/roles` · `/roles/{key}` | `admin.roles` or `settings.view` |
| POST/PUT/DELETE | `/roles` · `/roles/{key}` | `admin.roles` |
| GET  | `/roles/permissions` | permission catalog for the editor |
| GET/POST | `/users` | `admin.users` |
| GET/PUT/DELETE | `/users/{id}` | `admin.users` |

Interactive docs: `http://localhost:5000/docs`.

## Permission model

Permission codes are `"<module>.<action>"` strings (e.g. `donations.create`).
The full catalog lives in [`app/core/permissions.py`](app/core/permissions.py)
and mirrors `packages/shared/data/permissions.js` on the frontend. A role holds
a list of codes in `permissionIds`; a user is assigned exactly one role and
inherits its permissions. The **Admin** role always holds every permission and
is permission-locked; **Admin** and **Devotee** are system roles and cannot be
deleted.
