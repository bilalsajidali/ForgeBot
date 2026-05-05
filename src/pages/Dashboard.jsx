import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getMe } from '../api/auth'
import { listAgents, deleteAgent } from '../api/agents'
import BotCard from '../components/BotCard'
import { useAuthStore } from '../store/authStore'
import { toastApiError } from '../utils/errors'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const setAuth = useAuthStore((s) => s.setAuth)
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [list, me] = await Promise.all([listAgents(), getMe()])
      setAgents(list)
      if (token) setAuth(me, token)
    } catch (err) {
      toastApiError(err, 'Could not load dashboard')
    } finally {
      setLoading(false)
    }
  }, [setAuth, token])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function handleDelete(agent) {
    if (!window.confirm(`Delete bot “${agent.name}”? This cannot be undone.`)) return
    try {
      await deleteAgent(agent.id)
      toast.success('Bot deleted')
      refresh()
    } catch (err) {
      toastApiError(err, 'Delete failed')
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.top}>
        <div>
          <h1 className={styles.h1}>Your bots</h1>
          <p className={styles.lead}>
            Manage assistants, tune tone, and try them before you embed.
          </p>
        </div>
        <button type="button" className={styles.create} onClick={() => navigate('/bots/create')}>
          Create New Bot
        </button>
      </div>

      {user && (
        <section className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Messages today</span>
            <strong className={styles.statValue}>
              {user.messages_used} / {user.messages_limit}
            </strong>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Plan</span>
            <span className={styles.planPill}>{user.plan}</span>
          </div>
        </section>
      )}

      {loading ? (
        <p className={styles.muted}>Loading bots…</p>
      ) : agents.length === 0 ? (
        <div className={styles.empty}>
          <h2 className={styles.emptyTitle}>No bots yet</h2>
          <p className={styles.emptyText}>
            Create your first bot to answer FAQs in your brand voice.
          </p>
          <button type="button" className={styles.create} onClick={() => navigate('/bots/create')}>
            Create New Bot
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {agents.map((a) => (
            <BotCard key={a.id} agent={a} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </main>
  )
}
