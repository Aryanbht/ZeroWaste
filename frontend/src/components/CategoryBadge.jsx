const CATEGORY_CONFIG = {
  'E-waste':  { icon: '💻', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  'Organic':  { icon: '🍂', color: '#22c55e', bg: 'rgba(34,197,94,0.15)'  },
  'Plastic':  { icon: '♻️', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  'Metal':    { icon: '🔩', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)'},
  'Glass':    { icon: '🍾', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)'  },
  'General':  { icon: '🗑️', color: '#6b7280', bg: 'rgba(107,114,128,0.15)'},
}

export default function CategoryBadge({ category, size = 'md' }) {
  if (!category) return null
  const cfg = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['General']
  const padding = size === 'lg' ? '8px 18px' : '5px 12px'
  const fontSize = size === 'lg' ? '1rem' : '0.8rem'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding,
        borderRadius: '99px',
        fontSize,
        fontWeight: 700,
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.color}40`,
        letterSpacing: '0.02em',
      }}
    >
      {cfg.icon} {category}
    </span>
  )
}

export { CATEGORY_CONFIG }
