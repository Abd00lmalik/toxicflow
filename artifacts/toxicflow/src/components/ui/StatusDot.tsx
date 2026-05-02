export function StatusDot({ status }: { status: 'live' | 'pending' | 'offline' | 'unknown' }) {
  const colors = {
    live: 'var(--trusted)',
    pending: 'var(--stale)',
    offline: 'var(--toxic)',
    unknown: 'var(--neutral)',
  }
  const c = colors[status]
  return (
    <span style={{
      display: 'inline-block',
      width: 8, height: 8,
      borderRadius: '50%',
      background: c,
      boxShadow: `0 0 6px ${c}`,
      flexShrink: 0,
    }} />
  )
}
