# 🏥 MediScan AI — Multi-Disease Risk Predictor

![MediScan AI](https://img.shields.io/badge/MediScan-AI-00ff95?style=for-the-badge&logo=react&logoColor=black)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)

> An AI-powered early disease risk detection web application built with React, FastAPI, and scikit-learn. Users can register, log in, and get instant risk predictions for Diabetes, Heart Disease, and Parkinson's Disease using trained ML models.

🌐 **Live App:** [mediscan-frontend-ruby.vercel.app](https://mediscan-frontend-ruby.vercel.app)
🔧 **Backend API:** [mediscan-backend-lmhf.onrender.com](https://mediscan-backend-lmhf.onrender.com)

---

## 🎯 What Does This App Do?

MediScan AI allows anyone to:
- Create a secure account and log in
- Input personal health vitals and biomarkers
- Get an instant AI-powered risk assessment for 3 diseases
- Receive personalised health recommendations based on their result

This is a full stack data science application — not just a notebook or a Streamlit demo. It has real authentication, a REST API backend, trained ML models, and is fully deployed on the internet.

---

## 🚀 Features

- 🔐 **Real Authentication** — Supabase-powered signup/login with protected routes
- 🩸 **Diabetes Predictor** — Random Forest trained on Pima Indians Diabetes Dataset
- 🫀 **Heart Disease Predictor** — Gradient Boosting trained on Cleveland Heart Disease Dataset
- 🫁 **Parkinson's Predictor** — Gradient Boosting trained on UCI Parkinson's Voice Dataset
- 📊 **Risk Probability Bar** — Visual indicator showing exact risk percentage
- 💡 **Health Recommendations** — Personalised tips based on prediction result
- 🌐 **Fully Deployed** — Live on Vercel (frontend) + Render (backend)
- 🎨 **Terminal Dark UI** — Bloomberg/medical terminal aesthetic

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | CSS-in-JS (inline styles) |
| Authentication | Supabase Auth |
| Database | Supabase PostgreSQL |
| Backend | FastAPI (Python) |
| ML Models | scikit-learn (Random Forest, Gradient Boosting) |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## 🧠 ML Models & Accuracy

| Disease | Algorithm | Dataset | Accuracy |
|---|---|---|---|
| 🩸 Diabetes | Random Forest | Pima Indians Diabetes (768 rows) | ~73% |
| 🫀 Heart Disease | Gradient Boosting | Cleveland Heart Disease (1025 rows) | ~93% |
| 🫁 Parkinson's | Gradient Boosting | UCI Parkinson's Voice (195 rows) | ~95% |

---

## 📁 Project Structure
mediscan-frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx          ← Login page
│   │   ├── Register.jsx       ← Register page
│   │   └── Dashboard.jsx      ← Main predictor dashboard
│   ├── components/
│   │   └── ProtectedRoute.jsx ← Auth guard component
│   ├── supabase.js            ← Supabase client config
│   └── App.jsx                ← Router setup
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
/dashboard (ML Predictor)

New users can register at `/register` — credentials are stored securely in Supabase.

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

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/predict/diabetes` | Diabetes risk prediction |
| POST | `/predict/heart` | Heart disease risk prediction |
| POST | `/predict/parkinsons` | Parkinson's risk prediction |

---

## 👨‍💻 About the Developer

**Rishit Pandya**
Master of Data Science Student @ University of Adelaide, South Australia 🇦🇺

[![GitHub](https://img.shields.io/badge/GitHub-RishitPandya22-181717?style=for-the-badge&logo=github)](https://github.com/RishitPandya22)

---

## ⚠️ Disclaimer

This application is built for **educational and portfolio purposes only**. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical decisions.

---

*Built with 🔥 by Rishit Pandya — M.Data Science @ University of Adelaide*