import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { WalletConnector } from '@/components/wallet/WalletConnector'

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
      height: 60,
      background: 'var(--glass)', borderBottom: '1px solid var(--glass-border)',
      backdropFilter: 'blur(20px)',
      display: 'flex', alignItems: 'center', padding: '0 24px',
      gap: 0,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 32, flexShrink: 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'linear-gradient(135deg, var(--accent), var(--trusted))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 800, color: '#04060e',
        }}>T</div>
        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg)' }}>ToxicFlow</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, overflow: 'hidden' }}>
        {links.map(l => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--r-sm)',
              fontSize: 13,
              fontWeight: location === l.href ? 600 : 400,
              color: location === l.href ? 'var(--fg)' : 'var(--fg-2)',
              background: location === l.href ? 'var(--b-soft)' : 'transparent',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s, background 0.15s',
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '3px 10px', borderRadius: 'var(--r-sm)',
          background: 'var(--trusted-2)', border: '1px solid var(--trusted-g)',
          fontSize: 11, fontWeight: 600, color: 'var(--trusted)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--trusted)', boxShadow: '0 0 6px var(--trusted)', display: 'inline-block' }} />
          Sepolia
        </div>
        <WalletConnector />
      </div>
    </nav>
  )
}
