import styles from './FAQEditor.module.css'

export default function FAQEditor({ faqs, onChange }) {
  function updateAt(index, field, value) {
    const next = faqs.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    onChange(next)
  }

  function removeAt(index) {
    onChange(faqs.filter((_, i) => i !== index))
  }

  function addFaq() {
    onChange([...faqs, { question: '', answer: '' }])
  }

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h3 className={styles.heading}>FAQs</h3>
        <button type="button" className={styles.addBtn} onClick={addFaq}>
          Add FAQ
        </button>
      </div>
      {faqs.length === 0 ? (
        <p className={styles.hint}>No FAQs yet. Add common questions customers ask.</p>
      ) : (
        <ul className={styles.list}>
          {faqs.map((faq, index) => (
            <li key={index} className={styles.item}>
              <label className={styles.label}>
                Question
                <input
                  className={styles.input}
                  value={faq.question}
                  onChange={(e) => updateAt(index, 'question', e.target.value)}
                  placeholder="e.g. What are your hours?"
                />
              </label>
              <label className={styles.label}>
                Answer
                <textarea
                  className={styles.textarea}
                  value={faq.answer}
                  onChange={(e) => updateAt(index, 'answer', e.target.value)}
                  placeholder="Clear, helpful answer"
                  rows={3}
                />
              </label>
              <button type="button" className={styles.remove} onClick={() => removeAt(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
