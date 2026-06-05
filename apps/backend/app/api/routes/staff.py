from datetime import date as date_type

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.api.deps import require_permissions
from app.core.database import get_db
from app.models.staff import Attendance, Staff, Volunteer
from app.schemas.staff import (
    AttendanceMark,
    StaffCreate,
    StaffUpdate,
    VolunteerCreate,
    VolunteerUpdate,
)
from app.services.codes import generate_code

router = APIRouter(prefix="/staff", tags=["staff"])

can_view = require_permissions("staff.view")
can_create = require_permissions("staff.create")
can_update = require_permissions("staff.update")
can_delete = require_permissions("staff.delete")


def _staff_or_404(db: Session, code: str) -> Staff:
    s = db.scalar(select(Staff).where(Staff.code == code))
    if s is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Staff member not found")
    return s


def _vol_or_404(db: Session, code: str) -> Volunteer:
    v = db.scalar(select(Volunteer).where(Volunteer.code == code))
    if v is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Volunteer not found")
    return v


# ── Volunteers (before /{code}) ──
@router.get("/volunteers", dependencies=[Depends(can_view)])
def list_volunteers(db: Session = Depends(get_db)):
    vols = db.scalars(select(Volunteer).order_by(Volunteer.name)).all()
    data = [v.to_dict() for v in vols]
    return {"success": True, "count": len(data), "data": data}


@router.post("/volunteers", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_create)])
def create_volunteer(body: VolunteerCreate, db: Session = Depends(get_db)):
    vol = Volunteer(
        code=generate_code(db, Volunteer, Volunteer.code, "VOL-", pad=2, start=1),
        name=body.name, area=body.area, hours=body.hours, join_date=body.joined,
        phone=body.phone, email=body.email, city=body.city,
        availability=body.availability, skills=body.skills, status=body.status,
    )
    db.add(vol)
    db.commit()
    db.refresh(vol)
    return {"success": True, "data": vol.to_dict()}


@router.put("/volunteers/{code}", dependencies=[Depends(can_update)])
def update_volunteer(code: str, body: VolunteerUpdate, db: Session = Depends(get_db)):
    vol = _vol_or_404(db, code)
    data = body.model_dump(exclude_unset=True)
    if "joined" in data:
        vol.join_date = data.pop("joined")
    for field, value in data.items():
        setattr(vol, field, value)
    db.commit()
    db.refresh(vol)
    return {"success": True, "data": vol.to_dict()}


@router.delete("/volunteers/{code}", dependencies=[Depends(can_delete)])
def delete_volunteer(code: str, db: Session = Depends(get_db)):
    db.delete(_vol_or_404(db, code))
    db.commit()
    return {"success": True, "message": "Volunteer removed"}


# ── Attendance (before /{code}) ──
@router.get("/attendance", dependencies=[Depends(can_view)])
def get_attendance(date: date_type | None = None, db: Session = Depends(get_db)):
    day = date or date_type.today()
    staff = db.scalars(select(Staff).order_by(Staff.name)).all()
    records = {
        a.staff_id: a
        for a in db.scalars(select(Attendance).where(Attendance.att_date == day)).all()
    }
    rows = []
    for s in staff:
        rec = records.get(s.id)
        rows.append({
            **s.to_dict(),
            "attStatus": rec.status if rec else "present",
            "checkIn": rec.check_in if rec else "",
            "checkOut": rec.check_out if rec else "",
        })
    summary = {st: sum(1 for r in rows if r["attStatus"] == st) for st in ("present", "absent", "late", "leave")}
    return {"success": True, "date": day.isoformat(), "summary": summary, "data": rows}


@router.post("/attendance/mark", dependencies=[Depends(can_update)])
def mark_attendance(body: AttendanceMark, db: Session = Depends(get_db)):
    s = _staff_or_404(db, body.staffId)
    day = body.date or date_type.today()
    rec = db.scalar(select(Attendance).where(Attendance.staff_id == s.id, Attendance.att_date == day))
    if rec is None:
        rec = Attendance(staff_id=s.id, att_date=day)
        db.add(rec)
    rec.status = body.status
    rec.check_in = body.checkIn
    rec.check_out = body.checkOut
    db.commit()
    return {"success": True, "message": "Attendance recorded"}


# ── Salary / payroll (before /{code}) ──
def _payroll_row(s: Staff) -> dict:
    bonus = 5000 if s.salary > 30000 else 0
    deductions = round(s.salary * 0.08)
    return {
        **s.to_dict(),
        "base": s.salary,
        "bonus": bonus,
        "deductions": deductions,
        "net": s.salary + bonus - deductions,
        "paid": s.salary_status == "paid",
    }


@router.get("/salary", dependencies=[Depends(can_view)])
def salary(db: Session = Depends(get_db)):
    staff = db.scalars(select(Staff).order_by(Staff.name)).all()
    rows = [_payroll_row(s) for s in staff]
    total_payroll = sum(r["net"] for r in rows)
    return {
        "success": True,
        "data": rows,
        "totalPayroll": total_payroll,
        "paidCount": sum(1 for r in rows if r["paid"]),
        "pendingCount": sum(1 for r in rows if not r["paid"]),
    }


@router.post("/salary/process", dependencies=[Depends(can_update)])
def process_payroll(db: Session = Depends(get_db)):
    for s in db.scalars(select(Staff)).all():
        s.salary_status = "paid"
    db.commit()
    return {"success": True, "message": "Payroll processed"}


# ── Staff CRUD ──
@router.get("", dependencies=[Depends(can_view)])
def list_staff(q: str | None = None, db: Session = Depends(get_db)):
    stmt = select(Staff).order_by(Staff.name)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(or_(Staff.name.ilike(like), Staff.role.ilike(like)))
    staff = db.scalars(stmt).all()
    data = [s.to_dict() for s in staff]
    return {"success": True, "count": len(data), "data": data}


@router.get("/{code}", dependencies=[Depends(can_view)])
def get_staff(code: str, db: Session = Depends(get_db)):
    return {"success": True, "data": _staff_or_404(db, code).to_dict()}


@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(can_create)])
def create_staff(body: StaffCreate, db: Session = Depends(get_db)):
    s = Staff(
        code=generate_code(db, Staff, Staff.code, "STF-", pad=2, start=1),
        name=body.name, role=body.role, department=body.department, join_date=body.joinDate,
        phone=body.phone, email=body.email, salary=body.salary, status=body.status, avatar=body.avatar,
    )
    db.add(s)
    db.commit()
    db.refresh(s)
    return {"success": True, "data": s.to_dict()}


@router.put("/{code}", dependencies=[Depends(can_update)])
def update_staff(code: str, body: StaffUpdate, db: Session = Depends(get_db)):
    s = _staff_or_404(db, code)
    data = body.model_dump(exclude_unset=True)
    if "joinDate" in data:
        s.join_date = data.pop("joinDate")
    for field, value in data.items():
        setattr(s, field, value)
    db.commit()
    db.refresh(s)
    return {"success": True, "data": s.to_dict()}


@router.delete("/{code}", dependencies=[Depends(can_delete)])
def delete_staff(code: str, db: Session = Depends(get_db)):
    db.delete(_staff_or_404(db, code))
    db.commit()
    return {"success": True, "message": "Staff member removed"}
