import { useNavigate } from 'react-router-dom'
import styles from './BotCard.module.css'

const tones = {
  friendly: styles.toneFriendly,
  formal: styles.toneFormal,
  sales: styles.toneSales,
}

export default function BotCard({ agent, onDelete }) {
  const navigate = useNavigate()
  const toneClass = tones[agent.tone] ?? styles.toneDefault

  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.title}>{agent.name}</h3>
        <span className={`${styles.tone} ${toneClass}`}>{agent.tone}</span>
      </div>
      <p className={styles.biz}>{agent.business_name}</p>
      <div className={styles.flags}>
        <span className={agent.is_active ? styles.active : styles.inactive}>
          {agent.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.btnGhost}
          onClick={() => navigate(`/bots/${agent.id}/test`)}
        >
          Test
        </button>
        <button
          type="button"
          className={styles.btnGhost}
          onClick={() => navigate(`/bots/${agent.id}/edit`)}
        >
          Edit
        </button>
        <button type="button" className={styles.btnDanger} onClick={() => onDelete(agent)}>
          Delete
        </button>
      </div>
    </article>
  )
}
