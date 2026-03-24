import { useState, useRef, useCallback } from 'react'
import axios from 'axios'
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
      const { data } = await axios.post('/api/classify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(data)
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
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1>Waste Image Analyser</h1>
        <p>Upload any photo. Our AI will determine if it contains garbage and guide you on proper disposal.</p>
      </header>

      <div className="upload-layout">
        {/* Left: Drop zone + preview */}
        <div className="upload-panel">
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
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
              <div className="preview-actions">
                <button className="btn btn-primary" onClick={classify} disabled={loading} id="classify-btn">
                  {loading ? '🔍 Analysing…' : '🔍 Classify Waste'}
                </button>
                <button className="btn btn-ghost" onClick={reset} disabled={loading} id="reset-btn">
                  🔄 New Image
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="error-box fade-in">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Right: Result */}
        <div className="result-panel">
          {loading && (
            <div className="loading-state fade-in">
              <div className="spinner" />
              <p>AI is analysing your image…</p>
            </div>
          )}
          {!loading && result && <ResultCard result={result} />}
          {!loading && !result && !error && (
            <div className="placeholder-state">
              <div className="placeholder-icon">🌍</div>
              <p>Your classification results will appear here</p>
              <p className="placeholder-sub">Upload an image to get started</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
