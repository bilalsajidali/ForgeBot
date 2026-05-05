import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login, getMe } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import { toastApiError } from '../utils/errors'
import styles from './Login.module.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { access_token } = await login(email, password)
      setAuth(null, access_token)
      const me = await getMe()
      setAuth(me, access_token)
      toast.success('Welcome back')
      navigate('/', { replace: true })
    } catch (err) {
      toastApiError(err, 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.sub}>BotForge — AI chatbots for your business</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </label>
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? <span className={styles.spinner} aria-hidden /> : 'Continue'}
          </button>
        </form>
        <p className={styles.footer}>
          No account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  )
}
