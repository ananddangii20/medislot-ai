from typing import Literal
from pydantic import BaseModel, EmailStr

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Literal["patient", "doctor"] = "patient"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class VerifyEmail(BaseModel):
    email: EmailStr
    otp: str


class ResendOtpRequest(BaseModel):
    email: EmailStr


class GoogleAuthRequest(BaseModel):
    name: str
    email: EmailStr
    uid: str


class AppointmentCreate(BaseModel):
    doctor_id: str
    doctor_name: str
    date: str
    time: str
    reason: str


class AppointmentStatusUpdate(BaseModel):
    status: Literal["accepted", "rejected"]