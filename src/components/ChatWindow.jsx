import { useRef, useEffect, useState } from 'react'
import styles from './ChatWindow.module.css'

export default function ChatWindow({ messages, typing, onSend, disabled }) {
  const bottomRef = useRef(null)
  const [text, setText] = useState('')

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function submit(e) {
    e.preventDefault()
    const t = text.trim()
    if (!t || disabled) return
    onSend(t)
    setText('')
  }

  return (
    <div className={styles.shell}>
      <div className={styles.stream}>
        {messages.length === 0 && !typing && (
          <p className={styles.placeholder}>Send a message to test your bot.</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === 'user' ? styles.bubbleUser : styles.bubbleBot}
          >
            <p className={styles.bubbleText}>{m.content}</p>
          </div>
        ))}
        {typing && (
          <div className={styles.bubbleBot}>
            <span className={styles.typing}>…</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <form className={styles.compose} onSubmit={submit}>
        <input
          className={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          disabled={disabled}
          autoComplete="off"
        />
        <button type="submit" className={styles.send} disabled={disabled || !text.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}
