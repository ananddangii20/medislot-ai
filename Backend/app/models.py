from pydantic import BaseModel, EmailStr

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class VerifyEmail(BaseModel):
    email: EmailStr
    otp: str