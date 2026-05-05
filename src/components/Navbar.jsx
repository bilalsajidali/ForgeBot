import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { env } from '../config/env'
import styles from './Navbar.module.css'

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    toast.success('Signed out')
    navigate('/login', { replace: true })
  }

  return (
    <header className={styles.bar}>
      <Link to="/dashboard" className={styles.brand}>
        {env.appName}
      </Link>
      <div className={styles.right}>
        {user && (
          <>
            <span className={styles.name}>{user.name}</span>
            <span className={styles.planBadge}>{user.plan}</span>
            <button type="button" className={styles.logout} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  )
}
