import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabase'
import axios from 'axios'

const API = "https://mediscan-backend-lmhf.onrender.com"

function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [follower, setFollower] = useState({ x: -100, y: -100 })
  useEffect(() => {
    const moveCursor = (e) => {
      setPos({ x: e.clientX, y: e.clientY })
      setTimeout(() => setFollower({ x: e.clientX, y: e.clientY }), 80)
    }
    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])
  return (
    <>
      <motion.div animate={{ x: pos.x - 6, y: pos.y - 6 }}
        transition={{ type: 'spring', stiffness: 800, damping: 40 }}
        style={{ position: 'fixed', width: 12, height: 12, background: '#00ff95', borderRadius: '50%', pointerEvents: 'none', zIndex: 99999, mixBlendMode: 'difference' }} />
      <motion.div animate={{ x: follower.x - 18, y: follower.y - 18 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        style={{ position: 'fixed', width: 36, height: 36, border: '1px solid rgba(0,255,149,0.4)', borderRadius: '50%', pointerEvents: 'none', zIndex: 99998 }} />
    </>
  )
}

function MagneticButton({ children, onClick, disabled, style }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    setPos({ x: (e.clientX - rect.left - rect.width / 2) * 0.3, y: (e.clientY - rect.top - rect.height / 2) * 0.3 })
  }
  return (
    <motion.button ref={ref} onMouseMove={handleMouseMove} onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onClick={onClick} disabled={disabled} style={style}>{children}</motion.button>
  )
}

function AnimatedNumber({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const end = parseFloat(value)
    const step = end / (1500 / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setDisplay(end); clearInterval(timer) }
      else setDisplay(parseFloat(start.toFixed(1)))
    }, 16)
    return () => clearInterval(timer)
  }, [value])
  return <span>{display}{suffix}</span>
}

function FormField({ field, value, color, onChange }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <label style={{ color: '#8b949e', fontSize: '0.75rem', fontFamily: "'Space Mono', monospace" }}>{field.label}</label>
        <span style={{ color, fontSize: '0.8rem', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>{value}</span>
      </div>
      <input type="range" min={field.min} max={field.max} step={field.step}
        value={value} onChange={(e) => onChange(e.target.value)} style={{ accentColor: color }} />
    </motion.div>
  )
}

function getTips(disease, risk) {
  const tips = {
    diabetes: {
      HIGH: ['🥗 Reduce sugar & refined carbs immediately', '🏃 30 mins exercise daily is critical', '💧 Drink 8+ glasses of water daily', '🩺 Schedule a fasting glucose test now', '⚖️ Work towards a healthy BMI (18.5–24.9)'],
      LOW: ['🥦 Maintain a balanced diet rich in vegetables', '🏋️ Keep up your regular physical activity', '💤 Ensure 7–8 hours of quality sleep', '🩺 Annual check-ups are still recommended', '🚭 Avoid smoking & limit alcohol consumption'],
    },
    heart: {
      HIGH: ['🩺 Consult a cardiologist as soon as possible', '🧂 Reduce sodium intake to lower blood pressure', '🚭 Stop smoking — it doubles heart disease risk', '🏃 Begin a medically supervised exercise program', '💊 Discuss cholesterol medication with your doctor'],
      LOW: ['🥑 Eat heart-healthy foods — avocado, nuts, fish', '🏊 Cardio exercise 3–5 times per week', '😌 Manage stress through meditation or yoga', '🩺 Check blood pressure and cholesterol annually', '🍷 Limit alcohol to recommended guidelines'],
    },
    parkinsons: {
      HIGH: ['🧠 Consult a neurologist as soon as possible', '🏋️ Exercise has been shown to slow progression', '🎙️ Consider speech therapy for vocal symptoms', '💊 Discuss Levodopa therapy options with your doctor', '🤝 Join a Parkinson\'s support group for guidance'],
      LOW: ['🧠 Keep your brain active — puzzles, reading, learning', '🏃 Regular aerobic exercise protects neurological health', '🥗 Mediterranean diet supports brain health', '😴 Prioritise quality sleep for neural repair', '🩺 Annual neurological check-ups after age 50'],
    },
  }
  return tips[disease][risk]
}

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('diabetes')
  const [result, setResult] = useState(null)
  const [whatif, setWhatif] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  const [diabetes, setDiabetes] = useState({
    pregnancies: 1, glucose: 110, blood_pressure: 70,
    skin_thickness: 20, insulin: 80, bmi: 25,
    diabetes_pedigree: 0.5, age: 30
  })
  const [heart, setHeart] = useState({
    age: 45, sex: 1, cp: 0, trestbps: 120, chol: 200,
    fbs: 0, restecg: 0, thalach: 150, exang: 0,
    oldpeak: 1.0, slope: 0, ca: 0, thal: 0
  })
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
      if (session?.user) { setUser(session.user); loadHistory(session.user.id) }
    })
  }, [])

  const loadHistory = async (userId) => {
    const { data } = await supabase.from('predictions').select('*')
      .eq('user_id', userId).order('created_at', { ascending: false }).limit(10)
    if (data) setHistory(data)
  }

  const saveToHistory = async (userId, disease, resultData, inputData) => {
    await supabase.from('predictions').insert({
      user_id: userId, disease, risk: resultData.risk,
      probability: resultData.probability, input_data: inputData,
    })
    loadHistory(userId)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handlePredict = async () => {
    setLoading(true); setResult(null); setWhatif(null)
    try {
      let predResponse, whatifResponse, inputData
      if (activeTab === 'diabetes') {
        inputData = diabetes
        ;[predResponse, whatifResponse] = await Promise.all([
          axios.post(`${API}/predict/diabetes`, diabetes),
          axios.post(`${API}/whatif/diabetes`, diabetes),
        ])
      } else if (activeTab === 'heart') {
        inputData = heart
        ;[predResponse, whatifResponse] = await Promise.all([
          axios.post(`${API}/predict/heart`, heart),
          axios.post(`${API}/whatif/heart`, heart),
        ])
      } else {
        inputData = park
        ;[predResponse, whatifResponse] = await Promise.all([
          axios.post(`${API}/predict/parkinsons`, park),
          axios.post(`${API}/whatif/parkinsons`, park),
        ])
      }
      setResult(predResponse.data)
      setWhatif(whatifResponse.data.whatif)
      if (user) saveToHistory(user.id, activeTab, predResponse.data, inputData)
    } catch { setResult({ error: 'Could not connect to backend!' }) }
    setLoading(false)
  }

  const handleDownloadPDF = async () => {
    if (!result || !user) return
    try {
      const response = await axios.post(`${API}/generate-report`, {
        username: user?.user_metadata?.username || user?.email?.split('@')[0] || 'User',
        disease: activeTab, risk: result.risk, probability: result.probability,
        top_features: result.top_features || [], whatif: whatif || {},
        input_data: activeTab === 'diabetes' ? diabetes : activeTab === 'heart' ? heart : park,
      }, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `MediScan_Report_${activeTab}_${Date.now()}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch { alert('Could not generate PDF!') }
  }

  const updateField = (setter, field, value) => setter(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))

  const tabs = [
    { id: 'diabetes', label: '🩸 DIABETES', color: '#00ff95' },
    { id: 'heart', label: '🫀 HEART', color: '#ff6b6b' },
    { id: 'parkinsons', label: '🫁 PARKINSONS', color: '#00b4ff' },
  ]
  const activeColor = tabs.find(t => t.id === activeTab)?.color || '#00ff95'

  const diabetesFields = [
    { label: 'Pregnancies', key: 'pregnancies', min: 0, max: 20, step: 1 },
    { label: 'Glucose (mg/dL)', key: 'glucose', min: 0, max: 200, step: 1 },
    { label: 'Blood Pressure', key: 'blood_pressure', min: 0, max: 130, step: 1 },
    { label: 'Skin Thickness', key: 'skin_thickness', min: 0, max: 100, step: 1 },
    { label: 'Insulin (μU/mL)', key: 'insulin', min: 0, max: 900, step: 1 },
    { label: 'BMI', key: 'bmi', min: 0, max: 70, step: 0.1 },
    { label: 'Diabetes Pedigree', key: 'diabetes_pedigree', min: 0, max: 2.5, step: 0.01 },
    { label: 'Age', key: 'age', min: 1, max: 120, step: 1 },
  ]
  const heartFields = [
    { label: 'Age', key: 'age', min: 1, max: 120, step: 1 },
    { label: 'Sex (0=F, 1=M)', key: 'sex', min: 0, max: 1, step: 1 },
    { label: 'Chest Pain (0-3)', key: 'cp', min: 0, max: 3, step: 1 },
    { label: 'Resting BP', key: 'trestbps', min: 80, max: 200, step: 1 },
    { label: 'Cholesterol', key: 'chol', min: 100, max: 600, step: 1 },
    { label: 'Fasting Blood Sugar', key: 'fbs', min: 0, max: 1, step: 1 },
    { label: 'Resting ECG (0-2)', key: 'restecg', min: 0, max: 2, step: 1 },
    { label: 'Max Heart Rate', key: 'thalach', min: 60, max: 220, step: 1 },
    { label: 'Exercise Angina', key: 'exang', min: 0, max: 1, step: 1 },
    { label: 'ST Depression', key: 'oldpeak', min: 0, max: 6, step: 0.1 },
    { label: 'Slope (0-2)', key: 'slope', min: 0, max: 2, step: 1 },
    { label: 'Major Vessels', key: 'ca', min: 0, max: 4, step: 1 },
    { label: 'Thalassemia (0-3)', key: 'thal', min: 0, max: 3, step: 1 },
  ]
  const parkFields = [
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
  ]

  const activeFields = activeTab === 'diabetes' ? diabetesFields : activeTab === 'heart' ? heartFields : parkFields
  const activeState = activeTab === 'diabetes' ? diabetes : activeTab === 'heart' ? heart : park
  const activeSetter = activeTab === 'diabetes' ? setDiabetes : activeTab === 'heart' ? setHeart : setPark

  return (
    <>
      <CustomCursor />
      <div className="mesh-bg" />
      <div className="grid-overlay" />
      <div className="scanline" />

      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh' }}>

        {/* NAVBAR */}
        <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          style={{
            position: 'sticky', top: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 2rem', height: 64,
            background: 'rgba(2,11,24,0.9)',
            borderBottom: '1px solid rgba(0,255,149,0.1)',
            backdropFilter: 'blur(20px)',
          }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '4px',
            background: 'linear-gradient(90deg, #00ff95, #00b4ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>⚕ MEDISCAN AI</div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {tabs.map(tab => (
              <motion.button key={tab.id}
                onClick={() => { setActiveTab(tab.id); setResult(null); setWhatif(null) }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{
                  background: activeTab === tab.id ? `${tab.color}15` : 'transparent',
                  border: activeTab === tab.id ? `1px solid ${tab.color}40` : '1px solid transparent',
                  color: activeTab === tab.id ? tab.color : '#8b949e',
                  padding: '0.4rem 1rem', borderRadius: 8,
                  fontFamily: "'Space Mono', monospace", fontSize: '0.75rem',
                  letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s',
                }}>{tab.label}</motion.button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <motion.button whileHover={{ scale: 1.05 }}
              onClick={() => setShowHistory(!showHistory)}
              style={{
                background: showHistory ? 'rgba(0,180,255,0.15)' : 'transparent',
                border: '1px solid rgba(0,180,255,0.3)', color: '#00b4ff',
                padding: '0.4rem 1rem', borderRadius: 8, cursor: 'pointer',
                fontFamily: "'Space Mono', monospace", fontSize: '0.7rem',
              }}>📋 HISTORY</motion.button>

            <Link to="/profile" style={{
              color: '#8b949e', fontSize: '0.8rem',
              fontFamily: "'Space Mono', monospace",
              border: '1px solid rgba(0,255,149,0.2)',
              padding: '0.4rem 1rem', borderRadius: 8, transition: 'all 0.3s',
            }}>👤 {user?.user_metadata?.username || user?.email?.split('@')[0]}</Link>

            <motion.button whileHover={{ scale: 1.05 }} onClick={handleLogout}
              style={{
                background: 'transparent', border: '1px solid rgba(255,68,68,0.4)',
                color: '#ff6b6b', padding: '0.4rem 0.8rem', borderRadius: 8,
                cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem',
              }}>LOGOUT</motion.button>
          </div>
        </motion.nav>

        {/* HISTORY PANEL */}
        <AnimatePresence>
          {showHistory && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ background: 'rgba(13,31,45,0.95)', borderBottom: '1px solid rgba(0,180,255,0.2)', padding: '1.5rem 2rem', backdropFilter: 'blur(20px)' }}>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#00b4ff', fontSize: '1.2rem', letterSpacing: '3px', marginBottom: '1rem' }}>📋 PREDICTION HISTORY</p>
              {history.length === 0 ? (
                <p style={{ color: '#8b949e', fontFamily: "'Space Mono', monospace", fontSize: '0.8rem' }}>No predictions yet. Run your first analysis!</p>
              ) : (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {history.map((item) => (
                    <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="glass" style={{ padding: '0.75rem 1rem', minWidth: 180 }}>
                      <p style={{ fontFamily: "'Bebas Neue', sans-serif", color: item.risk === 'HIGH' ? '#ff6b6b' : '#00ff95', fontSize: '1rem', letterSpacing: '2px' }}>
                        {item.disease === 'diabetes' ? '🩸' : item.disease === 'heart' ? '🫀' : '🫁'}{' '}{item.risk} RISK
                      </p>
                      <p style={{ color: '#8b949e', fontSize: '0.75rem', fontFamily: "'Space Mono', monospace" }}>{item.probability}% probability</p>
                      <p style={{ color: '#8b949e', fontSize: '0.65rem', marginTop: '0.3rem' }}>{new Date(item.created_at).toLocaleDateString()}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem' }}>
          <motion.div key={activeTab} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '4px', color: activeColor, margin: 0, textShadow: `0 0 30px ${activeColor}40` }}>
              {activeTab === 'diabetes' && '🩸 DIABETES RISK ASSESSMENT'}
              {activeTab === 'heart' && '🫀 HEART DISEASE RISK ASSESSMENT'}
              {activeTab === 'parkinsons' && '🫁 PARKINSON\'S RISK ASSESSMENT'}
            </h1>
            <p style={{ color: '#8b949e', fontSize: '0.85rem', marginTop: '0.3rem', fontFamily: "'Space Mono', monospace" }}>
              {activeTab === 'diabetes' && '// Enter patient vitals to predict diabetes risk using Random Forest ML'}
              {activeTab === 'heart' && '// Enter cardiovascular indicators to assess heart disease risk using Gradient Boosting'}
              {activeTab === 'parkinsons' && '// Enter voice biomarkers to detect Parkinson\'s risk using Gradient Boosting'}
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '1.5rem', alignItems: 'start' }}>

            {/* FORM PANEL */}
            <motion.div key={`form-${activeTab}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'parkinsons' ? '1fr 1fr 1fr' : '1fr 1fr', gap: '1.2rem', marginBottom: '1.5rem' }}>
                {activeFields.map(field => (
                  <FormField key={field.key} field={field} value={activeState[field.key]}
                    color={activeColor} onChange={(v) => updateField(activeSetter, field.key, v)} />
                ))}
              </div>
              <MagneticButton onClick={handlePredict} disabled={loading} style={{
                width: '100%', padding: '1.1rem',
                background: loading ? 'rgba(0,255,149,0.2)' : `linear-gradient(90deg, ${activeColor}, #00b4ff)`,
                border: 'none', borderRadius: 12, color: '#020b18', fontSize: '1.1rem',
                fontWeight: 900, letterSpacing: '4px', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Bebas Neue', sans-serif",
                boxShadow: loading ? 'none' : `0 0 40px ${activeColor}40`, transition: 'all 0.3s',
              }}>
                {loading ? '⟳  RUNNING AI MODEL...' : '🔍  ANALYSE RISK'}
              </MagneticButton>
            </motion.div>

            {/* RESULT PANEL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AnimatePresence mode="wait">
                {!result && !loading && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
                    <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                      style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                      {activeTab === 'diabetes' ? '🩸' : activeTab === 'heart' ? '🫀' : '🫁'}
                    </motion.div>
                    <p style={{ color: '#8b949e', fontFamily: "'Space Mono', monospace", fontSize: '0.8rem' }}>Awaiting analysis input...</p>
                  </motion.div>
                )}

                {loading && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ fontSize: '3rem', marginBottom: '1rem', display: 'inline-block' }}>⟳</motion.div>
                    <p style={{ color: activeColor, fontFamily: "'Space Mono', monospace", fontSize: '0.85rem', letterSpacing: '2px' }}>RUNNING AI MODEL...</p>
                  </motion.div>
                )}

                {result && !result.error && (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>

                    {/* Risk badge */}
                    <div className="glass" style={{
                      padding: '1.5rem',
                      border: `2px solid ${result.risk === 'HIGH' ? '#ff444460' : '#00ff9560'}`,
                      textAlign: 'center', position: 'relative', overflow: 'hidden', marginBottom: '1rem',
                    }}>
                      <div style={{ position: 'absolute', inset: 0, background: result.risk === 'HIGH' ? 'radial-gradient(circle at center, rgba(255,68,68,0.08), transparent)' : 'radial-gradient(circle at center, rgba(0,255,149,0.08), transparent)' }} />
                      <motion.p initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '4px', color: result.risk === 'HIGH' ? '#ff4444' : '#00ff95', margin: 0, textShadow: result.risk === 'HIGH' ? '0 0 30px rgba(255,68,68,0.5)' : '0 0 30px rgba(0,255,149,0.5)' }}>
                        {result.risk === 'HIGH' ? '⚠ HIGH RISK' : '✅ LOW RISK'}
                      </motion.p>
                      <p style={{ color: '#8b949e', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                        {result.risk === 'HIGH' ? 'Please consult a healthcare professional' : 'No significant risk detected'}
                      </p>
                    </div>

                    {/* Probability + Confidence Interval */}
                    <div className="glass" style={{ padding: '1.2rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ color: '#8b949e', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '2px' }}>RISK PROBABILITY</span>
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: result.risk === 'HIGH' ? '#ff4444' : '#00ff95', letterSpacing: '2px' }}>
                          <AnimatedNumber value={result.probability} suffix="%" />
                        </span>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 999, height: 8, overflow: 'hidden', marginBottom: '0.75rem' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${result.probability}%` }}
                          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                          style={{ height: '100%', borderRadius: 999, background: result.risk === 'HIGH' ? 'linear-gradient(90deg, #ff4444, #ff6b6b)' : 'linear-gradient(90deg, #00ff95, #00b4ff)', boxShadow: result.risk === 'HIGH' ? '0 0 10px rgba(255,68,68,0.5)' : '0 0 10px rgba(0,255,149,0.5)' }} />
                      </div>

                      {/* Confidence Interval */}
                      {result.confidence_interval && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                          style={{ background: 'rgba(0,180,255,0.05)', border: '1px solid rgba(0,180,255,0.15)', borderRadius: 8, padding: '0.6rem 0.8rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                            <span style={{ color: '#00b4ff', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '2px' }}>
                              🎯 CONFIDENCE INTERVAL
                            </span>
                            <span style={{ color: '#8b949e', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem' }}>
                              95% CI
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <span style={{ color: '#00ff95', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem' }}>
                              {result.confidence_interval.lower}%
                            </span>
                            <div style={{ flex: 1, position: 'relative', height: 6, background: 'rgba(0,0,0,0.3)', borderRadius: 999 }}>
                              <motion.div
                                initial={{ left: '50%', right: '50%' }}
                                animate={{
                                  left: `${result.confidence_interval.lower}%`,
                                  right: `${100 - result.confidence_interval.upper}%`,
                                }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                style={{ position: 'absolute', top: 0, bottom: 0, background: 'linear-gradient(90deg, #00b4ff60, #00b4ff)', borderRadius: 999 }}
                              />
                              <motion.div
                                initial={{ left: '50%' }}
                                animate={{ left: `${result.probability}%` }}
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                style={{ position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', width: 10, height: 10, borderRadius: '50%', background: result.risk === 'HIGH' ? '#ff4444' : '#00ff95', boxShadow: `0 0 6px ${result.risk === 'HIGH' ? '#ff4444' : '#00ff95'}` }}
                              />
                            </div>
                            <span style={{ color: '#ff6b6b', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem' }}>
                              {result.confidence_interval.upper}%
                            </span>
                          </div>
                          <p style={{ color: '#8b949e', fontSize: '0.7rem', textAlign: 'center', marginTop: '0.4rem', fontFamily: "'Space Mono', monospace" }}>
                            Model std deviation: ±{result.confidence_interval.std}%
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Feature importance */}
                    {result.top_features && (
                      <div className="glass" style={{ padding: '1.2rem', marginBottom: '1rem' }}>
                        <p style={{ fontFamily: "'Space Mono', monospace", color: activeColor, fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '0.75rem' }}>◈ TOP RISK FACTORS</p>
                        {result.top_features.map((f, i) => (
                          <div key={i} style={{ marginBottom: '0.6rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                              <span style={{ color: '#c9d1d9', fontSize: '0.75rem', fontFamily: "'Space Mono', monospace" }}>{f.feature}</span>
                              <span style={{ color: activeColor, fontSize: '0.75rem', fontFamily: "'Space Mono', monospace" }}>{f.importance}%</span>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 999, height: 4 }}>
                              <motion.div initial={{ width: 0 }} animate={{ width: `${f.importance}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${activeColor}, ${activeColor}80)` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* What-if */}
                    {whatif && (
                      <div className="glass" style={{ padding: '1.2rem', marginBottom: '1rem' }}>
                        <p style={{ fontFamily: "'Space Mono', monospace", color: '#00b4ff', fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '0.75rem' }}>🔮 WHAT-IF SIMULATOR</p>
                        {Object.entries(whatif).map(([scenario, prob], i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                            style={{ background: 'rgba(0,180,255,0.05)', border: '1px solid rgba(0,180,255,0.15)', borderRadius: 8, padding: '0.6rem 0.8rem', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: '#c9d1d9', fontSize: '0.75rem' }}>💡 {scenario}</span>
                              <span style={{ color: prob < result.probability ? '#00ff95' : '#ff6b6b', fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', fontWeight: 700 }}>
                                {prob < result.probability ? '↓' : '↑'} {prob}%
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Health tips */}
                    <div className="glass" style={{ padding: '1.2rem', marginBottom: '1rem' }}>
                      <p style={{ fontFamily: "'Space Mono', monospace", color: activeColor, fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '0.75rem' }}>💡 HEALTH RECOMMENDATIONS</p>
                      {getTips(activeTab, result.risk).map((tip, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                          style={{ borderLeft: `3px solid ${activeColor}60`, paddingLeft: '0.75rem', marginBottom: '0.5rem', color: '#c9d1d9', fontSize: '0.82rem' }}>
                          {tip}
                        </motion.div>
                      ))}
                    </div>

                    {/* PDF Download */}
                    <MagneticButton onClick={handleDownloadPDF} style={{
                      width: '100%', padding: '0.9rem',
                      background: 'linear-gradient(90deg, #ff006e, #00b4ff)',
                      border: 'none', borderRadius: 12, color: '#ffffff',
                      fontSize: '0.95rem', fontWeight: 900, letterSpacing: '3px',
                      cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif",
                      boxShadow: '0 0 30px rgba(255,0,110,0.3)',
                    }}>
                      📄 DOWNLOAD PDF REPORT
                    </MagneticButton>
                  </motion.div>
                )}

                {result?.error && (
                  <motion.div key="error" className="glass" style={{ padding: '1.2rem', border: '1px solid rgba(255,68,68,0.4)', color: '#ff6b6b', fontSize: '0.85rem' }}>
                    ⚠ {result.error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard