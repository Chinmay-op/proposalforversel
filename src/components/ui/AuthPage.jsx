import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  fontSize: 14,
  fontWeight: 500,
  color: '#E2E8F0',
  background: 'rgba(30, 41, 59, 0.6)',
  border: '1px solid rgba(51, 65, 85, 0.4)',
  borderRadius: 10,
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
}

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#94A3B8',
  marginBottom: 6,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
}

function AuthInput({ id, type, value, onChange, placeholder, autoComplete }) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      style={inputStyle}
      onFocus={(e) => {
        e.target.style.borderColor = 'rgba(14, 165, 233, 0.5)'
        e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.08)'
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'rgba(51, 65, 85, 0.4)'
        e.target.style.boxShadow = 'none'
      }}
    />
  )
}

export function AuthPage() {
  const { login, signup, authError, clearError } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login')
    setLocalError('')
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    clearError()

    if (!email.trim() || !password.trim()) {
      setLocalError('Please fill in all fields.')
      return
    }
    if (mode === 'signup') {
      if (password.length < 6) { setLocalError('Password must be at least 6 characters.'); return }
      if (password !== confirmPassword) { setLocalError('Passwords do not match.'); return }
    }

    setIsSubmitting(true)
    try {
      if (mode === 'login') await login(email, password)
      else await signup(email, password)
    } catch { /* error set in context */ } finally { setIsSubmitting(false) }
  }

  const displayError = localError || authError

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#060A14', position: 'relative', overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* BG effects */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '-15%', right: '-5%', width: '45%', height: '55%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(51,65,85,0.12) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, padding: '0 20px', animation: 'authFadeIn 0.5s ease' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #0EA5E9, #8B5CF6)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px rgba(14,165,233,0.3), 0 0 48px rgba(139,92,246,0.15)', marginBottom: 16 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.03em', margin: 0 }}>AI Proposal Generator</h1>
          <p style={{ fontSize: 13, color: '#475569', marginTop: 6, fontWeight: 500 }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(24px)', border: '1px solid rgba(51,65,85,0.25)', borderRadius: 16, padding: '32px 28px', boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Email</label>
              <AuthInput id="auth-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" />
            </div>
            <div style={{ marginBottom: mode === 'signup' ? 18 : 8 }}>
              <label style={labelStyle}>Password</label>
              <AuthInput id="auth-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
            </div>
            {mode === 'signup' && (
              <div style={{ marginBottom: 8 }}>
                <label style={labelStyle}>Confirm Password</label>
                <AuthInput id="auth-confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
              </div>
            )}
            {displayError && (
              <div style={{ margin: '14px 0', padding: '10px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5', fontSize: 13, fontWeight: 500 }}>
                {displayError}
              </div>
            )}
            <button id="auth-submit" type="submit" disabled={isSubmitting} style={{
              width: '100%', padding: '13px 0', marginTop: 16, fontSize: 14, fontWeight: 700, color: '#FFF',
              background: isSubmitting ? 'rgba(51,65,85,0.4)' : 'linear-gradient(135deg, #0EA5E9, #8B5CF6)',
              border: 'none', borderRadius: 10, cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: isSubmitting ? 'none' : '0 4px 16px rgba(14,165,233,0.25)',
              letterSpacing: '0.02em',
            }}>
              {isSubmitting
                ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#64748B' }}>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={toggleMode} style={{ background: 'none', border: 'none', color: '#38BDF8', fontWeight: 600, cursor: 'pointer', fontSize: 13, padding: 0 }}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#334155', marginTop: 20, fontWeight: 500 }}>
          Powered by Azure GPT-5 · Two-Phase CoT+ReAct Engine
        </p>
      </div>

      <style>{`
        @keyframes authFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
