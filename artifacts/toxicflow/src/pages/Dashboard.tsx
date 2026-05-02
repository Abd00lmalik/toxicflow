import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { TierBadge } from '@/components/ui/TierBadge'
import { usePassport } from '@/hooks/usePassport'
import { RUNTIME_MODE } from '@/lib/config/runtimeMode'
import { tierFee } from '@/lib/swap/tokens'
import { WalletModal } from '@/components/wallet/WalletModal'
import { Link } from 'wouter'

interface FeeEvent {
  txHash: string
  trader: string
  tier: number
  appliedFeeBps: number
  blockNumber: string
  timestampMs?: number
  storageRef?: string
}

function NextAction({ passport, isConnected }: { passport: { hasPassport: boolean; tier: number }; isConnected: boolean }) {
  if (!isConnected) return null
  if (!passport.hasPassport) return (
    <Link href="/passport" className="btn btn-primary" style={{ fontSize: 13, padding: '10px 20px' }}>
      Create Passport
    </Link>
  )
  return (
    <Link href="/swap" className="btn btn-primary" style={{ fontSize: 13, padding: '10px 20px' }}>
      Swap with {['Neutral', 'Trusted', 'Toxic'][passport.tier]} tier
    </Link>
  )
}

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const passport = usePassport(address)
  const fee = tierFee(passport.tier)
  const [modalOpen, setModalOpen] = useState(false)
  const [userEvents, setUserEvents] = useState<FeeEvent[]>([])
  const [eventsLoading, setEventsLoading] = useState(false)

  useEffect(() => {
    if (!address || !RUNTIME_MODE.eventIndexingLive) return
    setEventsLoading(true)
    fetch(`/api/events?limit=5`)
      .then(r => r.json())
      .then(d => {
        const all: FeeEvent[] = d.events ?? []
        setUserEvents(all.filter(e => e.trader?.toLowerCase() === address.toLowerCase()))
      })
      .catch(() => {})
      .finally(() => setEventsLoading(false))
  }, [address])

  if (!isConnected) {
    return (
      <div className="page-content" style={{ minHeight: '88vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center' }}>
        <div className="anim-fade-in" style={{ maxWidth: 520 }}>
          <div style={{ marginBottom: 32 }}>
            <svg width={56} height={56} viewBox="0 0 56 56" fill="none" style={{ marginBottom: 20, opacity: 0.5 }}>
              <rect width="56" height="56" rx="16" fill="rgba(0,209,102,0.08)" stroke="rgba(0,209,102,0.18)" strokeWidth="1"/>
              <path d="M20 28 Q26 18 28 28 Q30 38 36 28" stroke="#00D166" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
              <circle cx="28" cy="28" r="3.5" fill="#00D166" opacity="0.6"/>
            </svg>
            <h1 className="display-md" style={{ marginBottom: 16 }}>Your Trading Dashboard</h1>
            <p className="body-lg" style={{ marginBottom: 8 }}>
              Connect your wallet to see your passport status, fee class, and recent activity.
            </p>
            <p className="caption" style={{ marginBottom: 32 }}>
              Everything shown here is tied to your wallet address on Sepolia.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 36 }}>
            {[
              { icon: '◈', label: 'Passport Tier', desc: 'Trusted, Neutral, or Toxic' },
              { icon: '◎', label: 'Fee Class', desc: '10, 30, or 80 bps' },
              { icon: '◌', label: 'Swap History', desc: 'Your recent fee records' },
            ].map(item => (
              <div key={item.label} className="card" style={{ padding: '18px 16px' }}>
                <div style={{ fontSize: 22, color: 'var(--accent)', marginBottom: 8, opacity: 0.7 }}>{item.icon}</div>
                <div className="heading" style={{ fontSize: 13, marginBottom: 4 }}>{item.label}</div>
                <div className="caption">{item.desc}</div>
              </div>
            ))}
          </div>

          <button onClick={() => setModalOpen(true)} className="btn btn-primary btn-lg">
            Connect Wallet
          </button>
        </div>
        <WalletModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    )
  }

  const tierLabels = ['Neutral', 'Trusted', 'Toxic']
  const tierColors = ['var(--neutral)', 'var(--trusted)', 'var(--toxic)']

  return (
    <div className="page-content" style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 80px' }}>
      <div style={{ marginBottom: 40 }} className="anim-fade-in">
        <div className="label" style={{ marginBottom: 8 }}>Your Account</div>
        <h1 className="display-md">Dashboard</h1>
      </div>

      {/* Passport card */}
      <div className="passport-shine" style={{
        borderRadius: 'var(--r-xl)', padding: '28px 32px', marginBottom: 24,
        background: passport.tier === 1
          ? 'linear-gradient(135deg, rgba(52,211,153,0.10), var(--s3))'
          : passport.tier === 2
          ? 'linear-gradient(135deg, rgba(248,113,113,0.08), var(--s3))'
          : 'linear-gradient(135deg, rgba(148,163,184,0.08), var(--s3))',
        border: `1px solid ${tierColors[passport.tier]}22`,
        boxShadow: passport.tier === 1 ? 'var(--sh-trusted)' : passport.tier === 2 ? 'var(--sh-toxic)' : 'var(--sh-md)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div>
            <div className="label" style={{ marginBottom: 10 }}>ToxicFlow Passport</div>
            {passport.isLoading ? (
              <div className="skeleton" style={{ width: 100, height: 28 }} />
            ) : (
              <TierBadge tier={passport.tier} size="lg" />
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="label" style={{ marginBottom: 4 }}>Status</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: passport.hasPassport ? 'var(--trusted)' : 'var(--neutral)' }}>
              {passport.isLoading ? '...' : passport.hasPassport ? 'Registered' : 'Not registered'}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 20, marginBottom: 24 }}>
          <div>
            <div className="label" style={{ marginBottom: 6 }}>Swap Fee</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: tierColors[passport.tier], letterSpacing: '-0.02em' }}>
              {fee.pct}
            </div>
          </div>
          <div>
            <div className="label" style={{ marginBottom: 6 }}>Fee Class</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--fg)' }}>{fee.pips} pips</div>
            <div className="caption">{fee.bps} bps</div>
          </div>
          <div>
            <div className="label" style={{ marginBottom: 6 }}>Wallet</div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--fg-2)', wordBreak: 'break-all' }}>{address?.slice(0, 10)}...{address?.slice(-6)}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <NextAction passport={passport} isConnected={isConnected} />
          {!passport.hasPassport && (
            <Link href="/passport" className="btn btn-secondary" style={{ fontSize: 13, padding: '10px 20px' }}>
              View Passport
            </Link>
          )}
        </div>
      </div>

      {/* Recent swaps */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="heading" style={{ fontSize: 15 }}>Recent Swaps</h2>
          <Link href="/records" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>All records</Link>
        </div>

        {eventsLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 52 }} />)}
          </div>
        ) : userEvents.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {userEvents.map(ev => (
              <div key={ev.txHash} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--s2)', borderRadius: 'var(--r-md)', border: '1px solid var(--b-dim)' }}>
                <TierBadge tier={ev.tier} size="sm" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-2)', fontWeight: 600 }}>{ev.appliedFeeBps} bps</span>
                  {ev.timestampMs && <span className="caption" style={{ marginLeft: 8 }}>{new Date(ev.timestampMs).toLocaleDateString()}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {ev.storageRef && (
                    <span style={{ fontSize: 11, padding: '2px 8px', background: 'var(--trusted-2)', color: 'var(--trusted)', borderRadius: 10, fontWeight: 600 }}>Stored</span>
                  )}
                  <a href={`https://sepolia.etherscan.io/tx/${ev.txHash}`} target="_blank" rel="noopener noreferrer" className="mono" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none' }}>
                    {ev.txHash.slice(0, 8)}... ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '24px 0', textAlign: 'center' }}>
            <div className="body" style={{ marginBottom: 12, color: 'var(--fg-3)' }}>No swaps from this wallet yet.</div>
            <Link href="/swap" className="btn btn-accent btn-sm">Go to Swap</Link>
          </div>
        )}
      </div>

      {/* Next steps */}
      <div className="card" style={{ padding: 24 }}>
        <h2 className="heading" style={{ fontSize: 15, marginBottom: 16 }}>Explore</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
          {[
            { href: '/passport', label: 'View Passport', desc: 'Your tier and fee class' },
            { href: '/swap', label: 'Swap', desc: 'Tier-adjusted fee swap' },
            { href: '/records', label: 'Fee Records', desc: 'All on-chain fee events' },
            { href: '/pool-defense', label: 'Pool Defense', desc: 'Flow monitor and automation' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{ padding: '14px 16px', background: 'var(--s3)', border: '1px solid var(--b-soft)', borderRadius: 'var(--r-md)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--fg)', marginBottom: 4 }}>{item.label}</div>
                <div className="caption">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <WalletModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
