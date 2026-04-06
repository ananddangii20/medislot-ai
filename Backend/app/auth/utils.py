from passlib.context import CryptContext
from jose import jwt
import os
from datetime import datetime, timedelta

# Use PBKDF2 to avoid bcrypt backend/version issues in local setups.
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

SECRET = os.getenv("JWT_SECRET")

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(password, hashed):
    return pwd_context.verify(password, hashed)

def create_token(data: dict):
    data.update({"exp": datetime.utcnow() + timedelta(hours=2)})
    return jwt.encode(data, SECRET, algorithm="HS256")