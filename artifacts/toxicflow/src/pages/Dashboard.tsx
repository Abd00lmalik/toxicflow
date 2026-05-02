import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { TierBadge } from '@/components/ui/TierBadge'
import { StatusDot } from '@/components/ui/StatusDot'
import { usePassport } from '@/hooks/usePassport'
import { RUNTIME_MODE } from '@/lib/config/runtimeMode'
import { PASSPORT_REGISTRY, TOXIC_FLOW_HOOK, TOKEN_PAIR } from '@/lib/config/contracts'
import { tierFee } from '@/lib/swap/tokens'

interface EventSummary {
  totalEvents: number
  toxicEvents: number
  computedToxicShareBps: number
  triggerThresholdBps: number
  thresholdExceeded: boolean
}

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const passport = usePassport(address)
  const [events, setEvents] = useState<EventSummary | null>(null)
  const [eventsLoading, setEventsLoading] = useState(true)

  useEffect(() => {
    if (!RUNTIME_MODE.eventIndexingLive) { setEventsLoading(false); return }
    fetch('/api/events?limit=50')
      .then(r => r.json())
      .then(d => { if (d.summary) setEvents(d.summary) })
      .catch(() => {})
      .finally(() => setEventsLoading(false))
  }, [])

  const fee = tierFee(passport.tier)

  const flags = [
    { label: 'Passport Registry', ok: RUNTIME_MODE.passportLive },
    { label: 'Hook Preview', ok: RUNTIME_MODE.hookPreviewLive },
    { label: 'Pool Ready', ok: RUNTIME_MODE.poolReady },
    { label: 'Event Indexing', ok: RUNTIME_MODE.eventIndexingLive },
    { label: '0G Storage', ok: RUNTIME_MODE.zeroGStorageConfigured },
    { label: 'KeeperHub', ok: RUNTIME_MODE.keeperHubConfigured },
  ]

  return (
    <div className="page-content" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>
      <div style={{ marginBottom: 40 }}>
        <div className="label" style={{ marginBottom: 8 }}>Overview</div>
        <h1 className="display-md">Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        {/* My Tier */}
        <div className="card-elevated" style={{ padding: 24 }}>
          <div className="label" style={{ marginBottom: 12 }}>My Tier</div>
          {isConnected ? (
            passport.isLoading ? (
              <div className="skeleton" style={{ height: 32, width: 100 }} />
            ) : (
              <>
                <TierBadge tier={passport.tier} size="lg" />
                <div style={{ marginTop: 12, fontSize: 28, fontWeight: 700 }}>{fee.pct}</div>
                <div className="caption">swap fee</div>
              </>
            )
          ) : (
            <div className="body" style={{ color: 'var(--fg-3)' }}>Connect wallet to view</div>
          )}
        </div>

        {/* Pool Status */}
        <div className="card-elevated" style={{ padding: 24 }}>
          <div className="label" style={{ marginBottom: 12 }}>Pool</div>
          <div className="heading" style={{ marginBottom: 6 }}>{TOKEN_PAIR}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StatusDot status={RUNTIME_MODE.poolReady ? 'live' : 'offline'} />
            <span className="caption">{RUNTIME_MODE.poolReady ? 'Active' : 'Not configured'}</span>
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="caption" style={{ marginBottom: 4 }}>Dynamic fee hook</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StatusDot status={RUNTIME_MODE.hookPreviewLive ? 'live' : 'offline'} />
              <span className="caption">{RUNTIME_MODE.hookPreviewLive ? 'Active' : 'Not deployed'}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-elevated" style={{ padding: 24 }}>
          <div className="label" style={{ marginBottom: 12 }}>Recent Activity</div>
          {eventsLoading ? (
            <div className="skeleton" style={{ height: 60 }} />
          ) : events ? (
            <>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{events.totalEvents}</div>
              <div className="caption">swap events indexed</div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, padding: '2px 8px', background: 'var(--toxic-2)', color: 'var(--toxic)', borderRadius: 4 }}>
                  {events.toxicEvents} toxic
                </span>
                <span style={{ fontSize: 12, padding: '2px 8px', background: 'var(--trusted-2)', color: 'var(--trusted)', borderRadius: 4 }}>
                  {events.totalEvents - events.toxicEvents} safe
                </span>
              </div>
            </>
          ) : (
            <div className="body" style={{ color: 'var(--fg-3)' }}>No events yet</div>
          )}
        </div>

        {/* Toxic Share */}
        <div className="card-elevated" style={{ padding: 24 }}>
          <div className="label" style={{ marginBottom: 12 }}>Toxic Flow Share</div>
          {events ? (
            <>
              <div style={{ fontSize: 32, fontWeight: 700, color: events.thresholdExceeded ? 'var(--toxic)' : 'var(--trusted)' }}>
                {(events.computedToxicShareBps / 100).toFixed(1)}%
              </div>
              <div className="caption">of recent swaps</div>
              <div style={{ marginTop: 12, height: 4, background: 'var(--s4)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, events.computedToxicShareBps / 100)}%`, background: events.thresholdExceeded ? 'var(--toxic)' : 'var(--trusted)', borderRadius: 2, transition: 'width 0.5s' }} />
              </div>
            </>
          ) : (
            <div className="body" style={{ color: 'var(--fg-3)' }}>No data</div>
          )}
        </div>
      </div>

      {/* Runtime flags */}
      <div className="card" style={{ padding: 24 }}>
        <div className="label" style={{ marginBottom: 20 }}>System Status</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {flags.map(f => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <StatusDot status={f.ok ? 'live' : 'offline'} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>{f.label}</div>
                <div className="caption">{f.ok ? 'Configured' : 'Not configured'}</div>
              </div>
            </div>
          ))}
        </div>
        {PASSPORT_REGISTRY && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--b-dim)' }}>
            <div className="caption" style={{ marginBottom: 4 }}>Registry</div>
            <a href={`https://sepolia.etherscan.io/address/${PASSPORT_REGISTRY}`} target="_blank" rel="noopener noreferrer" className="mono" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>{PASSPORT_REGISTRY}</a>
          </div>
        )}
        {TOXIC_FLOW_HOOK && (
          <div style={{ marginTop: 12 }}>
            <div className="caption" style={{ marginBottom: 4 }}>Hook</div>
            <a href={`https://sepolia.etherscan.io/address/${TOXIC_FLOW_HOOK}`} target="_blank" rel="noopener noreferrer" className="mono" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>{TOXIC_FLOW_HOOK}</a>
          </div>
        )}
      </div>
    </div>
  )
}
