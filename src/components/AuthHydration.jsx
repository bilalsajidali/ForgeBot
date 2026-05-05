import { useEffect, useState } from 'react'
import { getMe } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import styles from './AuthHydration.module.css'

export default function AuthHydration({ children }) {
  const token = useAuthStore((s) => s.token)
  const [ready, setReady] = useState(() => {
    const t = useAuthStore.getState().token
    const u = useAuthStore.getState().user
    if (!t) return true
    if (u) return true
    return false
  })

  useEffect(() => {
    let cancelled = false

    async function run() {
      const { user, token: t, setAuth, logout } = useAuthStore.getState()
      if (!t) {
        setReady(true)
        return
      }
      if (user) {
        setReady(true)
        return
      }
      try {
        const me = await getMe()
        if (!cancelled) setAuth(me, t)
      } catch {
        if (!cancelled) logout()
      } finally {
        if (!cancelled) setReady(true)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [token])

  if (!ready) {
    return (
      <div className={styles.wrap}>
        <div className={styles.spinner} aria-label="Loading" />
        <p className={styles.text}>Loading…</p>
      </div>
    )
  }

  return children
}
