from pydantic import BaseModel, EmailStr
from datetime import date
from enum import Enum


class AttendanceStatus(str, Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"


class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str


class EmployeeResponse(EmployeeCreate):
    pass


class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    status: AttendanceStatus
