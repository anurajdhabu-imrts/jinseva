from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.routes import (
    auth,
    bookings,
    communication,
    dashboard,
    donations,
    events,
    expenses,
    income,
    inventory,
    lookups,
    me,
    media,
    public,
    reports,
    roles,
    staff,
    users,
)
from app.api.routes.media import UPLOAD_DIR
from app.core.config import settings
from app.core.database import Base, engine
from app.models import (  # noqa: F401 — register mappers for create_all
    Announcement,
    Attendance,
    Booking,
    Donation,
    Event,
    EventDonation,
    EventExpense,
    Expense,
    ExpenseCategory,
    Income,
    InventoryItem,
    Lookup,
    Media,
    MessageTemplate,
    Role,
    Staff,
    Supplier,
    User,
    Volunteer,
)

app = FastAPI(title="Shree Jinalaya API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded media files (photos/videos) at /uploads/<file>.
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


@app.on_event("startup")
def on_startup() -> None:
    # Dev convenience: ensure tables exist. For production use Alembic migrations.
    Base.metadata.create_all(bind=engine)
    # Seed default dropdown options the first time the table is empty.
    from app.api.routes.lookups import seed_lookups
    from app.core.database import SessionLocal

    db = SessionLocal()
    try:
        seed_lookups(db)
    finally:
        db.close()


# ── Error handlers — shape bodies as { success, message } so the dashboard's
#    apiError(err) helper (reads response.data.message) always finds a message.
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(_request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "message": exc.detail},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_request: Request, exc: RequestValidationError):
    first = exc.errors()[0] if exc.errors() else {}
    loc = ".".join(str(p) for p in first.get("loc", []) if p != "body")
    msg = first.get("msg", "Validation failed")
    message = f"{loc}: {msg}" if loc else msg
    return JSONResponse(
        status_code=422,
        content={"success": False, "message": message, "details": exc.errors()},
    )


@app.get("/api/health")
def health():
    return {"success": True, "status": "ok", "service": "jinalaya-api"}


app.include_router(auth.router, prefix="/api")
app.include_router(roles.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(events.router, prefix="/api")
app.include_router(donations.router, prefix="/api")
app.include_router(income.router, prefix="/api")
app.include_router(expenses.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")
app.include_router(inventory.router, prefix="/api")
app.include_router(lookups.router, prefix="/api")
app.include_router(staff.router, prefix="/api")
app.include_router(communication.router, prefix="/api")
app.include_router(me.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(media.router, prefix="/api")
app.include_router(public.router, prefix="/api")
