from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Staff(Base):
    __tablename__ = "staff"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    role: Mapped[str] = mapped_column(String(120), default="", nullable=False)
    department: Mapped[str] = mapped_column(String(120), default="", nullable=False)
    join_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    phone: Mapped[str] = mapped_column(String(40), default="", nullable=False)
    email: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    salary: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="active", nullable=False)
    salary_status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)
    avatar: Mapped[str] = mapped_column(String(500), default="", nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    attendance: Mapped[list["Attendance"]] = relationship(back_populates="staff", cascade="all, delete-orphan")

    def avatar_url(self) -> str:
        if self.avatar:
            return self.avatar
        from urllib.parse import quote
        return f"https://ui-avatars.com/api/?name={quote(self.name)}&background=c8102e&color=fff&bold=true"

    def to_dict(self) -> dict:
        return {
            "id": self.code,
            "name": self.name,
            "role": self.role,
            "department": self.department,
            "joinDate": self.join_date.isoformat() if self.join_date else None,
            "phone": self.phone,
            "email": self.email,
            "salary": self.salary,
            "status": self.status,
            "salaryStatus": self.salary_status,
            "avatar": self.avatar or self.avatar_url(),
        }


class Volunteer(Base):
    __tablename__ = "volunteers"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    area: Mapped[str] = mapped_column(String(120), default="", nullable=False)
    hours: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    join_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    phone: Mapped[str] = mapped_column(String(40), default="", nullable=False)
    email: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    city: Mapped[str] = mapped_column(String(120), default="", nullable=False)
    availability: Mapped[str] = mapped_column(String(160), default="", nullable=False)
    skills: Mapped[str] = mapped_column(Text, default="", nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="active", nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def to_dict(self) -> dict:
        return {
            "id": self.code,
            "name": self.name,
            "area": self.area,
            "hours": self.hours,
            "joined": self.join_date.isoformat() if self.join_date else None,
            "phone": self.phone,
            "email": self.email,
            "city": self.city,
            "availability": self.availability,
            "skills": self.skills,
            "status": self.status,
        }


class Attendance(Base):
    __tablename__ = "attendance"
    __table_args__ = (UniqueConstraint("staff_id", "att_date", name="uq_attendance_staff_date"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    staff_id: Mapped[int] = mapped_column(ForeignKey("staff.id", ondelete="CASCADE"), index=True, nullable=False)
    att_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="present", nullable=False)  # present|absent|late|leave
    check_in: Mapped[str] = mapped_column(String(10), default="", nullable=False)
    check_out: Mapped[str] = mapped_column(String(10), default="", nullable=False)

    staff: Mapped["Staff"] = relationship(back_populates="attendance")
