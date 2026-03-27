import { useState, useRef, useEffect } from 'react'
import client from '../api/client'
import './WasteQA.css'

export default function WasteQA({ category, itemDescription }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendQuestion = async () => {
    const question = input.trim()
    if (!question || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: question }])
    setLoading(true)

    try {
      const { data } = await client.post('/api/ask', {
        question,
        category,
        item_description: itemDescription,
      })
      setMessages(prev => [...prev, { role: 'ai', text: data.answer || 'Sorry, I could not get a response.' }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Connection error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendQuestion()
    }
  }

  const suggestions = [
    `Is ${category || 'this item'} recyclable in India?`,
    `How harmful is this to the environment?`,
    `Can children safely handle this waste?`,
  ]

  return (
    <div className="qa-section">
      <div className="qa-header">
        <span className="qa-icon">🤖</span>
        <div>
          <h4 className="qa-title">Ask Questions</h4>
          <p className="qa-subtitle">Ask anything about this {category || 'item'}</p>
        </div>
      </div>

      {/* Quick suggestion chips */}
      {messages.length === 0 && (
        <div className="qa-suggestions">
          {suggestions.map((s, i) => (
            <button key={i} className="qa-chip" onClick={() => { setInput(s) }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Chat messages */}
      {messages.length > 0 && (
        <div className="qa-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`qa-message ${msg.role}`}>
              <span className="qa-bubble">{msg.text}</span>
            </div>
          ))}
          {loading && (
            <div className="qa-message ai">
              <span className="qa-bubble qa-thinking">
                <span className="dot" /><span className="dot" /><span className="dot" />
              </span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input area */}
      <div className="qa-input-row">
        <input
          className="qa-input"
          type="text"
          placeholder={`Ask about ${category || 'this item'}…`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="qa-send-btn"
          onClick={sendQuestion}
          disabled={loading || !input.trim()}
        >
          {loading ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  )
}
