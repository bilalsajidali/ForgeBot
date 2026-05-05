import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getAgent, updateAgent, uploadKnowledgeDocuments, deleteKnowledgeDocument } from '../api/agents'
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
  const [botKnowledge, setBotKnowledge] = useState('')
  const [tone, setTone] = useState('friendly')
  const [faqs, setFaqs] = useState([])
  const [documents, setDocuments] = useState([])
  const [pendingFiles, setPendingFiles] = useState([])
  const [loadState, setLoadState] = useState('loading')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const agent = await getAgent(id)
        if (cancelled) return
        setName(agent.name)
        setBotKnowledge(agent.bot_knowledge ?? '')
        setTone(agent.tone || 'friendly')
        setFaqs(faqsFromAgent(agent))
        setDocuments(agent.documents || [])
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
    if (botKnowledge.trim().length < 10) {
      toast.error('Bot knowledge must be at least 10 characters')
      return
    }
    setSaving(true)
    try {
      await updateAgent(id, {
        name: name.trim(),
        bot_knowledge: botKnowledge.trim(),
        tone,
        faqs: normalizeFaqs(faqs),
      })
      if (pendingFiles.length > 0) {
        const { agent: refreshed, warnings } = await uploadKnowledgeDocuments(id, pendingFiles)
        setDocuments(refreshed.documents || [])
        setPendingFiles([])
        if (warnings && warnings.trim()) {
          toast(warnings.split(' | ').slice(0, 3).join(' · '), { duration: 8000 })
        }
      }
      toast.success('Bot saved')
      navigate('/dashboard')
    } catch (err) {
      toastApiError(err, 'Could not save bot')
    } finally {
      setSaving(false)
    }
  }

  async function handleRemoveDocument(docIndex) {
    try {
      const updated = await deleteKnowledgeDocument(id, docIndex)
      setDocuments(updated.documents || [])
      toast.success('File removed')
    } catch (err) {
      toastApiError(err, 'Could not remove file')
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
        <button type="button" className={styles.submit} onClick={() => navigate('/dashboard')}>
          Dashboard
        </button>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>Edit bot</h1>
      <p className={styles.lead}>
        Keep the bot name and core knowledge fresh, add PDFs/DOCX/TXT, and tune structured FAQs.
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
            disabled={saving}
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
            disabled={saving}
            placeholder="Scope, audience, products, policies, what to avoid, anything the bot should always remember…"
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

        <KnowledgeFilesEditor
          disabled={saving}
          existingDocuments={documents}
          onRemoveExisting={handleRemoveDocument}
          pendingFiles={pendingFiles}
          onAddFiles={(picked) =>
            setPendingFiles((prev) => [
              ...prev,
              ...picked.filter((x) => !prev.some((p) => p.name === x.name && p.size === x.size)),
            ])
          }
          onRemovePending={(idx) =>
            setPendingFiles((prev) => prev.filter((_, i) => i !== idx))
          }
        />

        <FAQEditor faqs={faqs} onChange={setFaqs} />

        <button type="submit" className={styles.submit} disabled={saving}>
          {saving ? <span className={styles.spinner} aria-hidden /> : 'Save changes'}
        </button>
      </form>
    </main>
  )
}
