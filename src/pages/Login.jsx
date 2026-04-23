import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabase'

// ─────────────────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────────────────
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
      <motion.div
        animate={{ x: pos.x - 6, y: pos.y - 6 }}
        transition={{ type: 'spring', stiffness: 800, damping: 40 }}
        style={{
          position: 'fixed', width: 12, height: 12,
          background: '#00ff95', borderRadius: '50%',
          pointerEvents: 'none', zIndex: 99999,
          mixBlendMode: 'difference',
        }}
      />
      <motion.div
        animate={{ x: follower.x - 18, y: follower.y - 18 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        style={{
          position: 'fixed', width: 36, height: 36,
          border: '1px solid rgba(0,255,149,0.4)',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 99998,
        }}
      />
    </>
  )
}

// ─────────────────────────────────────────────
// MAGNETIC BUTTON
// ─────────────────────────────────────────────
function MagneticButton({ children, onClick, disabled, style }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPos({ x: x * 0.3, y: y * 0.3 })
  }

  const handleMouseLeave = () => setPos({ x: 0, y: 0 })

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </motion.button>
  )
}

// ─────────────────────────────────────────────
// GLITCH TEXT
// ─────────────────────────────────────────────
function GlitchText({ text, style }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      <span style={{ position: 'relative', zIndex: 2 }}>{text}</span>
      <span style={{
        position: 'absolute', top: 0, left: 0,
        color: '#00b4ff', zIndex: 1,
        animation: 'glitch 3s infinite linear',
        opacity: 0.7,
      }}>{text}</span>
      <span style={{
        position: 'absolute', top: 0, left: 0,
        color: '#ff006e', zIndex: 1,
        animation: 'glitch2 3s infinite linear',
        opacity: 0.7,
      }}>{text}</span>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN LOGIN PAGE
// ─────────────────────────────────────────────
function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState('')

  const handleLogin = async () => {
    if (!email || !password) { setError('All fields required'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else navigate('/dashboard')
  }

  return (
    <>
      <CustomCursor />
      <div className="mesh-bg" />
      <div className="grid-overlay" />
      <div className="scanline" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
          padding: '2rem',
        }}
      >
        {/* Floating orbs */}
        <motion.div
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'fixed', top: '15%', left: '10%',
            width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,255,149,0.08), transparent)',
            filter: 'blur(40px)', pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{ y: [0, 20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{
            position: 'fixed', bottom: '15%', right: '10%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,180,255,0.08), transparent)',
            filter: 'blur(40px)', pointerEvents: 'none',
          }}
        />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-strong"
          style={{
            width: '100%', maxWidth: 440,
            padding: '3rem', position: 'relative', overflow: 'hidden'
          }}
        >
          {/* Top accent line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, #00ff95, #00b4ff, transparent)',
          }} />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ textAlign: 'center', marginBottom: '2rem' }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}
            >⚕</motion.div>

            <GlitchText text="MEDISCAN AI" style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '3rem',
              letterSpacing: '6px',
              background: 'linear-gradient(90deg, #00ff95, #00b4ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }} />

            <p style={{
              fontFamily: "'Space Mono', monospace",
              color: 'rgba(0,255,149,0.5)',
              fontSize: '0.65rem',
              letterSpacing: '3px',
              marginTop: '0.3rem',
            }}>[ DISEASE RISK DETECTION SYSTEM ]</p>
          </motion.div>

          {/* Divider */}
          <div style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(0,255,149,0.3), transparent)',
            marginBottom: '2rem',
          }} />

          {/* Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1.6rem',
              letterSpacing: '3px',
              color: '#e6edf3',
              marginBottom: '0.3rem',
            }}>WELCOME BACK</p>
            <p style={{
              color: '#8b949e', fontSize: '0.85rem',
              marginBottom: '1.5rem',
            }}>Sign in to access your health dashboard</p>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: 'rgba(255,68,68,0.1)',
                    border: '1px solid rgba(255,68,68,0.4)',
                    borderRadius: 8, padding: '0.75rem 1rem',
                    color: '#ff6b6b', fontSize: '0.85rem',
                    marginBottom: '1rem',
                  }}
                >⚠ {error}</motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontFamily: "'Space Mono', monospace",
                color: focused === 'email' ? '#00ff95' : 'rgba(0,255,149,0.5)',
                fontSize: '0.65rem', letterSpacing: '2px',
                marginBottom: '0.4rem', transition: 'color 0.3s',
              }}>EMAIL ADDRESS</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '1rem', top: '50%',
                  transform: 'translateY(-50%)', fontSize: '0.9rem', opacity: 0.5,
                }}>✉</span>
                <input
                  className="cyber-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontFamily: "'Space Mono', monospace",
                color: focused === 'password' ? '#00ff95' : 'rgba(0,255,149,0.5)',
                fontSize: '0.65rem', letterSpacing: '2px',
                marginBottom: '0.4rem', transition: 'color 0.3s',
              }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '1rem', top: '50%',
                  transform: 'translateY(-50%)', fontSize: '0.9rem', opacity: 0.5,
                }}>🔒</span>
                <input
                  className="cyber-input"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>

            {/* Magnetic Button */}
            <MagneticButton
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: '100%', padding: '1rem',
                background: loading
                  ? 'rgba(0,255,149,0.3)'
                  : 'linear-gradient(90deg, #00ff95, #00b4ff)',
                border: 'none', borderRadius: 10,
                color: '#020b18', fontSize: '1rem',
                fontWeight: 700, letterSpacing: '3px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Bebas Neue', sans-serif",
                boxShadow: loading ? 'none' : '0 0 30px rgba(0,255,149,0.3)',
                transition: 'box-shadow 0.3s',
              }}
            >
              {loading ? '⟳  AUTHENTICATING...' : '⚡  SIGN IN'}
            </MagneticButton>

            <p style={{
              textAlign: 'center', marginTop: '1.5rem',
              color: '#8b949e', fontSize: '0.85rem',
            }}>
              Don't have an account?{' '}
              <Link to="/register" style={{
                color: '#00ff95', fontWeight: 600, letterSpacing: '1px',
              }}>CREATE ACCOUNT →</Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  )
}

export default Login