import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getAgent } from '../api/agents'
import { sendTestMessage } from '../api/chat'
import ChatWindow from '../components/ChatWindow'
import { useAuthStore } from '../store/authStore'
import { toastApiError } from '../utils/errors'
import { buildEmbedSnippet } from '../config/embed'
import styles from './TestBot.module.css'

function summarizeKnowledge(text, maxChars = 180) {
  const t = (text || '').replace(/\s+/g, ' ').trim()
  if (!t) return ''
  return t.length > maxChars ? `${t.slice(0, maxChars)}…` : t
}

export default function TestBot() {
  const { id } = useParams()
  const patchUser = useAuthStore((s) => s.patchUser)
  const [agent, setAgent] = useState(null)
  const [loadState, setLoadState] = useState('loading')
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [chatDisabled, setChatDisabled] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getAgent(id)
        if (!cancelled) {
          setAgent(data)
          setLoadState('ready')
        }
      } catch (err) {
        if (!cancelled) {
          toastApiError(err, 'Could not load bot')
          setLoadState('error')
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [id])

  async function onSend(text) {
    if (!agent) return
    const prior = messages
    setMessages((m) => [...m, { role: 'user', content: text }])
    setTyping(true)
    setChatDisabled(true)

    const historySlice = prior.slice(-15).map(({ role, content }) => ({ role, content }))

    try {
      const res = await sendTestMessage(agent.id, text, historySlice)
      setMessages((m) => [...m, { role: 'assistant', content: res.reply }])
      patchUser({
        messages_used: res.messages_used,
        messages_limit: res.messages_limit,
      })
    } catch (err) {
      toastApiError(err, 'Could not get reply')
      setMessages((m) => m.slice(0, -1))
    } finally {
      setTyping(false)
      setChatDisabled(false)
    }
  }

  async function copyKey() {
    if (!agent) return
    try {
      await navigator.clipboard.writeText(agent.api_key)
      toast.success('API key copied')
    } catch {
      toast.error('Could not copy')
    }
  }

  async function copySnippet() {
    if (!agent) return
    try {
      await navigator.clipboard.writeText(EMBED_SNIPPET(agent.api_key))
      toast.success('Embed code copied')
    } catch {
      toast.error('Could not copy')
    }
  }

  if (loadState === 'loading' || !agent) {
    return (
      <main className={styles.main}>
        <p className={styles.muted}>Loading bot…</p>
      </main>
    )
  }

  if (loadState === 'error') {
    return (
      <main className={styles.main}>
        <p className={styles.muted}>Unable to load this bot.</p>
        <Link className={styles.back} to="/dashboard">
          ← Dashboard
        </Link>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div>
          <Link className={styles.back} to="/dashboard">
            ← Dashboard
          </Link>
          <h1 className={styles.title}>{agent.name}</h1>
          <p className={styles.sub}>{summarizeKnowledge(agent.bot_knowledge) || 'No knowledge summary yet.'}</p>
          {(agent.documents ?? []).length > 0 && (
            <p className={styles.kb}>
              {(agent.documents ?? []).length} uploaded file
              {(agent.documents ?? []).length === 1 ? '' : 's'} · knowledge library
            </p>
          )}
        </div>
      </div>

      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>API key</h2>
        <div className={styles.keyRow}>
          <code className={styles.key}>{agent.api_key}</code>
          <button type="button" className={styles.copyBtn} onClick={copyKey}>
            Copy
          </button>
        </div>

        <h2 className={styles.panelTitle}>Embed snippet</h2>
        <pre className={styles.snippet}>{buildEmbedSnippet(agent.api_key)}</pre>
        <button type="button" className={styles.copyBtn} onClick={copySnippet}>
          Copy embed code
        </button>
      </section>

      <section className={styles.chatSection}>
        <h2 className={styles.panelTitle}>Live test</h2>
        <ChatWindow
          messages={messages}
          typing={typing}
          onSend={onSend}
          disabled={chatDisabled || !agent.is_active}
        />
        {!agent.is_active && (
          <p className={styles.warn}>This bot is inactive. Enable it from the edit page to chat.</p>
        )}
      </section>
    </main>
  )
}
