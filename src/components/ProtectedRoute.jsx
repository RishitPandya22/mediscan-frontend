import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../supabase'

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Show loading screen while checking
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#020b18',
        color: '#00ff95',
        fontFamily: 'monospace',
        fontSize: '1.2rem',
        letterSpacing: '3px'
      }}>
        ⚕ MEDISCAN AI — LOADING...
      </div>
    )
  }

  // If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If logged in → show the page
  return children
}

export default ProtectedRoute