from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.auth.routes import router as auth_router
from app.chatbot.routes import router as chatbot_router
 
# ✅ ADD THIS
 

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parents[1]
UPLOADS_DIR = BASE_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
 

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://medislott.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")

# ✅ ADD THIS
app.include_router(chatbot_router)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

@app.get("/")
def home():
    return {"message": "MediSlot AI Backend Running"}

