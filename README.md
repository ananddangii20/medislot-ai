# 🏥 MediSlot AI

### Smart Healthcare Appointment System with AI

🚀 **MediSlot AI** is a modern, AI-powered healthcare platform that allows patients to seamlessly book doctor appointments while enabling doctors to manage their availability efficiently.

It also includes a **basic AI symptom checker** to assist users before consulting a doctor.

---

## 🎯 Project Overview

This platform simplifies the healthcare booking experience by providing:

* 🧑‍⚕️ Easy doctor discovery & booking
* 📅 Real-time appointment scheduling
* 🤖 AI-powered symptom suggestions (non-diagnostic)
* 📊 Separate dashboards for doctors & patients

---

## ✨ Key Features

### 👤 Patient Features

* Signup / Login authentication
* Search doctors by specialization
* View doctor profiles
* Book appointments
* View booking history

---

### 👨‍⚕️ Doctor Features

* Secure login
* Set availability (time slots)
* Accept / Reject appointments
* Manage appointments via dashboard

---

### 🤖 AI Symptom Checker

* Users input symptoms (text)
* AI suggests possible conditions
* Provides basic guidance

⚠️ **Disclaimer:**

> This is not medical advice. Please consult a qualified doctor.

---

## 🎨 Frontend Highlights

* 🔴 Premium Red & White Theme
* ⚡ Smooth animations (Framer Motion)
* 🧊 Glassmorphism + soft shadows
* 📱 Fully responsive design
* ✨ Micro-interactions & transitions
* ⏳ Skeleton loading states

---

## 🧩 Pages

* Splash Screen
* Home Page
* Doctor Listing
* Doctor Profile
* Booking Page
* Login / Register
* Patient Dashboard
* Doctor Dashboard
* AI Symptom Checker

---

## 🏗️ System Architecture

Frontend (React + Vercel)
⬇️
Backend (FastAPI - Python)
⬇️
Database (MongoDB Atlas)
⬇️
AI API (Gemini / OpenAI)

---

## ⚙️ Tech Stack

### 🌐 Frontend

* React.js
* Tailwind CSS
* Framer Motion

### ⚙️ Backend

* FastAPI (Python)
* Pydantic (data validation)
* Uvicorn (ASGI server)

### 🗄️ Database

* MongoDB Atlas

### 🤖 AI Integration

* Gemini API / OpenAI API

### ☁️ Deployment

* Vercel (Frontend)
* Render (Backend)

---

## 📦 Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/medislot-ai.git
cd medislot-ai
```

---

## 🧠 Backend Setup (FastAPI)

### 2️⃣ Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Run FastAPI Server

```bash
uvicorn main:app --reload
```

👉 Server runs on: `http://127.0.0.1:8000`

---

## 🌐 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create `.env` file in backend:

```env
MONGO_URI=your_mongodb_uri
SECRET_KEY=your_secret_key
AI_API_KEY=your_api_key
```

---

## 📡 API Overview

### Auth Routes

* `POST /signup`
* `POST /login`

### Doctor Routes

* `GET /doctors`
* `GET /doctor/{id}`

### Appointment Routes

* `POST /appointments`
* `GET /appointments/{user_id}`

### AI Route

* `POST /ai/symptoms`

---

## 🚀 Deployment

* Backend deployed on **Render (FastAPI)**
* Frontend deployed on **Vercel**
* MongoDB Atlas used for cloud database

---

## 🧠 Future Enhancements

* ⭐ Doctor ratings & reviews
* 📅 Advanced calendar UI
* 🔔 Email/SMS notifications
* 💬 Chat with doctor
* 📱 Mobile app

---

## 🏆 Hackathon Value

* Real-world healthcare solution
* AI integration
* Clean UI/UX + animations
* Scalable backend with FastAPI

---

## 👨‍💻 Author

**Anand Dangi**
**Mahika Chaurasiya**
**kalp Doshi**
**Gautam Gupta**


---

## 📄 License

MIT License

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
