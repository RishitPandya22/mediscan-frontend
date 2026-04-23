# 🏥 MediScan AI — Multi-Disease Risk Predictor v3.0

![MediScan AI](https://img.shields.io/badge/MediScan-AI_v3.0-00ff95?style=for-the-badge&logo=react&logoColor=black)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-FF0055?style=for-the-badge&logo=framer&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth_+_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)

> A production-grade full stack AI web application for early disease risk detection. Built with React, FastAPI, scikit-learn, and Supabase. Features real Google OAuth authentication, 3 trained ML models, confidence intervals, feature importance, what-if simulation, risk trend charts, prediction history, PDF export, user profiles with avatar upload, and a Cyber-Brutalism dark UI with Framer Motion animations.

🌐 **Live App:** [mediscan-frontend-ruby.vercel.app](https://mediscan-frontend-ruby.vercel.app)
🔧 **Backend API:** [mediscan-backend-lmhf.onrender.com](https://mediscan-backend-lmhf.onrender.com)
📖 **API Docs:** [mediscan-backend-lmhf.onrender.com/docs](https://mediscan-backend-lmhf.onrender.com/docs)

---

## 🎯 What Does This App Do?

MediScan AI allows anyone to:
- Sign up or log in with **Google OAuth** or email/password
- Reset their password via email if forgotten
- Input personal health vitals via interactive sliders
- Get instant AI-powered risk predictions for 3 diseases
- See a **95% confidence interval** showing model certainty
- Understand **which health factors** drove the prediction (feature importance)
- Simulate **"what-if" health improvements** and see risk change live
- View their **risk trend chart** — a line graph of all past predictions over time
- Download a professional **PDF medical report** of their results
- Manage their **user profile** — edit name, username, upload avatar

---

## 🚀 Features

### 🔐 Authentication
- Google OAuth — one click sign in with Google
- Email + Password signup and login
- Forgot password — real reset email via Supabase
- Protected routes — dashboard inaccessible without login
- Username + full name + avatar stored in Supabase profiles table

### 🧠 AI Predictions
- 🩸 **Diabetes Predictor** — Random Forest trained on Pima Indians Dataset (~73% accuracy)
- 🫀 **Heart Disease Predictor** — Gradient Boosting on Cleveland Dataset (~93% accuracy)
- 🫁 **Parkinson's Predictor** — Gradient Boosting on UCI Voice Dataset (~95% accuracy)

### 📊 Advanced Analytics
- **Confidence Intervals** — 95% CI showing lower and upper probability bounds
- **Feature Importance** — Top 5 factors that drove the prediction with animated bars
- **What-If Simulator** — Simulate health improvements and see projected risk change
- **Animated Probability Bar** — Liquid fill animation showing exact risk percentage
- **Animated Number Counter** — Risk probability counts up dramatically on reveal

### 📋 Prediction History & Trends
- Every prediction saved to Supabase PostgreSQL database
- Collapsible history panel showing last 10 predictions
- **Risk Trend Chart** — interactive line graph (Recharts) showing risk over time
- Filter chart by disease type — Diabetes, Heart, or Parkinson's

### 📄 PDF Report Export
- Download a full medical-style PDF report
- Includes risk result, probability, confidence interval, feature importance, what-if scenarios, and health tips
- Auto-named with disease type and date

### 👤 User Profile
- Edit full name and username
- Upload profile avatar (photo)
- View personal prediction stats (total, high risk, low risk)
- Danger zone — sign out of all sessions

### 🎨 UI/UX
- Cyber-Brutalism dark terminal aesthetic
- Framer Motion page transitions and micro-animations
- Custom animated cursor with follower ring
- Magnetic buttons that follow cursor movement
- Glitch effect on logo
- Floating animated orbs
- Animated mesh gradient background
- CRT scanline overlay
- Glassmorphic cards with heavy backdrop blur

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Animations | Framer Motion |
| Charts | Recharts |
| Authentication | Supabase Auth (Email + Google OAuth) |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage (avatar uploads) |
| Backend | FastAPI (Python) |
| ML Models | scikit-learn (Random Forest + Gradient Boosting) |
| PDF Generation | ReportLab |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## 🧠 ML Models & Accuracy

| Disease | Algorithm | Dataset | Accuracy |
|---|---|---|---|
| 🩸 Diabetes | Random Forest (100 trees) | Pima Indians (768 rows) | ~73% |
| 🫀 Heart Disease | Gradient Boosting (100 trees) | Cleveland (1025 rows) | ~93% |
| 🫁 Parkinson's | Gradient Boosting (100 trees) | UCI Voice (195 rows) | ~95% |

All models return:
- Risk prediction (HIGH/LOW)
- Probability score (0-100%)
- 95% Confidence interval (lower/upper bounds)
- Top 5 feature importances

---

## 📁 Project Structure
mediscan-frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx             ← Google OAuth + email login
│   │   ├── Register.jsx          ← Account creation
│   │   ├── ForgotPassword.jsx    ← Password reset flow
│   │   ├── Dashboard.jsx         ← Main predictor + all analytics
│   │   └── Profile.jsx           ← User profile + trend chart
│   ├── components/
│   │   └── ProtectedRoute.jsx    ← Auth guard
│   ├── supabase.js               ← Supabase client
│   ├── App.jsx                   ← Router
│   └── index.css                 ← Global styles + animations
├── public/
├── index.html
└── package.json

---

## 🔐 Authentication Flow
User visits app
↓
/login page
├── Google OAuth (one click)
└── Email + Password
↓
ProtectedRoute checks session
↓
/dashboard
├── Run AI predictions
├── View confidence intervals
├── See feature importance
├── Simulate what-if scenarios
├── Download PDF report
└── View prediction history
↓
/profile
├── Edit name + username
├── Upload avatar
├── View stats
└── View risk trend chart

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/predict/diabetes` | Diabetes prediction + CI + features |
| POST | `/predict/heart` | Heart disease prediction + CI + features |
| POST | `/predict/parkinsons` | Parkinson's prediction + CI + features |
| POST | `/whatif/diabetes` | Diabetes what-if simulation |
| POST | `/whatif/heart` | Heart disease what-if simulation |
| POST | `/whatif/parkinsons` | Parkinson's what-if simulation |
| POST | `/generate-report` | PDF report generation |

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

> *"I built a production-grade full stack AI web app with React, FastAPI, and Supabase. It has Google OAuth authentication, 3 scikit-learn ML models with 95% confidence intervals and feature importance analysis, what-if health simulations, a risk trend chart using Recharts, PDF report export using ReportLab, user profiles with avatar upload to Supabase Storage, and a Cyber-Brutalism UI with Framer Motion animations. Fully deployed on Vercel and Render."*

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