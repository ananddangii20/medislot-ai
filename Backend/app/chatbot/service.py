from groq import Groq
import os
from dotenv import load_dotenv
from fastapi import HTTPException
from pathlib import Path
import random

# load env
BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# init client (lazy initialization to handle missing key environment)
def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None
    return Groq(api_key=api_key)


def call_grok(messages):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Groq API key not found in environment.")

    try:
        client = get_groq_client()
        if not client:
            raise HTTPException(status_code=500, detail="Failed to initialize Groq client.")

        completion = client.chat.completions.create(
            model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
            messages=messages,
            temperature=round(random.uniform(0.4, 0.7), 2),
            max_tokens=500
        )

        return completion.choices[0].message.content

    except Exception as e:
        # Raise as 502 so routes.py can catch and trigger fallback
        raise HTTPException(status_code=502, detail=f"Groq API error: {str(e)}")