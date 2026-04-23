# 🏥 MediScan AI — Multi-Disease Risk Predictor v2.0

![MediScan AI](https://img.shields.io/badge/MediScan-AI_v2.0-00ff95?style=for-the-badge&logo=react&logoColor=black)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-FF0055?style=for-the-badge&logo=framer&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth_+_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)

> A full stack AI-powered early disease risk detection web application. Built with React, FastAPI, scikit-learn, and Supabase. Features real authentication, 3 trained ML models, feature importance analysis, what-if simulation, prediction history, and a Cyber-Brutalism dark UI with Framer Motion animations.

🌐 **Live App:** [mediscan-frontend-ruby.vercel.app](https://mediscan-frontend-ruby.vercel.app)
🔧 **Backend API:** [mediscan-backend-lmhf.onrender.com](https://mediscan-backend-lmhf.onrender.com)

---

## 🎯 What Does This App Do?

MediScan AI allows anyone to:
- Create a secure account and log in with protected routes
- Input personal health vitals and biomarkers via interactive sliders
- Get an instant AI-powered risk assessment for 3 diseases
- See which health factors are driving the risk (feature importance)
- Simulate "what-if" scenarios — what happens if you improve your health metrics
- View their full prediction history saved to the cloud
- Receive personalised health recommendations based on results

---

## 🚀 Features

### 🔐 Authentication
- Supabase-powered signup & login
- Protected routes — dashboard inaccessible without login
- Username + full name stored in Supabase profiles table
- Session persistence across page refreshes

### 🧠 AI Predictions
- 🩸 **Diabetes Predictor** — Random Forest trained on Pima Indians Dataset
- 🫀 **Heart Disease Predictor** — Gradient Boosting on Cleveland Dataset
- 🫁 **Parkinson's Predictor** — Gradient Boosting on UCI Voice Dataset

### 📊 Advanced Analytics
- **Feature Importance** — See exactly which inputs drove the prediction
- **What-If Simulator** — Simulate health improvements and see risk change
- **Animated Probability Bar** — Liquid fill animation showing exact risk %
- **Animated Number Counter** — Risk probability counts up dramatically

### 📋 Prediction History
- Every prediction saved to Supabase database
- View last 10 predictions in collapsible history panel
- Disease type, risk level, probability, and date all stored

### 🎨 UI/UX
- Cyber-Brutalism dark terminal aesthetic
- Framer Motion page transitions and micro-animations
- Custom animated cursor with follower
- Magnetic buttons that follow cursor movement
- Glitch effect on logo
- Floating animated orbs
- Animated mesh gradient background
- CRT scanline overlay
- Glassmorphic cards with heavy backdrop blur
- Fully responsive layout

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Animations | Framer Motion |
| Authentication | Supabase Auth |
| Database | Supabase PostgreSQL |
| Backend | FastAPI (Python) |
| ML Models | scikit-learn |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## 🧠 ML Models & Accuracy

| Disease | Algorithm | Dataset | Accuracy |
|---|---|---|---|
| 🩸 Diabetes | Random Forest (100 trees) | Pima Indians (768 rows) | ~73% |
| 🫀 Heart Disease | Gradient Boosting (100 trees) | Cleveland (1025 rows) | ~93% |
| 🫁 Parkinson's | Gradient Boosting (100 trees) | UCI Voice (195 rows) | ~95% |

---

## 📁 Project Structure
mediscan-frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx           ← Animated login with magnetic button
│   │   ├── Register.jsx        ← Registration with validation
│   │   └── Dashboard.jsx       ← Main predictor + history + what-if
│   ├── components/
│   │   └── ProtectedRoute.jsx  ← Auth guard component
│   ├── supabase.js             ← Supabase client config
│   ├── App.jsx                 ← Router setup
│   └── index.css               ← Global styles + animations
├── public/
├── index.html
└── package.json

---

## 🔐 Authentication Flow
User visits app
↓
/login page
↓
Sign in with Supabase Auth
↓
ProtectedRoute checks session
↓
/dashboard
├── Run predictions
├── View feature importance
├── Simulate what-if scenarios
└── View prediction history

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/predict/diabetes` | Diabetes prediction + feature importance |
| POST | `/predict/heart` | Heart disease prediction + feature importance |
| POST | `/predict/parkinsons` | Parkinson's prediction + feature importance |
| POST | `/whatif/diabetes` | Diabetes what-if simulation |
| POST | `/whatif/heart` | Heart disease what-if simulation |
| POST | `/whatif/parkinsons` | Parkinson's what-if simulation |

---

## 🏃 Run Locally

### Frontend
```bash
git clone https://github.com/RishitPandya22/mediscan-frontend
cd mediscan-frontend
npm install
npm run dev
```

### Backend
```bash
git clone https://github.com/RishitPandya22/mediscan-backend
cd mediscan-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 💼 Interview Talking Points

> *"I built a full stack AI web application using React and FastAPI that predicts risk for 3 diseases. It features real Supabase authentication, 3 scikit-learn ML models served via REST API, feature importance analysis, what-if health simulations, prediction history stored in PostgreSQL, and a Cyber-Brutalism UI with Framer Motion animations. Fully deployed on Vercel and Render."*

---

## 👨‍💻 About the Developer

**Rishit Pandya**
Master of Data Science Student @ University of Adelaide, South Australia 🇦🇺

[![GitHub](https://img.shields.io/badge/GitHub-RishitPandya22-181717?style=for-the-badge&logo=github)](https://github.com/RishitPandya22)

---

## ⚠️ Disclaimer

This application is built for **educational and portfolio purposes only**. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.

---

*Built with 🔥 by Rishit Pandya — M.Data Science @ University of Adelaide*