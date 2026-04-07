from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from bson import ObjectId
from app.schemas import (
    UserSignup,
    UserLogin,
    VerifyEmail,
    ResendOtpRequest,
    GoogleAuthRequest,
    AppointmentCreate,
    AppointmentStatusUpdate,
    DoctorFeeUpdate,
    DoctorProfileUpdate,
)
from app.db import users_collection, appointments_collection
from app.auth.utils import hash_password, verify_password, create_token
from app.auth.email import generate_otp, send_otp_email
from jose import jwt
import os

router = APIRouter()
security = HTTPBearer()
SECRET = os.getenv("JWT_SECRET")


def serialize_appointment(item: dict) -> dict:
    return {
        "id": str(item["_id"]),
        "doctor_id": item["doctor_id"],
        "doctor_name": item["doctor_name"],
        "patient_name": item["patient_name"],
        "patient_email": item["patient_email"],
        "date": item["date"],
        "time": item["time"],
        "reason": item["reason"],
        "status": item["status"],
        "appointment_charge": item.get("appointment_charge"),
        "payment_status": item.get("payment_status", "not_required"),
        "paid_at": item.get("paid_at"),
        "created_at": item.get("created_at"),
    }


def serialize_doctor(item: dict) -> dict:
    return {
        "id": str(item["_id"]),
        "name": item.get("name", "Doctor"),
        "email": item.get("email", ""),
        "specialization": item.get("specialization", "General Physician"),
        "experience": item.get("experience", 5),
        "bio": item.get("bio", "Experienced Indian healthcare professional available for online consultation."),
        "consultation_fee": item.get("consultation_fee", 1000),
        "image": item.get("image", ""),
    }


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        email = payload.get("email")

        if not email:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        user = await users_collection.find_one({"email": email})

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return user
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


async def require_role(required_role: str, user: dict) -> None:
    if user.get("role") != required_role:
        raise HTTPException(status_code=403, detail=f"Only {required_role}s are allowed")

@router.post("/signup")
async def signup(user: UserSignup):
    existing = await users_collection.find_one({"email": user.email})
    hashed = hash_password(user.password)
    otp = generate_otp()
    otp_expiry = datetime.now(timezone.utc) + timedelta(minutes=10)

    if existing:
        if existing.get("is_verified"):
            raise HTTPException(400, "User already exists. Please login")

        await users_collection.update_one(
            {"email": user.email},
            {
                "$set": {
                    "name": user.name,
                    "password": hashed,
                    "role": user.role,
                    "provider": "local",
                    "otp": otp,
                    "otp_expires_at": otp_expiry,
                    "consultation_fee": existing.get("consultation_fee", 1000) if user.role == "doctor" else existing.get("consultation_fee"),
                }
            },
        )

        try:
            send_otp_email(user.email, otp)
        except Exception as exc:
            raise HTTPException(500, f"Failed to send OTP email: {str(exc)}")

        return {"message": "Existing unverified account updated. OTP sent to email"}

    await users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed,
        "role": user.role,
        "is_verified": False,
        "provider": "local",
        "otp": otp,
        "otp_expires_at": otp_expiry,
        "consultation_fee": 1000 if user.role == "doctor" else None,
        "specialization": "General Physician" if user.role == "doctor" else None,
        "experience": 5 if user.role == "doctor" else None,
        "bio": "Experienced Indian healthcare professional available for online consultation." if user.role == "doctor" else None,
        "image": "" if user.role == "doctor" else None,
    })

    try:
        send_otp_email(user.email, otp)
    except Exception as exc:
        raise HTTPException(500, f"Failed to send OTP email: {str(exc)}")

    return {"message": "OTP sent to email"}


@router.post("/resend-otp")
async def resend_otp(data: ResendOtpRequest):
    user = await users_collection.find_one({"email": data.email})

    if not user:
        raise HTTPException(404, "User not found")

    if user.get("is_verified"):
        raise HTTPException(400, "User already verified")

    otp = generate_otp()
    otp_expiry = datetime.now(timezone.utc) + timedelta(minutes=10)

    await users_collection.update_one(
        {"email": data.email},
        {"$set": {"otp": otp, "otp_expires_at": otp_expiry}},
    )

    try:
        send_otp_email(data.email, otp)
    except Exception as exc:
        raise HTTPException(500, f"Failed to send OTP email: {str(exc)}")

    return {"message": "OTP resent successfully"}


@router.post("/verify-email")
async def verify_email(data: VerifyEmail):
    user = await users_collection.find_one({"email": data.email})

    if not user:
        raise HTTPException(404, "User not found")

    if user.get("is_verified"):
        return {"message": "Email already verified"}

    stored_otp = user.get("otp")
    otp_expires_at = user.get("otp_expires_at")

    if not stored_otp or data.otp != stored_otp:
        raise HTTPException(400, "Invalid OTP")

    if otp_expires_at and otp_expires_at.tzinfo is None:
        otp_expires_at = otp_expires_at.replace(tzinfo=timezone.utc)

    if otp_expires_at and datetime.now(timezone.utc) > otp_expires_at:
        raise HTTPException(400, "OTP expired")

    await users_collection.update_one(
        {"email": data.email},
        {"$set": {"is_verified": True}, "$unset": {"otp": "", "otp_expires_at": ""}},
    )

    return {"message": "Email verified successfully"}

@router.post("/login")
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(400, "User not found")

    if not db_user["is_verified"]:
        raise HTTPException(403, "Email not verified")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(400, "Wrong password")

    token = create_token({"email": user.email, "role": db_user.get("role", "patient")})

    return {
        "access_token": token,
        "role": db_user.get("role", "patient"),
        "name": db_user.get("name", ""),
    }


@router.post("/google")
async def google_auth(payload: GoogleAuthRequest):
    db_user = await users_collection.find_one({"email": payload.email})

    if not db_user:
        await users_collection.insert_one({
            "name": payload.name,
            "email": payload.email,
            "google_uid": payload.uid,
            "role": "patient",
            "is_verified": True,
            "provider": "google",
        })
    else:
        if db_user.get("provider") != "google":
            await users_collection.update_one(
                {"email": payload.email},
                {
                    "$set": {
                        "name": payload.name,
                        "google_uid": payload.uid,
                        "role": db_user.get("role", "patient"),
                        "is_verified": True,
                    }
                },
            )

    user = await users_collection.find_one({"email": payload.email})

    token = create_token({"email": payload.email, "role": user.get("role", "patient")})
    return {
        "access_token": token,
        "role": user.get("role", "patient"),
        "name": user.get("name", ""),
        "message": "Google login successful",
    }


@router.get("/me")
async def get_me(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = await get_current_user(credentials)
    user["id"] = str(user.get("_id"))
    user.pop("_id", None)
    user.pop("password", None)
    user.pop("otp", None)
    user.pop("otp_expires_at", None)
    return user


@router.get("/doctors")
async def get_doctors():
    doctor_items = await users_collection.find(
        {
            "role": "doctor",
            "is_verified": True,
        }
    ).to_list(500)

    return {"doctors": [serialize_doctor(item) for item in doctor_items]}


@router.put("/doctor/consultation-fee")
async def set_doctor_consultation_fee(
    payload: DoctorFeeUpdate,
    current_user: dict = Depends(get_current_user),
):
    await require_role("doctor", current_user)

    await users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"consultation_fee": payload.consultation_fee}},
    )

    current_user["consultation_fee"] = payload.consultation_fee
    return {
        "message": "Consultation fee updated",
        "consultation_fee": payload.consultation_fee,
    }


@router.put("/doctor/profile")
async def update_doctor_profile(
    payload: DoctorProfileUpdate,
    current_user: dict = Depends(get_current_user),
):
    await require_role("doctor", current_user)

    await users_collection.update_one(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "name": payload.name.strip(),
                "specialization": payload.specialization.strip(),
                "experience": payload.experience,
                "bio": payload.bio.strip(),
                "image": payload.image.strip(),
            }
        },
    )

    return {"message": "Doctor profile updated successfully"}


@router.post("/appointments")
async def create_appointment(
    payload: AppointmentCreate,
    current_user: dict = Depends(get_current_user),
):
    await require_role("patient", current_user)

    doctor_record = None
    if ObjectId.is_valid(payload.doctor_id):
        doctor_record = await users_collection.find_one(
            {
                "_id": ObjectId(payload.doctor_id),
                "role": "doctor",
                "is_verified": True,
            }
        )

    doctor_id = str(doctor_record["_id"]) if doctor_record else payload.doctor_id
    doctor_name = doctor_record.get("name", payload.doctor_name) if doctor_record else payload.doctor_name

    appointment = {
        "doctor_id": doctor_id,
        "doctor_name": doctor_name,
        "patient_name": current_user.get("name", "Patient"),
        "patient_email": current_user["email"],
        "date": payload.date,
        "time": payload.time,
        "reason": payload.reason,
        "status": "pending",
        "appointment_charge": None,
        "payment_status": "not_required",
        "paid_at": None,
        "created_at": datetime.now(timezone.utc),
    }

    inserted = await appointments_collection.insert_one(appointment)
    appointment["_id"] = inserted.inserted_id
    return {"message": "Appointment request sent", "appointment": serialize_appointment(appointment)}


@router.get("/appointments/patient")
async def get_patient_appointments(current_user: dict = Depends(get_current_user)):
    await require_role("patient", current_user)

    items = (
        await appointments_collection.find({"patient_email": current_user["email"]})
        .sort("created_at", -1)
        .to_list(200)
    )

    return {"appointments": [serialize_appointment(item) for item in items]}


@router.get("/appointments/doctor")
async def get_doctor_appointments(current_user: dict = Depends(get_current_user)):
    await require_role("doctor", current_user)

    doctor_id = str(current_user.get("_id"))
    items = (
        await appointments_collection.find(
            {
                "$or": [
                    {"doctor_id": doctor_id},
                    {"doctor_name": current_user.get("name", "")},
                ]
            }
        )
        .sort("created_at", -1)
        .to_list(200)
    )

    return {"appointments": [serialize_appointment(item) for item in items]}


@router.put("/appointments/{appointment_id}/status")
async def update_appointment_status(
    appointment_id: str,
    payload: AppointmentStatusUpdate,
    current_user: dict = Depends(get_current_user),
):
    await require_role("doctor", current_user)

    if not ObjectId.is_valid(appointment_id):
        raise HTTPException(400, "Invalid appointment id")

    db_item = await appointments_collection.find_one({"_id": ObjectId(appointment_id)})
    if not db_item:
        raise HTTPException(404, "Appointment not found")

    current_doctor_id = str(current_user.get("_id"))
    owns_appointment = (
        db_item.get("doctor_id") == current_doctor_id
        or db_item.get("doctor_name") == current_user.get("name")
    )

    if not owns_appointment:
        raise HTTPException(403, "You can update only your own appointment requests")

    update_fields = {"status": payload.status}
    if payload.status == "accepted":
        update_fields["appointment_charge"] = current_user.get("consultation_fee", 1000)
        update_fields["payment_status"] = "pending"
    else:
        update_fields["appointment_charge"] = None
        update_fields["payment_status"] = "not_required"
        update_fields["paid_at"] = None

    await appointments_collection.update_one(
        {"_id": ObjectId(appointment_id)},
        {"$set": update_fields},
    )

    updated_item = await appointments_collection.find_one({"_id": ObjectId(appointment_id)})
    return {"message": "Appointment updated", "appointment": serialize_appointment(updated_item)}


@router.post("/appointments/{appointment_id}/pay")
async def pay_appointment_charge(
    appointment_id: str,
    current_user: dict = Depends(get_current_user),
):
    await require_role("patient", current_user)

    if not ObjectId.is_valid(appointment_id):
        raise HTTPException(400, "Invalid appointment id")

    db_item = await appointments_collection.find_one(
        {
            "_id": ObjectId(appointment_id),
            "patient_email": current_user.get("email"),
        }
    )
    if not db_item:
        raise HTTPException(404, "Appointment not found")

    if db_item.get("status") != "accepted":
        raise HTTPException(400, "Only accepted appointments can be paid")

    if db_item.get("payment_status") == "paid":
        return {"message": "Payment already completed", "appointment": serialize_appointment(db_item)}

    await appointments_collection.update_one(
        {"_id": ObjectId(appointment_id)},
        {
            "$set": {
                "payment_status": "paid",
                "paid_at": datetime.now(timezone.utc),
            }
        },
    )

    updated_item = await appointments_collection.find_one({"_id": ObjectId(appointment_id)})
    return {"message": "Appointment payment successful", "appointment": serialize_appointment(updated_item)}