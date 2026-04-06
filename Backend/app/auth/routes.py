from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.schemas import UserSignup, UserLogin, VerifyEmail, GoogleAuthRequest
from app.db import users_collection
from app.auth.utils import hash_password, verify_password, create_token
from app.auth.email import generate_otp, verify_otp
from jose import jwt
import os

router = APIRouter()
security = HTTPBearer()
SECRET = os.getenv("JWT_SECRET")

@router.post("/signup")
async def signup(user: UserSignup):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(400, "User already exists")

    hashed = hash_password(user.password)

    await users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed,
        "is_verified": False,
        "provider": "local"
    })

    generate_otp(user.email)

    return {"message": "OTP sent to email"}

@router.post("/verify-email")
async def verify_email(data: VerifyEmail):
    if not verify_otp(data.email, data.otp):
        raise HTTPException(400, "Invalid OTP")

    await users_collection.update_one(
        {"email": data.email},
        {"$set": {"is_verified": True}}
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

    token = create_token({"email": user.email})

    return {"access_token": token}


@router.post("/google")
async def google_auth(payload: GoogleAuthRequest):
    db_user = await users_collection.find_one({"email": payload.email})

    if not db_user:
        await users_collection.insert_one({
            "name": payload.name,
            "email": payload.email,
            "google_uid": payload.uid,
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
                        "is_verified": True,
                    }
                },
            )

    token = create_token({"email": payload.email})
    return {"access_token": token, "message": "Google login successful"}


@router.get("/me")
async def get_me(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        email = payload.get("email")

        user = await users_collection.find_one(
            {"email": email},
            {"_id": 0, "password": 0},
        )

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return user

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")