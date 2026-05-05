import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createAgent } from '../api/agents'
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

export default function CreateBot() {
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessDescription, setBusinessDescription] = useState('')
  const [tone, setTone] = useState('friendly')
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (businessDescription.trim().length < 10) {
      toast.error('Business description must be at least 10 characters')
      return
    }
    setLoading(true)
    try {
      await createAgent({
        name: name.trim(),
        business_name: businessName.trim(),
        business_description: businessDescription.trim(),
        tone,
        faqs: normalizeFaqs(faqs),
      })
      toast.success('Bot created!')
      navigate('/')
    } catch (err) {
      toastApiError(err, 'Could not create bot')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>Create bot</h1>
      <p className={styles.lead}>Describe your business and train the bot with FAQs.</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Bot name
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />
        </label>
        <label className={styles.label}>
          Tone
          <select
            className={styles.select}
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            disabled={loading}
          >
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="sales">Sales</option>
          </select>
        </label>

        <FAQEditor faqs={faqs} onChange={setFaqs} />

        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? <span className={styles.spinner} aria-hidden /> : 'Create bot'}
        </button>
      </form>
    </main>
  )
}
