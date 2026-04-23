import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabase'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'

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

// ─────────────────────────────────────────────
// CUSTOM TOOLTIP FOR CHART
// ─────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(13,31,45,0.95)',
        border: '1px solid rgba(0,255,149,0.2)',
        borderRadius: 8, padding: '0.75rem 1rem',
        fontFamily: "'Space Mono', monospace",
      }}>
        <p style={{ color: '#8b949e', fontSize: '0.7rem', marginBottom: '0.3rem' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: '0.8rem', margin: '0.1rem 0' }}>
            {p.name}: {p.value}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState({ full_name: '', username: '' })
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ total: 0, high: 0, low: 0 })
  const [chartData, setChartData] = useState([])
  const [activeChart, setActiveChart] = useState('all')
  const fileRef = useRef(null)

  useEffect(() => { loadProfile() }, [])

  const loadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) { navigate('/login'); return }
    setUser(session.user)

    const { data: profileData } = await supabase
      .from('profiles').select('*').eq('id', session.user.id).single()
    if (profileData) {
      setProfile({ full_name: profileData.full_name || '', username: profileData.username || '' })
      if (profileData.avatar_url) setAvatarUrl(profileData.avatar_url)
    }

    const { data: predictions } = await supabase
      .from('predictions').select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true })

    if (predictions) {
      setStats({
        total: predictions.length,
        high: predictions.filter(p => p.risk === 'HIGH').length,
        low: predictions.filter(p => p.risk === 'LOW').length,
      })

      // Build chart data
      const chartMap = {}
      predictions.forEach(p => {
        const date = new Date(p.created_at).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })
        if (!chartMap[date]) chartMap[date] = { date, diabetes: null, heart: null, parkinsons: null }
        chartMap[date][p.disease] = p.probability
      })
      setChartData(Object.values(chartMap))
    }

    setLoading(false)
  }

  const handleSave = async () => {
    if (!profile.full_name || !profile.username) { setError('Full name and username are required'); return }
    setSaving(true); setError(''); setSuccess('')
    const { error: updateError } = await supabase.from('profiles')
      .update({ full_name: profile.full_name, username: profile.username, ...(avatarUrl && { avatar_url: avatarUrl }) })
      .eq('id', user.id)
    if (updateError) { setError(updateError.message) }
    else { setSuccess('Profile updated successfully!'); setTimeout(() => setSuccess(''), 3000) }
    setSaving(false)
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setError('Image must be under 2MB'); return }
    setUploadingAvatar(true); setError('')
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/avatar.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true })
    if (uploadError) {
      const reader = new FileReader()
      reader.onload = (e) => setAvatarUrl(e.target.result)
      reader.readAsDataURL(file)
    } else {
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
      setAvatarUrl(data.publicUrl)
    }
    setUploadingAvatar(false)
  }

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login') }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#020b18', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00ff95', fontFamily: "'Space Mono', monospace", letterSpacing: '3px' }}>
      ⟳ LOADING PROFILE...
    </div>
  )

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?'

  const filteredChartData = chartData.filter(d => {
    if (activeChart === 'all') return true
    return d[activeChart] !== null && d[activeChart] !== undefined
  })

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
          <Link to="/dashboard" style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '4px',
            background: 'linear-gradient(90deg, #00ff95, #00b4ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>⚕ MEDISCAN AI</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/dashboard" style={{
              color: '#8b949e', fontSize: '0.8rem', fontFamily: "'Space Mono', monospace",
              border: '1px solid rgba(0,255,149,0.2)', padding: '0.4rem 1rem', borderRadius: 8,
            }}>← DASHBOARD</Link>
            <motion.button whileHover={{ scale: 1.05 }} onClick={handleLogout}
              style={{ background: 'transparent', border: '1px solid rgba(255,68,68,0.4)', color: '#ff6b6b', padding: '0.4rem 0.8rem', borderRadius: 8, cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem' }}>
              LOGOUT
            </motion.button>
          </div>
        </motion.nav>

        {/* MAIN CONTENT */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '4px', color: '#00ff95', margin: 0, textShadow: '0 0 30px rgba(0,255,149,0.4)' }}>
              👤 USER PROFILE
            </h1>
            <p style={{ color: '#8b949e', fontSize: '0.85rem', marginTop: '0.3rem', fontFamily: "'Space Mono', monospace" }}>
              // Manage your account settings and view your health trends
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', alignItems: 'start' }}>

            {/* LEFT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Avatar Card */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                  <div style={{
                    width: 100, height: 100, borderRadius: '50%',
                    background: avatarUrl ? 'transparent' : 'linear-gradient(135deg, #00ff95, #00b4ff)',
                    border: '3px solid rgba(0,255,149,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.5rem', fontWeight: 900, color: '#020b18',
                    fontFamily: "'Bebas Neue', sans-serif",
                    overflow: 'hidden', margin: '0 auto',
                    boxShadow: '0 0 30px rgba(0,255,149,0.2)',
                  }}>
                    {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} onClick={() => fileRef.current.click()}
                    style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #00ff95, #00b4ff)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                    📷
                  </motion.button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                </div>
                {uploadingAvatar && <p style={{ color: '#00b4ff', fontSize: '0.75rem', fontFamily: "'Space Mono', monospace" }}>⟳ Uploading...</p>}
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '2px', color: '#e6edf3', margin: '0.5rem 0 0.2rem' }}>
                  {profile.full_name || 'Your Name'}
                </p>
                <p style={{ color: '#00ff95', fontSize: '0.8rem', fontFamily: "'Space Mono', monospace" }}>@{profile.username || 'username'}</p>
                <p style={{ color: '#8b949e', fontSize: '0.75rem', marginTop: '0.3rem' }}>{user?.email}</p>
              </motion.div>

              {/* Stats Card */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                className="glass" style={{ padding: '1.5rem' }}>
                <p style={{ fontFamily: "'Space Mono', monospace", color: '#00ff95', fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '1rem' }}>◈ YOUR STATS</p>
                {[
                  { label: 'Total Predictions', value: stats.total, color: '#00b4ff' },
                  { label: 'High Risk Results', value: stats.high, color: '#ff6b6b' },
                  { label: 'Low Risk Results', value: stats.low, color: '#00ff95' },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: i < 2 ? '1px solid rgba(0,255,149,0.08)' : 'none' }}>
                    <span style={{ color: '#8b949e', fontSize: '0.8rem' }}>{stat.label}</span>
                    <span style={{ color: stat.color, fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '2px' }}>{stat.value}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Edit Form */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="glass" style={{ padding: '1.5rem' }}>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '3px', color: '#e6edf3', marginBottom: '1rem' }}>EDIT PROFILE</p>

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.4)', borderRadius: 8, padding: '0.75rem', color: '#ff6b6b', fontSize: '0.8rem', marginBottom: '1rem' }}>
                      ⚠ {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ background: 'rgba(0,255,149,0.1)', border: '1px solid rgba(0,255,149,0.4)', borderRadius: 8, padding: '0.75rem', color: '#00ff95', fontSize: '0.8rem', marginBottom: '1rem' }}>
                      ✅ {success}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", color: 'rgba(0,255,149,0.5)', fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '0.4rem' }}>FULL NAME</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>👤</span>
                    <input className="cyber-input" type="text" placeholder="Your full name"
                      value={profile.full_name} onChange={(e) => setProfile(p => ({ ...p, full_name: e.target.value }))} />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", color: 'rgba(0,255,149,0.5)', fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '0.4rem' }}>USERNAME</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>@</span>
                    <input className="cyber-input" type="text" placeholder="your_username"
                      value={profile.username} onChange={(e) => setProfile(p => ({ ...p, username: e.target.value }))} />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", color: 'rgba(0,255,149,0.3)', fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '0.4rem' }}>EMAIL (CANNOT BE CHANGED)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }}>✉</span>
                    <input className="cyber-input" type="email" value={user?.email || ''} readOnly style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                  </div>
                </div>

                <MagneticButton onClick={handleSave} disabled={saving} style={{
                  width: '100%', padding: '0.9rem',
                  background: saving ? 'rgba(0,255,149,0.2)' : 'linear-gradient(90deg, #00ff95, #00b4ff)',
                  border: 'none', borderRadius: 10, color: '#020b18', fontSize: '0.95rem',
                  fontWeight: 700, letterSpacing: '3px', cursor: saving ? 'not-allowed' : 'pointer',
                  fontFamily: "'Bebas Neue', sans-serif",
                  boxShadow: saving ? 'none' : '0 0 30px rgba(0,255,149,0.3)',
                }}>
                  {saving ? '⟳  SAVING...' : '💾  SAVE CHANGES'}
                </MagneticButton>
              </motion.div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Risk Trend Chart */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="glass" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '3px', color: '#e6edf3', margin: 0 }}>
                      📈 RISK TREND CHART
                    </p>
                    <p style={{ color: '#8b949e', fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", marginTop: '0.2rem' }}>
                      Your risk probability over time
                    </p>
                  </div>

                  {/* Filter buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[
                      { id: 'all', label: 'ALL', color: '#e6edf3' },
                      { id: 'diabetes', label: '🩸', color: '#00ff95' },
                      { id: 'heart', label: '🫀', color: '#ff6b6b' },
                      { id: 'parkinsons', label: '🫁', color: '#00b4ff' },
                    ].map(f => (
                      <motion.button key={f.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveChart(f.id)}
                        style={{
                          background: activeChart === f.id ? `${f.color}20` : 'transparent',
                          border: `1px solid ${activeChart === f.id ? f.color : 'rgba(255,255,255,0.1)'}`,
                          color: activeChart === f.id ? f.color : '#8b949e',
                          padding: '0.3rem 0.7rem', borderRadius: 6,
                          cursor: 'pointer', fontSize: '0.75rem',
                          fontFamily: "'Space Mono', monospace",
                        }}>{f.label}</motion.button>
                    ))}
                  </div>
                </div>

                {chartData.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#8b949e', fontFamily: "'Space Mono', monospace", fontSize: '0.8rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📊</div>
                    No prediction data yet.<br />Run some analyses to see your trends!
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={filteredChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,149,0.05)" />
                      <XAxis dataKey="date" tick={{ fill: '#8b949e', fontSize: 11, fontFamily: 'Space Mono' }} axisLine={{ stroke: 'rgba(0,255,149,0.1)' }} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: '#8b949e', fontSize: 11, fontFamily: 'Space Mono' }} axisLine={{ stroke: 'rgba(0,255,149,0.1)' }} tickLine={false} tickFormatter={(v) => `${v}%`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: '#8b949e' }} />
                      {(activeChart === 'all' || activeChart === 'diabetes') && (
                        <Line type="monotone" dataKey="diabetes" stroke="#00ff95" strokeWidth={2} dot={{ fill: '#00ff95', r: 4 }} activeDot={{ r: 6 }} connectNulls name="Diabetes" />
                      )}
                      {(activeChart === 'all' || activeChart === 'heart') && (
                        <Line type="monotone" dataKey="heart" stroke="#ff6b6b" strokeWidth={2} dot={{ fill: '#ff6b6b', r: 4 }} activeDot={{ r: 6 }} connectNulls name="Heart" />
                      )}
                      {(activeChart === 'all' || activeChart === 'parkinsons') && (
                        <Line type="monotone" dataKey="parkinsons" stroke="#00b4ff" strokeWidth={2} dot={{ fill: '#00b4ff', r: 4 }} activeDot={{ r: 6 }} connectNulls name="Parkinson's" />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </motion.div>

              {/* Danger Zone */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                className="glass" style={{ padding: '1.5rem', border: '1px solid rgba(255,68,68,0.15)' }}>
                <p style={{ fontFamily: "'Space Mono', monospace", color: '#ff6b6b', fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>⚠ DANGER ZONE</p>
                <p style={{ color: '#8b949e', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  Sign out of your current session
                </p>
                <motion.button whileHover={{ scale: 1.02 }} onClick={handleLogout}
                  style={{ width: '100%', padding: '0.8rem', background: 'transparent', border: '1px solid rgba(255,68,68,0.4)', borderRadius: 8, color: '#ff6b6b', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', letterSpacing: '2px' }}>
                  SIGN OUT OF ALL SESSIONS
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile