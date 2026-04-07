from typing import Literal
from pydantic import BaseModel, EmailStr, Field

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


class DoctorFeeUpdate(BaseModel):
    consultation_fee: float = Field(gt=0)


class DoctorProfileUpdate(BaseModel):
    name: str
    specialization: str
    experience: int = Field(ge=0)
    bio: str
    image: str
    location: str
    hospital_or_clinic: str


class AppointmentPayment(BaseModel):
    payment_method: Literal["upi", "card", "netbanking"]
    payment_reference: str