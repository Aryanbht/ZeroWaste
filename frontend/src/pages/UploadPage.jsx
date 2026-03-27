import { useState, useRef, useCallback } from 'react'
import client from '../api/client'
import ResultCard from '../components/ResultCard'
import './UploadPage.css'

export default function UploadPage() {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef(null)
  const resultRef = useRef(null)

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }
    setError(null)
    setResult(null)
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  const onInputChange = (e) => {
    if (e.target.files[0]) handleFile(e.target.files[0])
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  const classify = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await client.post('/api/classify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(data)
      // Smooth scroll to results
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Classification failed.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setPreview(null)
    setFile(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="page">
      {/* Hero Header */}
      <header className="page-header fade-in">
        <h1>Waste Image Analyser</h1>
        <p>Upload any photo — our AI identifies the item, suggests disposal methods, and answers your questions.</p>
      </header>

      {/* Upload / Preview area */}
      <div className="upload-hero fade-in">
        {!preview ? (
          <div
            className={`drop-zone ${dragging ? 'drag-over' : ''}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="drop-icon">📁</div>
            <p className="drop-title">Drop your image here</p>
            <p className="drop-sub">or click to browse · PNG, JPG, WEBP up to 20 MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onInputChange}
              style={{ display: 'none' }}
              id="file-input"
            />
          </div>
        ) : (
          <div className="preview-hero">
            <img src={preview} alt="Preview" className="preview-image-hero" />
            <div className="preview-actions-hero">
              <button className="btn btn-primary" onClick={classify} disabled={loading} id="classify-btn">
                {loading ? '🔍 Analysing…' : '🔍 Classify Waste'}
              </button>
              <button className="btn btn-ghost" onClick={reset} disabled={loading} id="reset-btn">
                🔄 New Image
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-box fade-in">⚠️ {error}</div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="loading-hero fade-in">
          <div className="spinner" />
          <p>AI is analysing your image…</p>
        </div>
      )}

      {/* Results — full width below */}
      {!loading && result && (
        <div className="results-section fade-in" ref={resultRef}>
          <ResultCard result={result} />
        </div>
      )}
    </main>
  )
}
