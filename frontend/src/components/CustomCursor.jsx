import { useEffect, useRef } from 'react'
import './CustomCursor.css'

export default function CustomCursor() {
  const spotlightRef = useRef(null)

  useEffect(() => {
    const el = spotlightRef.current
    if (!el) return

    const onMove = (e) => {
      el.style.background = `radial-gradient(
        600px circle at ${e.clientX}px ${e.clientY}px,
        rgba(124, 58, 237, 0.12) 0%,
        rgba(236, 72, 153, 0.05) 40%,
        transparent 65%
      )`
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return <div ref={spotlightRef} className="cursor-spotlight" />
}
