import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createAgent, uploadKnowledgeDocuments } from '../api/agents'
import FAQEditor from '../components/FAQEditor'
import KnowledgeFilesEditor from '../components/KnowledgeFilesEditor'
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
  const [botKnowledge, setBotKnowledge] = useState('')
  const [tone, setTone] = useState('friendly')
  const [faqs, setFaqs] = useState([])
  const [pendingFiles, setPendingFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (botKnowledge.trim().length < 10) {
      toast.error('Bot knowledge must be at least 10 characters')
      return
    }
    setLoading(true)
    try {
      const created = await createAgent({
        name: name.trim(),
        bot_knowledge: botKnowledge.trim(),
        tone,
        faqs: normalizeFaqs(faqs),
      })
      if (pendingFiles.length > 0) {
        try {
          const { warnings } = await uploadKnowledgeDocuments(created.id, pendingFiles)
          if (warnings && typeof warnings === 'string' && warnings.trim()) {
            toast(warnings.split(' | ').slice(0, 3).join(' · '), {
              duration: 8000,
            })
          }
        } catch (pdfErr) {
          toastApiError(pdfErr, 'File upload failed. You can retry from Edit.')
          navigate(`/bots/${created.id}/edit`, { replace: true })
          return
        }
      }
      toast.success('Bot created!')
      navigate('/dashboard')
    } catch (err) {
      toastApiError(err, 'Could not create bot')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>Create bot</h1>
      <p className={styles.lead}>
        Name your bot, define its knowledge and scope in one place, then layer on files and FAQs to train
        it further.
      </p>

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
          Bot knowledge
          <textarea
            className={styles.textarea}
            value={botKnowledge}
            onChange={(e) => setBotKnowledge(e.target.value)}
            required
            minLength={10}
            rows={8}
            disabled={loading}
            placeholder="Who is this bot for, what should it help with, tone and boundaries, products or services, hours, links, anything it should always keep in mind…"
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

        <KnowledgeFilesEditor
          disabled={loading}
          pendingFiles={pendingFiles}
          onAddFiles={(picked) =>
            setPendingFiles((prev) => [
              ...prev,
              ...picked.filter((x) => !prev.some((p) => p.name === x.name && p.size === x.size)),
            ])
          }
          onRemovePending={(idx) => setPendingFiles((prev) => prev.filter((_, i) => i !== idx))}
        />

        <FAQEditor faqs={faqs} onChange={setFaqs} />

        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? <span className={styles.spinner} aria-hidden /> : 'Create bot'}
        </button>
      </form>
    </main>
  )
}
