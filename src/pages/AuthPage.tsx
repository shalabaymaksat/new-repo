import { useState, type FormEvent } from 'react'
import { useStore } from '../state/store'

export default function AuthPage() {
  const { register, login } = useStore()
  const [mode, setMode] = useState<'register' | 'login'>('register')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (mode === 'register') {
      if (!name.trim()) return setError('Атыңды енгіз')
      setError(register(name.trim(), email.trim().toLowerCase(), password))
    } else {
      setError(login(email.trim().toLowerCase(), password))
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🚀</div>
        <h1>MarketSim</h1>
        <p className="auth-sub">Маркетологтарға арналған жұмыс симуляторы. Тіркел де, нағыз жобада junior-маркетолог ретінде жұмысты баста!</p>

        <div className="auth-tabs">
          <button className={mode === 'register' ? 'tab active' : 'tab'} onClick={() => setMode('register')}>Тіркелу</button>
          <button className={mode === 'login' ? 'tab active' : 'tab'} onClick={() => setMode('login')}>Кіру</button>
        </div>

        <form onSubmit={submit}>
          {mode === 'register' && (
            <input placeholder="Атың" value={name} onChange={(e) => setName(e.target.value)} />
          )}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Құпиясөз" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={4} />
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="btn-primary">
            {mode === 'register' ? 'Симуляцияны бастау 🚀' : 'Кіру'}
          </button>
        </form>

        <div className="auth-features">
          <span>🎯 Performance</span>
          <span>✍️ Content</span>
          <span>📊 Аналитика</span>
          <span>🎓 FMS курсы</span>
        </div>
      </div>
    </div>
  )
}
