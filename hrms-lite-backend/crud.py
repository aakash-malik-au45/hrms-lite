from sqlalchemy.orm import Session
import models


def create_employee(db: Session, emp):
    employee = models.Employee(**emp.dict())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


def get_employees(db: Session):
    return db.query(models.Employee).all()


def delete_employee(db: Session, employee_id: str):
    emp = db.query(models.Employee).filter(
        models.Employee.employee_id == employee_id
    ).first()

    if not emp:
        return None

    db.delete(emp)
    db.commit()
    return emp


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



def get_attendance(db: Session, employee_id: str):
    return db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    ).all()
