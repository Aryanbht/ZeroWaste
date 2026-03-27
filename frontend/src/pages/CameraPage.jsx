import { useState, useRef, useEffect, useCallback } from 'react'
import ResultCard from '../components/ResultCard'
import CategoryBadge from '../components/CategoryBadge'
import './CameraPage.css'

const FRAME_INTERVAL_MS = 5000

export default function CameraPage() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const wsRef = useRef(null)
  const intervalRef = useRef(null)

  const [active, setActive] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const [error, setError] = useState(null)
  const [wsStatus, setWsStatus] = useState('idle') // idle | connecting | connected | error
  const [analysing, setAnalysing] = useState(false)

  // ─── Start camera + WS ───────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setError(null)
    setLastResult(null)
    setWsStatus('connecting')

    // 1. Get webcam stream
    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions and try again.')
      setWsStatus('idle')
      return
    }

    if (videoRef.current) {
      videoRef.current.srcObject = stream
      await videoRef.current.play().catch(() => {})
    }

    // 2. Open WebSocket
    const isProd = import.meta.env.PROD
    const wsHost = isProd ? 'zerowaste-8dxa.onrender.com' : 'localhost:8000'
    const wsProtocol = isProd ? 'wss' : 'ws'
    const wsUrl = `${wsProtocol}://${wsHost}/api/ws/realtime`

    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      setWsStatus('connected')
      setActive(true)
    }

    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data)
        setLastResult(data)
        setAnalysing(false)
      } catch {
        setAnalysing(false)
      }
    }

    ws.onerror = () => {
      setError(`WebSocket connection failed. Make sure the backend is running at ${wsHost}.`)
      setWsStatus('error')
      stopCamera()
    }

    ws.onclose = () => {
      setWsStatus('idle')
    }
  }, [])

  // ─── Stop camera + WS ────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (wsRef.current) wsRef.current.close()
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      videoRef.current.srcObject = null
    }
    setActive(false)
    setWsStatus('idle')
    setAnalysing(false)
  }, [])

  // ─── Send frames loop ─────────────────────────────────────────────────
  useEffect(() => {
    if (!active) return
    intervalRef.current = setInterval(() => {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ws = wsRef.current
      if (!video || !canvas || !ws || ws.readyState !== WebSocket.OPEN) return
      if (video.readyState < 2) return

      canvas.width = 320
      canvas.height = 240
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, 320, 240)
      const frame = canvas.toDataURL('image/jpeg', 0.7)
      ws.send(JSON.stringify({ frame }))
      setAnalysing(true)
    }, FRAME_INTERVAL_MS)

    return () => clearInterval(intervalRef.current)
  }, [active])

  // cleanup on unmount
  useEffect(() => () => stopCamera(), [stopCamera])

  const statusDot = wsStatus === 'connected'
    ? 'dot-green' : wsStatus === 'connecting'
    ? 'dot-yellow' : wsStatus === 'error'
    ? 'dot-red' : 'dot-gray'

  return (
    <main className="page">
      <header className="page-header">
        <h1>Live Waste Detector</h1>
        <p>Turn on your camera and point it at any object. Our AI will detect garbage in real-time.</p>
      </header>

      <div className="camera-layout">
        {/* Camera feed */}
        <div className="camera-panel">
          <div className="camera-viewport">
            <video ref={videoRef} className="camera-video" playsInline muted />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {!active && (
              <div className="camera-overlay-center">
                <div className="camera-idle-icon">🎥</div>
                <p>Camera is off</p>
              </div>
            )}

            {active && analysing && (
              <div className="scanning-badge pulsing">🔍 Scanning…</div>
            )}

            {active && lastResult && !analysing && (
              <div className="live-badge">
                {lastResult.is_garbage
                  ? <><span className="live-verdict garbage">🗑️ Garbage</span> <CategoryBadge category={lastResult.category} /></>
                  : <span className="live-verdict clean">✅ Not Garbage</span>
                }
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="camera-controls">
            <div className="ws-status">
              <span className={`status-dot ${statusDot}`} />
              <span>
                {wsStatus === 'idle' && 'Camera off'}
                {wsStatus === 'connecting' && 'Connecting…'}
                {wsStatus === 'connected' && 'Live — analysing every 5s'}
                {wsStatus === 'error' && 'Connection error'}
              </span>
            </div>
            {!active
              ? <button className="btn btn-primary" onClick={startCamera} id="start-camera-btn">🎥 Start Camera</button>
              : <button className="btn btn-ghost" onClick={stopCamera} id="stop-camera-btn">⏹ Stop Camera</button>
            }
          </div>

          {error && (
            <div className="cam-error fade-in">⚠️ {error}</div>
          )}
        </div>

        {/* Results panel */}
        <div className="cam-result-panel">
          {lastResult ? (
            <ResultCard result={lastResult} key={JSON.stringify(lastResult)} />
          ) : (
            <div className="cam-placeholder">
              <div style={{ fontSize: '3.5rem' }}>📡</div>
              <p>Live results appear here</p>
              <p className="placeholder-sub">Start your camera to begin detection</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
