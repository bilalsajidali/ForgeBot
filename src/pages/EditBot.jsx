import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getAgent, updateAgent } from '../api/agents'
import FAQEditor from '../components/FAQEditor'
import { toastApiError } from '../utils/errors'
import styles from './CreateBot.module.css'

function normalizeFaqs(faqs) {
  return faqs
    .map((f) => ({
      question: f.question.trim(),
      answer: f.answer.trim(),
    }))
    .filter((f) => f.question.length >= 3 && f.answer.length >= 1)
}

function faqsFromAgent(agent) {
  if (!agent?.faqs?.length) return []
  return agent.faqs.map((f) => ({
    question: f.question ?? '',
    answer: f.answer ?? '',
  }))
}

export default function EditBot() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessDescription, setBusinessDescription] = useState('')
  const [tone, setTone] = useState('friendly')
  const [faqs, setFaqs] = useState([])
  const [loadState, setLoadState] = useState('loading')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const agent = await getAgent(id)
        if (cancelled) return
        setName(agent.name)
        setBusinessName(agent.business_name)
        setBusinessDescription(agent.business_description)
        setTone(agent.tone || 'friendly')
        setFaqs(faqsFromAgent(agent))
        setLoadState('ready')
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

  async function handleSubmit(e) {
    e.preventDefault()
    if (businessDescription.trim().length < 10) {
      toast.error('Business description must be at least 10 characters')
      return
    }
    setSaving(true)
    try {
      await updateAgent(id, {
        name: name.trim(),
        business_name: businessName.trim(),
        business_description: businessDescription.trim(),
        tone,
        faqs: normalizeFaqs(faqs),
      })
      toast.success('Bot saved')
      navigate('/')
    } catch (err) {
      toastApiError(err, 'Could not save bot')
    } finally {
      setSaving(false)
    }
  }

  if (loadState === 'loading') {
    return (
      <main className={styles.main}>
        <p className={styles.lead}>Loading bot…</p>
      </main>
    )
  }

  if (loadState === 'error') {
    return (
      <main className={styles.main}>
        <p className={styles.lead}>Something went wrong. Go back to the dashboard.</p>
        <button type="button" className={styles.submit} onClick={() => navigate('/')}>
          Dashboard
        </button>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>Edit bot</h1>
      <p className={styles.lead}>Update training data and how your bot speaks.</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Bot name
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            disabled={saving}
          />
        </label>
        <label className={styles.label}>
          Business name
          <input
            className={styles.input}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            minLength={2}
            disabled={saving}
          />
        </label>
        <label className={styles.label}>
          Business description
          <textarea
            className={styles.textarea}
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            required
            minLength={10}
            rows={4}
            disabled={saving}
          />
        </label>
        <label className={styles.label}>
          Tone
          <select
            className={styles.select}
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            disabled={saving}
          >
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="sales">Sales</option>
          </select>
        </label>

        <FAQEditor faqs={faqs} onChange={setFaqs} />

        <button type="submit" className={styles.submit} disabled={saving}>
          {saving ? <span className={styles.spinner} aria-hidden /> : 'Save changes'}
        </button>
      </form>
    </main>
  )
}
