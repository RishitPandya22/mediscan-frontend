import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import axios from 'axios'

const API = "https://mediscan-backend-lmhf.onrender.com"

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('diabetes')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  // Diabetes form state
  const [diabetes, setDiabetes] = useState({
    pregnancies: 1, glucose: 110, blood_pressure: 70,
    skin_thickness: 20, insulin: 80, bmi: 25,
    diabetes_pedigree: 0.5, age: 30
  })

  // Heart form state
  const [heart, setHeart] = useState({
    age: 45, sex: 1, cp: 0, trestbps: 120, chol: 200,
    fbs: 0, restecg: 0, thalach: 150, exang: 0,
    oldpeak: 1.0, slope: 0, ca: 0, thal: 0
  })

  // Parkinsons form state
  const [park, setPark] = useState({
    fo: 150, fhi: 200, flo: 100, jitter_pct: 0.005,
    jitter_abs: 0.00003, rap: 0.003, ppq: 0.003, ddp: 0.009,
    shimmer: 0.03, shimmer_db: 0.3, apq3: 0.015, apq5: 0.02,
    apq: 0.025, dda: 0.045, nhr: 0.025, hnr: 22,
    rpde: 0.45, dfa: 0.72, spread1: -5.5, spread2: 0.2,
    d2: 2.3, ppe: 0.2
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handlePredict = async () => {
    setLoading(true)
    setResult(null)
    try {
      let response
      if (activeTab === 'diabetes') {
        response = await axios.post(`${API}/predict/diabetes`, diabetes)
      } else if (activeTab === 'heart') {
        response = await axios.post(`${API}/predict/heart`, heart)
      } else {
        response = await axios.post(`${API}/predict/parkinsons`, park)
      }
      setResult(response.data)
    } catch (err) {
      setResult({ error: 'Could not connect to backend. Make sure it is running!' })
    }
    setLoading(false)
  }

  const updateField = (setter, field, value) => {
    setter(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const tabs = [
    { id: 'diabetes', label: '🩸 DIABETES', color: '#00ff95' },
    { id: 'heart', label: '🫀 HEART', color: '#ff6b6b' },
    { id: 'parkinsons', label: '🫁 PARKINSONS', color: '#00b4ff' },
  ]

  const activeColor = tabs.find(t => t.id === activeTab)?.color || '#00ff95'

  return (
    <div style={styles.container}>
      <div style={styles.grid} />

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.navLogo}>⚕ MEDISCAN AI</div>
        <div style={styles.navCenter}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResult(null) }}
              style={{
                ...styles.navTab,
                color: activeTab === tab.id ? tab.color : '#8b949e',
                borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={styles.navRight}>
          <span style={styles.navUser}>
            👤 {user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'}
          </span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            LOGOUT
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div style={styles.content}>

        {/* PAGE TITLE */}
        <div style={styles.pageTitle}>
          <h1 style={{ ...styles.titleText, color: activeColor }}>
            {activeTab === 'diabetes' && '🩸 Diabetes Risk Assessment'}
            {activeTab === 'heart' && '🫀 Heart Disease Risk Assessment'}
            {activeTab === 'parkinsons' && '🫁 Parkinson\'s Risk Assessment'}
          </h1>
          <p style={styles.titleSub}>
            {activeTab === 'diabetes' && 'Enter patient vitals to predict diabetes risk'}
            {activeTab === 'heart' && 'Enter cardiovascular indicators to assess heart disease risk'}
            {activeTab === 'parkinsons' && 'Enter voice biomarkers to detect Parkinson\'s risk'}
          </p>
        </div>

        <div style={styles.mainGrid}>
          {/* FORM PANEL */}
          <div style={styles.formPanel}>

            {/* DIABETES FORM */}
            {activeTab === 'diabetes' && (
              <div style={styles.formGrid}>
                {[
                  { label: 'Pregnancies', key: 'pregnancies', min: 0, max: 20, step: 1 },
                  { label: 'Glucose (mg/dL)', key: 'glucose', min: 0, max: 200, step: 1 },
                  { label: 'Blood Pressure (mmHg)', key: 'blood_pressure', min: 0, max: 130, step: 1 },
                  { label: 'Skin Thickness (mm)', key: 'skin_thickness', min: 0, max: 100, step: 1 },
                  { label: 'Insulin (μU/mL)', key: 'insulin', min: 0, max: 900, step: 1 },
                  { label: 'BMI', key: 'bmi', min: 0, max: 70, step: 0.1 },
                  { label: 'Diabetes Pedigree', key: 'diabetes_pedigree', min: 0, max: 2.5, step: 0.01 },
                  { label: 'Age', key: 'age', min: 1, max: 120, step: 1 },
                ].map(field => (
                  <FormField key={field.key} field={field} value={diabetes[field.key]}
                    color={activeColor} onChange={(v) => updateField(setDiabetes, field.key, v)} />
                ))}
              </div>
            )}

            {/* HEART FORM */}
            {activeTab === 'heart' && (
              <div style={styles.formGrid}>
                {[
                  { label: 'Age', key: 'age', min: 1, max: 120, step: 1 },
                  { label: 'Sex (0=F, 1=M)', key: 'sex', min: 0, max: 1, step: 1 },
                  { label: 'Chest Pain Type (0-3)', key: 'cp', min: 0, max: 3, step: 1 },
                  { label: 'Resting BP (mmHg)', key: 'trestbps', min: 80, max: 200, step: 1 },
                  { label: 'Cholesterol (mg/dL)', key: 'chol', min: 100, max: 600, step: 1 },
                  { label: 'Fasting Blood Sugar >120 (0/1)', key: 'fbs', min: 0, max: 1, step: 1 },
                  { label: 'Resting ECG (0-2)', key: 'restecg', min: 0, max: 2, step: 1 },
                  { label: 'Max Heart Rate', key: 'thalach', min: 60, max: 220, step: 1 },
                  { label: 'Exercise Angina (0/1)', key: 'exang', min: 0, max: 1, step: 1 },
                  { label: 'ST Depression', key: 'oldpeak', min: 0, max: 6, step: 0.1 },
                  { label: 'Slope (0-2)', key: 'slope', min: 0, max: 2, step: 1 },
                  { label: 'Major Vessels (0-4)', key: 'ca', min: 0, max: 4, step: 1 },
                  { label: 'Thalassemia (0-3)', key: 'thal', min: 0, max: 3, step: 1 },
                ].map(field => (
                  <FormField key={field.key} field={field} value={heart[field.key]}
                    color={activeColor} onChange={(v) => updateField(setHeart, field.key, v)} />
                ))}
              </div>
            )}

            {/* PARKINSONS FORM */}
            {activeTab === 'parkinsons' && (
              <div style={styles.formGrid}>
                {[
                  { label: 'MDVP:Fo(Hz)', key: 'fo', min: 80, max: 270, step: 0.1 },
                  { label: 'MDVP:Fhi(Hz)', key: 'fhi', min: 100, max: 600, step: 0.1 },
                  { label: 'MDVP:Flo(Hz)', key: 'flo', min: 60, max: 240, step: 0.1 },
                  { label: 'Jitter(%)', key: 'jitter_pct', min: 0, max: 1, step: 0.001 },
                  { label: 'Jitter(Abs)', key: 'jitter_abs', min: 0, max: 0.0001, step: 0.000001 },
                  { label: 'RAP', key: 'rap', min: 0, max: 0.02, step: 0.0001 },
                  { label: 'PPQ', key: 'ppq', min: 0, max: 0.02, step: 0.0001 },
                  { label: 'DDP', key: 'ddp', min: 0, max: 0.06, step: 0.001 },
                  { label: 'Shimmer', key: 'shimmer', min: 0, max: 0.2, step: 0.001 },
                  { label: 'Shimmer(dB)', key: 'shimmer_db', min: 0, max: 2, step: 0.01 },
                  { label: 'APQ3', key: 'apq3', min: 0, max: 0.1, step: 0.001 },
                  { label: 'APQ5', key: 'apq5', min: 0, max: 0.15, step: 0.001 },
                  { label: 'APQ', key: 'apq', min: 0, max: 0.15, step: 0.001 },
                  { label: 'DDA', key: 'dda', min: 0, max: 0.3, step: 0.001 },
                  { label: 'NHR', key: 'nhr', min: 0, max: 0.35, step: 0.001 },
                  { label: 'HNR', key: 'hnr', min: 5, max: 40, step: 0.1 },
                  { label: 'RPDE', key: 'rpde', min: 0.2, max: 0.7, step: 0.001 },
                  { label: 'DFA', key: 'dfa', min: 0.5, max: 0.9, step: 0.001 },
                  { label: 'Spread1', key: 'spread1', min: -8, max: -2, step: 0.01 },
                  { label: 'Spread2', key: 'spread2', min: 0, max: 0.5, step: 0.001 },
                  { label: 'D2', key: 'd2', min: 1.5, max: 4, step: 0.01 },
                  { label: 'PPE', key: 'ppe', min: 0, max: 0.5, step: 0.001 },
                ].map(field => (
                  <FormField key={field.key} field={field} value={park[field.key]}
                    color={activeColor} onChange={(v) => updateField(setPark, field.key, v)} />
                ))}
              </div>
            )}

            {/* PREDICT BUTTON */}
            <button
              onClick={handlePredict}
              disabled={loading}
              style={{
                ...styles.predictBtn,
                background: `linear-gradient(90deg, ${activeColor}, #00b4ff)`,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '⟳ ANALYSING...' : '🔍 ANALYSE RISK'}
            </button>
          </div>

          {/* RESULT PANEL */}
          <div style={styles.resultPanel}>
            <p style={{ ...styles.sectionLabel, color: activeColor }}>◈ ANALYSIS RESULT</p>

            {!result && !loading && (
              <div style={styles.emptyResult}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                  {activeTab === 'diabetes' ? '🩸' : activeTab === 'heart' ? '🫀' : '🫁'}
                </div>
                <p style={styles.emptyText}>Fill in the form and click</p>
                <p style={{ ...styles.emptyText, color: activeColor }}>ANALYSE RISK</p>
                <p style={styles.emptyText}>to get your prediction</p>
              </div>
            )}

            {loading && (
              <div style={styles.emptyResult}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⟳</div>
                <p style={{ ...styles.emptyText, color: activeColor }}>RUNNING AI MODEL...</p>
              </div>
            )}

            {result && !result.error && (
              <div>
                {/* Risk Badge */}
                <div style={{
                  ...styles.riskBadge,
                  background: result.risk === 'HIGH' ? '#2d0d0d' : '#0d2818',
                  border: `2px solid ${result.risk === 'HIGH' ? '#ff4444' : '#00ff95'}`,
                }}>
                  <p style={{
                    ...styles.riskTitle,
                    color: result.risk === 'HIGH' ? '#ff4444' : '#00ff95'
                  }}>
                    {result.risk === 'HIGH' ? '⚠ HIGH RISK' : '✅ LOW RISK'}
                  </p>
                  <p style={styles.riskSub}>
                    {result.risk === 'HIGH'
                      ? 'Please consult a healthcare professional'
                      : 'No significant risk detected'}
                  </p>
                </div>

                {/* Probability Bar */}
                <div style={styles.probSection}>
                  <div style={styles.probHeader}>
                    <span style={styles.probLabel}>RISK PROBABILITY</span>
                    <span style={{
                      ...styles.probValue,
                      color: result.risk === 'HIGH' ? '#ff4444' : '#00ff95'
                    }}>
                      {result.probability}%
                    </span>
                  </div>
                  <div style={styles.probBarBg}>
                    <div style={{
                      ...styles.probBarFill,
                      width: `${result.probability}%`,
                      background: result.risk === 'HIGH'
                        ? 'linear-gradient(90deg, #ff4444, #ff6b6b)'
                        : 'linear-gradient(90deg, #00ff95, #00b4ff)',
                    }} />
                  </div>
                </div>

                {/* Health Tips */}
                <div style={{ marginTop: '1.5rem' }}>
                  <p style={{ ...styles.sectionLabel, color: activeColor }}>
                    💡 HEALTH RECOMMENDATIONS
                  </p>
                  {getTips(activeTab, result.risk).map((tip, i) => (
                    <div key={i} style={styles.tipBox}>{tip}</div>
                  ))}
                </div>
              </div>
            )}

            {result?.error && (
              <div style={styles.errorBox}>⚠ {result.error}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// FORM FIELD COMPONENT
// ─────────────────────────────────────────────
function FormField({ field, value, color, onChange }) {
  return (
    <div style={fieldStyles.group}>
      <div style={fieldStyles.header}>
        <label style={fieldStyles.label}>{field.label}</label>
        <span style={{ ...fieldStyles.value, color }}>{value}</span>
      </div>
      <input
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={fieldStyles.slider}
      />
    </div>
  )
}

const fieldStyles = {
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#8b949e',
    fontSize: '0.78rem',
    fontFamily: "'Courier New', monospace",
  },
  value: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    fontFamily: "'Courier New', monospace",
  },
  slider: {
    width: '100%',
    accentColor: '#00ff95',
    cursor: 'pointer',
  },
}

// ─────────────────────────────────────────────
// HEALTH TIPS
// ─────────────────────────────────────────────
function getTips(disease, risk) {
  const tips = {
    diabetes: {
      HIGH: ['🥗 Reduce sugar & refined carbs', '🏃 30 mins exercise daily', '💧 Drink 8+ glasses of water', '🩺 Schedule a fasting glucose test', '⚖️ Work towards healthy BMI'],
      LOW: ['🥦 Maintain balanced diet', '🏋️ Keep up regular exercise', '💤 Get 7-8 hours sleep', '🩺 Annual check-ups recommended', '🚭 Avoid smoking & limit alcohol'],
    },
    heart: {
      HIGH: ['🩺 Consult a cardiologist ASAP', '🧂 Reduce sodium intake', '🚭 Stop smoking immediately', '🏃 Start supervised exercise', '💊 Discuss medication with doctor'],
      LOW: ['🥑 Eat heart-healthy foods', '🏊 Cardio 3-5 times per week', '😌 Manage stress with meditation', '🩺 Check BP & cholesterol annually', '🍷 Limit alcohol intake'],
    },
    parkinsons: {
      HIGH: ['🧠 Consult a neurologist ASAP', '🏋️ Exercise slows progression', '🎙️ Consider speech therapy', '💊 Discuss Levodopa with doctor', '🤝 Join a Parkinson\'s support group'],
      LOW: ['🧠 Keep brain active with puzzles', '🏃 Regular aerobic exercise', '🥗 Mediterranean diet helps', '😴 Prioritise quality sleep', '🩺 Annual neuro check-ups after 50'],
    },
  }
  return tips[disease][risk]
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = {
  container: {
    minHeight: '100vh',
    background: '#020b18',
    fontFamily: "'Courier New', monospace",
    position: 'relative',
  },
  grid: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0,255,149,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,149,0.02) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    zIndex: 0,
    pointerEvents: 'none',
  },
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    height: '60px',
    background: '#020b18ee',
    borderBottom: '1px solid #00ff9520',
    backdropFilter: 'blur(10px)',
  },
  navLogo: {
    fontSize: '1rem',
    fontWeight: '900',
    background: 'linear-gradient(90deg, #00ff95, #00b4ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '3px',
    minWidth: '160px',
  },
  navCenter: {
    display: 'flex',
    gap: '0.5rem',
  },
  navTab: {
    background: 'transparent',
    border: 'none',
    padding: '0.5rem 1.2rem',
    fontSize: '0.78rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    cursor: 'pointer',
    fontFamily: "'Courier New', monospace",
    transition: 'all 0.2s',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    minWidth: '160px',
    justifyContent: 'flex-end',
  },
  navUser: {
    color: '#8b949e',
    fontSize: '0.8rem',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #ff444460',
    color: '#ff6b6b',
    borderRadius: '6px',
    padding: '0.3rem 0.8rem',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontFamily: "'Courier New', monospace",
    letterSpacing: '1px',
  },
  content: {
    maxWidth: '1300px',
    margin: '0 auto',
    padding: '2rem',
    position: 'relative',
    zIndex: 1,
  },
  pageTitle: {
    marginBottom: '1.5rem',
  },
  titleText: {
    fontFamily: "'Courier New', monospace",
    fontSize: '1.5rem',
    fontWeight: '900',
    letterSpacing: '2px',
    margin: '0 0 0.3rem 0',
  },
  titleSub: {
    color: '#8b949e',
    fontSize: '0.85rem',
    margin: 0,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '1.5rem',
    alignItems: 'start',
  },
  formPanel: {
    background: 'linear-gradient(135deg, #0d1f2d, #0a1628)',
    border: '1px solid #00ff9520',
    borderRadius: '16px',
    padding: '1.5rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.2rem',
    marginBottom: '1.5rem',
  },
  predictBtn: {
    width: '100%',
    border: 'none',
    borderRadius: '10px',
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: '900',
    letterSpacing: '3px',
    color: '#020b18',
    fontFamily: "'Courier New', monospace",
    transition: 'all 0.3s',
  },
  resultPanel: {
    background: 'linear-gradient(135deg, #0d1f2d, #0a1628)',
    border: '1px solid #00ff9520',
    borderRadius: '16px',
    padding: '1.5rem',
    position: 'sticky',
    top: '76px',
  },
  sectionLabel: {
    fontSize: '0.7rem',
    letterSpacing: '2px',
    marginBottom: '1rem',
    marginTop: 0,
  },
  emptyResult: {
    textAlign: 'center',
    padding: '3rem 1rem',
    opacity: 0.5,
  },
  emptyText: {
    color: '#8b949e',
    fontSize: '0.9rem',
    margin: '0.2rem 0',
  },
  riskBadge: {
    borderRadius: '12px',
    padding: '1.2rem',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  riskTitle: {
    fontFamily: "'Courier New', monospace",
    fontSize: '1.5rem',
    fontWeight: '900',
    letterSpacing: '2px',
    margin: '0 0 0.3rem 0',
  },
  riskSub: {
    color: '#8b949e',
    fontSize: '0.8rem',
    margin: 0,
  },
  probSection: {
    marginBottom: '0.5rem',
  },
  probHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  probLabel: {
    color: '#8b949e',
    fontSize: '0.7rem',
    letterSpacing: '2px',
  },
  probValue: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  probBarBg: {
    background: '#020b18',
    borderRadius: '999px',
    height: '8px',
    overflow: 'hidden',
  },
  probBarFill: {
    height: '100%',
    borderRadius: '999px',
    transition: 'width 0.8s ease',
  },
  tipBox: {
    background: '#020b18',
    borderLeft: '3px solid #00b4ff',
    borderRadius: '0 8px 8px 0',
    padding: '0.6rem 0.8rem',
    marginBottom: '0.4rem',
    fontSize: '0.82rem',
    color: '#c9d1d9',
  },
  errorBox: {
    background: '#2d0d0d',
    border: '1px solid #ff444460',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#ff6b6b',
    fontSize: '0.85rem',
  },
}

export default Dashboard