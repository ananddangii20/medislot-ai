from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth.routes import router as auth_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:8081",
        "http://127.0.0.1:8081",
        "http://localhost:8082",
        "http://127.0.0.1:8082",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")

@app.get("/")
def home():
    return {"message": "MediSlot AI Backend Running"}