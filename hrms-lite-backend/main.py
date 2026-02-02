from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import date
from typing import Optional
from sqlalchemy import func, distinct
from sqlalchemy import and_, func
from sqlalchemy.orm import aliased

import models
import schemas
import crud
from database import Base, engine, SessionLocal

from fastapi.middleware.cors import CORSMiddleware

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API")

# CORS for frontend later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- EMPLOYEES ----------------

@app.post("/employees", status_code=201)
def create_employee(emp: schemas.EmployeeCreate, db: Session = Depends(get_db)):

    existing = db.query(models.Employee).filter(
        (models.Employee.employee_id == emp.employee_id)
        | (models.Employee.email == emp.email)
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Employee with same ID or email already exists",
        )

    return crud.create_employee(db, emp)


# ✅ PAGINATED LIST
@app.get("/employees")
def list_employees(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
):

    offset = (page - 1) * limit

    total = db.query(models.Employee).count()

    employees = (
        db.query(models.Employee)
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "data": employees,
    }
# ---------------- ATTENDANCE ----------------

@app.post("/attendance", status_code=201)
def mark_attendance(
    record: schemas.AttendanceCreate,
    db: Session = Depends(get_db),
):

    emp = db.query(models.Employee).filter(
        models.Employee.employee_id == record.employee_id
    ).first()

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    return crud.mark_attendance(db, record)


@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: str, db: Session = Depends(get_db)):

    emp = crud.delete_employee(db, employee_id)

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    return {"message": "Employee deleted successfully"}


# ---------------- ATTENDANCE ----------------

def mark_attendance(db: Session, record):

    existing = (
        db.query(models.Attendance)
        .filter(
            models.Attendance.employee_id == record.employee_id,
            models.Attendance.date == record.date,
        )
        .first()
    )

    if existing:
        existing.status = record.status
        db.commit()
        db.refresh(existing)
        return existing

    attendance = models.Attendance(**record.dict())
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance



# ✅ FILTER BY DATE
@app.get("/attendance/{employee_id}")
def get_attendance(
    employee_id: str,
    from_date: Optional[date] = Query(None, alias="from"),
    to_date: Optional[date] = Query(None, alias="to"),
    db: Session = Depends(get_db),
):

    query = db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    )

    if from_date:
        query = query.filter(models.Attendance.date >= from_date)

    if to_date:
        query = query.filter(models.Attendance.date <= to_date)

    return query.order_by(models.Attendance.date.desc()).all()


# ---------------- DASHBOARD ----------------

@app.get("/dashboard")
def dashboard_summary(db: Session = Depends(get_db)):

    today = date.today()

    total_employees = db.query(models.Employee).count()

    # Subquery to get max attendance id per employee for today
    subq = (
        db.query(
            models.Attendance.employee_id,
            func.max(models.Attendance.id).label("max_id")
        )
        .filter(models.Attendance.date == today)
        .group_by(models.Attendance.employee_id)
        .subquery()
    )

    att_alias = aliased(models.Attendance)

    latest_attendance = (
        db.query(att_alias)
        .join(subq, and_(
            att_alias.employee_id == subq.c.employee_id,
            att_alias.id == subq.c.max_id
        ))
    )

    present_today = (
        latest_attendance.filter(att_alias.status == models.AttendanceStatus.PRESENT)
        .count()
    )

    absent_today = (
        latest_attendance.filter(att_alias.status == models.AttendanceStatus.ABSENT)
        .count()
    )

    return {
        "total_employees": total_employees,
        "present_today": present_today,
        "absent_today": absent_today,
    }