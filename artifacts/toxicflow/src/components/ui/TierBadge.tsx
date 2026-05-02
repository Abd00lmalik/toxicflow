import React from 'react'

interface TierBadgeProps {
  tier: number
  size?: 'sm' | 'md' | 'lg'
  showFee?: boolean
}

const TIERS = {
  0: { label: 'Neutral', color: 'var(--neutral)', bg: 'var(--neutral-2)', fee: '30 bps' },
  1: { label: 'Trusted', color: 'var(--trusted)', bg: 'var(--trusted-2)', fee: '10 bps' },
  2: { label: 'Toxic', color: 'var(--toxic)', bg: 'var(--toxic-2)', fee: '80 bps' },
}

export function TierBadge({ tier, size = 'md', showFee = false }: TierBadgeProps) {
  const t = TIERS[tier as keyof typeof TIERS] ?? TIERS[0]
  const pad = size === 'sm' ? '2px 8px' : size === 'lg' ? '6px 16px' : '4px 12px'
  const fs = size === 'sm' ? 11 : size === 'lg' ? 15 : 12
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: pad,
      background: t.bg,
      border: `1px solid ${t.color}33`,
      borderRadius: 'var(--r-sm)',
      color: t.color,
      fontSize: fs,
      fontWeight: 600,
      letterSpacing: '0.04em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.color, display: 'inline-block', boxShadow: `0 0 6px ${t.color}` }} />
      {t.label}
      {showFee && <span style={{ color: t.color, opacity: 0.7, fontWeight: 400 }}>· {t.fee}</span>}
    </span>
  )
}
