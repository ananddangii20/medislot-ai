# MediSlot 

MediSlot is a healthcare appointment platform for Indian patients and doctors. It combines doctor discovery, appointment booking, doctor approvals, payment handling, and a symptom checker that suggests the right specialist and next steps.

## What this project does

- Patients can browse doctors, view profiles, and request appointments.
- Doctors can manage their own dashboard, update profile details, set consultation fees, and accept or reject requests.
- After a doctor accepts an appointment, the patient can complete a mock payment flow from the dashboard.
- The symptom checker gives simple medical suggestions, possible specialist recommendations, and basic self-care guidance.

## Main features

### Patient portal

- Sign up, log in, and manage profile details.
- Browse doctors with location, clinic/hospital, fee, and profile photo.
- Request an appointment with a preferred doctor and time slot.
- See appointment status: pending, accepted, rejected, and paid.
- Pay accepted appointments through a realistic checkout flow.

### Doctor portal

- Dashboard-based experience focused on the tasks doctors actually need.
- Update profile name, photo, specialization, experience, location, clinic/hospital, and bio.
- Set consultation fee in INR.
- Review incoming appointment requests and accept or reject them.
- Track paid and pending appointments.

### Symptom checker

- Enter symptoms in natural language.
- Get a conversational response from the AI assistant.
- See suggested questions, likely specialist type, home-care guidance, and warning signs.

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Framer Motion
- Backend: FastAPI, Python, Pydantic, Uvicorn
- Database: MongoDB
- AI: Groq-powered chat service

## Project structure

```text
medislot-ai/
├── Backend/
│   ├── app/
│   │   ├── auth/
│   │   ├── chatbot/
│   │   ├── db.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── api.ts
```

## Running the project locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd medislot-ai
```

### 2. Backend setup

Create and activate a virtual environment:

```bash
python -m venv .venv
.venv\Scripts\activate
```

Install backend dependencies. If you do not already have a requirements file, install the main packages manually:

```bash
pip install fastapi uvicorn motor python-dotenv python-jose[cryptography] passlib[bcrypt] groq python-multipart
```

Run the backend:

```bash
cd Backend
uvicorn app.main:app --reload
```

The backend usually runs at:

```text
http://127.0.0.1:8000
```

### 3. Frontend setup

Install dependencies and start the dev server:

```bash
cd Frontend
npm install
npm run dev
```

The frontend usually runs at:

```text
http://127.0.0.1:5173
```

## Environment variables

Create a `.env` file inside `Backend/` with the values your backend needs.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

If you use email OTP login, also add the sender credentials required by the backend.

## Important routes in the app

- `/home` - landing page
- `/doctors` - doctor listing
- `/doctor/:id` - doctor profile
- `/booking/:id` - appointment booking
- `/patient-dashboard` - patient portal
- `/doctor-dashboard` - doctor portal
- `/symptom-checker` - AI symptom checker

## Notes

- Doctor images are uploaded from file input and served from the backend uploads folder.
- The payment flow is a realistic mock checkout, not a live payment gateway.
- The symptom checker is for guidance only and should not be treated as a diagnosis.

## Current status

This project is actively evolving. The core patient and doctor workflows are already wired, and the UI has been tuned for mobile and desktop use.

## License

MIT
