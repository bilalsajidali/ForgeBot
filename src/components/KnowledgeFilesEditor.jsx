import styles from './KnowledgeFilesEditor.module.css'

const ACCEPT =
  '.pdf,.doc,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain'

function isAllowedFile(file) {
  const n = file.name.toLowerCase()
  if (/\.(pdf|docx|txt)$/.test(n)) return true
  if (n.endsWith('.doc') && !n.endsWith('.docx')) return true
  return ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(
    file.type
  )
}

export default function KnowledgeFilesEditor({
  disabled = false,
  existingDocuments = [],
  onRemoveExisting,
  pendingFiles = [],
  onAddFiles,
  onRemovePending,
}) {
  const showExisting = existingDocuments.length > 0
  const showPending = pendingFiles.length > 0

  function handleFilePick(e) {
    const picked = Array.from(e.target.files || []).filter(isAllowedFile)
    if (picked.length && onAddFiles) onAddFiles(picked)
    e.target.value = ''
  }

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h3 className={styles.heading}>More knowledge (files)</h3>
      </div>
      <p className={styles.hint}>
        Upload <strong>PDF</strong>, <strong>DOCX</strong>, or <strong>TXT</strong> for policies, catalogs, resumes, menus,
        and anything else that should sharpen answers. Plain text is extracted when you upload. Legacy{' '}
        <strong>.doc</strong> is not supported — save as DOCX instead. FAQs below add structured Q&A on top.
      </p>

      {showExisting && (
        <ul className={styles.list}>
          {existingDocuments.map((d, idx) => (
            <li key={`${d.filename}-${idx}`} className={styles.row}>
              <div className={styles.meta}>
                <span className={styles.fileName}>{d.filename}</span>
                <span className={styles.chars}>{d.chars.toLocaleString()} characters</span>
              </div>
              {typeof onRemoveExisting === 'function' && (
                <button
                  type="button"
                  className={styles.linkBtn}
                  disabled={disabled}
                  onClick={() => onRemoveExisting(idx)}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {showPending && (
        <>
          <p className={styles.subLabel}>Queued — uploads when you save (create/edit)</p>
          <ul className={styles.list}>
            {pendingFiles.map((f, idx) => (
              <li key={`${f.name}-${idx}-${f.size}`} className={styles.row}>
                <div className={styles.meta}>
                  <span className={styles.fileName}>{f.name}</span>
                  <span className={styles.chars}>{(f.size / 1024).toFixed(1)} KB</span>
                </div>
                {typeof onRemovePending === 'function' && (
                  <button
                    type="button"
                    className={styles.linkBtn}
                    disabled={disabled}
                    onClick={() => onRemovePending(idx)}
                  >
                    Undo
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <label className={`${styles.filePick} ${disabled ? styles.filePickDisabled : ''}`}>
        <input
          className={styles.fileInput}
          type="file"
          accept={ACCEPT}
          multiple
          disabled={disabled}
          onChange={handleFilePick}
        />
        <span className={styles.filePickBtn}>Add files</span>
      </label>
    </section>
  )
}
