import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { WalletConnector } from '@/components/wallet/WalletConnector'

function ToxicFlowMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="#00D166"/>
      <path d="M7 16 Q11 9.5 16 16 Q21 22.5 25 16" stroke="#010208" strokeWidth="2.6" strokeLinecap="round" fill="none"/>
      <circle cx="16" cy="16" r="2.2" fill="#010208"/>
    </svg>
  )
}

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/passport', label: 'Passport' },
  { href: '/swap', label: 'Swap' },
  { href: '/records', label: 'Records' },
  { href: '/pool-defense', label: 'Pool Defense' },
  { href: '/developers', label: 'Developers' },
  { href: '/demo', label: 'Demo' },
]

export function Nav() {
  const [location] = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 64,
      background: 'var(--glass)', borderBottom: '1px solid var(--glass-border)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      display: 'flex', alignItems: 'center', padding: '0 24px',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', marginRight: 36, flexShrink: 0 }}>
        <ToxicFlowMark size={28} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--fg)', letterSpacing: '-0.01em' }}>ToxicFlow</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, overflow: 'hidden' }}>
        {links.map(l => {
          const active = location === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--r-sm)',
                fontSize: 13,
                fontFamily: 'var(--font-display)',
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--fg)' : 'var(--fg-3)',
                background: active ? 'var(--b-soft)' : 'transparent',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => {
                if (!active) { (e.currentTarget as HTMLElement).style.color = 'var(--fg-2)' }
              }}
              onMouseLeave={e => {
                if (!active) { (e.currentTarget as HTMLElement).style.color = 'var(--fg-3)' }
              }}
            >
              {l.label}
            </Link>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '3px 10px', borderRadius: 'var(--r-sm)',
          background: 'var(--accent-2)', border: '1px solid var(--accent-border)',
          fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 500, color: 'var(--accent)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px var(--accent-glow)', display: 'inline-block' }} />
          Sepolia
        </div>
        <WalletConnector />
      </div>
    </nav>
  )
}
