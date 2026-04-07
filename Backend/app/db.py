from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env from backend root so env vars are found even when server is started from another folder.
BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")

client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client["medislot"]
users_collection = db["users"]
appointments_collection = db["appointments"]