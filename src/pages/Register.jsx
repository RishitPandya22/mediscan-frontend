import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'

function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async () => {
    if (!fullName || !username || !email || !password || !confirm) {
      setError('Please fill in all fields')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match!')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')

    // Sign up with Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, username }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Save username + full name to profiles table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username,
          full_name: fullName
        })

      if (profileError && !profileError.message.includes('duplicate')) {
        setError(profileError.message)
        setLoading(false)
        return
      }
    }

    setLoading(false)
    setSuccess('Account created! Redirecting to login...')
    setTimeout(() => navigate('/login'), 2000)
  }

  return (
    <div style={styles.container}>
      <div style={styles.grid} />
      <div style={{...styles.orb, top: '10%', left: '15%', background: '#00ff9520'}} />
      <div style={{...styles.orb, top: '60%', right: '10%', background: '#00b4ff20'}} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>⚕</div>
          <h1 style={styles.logoText}>MEDISCAN AI</h1>
          <p style={styles.logoSub}>[ CREATE YOUR ACCOUNT ]</p>
        </div>

        <div style={styles.divider} />

        <div style={styles.form}>
          <p style={styles.welcomeText}>JOIN MEDISCAN</p>
          <p style={styles.welcomeSub}>Create your free account to get started</p>

          {error && <div style={styles.errorBox}>⚠ {error}</div>}
          {success && <div style={styles.successBox}>✅ {success}</div>}

          {/* Full Name */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>FULL NAME</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>👤</span>
              <input
                style={styles.input}
                type="text"
                placeholder="Rishit Pandya"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          {/* Username */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>USERNAME</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>@</span>
              <input
                style={styles.input}
                type="text"
                placeholder="rishit_pandya"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
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
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>PASSWORD</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                style={styles.input}
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>CONFIRM PASSWORD</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                style={styles.input}
                type="password"
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
              />
            </div>
          </div>

          <button
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? '⟳ CREATING ACCOUNT...' : '🚀 CREATE ACCOUNT'}
          </button>

          <p style={styles.loginText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.loginLink}>
              SIGN IN →
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
    padding: '2rem 0',
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
    gap: '0.85rem',
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
  successBox: {
    background: '#0d2818',
    border: '1px solid #00ff9560',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#00ff95',
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
  },
  loginText: {
    color: '#8b949e',
    fontSize: '0.85rem',
    textAlign: 'center',
    margin: '0',
  },
  loginLink: {
    color: '#00ff95',
    textDecoration: 'none',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
}

export default Register