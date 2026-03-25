import { useState, useEffect } from 'react'
import './YoutubeSection.css'

export default function YoutubeSection({ category }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!category) return
    setLoading(true)
    setData(null)
    fetch(`/api/youtube?category=${encodeURIComponent(category)}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [category])

  if (loading) {
    return (
      <div className="yt-section">
        <h4 className="yt-title">📺 Learn to Upcycle</h4>
        <div className="yt-skeletons">
          {[0, 1, 2].map(i => <div key={i} className="yt-skeleton" />)}
        </div>
      </div>
    )
  }

  if (!data) return null

  const { videos, search_url, query } = data

  return (
    <div className="yt-section fade-in">
      <div className="yt-header">
        <h4 className="yt-title">📺 Learn to Upcycle</h4>
        <a
          href={search_url}
          target="_blank"
          rel="noopener noreferrer"
          className="yt-see-all"
        >
          See all on YouTube ↗
        </a>
      </div>

      {videos.length > 0 ? (
        <div className="yt-grid">
          {videos.map(v => (
            <a
              key={v.videoId}
              href={`https://www.youtube.com/watch?v=${v.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="yt-card"
            >
              <div className="yt-thumb-wrap">
                <img src={v.thumbnail} alt={v.title} className="yt-thumb" />
                <div className="yt-play-btn">▶</div>
              </div>
              <div className="yt-info">
                <p className="yt-video-title">{v.title}</p>
                <p className="yt-channel">{v.channel}</p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        /* Fallback when no API key — still useful */
        <div className="yt-fallback">
          <p className="yt-fallback-text">
            Find creative ways to reuse <strong>{category}</strong> waste:
          </p>
          <a
            href={search_url}
            target="_blank"
            rel="noopener noreferrer"
            className="yt-search-btn"
          >
            🔍 Search "{query}" on YouTube
          </a>
        </div>
      )}
    </div>
  )
}
