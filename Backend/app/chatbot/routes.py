from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.chatbot.service import call_grok

router = APIRouter()


# 🔹 Message model for chat history
class Message(BaseModel):
    role: str   # "user" or "assistant"
    content: str


# 🔹 Request model
class ChatRequest(BaseModel):
    message: str
    role: str            # "patient" or "doctor"
    history: List[Message] = []


# 🧠 PATIENT PROMPT (Symptom Checker)
PATIENT_PROMPT = """
You are a friendly, caring doctor chatting with a patient.

Speak like a real human doctor, not like an AI.

Guidelines:
- Talk in a natural, casual, and warm tone
- Keep it simple and easy to understand
- Avoid any robotic or structured format
- No numbering, no headings
- Respond like you're talking face-to-face

Behavior:
- First react to what the patient said
- Then gently ask 1–2 follow-up questions if needed
- Give simple advice in a conversational way
- Suggest doctor/specialist naturally (not as a list)
- Do NOT give final diagnosis

Tone examples:
- "Hmm, that sounds like a common cold."
- "Have you noticed any fever or body aches along with it?"
- "It might just be something mild, but let's be sure."

Keep responses short, friendly, and human-like.
"""

DOCTOR_PROMPT = """
You are a clinical assistant helping a doctor.

- Speak like a real medical colleague
- Be concise and professional
- No robotic formatting
- Give suggestions naturally
"""


def build_fallback_response(user_input: str) -> str:
    user_input = user_input.lower()
    if any(k in user_input for k in ["fever", "headache", "cold", "body ache"]):
        return """
1. Possible Causes: Viral fever, seasonal flu, or common cold.
2. Recommended Specialist: General Physician
3. Urgency: Medium
4. Advice: Stay hydrated, rest, and monitor your temperature. If symptoms persist for more than 3 days, consult a doctor.
"""
    elif any(k in user_input for k in ["chest pain", "breathless", "heart"]):
        return """
1. Possible Causes: Cardiac issues, respiratory infection, or severe anxiety.
2. Recommended Specialist: Cardiologist / ER
3. Urgency: High
4. Advice: Please seek immediate medical attention or visit the nearest emergency room.
"""
    elif any(k in user_input for k in ["stomach", "pain", "digestion"]):
        return """
1. Possible Causes: Indigestion, gastritis, or food poisoning.
2. Recommended Specialist: Gastroenterologist
3. Urgency: Medium
4. Advice: Avoid spicy food, drink plenty of water, and consider a light diet.
"""
    else:
        return """
1. Possible Causes: General symptoms requiring clinical evaluation.
2. Recommended Specialist: General Physician
3. Urgency: Low
4. Advice: Please provide more details or visit a general physician for a physical examination.
"""


# 🚀 MAIN CHAT API
@router.post("/chat")
def chat(req: ChatRequest):

    # 🔴 Handle garbage / too short input
    if len(req.message.strip()) < 5:
        return {"response": "Please describe your symptoms clearly."}

    # 🔹 Choose prompt
    system_prompt = PATIENT_PROMPT if req.role == "patient" else DOCTOR_PROMPT

    # 🔹 Build messages
    messages = [
        {"role": "system", "content": system_prompt}
    ]

    # 🔹 Add last few history messages (limit to avoid overload)
    for msg in req.history[-6:]:
        messages.append({
            "role": msg.role,
            "content": msg.content
        })

    # 🔹 Add current user message
    messages.append({
        "role": "user",
        "content": req.message
    })

    # 🔹 Call Grok AI with Fallback logic
    try:
        reply = call_grok(messages)
    except HTTPException as e:
        # If AI fails (e.g. 502/503), use local fallback
        if e.status_code in [502, 503, 500]:
            reply = build_fallback_response(req.message)
        else:
            raise e
    except Exception:
        reply = build_fallback_response(req.message)

    return {"response": reply}