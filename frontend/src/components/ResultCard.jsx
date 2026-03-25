import CategoryBadge from './CategoryBadge'
import YoutubeSection from './YoutubeSection'
import WasteQA from './WasteQA'
import './ResultCard.css'

export default function ResultCard({ result }) {
  if (!result) return null

  const { is_garbage, category, confidence, reasoning, tips_data } = result
  const pct = Math.round((confidence || 0) * 100)

  return (
    <div className={`result-card fade-in ${is_garbage ? 'garbage' : 'clean'}`}>
      {/* Verdict */}
      <div className="verdict">
        <span className="verdict-icon">{is_garbage ? '🗑️' : '✅'}</span>
        <div className="verdict-text">
          <div className="verdict-title">
            {is_garbage ? 'Garbage Detected' : 'Not Garbage'}
          </div>
          <div className="verdict-subtitle">{reasoning}</div>
        </div>
        {category && <CategoryBadge category={category} size="lg" />}
      </div>

      {/* Confidence */}
      <div className="confidence-section">
        <div className="confidence-label">
          <span>AI Confidence</span>
          <span className="confidence-pct">{pct}%</span>
        </div>
        <div className="confidence-bar-track">
          <div
            className="confidence-bar-fill"
            style={{
              width: `${pct}%`,
              background: is_garbage
                ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                : 'linear-gradient(90deg, var(--accent), var(--accent-cyan))',
            }}
          />
        </div>
      </div>

      <div className="section-divider" />

      {/* Tips */}
      {tips_data && (
        <div className="tips-section">
          <div className="tips-description">{tips_data.description}</div>

          <div className="tips-grid">
            <div className="tips-group">
              <div className="tips-group-title">🗂️ Disposal / Handling</div>
              <ul>
                {tips_data.disposal.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="tips-group">
              <div className="tips-group-title">💡 Reuse / Upcycle</div>
              <ul>
                {tips_data.reuse.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="carbon-box">
            <span className="carbon-icon">🌿</span>
            <span>{tips_data.carbon_saving}</span>
          </div>
        </div>
      )}

      <div className="section-divider" />

      {/* YouTube */}
      {is_garbage && <YoutubeSection category={category} />}

      {/* Ask Gemini */}
      <WasteQA category={category} itemDescription={tips_data?.description} />
    </div>
  )
}
