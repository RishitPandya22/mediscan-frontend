import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div style={styles.container}>
      {/* Animated background grid */}
      <div style={styles.grid} />

      {/* Glowing orbs */}
      <div style={{...styles.orb, top: '10%', left: '15%', background: '#00ff9520'}} />
      <div style={{...styles.orb, top: '60%', right: '10%', background: '#00b4ff20'}} />
      <div style={{...styles.orb, bottom: '10%', left: '40%', background: '#ff006e15'}} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>⚕</div>
          <h1 style={styles.logoText}>MEDISCAN AI</h1>
          <p style={styles.logoSub}>[ DISEASE RISK DETECTION SYSTEM ]</p>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Form */}
        <div style={styles.form}>
          <p style={styles.welcomeText}>WELCOME BACK</p>
          <p style={styles.welcomeSub}>Sign in to access your health dashboard</p>

          {error && (
            <div style={styles.errorBox}>
              ⚠ {error}
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>EMAIL ADDRESS</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>✉</span>
              <input
                style={styles.input}
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>PASSWORD</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          <button
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? '⟳ AUTHENTICATING...' : '⚡ SIGN IN'}
          </button>

          <p style={styles.registerText}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.registerLink}>
              CREATE ACCOUNT →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#020b18',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Courier New', monospace",
    position: 'relative',
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0,255,149,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,149,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    zIndex: 0,
  },
  orb: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    filter: 'blur(80px)',
    zIndex: 0,
  },
  card: {
    background: 'linear-gradient(135deg, #0d1f2d, #0a1628)',
    border: '1px solid #00ff9530',
    borderRadius: '20px',
    padding: '3rem',
    width: '100%',
    maxWidth: '440px',
    position: 'relative',
    zIndex: 1,
    boxShadow: '0 0 60px rgba(0,255,149,0.08), 0 0 120px rgba(0,180,255,0.05)',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  logoIcon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  logoText: {
    fontFamily: "'Courier New', monospace",
    fontSize: '1.8rem',
    fontWeight: '900',
    background: 'linear-gradient(90deg, #00ff95, #00b4ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '4px',
    margin: '0',
  },
  logoSub: {
    color: '#00ff9560',
    fontSize: '0.7rem',
    letterSpacing: '2px',
    marginTop: '0.3rem',
  },
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #00ff9540, transparent)',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  welcomeText: {
    color: '#c9d1d9',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    letterSpacing: '3px',
    margin: '0',
  },
  welcomeSub: {
    color: '#8b949e',
    fontSize: '0.85rem',
    margin: '0',
  },
  errorBox: {
    background: '#2d0d0d',
    border: '1px solid #ff444460',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#ff6b6b',
    fontSize: '0.85rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    color: '#00ff9580',
    fontSize: '0.7rem',
    letterSpacing: '2px',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: '#020b18',
    border: '1px solid #00ff9530',
    borderRadius: '8px',
    padding: '0 1rem',
    transition: 'border-color 0.3s',
  },
  inputIcon: {
    marginRight: '0.75rem',
    fontSize: '0.9rem',
    opacity: 0.6,
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#c9d1d9',
    fontSize: '0.95rem',
    padding: '0.85rem 0',
    fontFamily: "'Courier New', monospace",
  },
  button: {
    background: 'linear-gradient(90deg, #00ff95, #00b4ff)',
    color: '#020b18',
    border: 'none',
    borderRadius: '8px',
    padding: '0.9rem',
    fontSize: '0.95rem',
    fontWeight: '900',
    letterSpacing: '2px',
    cursor: 'pointer',
    marginTop: '0.5rem',
    fontFamily: "'Courier New', monospace",
    transition: 'all 0.3s',
  },
  registerText: {
    color: '#8b949e',
    fontSize: '0.85rem',
    textAlign: 'center',
    margin: '0',
  },
  registerLink: {
    color: '#00ff95',
    textDecoration: 'none',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
}

export default Login