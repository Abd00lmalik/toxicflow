import { useEffect, useState } from 'react'
import { TierBadge } from '@/components/ui/TierBadge'
import { RUNTIME_MODE } from '@/lib/config/runtimeMode'

interface FeeEvent {
  txHash: string
  trader: string
  tier: number
  appliedFeeBps: number
  appliedFeePips: number
  blockNumber: string
  timestampMs?: number
  storageRef?: string
  poolId?: string
}

export default function Records() {
  const [events, setEvents] = useState<FeeEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedTx, setExpandedTx] = useState<string | null>(null)

  const fetchData = () => {
    setLoading(true)
    const eventsP = RUNTIME_MODE.eventIndexingLive
      ? fetch('/api/events?limit=20').then(r => r.json()).catch(() => ({ events: [] }))
      : Promise.resolve({ events: [] })
    const anchoredP = fetch('/api/evidence/anchored?limit=20').then(r => r.json()).catch(() => ({ records: [] }))

    Promise.all([eventsP, anchoredP]).then(([evData, ancData]) => {
      const anchored: Record<string, string> = {}
      if (ancData?.records) {
        for (const r of ancData.records) {
          if (r.txHash && r.storageRef) anchored[r.txHash] = r.storageRef
        }
      }
      const evList = (evData?.events ?? []).map((e: FeeEvent) => ({
        ...e,
        storageRef: anchored[e.txHash],
      }))
      setEvents(evList)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const tierLabels = ['Neutral', 'Trusted', 'Toxic']

  return (
    <div className="page-content" style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
          <div className="label" style={{ marginBottom: 8 }}>On-Chain + 0G Storage</div>
          <h1 className="display-md">Fee Records</h1>
        </div>
        <button onClick={fetchData} className="btn btn-secondary btn-sm" disabled={loading}>
          {loading ? 'Loading...' : '↻ Refresh'}
        </button>
      </div>

      {!RUNTIME_MODE.eventIndexingLive && (
        <div style={{ padding: '16px 20px', background: 'var(--neutral-2)', borderRadius: 'var(--r-md)', marginBottom: 24, fontSize: 13, color: 'var(--neutral)' }}>
          Event indexing not configured: deploy the ToxicFlow hook to see live fee records.
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--r-lg)' }} />)}
        </div>
      ) : events.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <div className="heading" style={{ marginBottom: 8 }}>No fee records yet</div>
          <div className="body">Execute a swap to create your first record.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {events.map(ev => (
            <div key={ev.txHash} className="card card-hover" onClick={() => setExpandedTx(prev => prev === ev.txHash ? null : ev.txHash)} style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <TierBadge tier={ev.tier} size="md" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{ev.appliedFeeBps} bps</span>
                    <span className="caption">({(ev.appliedFeeBps / 100).toFixed(2)}%)</span>
                    {ev.timestampMs && (
                      <span className="caption">{new Date(ev.timestampMs).toLocaleString()}</span>
                    )}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <a href={`https://sepolia.etherscan.io/tx/${ev.txHash}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="mono" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>
                      {ev.txHash.slice(0, 16)}...{ev.txHash.slice(-8)} ↗
                    </a>
                  </div>
                </div>
                <div>
                  {ev.storageRef ? (
                    <span style={{ fontSize: 12, padding: '3px 10px', background: 'var(--trusted-2)', color: 'var(--trusted)', borderRadius: 12, fontWeight: 600 }}>
                      Stored ✓
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, padding: '3px 10px', background: 'var(--neutral-2)', color: 'var(--neutral)', borderRadius: 12 }}>
                      Not stored
                    </span>
                  )}
                </div>
              </div>

              {expandedTx === ev.txHash && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--b-dim)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                  {[
                    { label: 'Tier', value: `${ev.tier} (${tierLabels[ev.tier]})` },
                    { label: 'Fee Pips', value: String(ev.appliedFeePips) },
                    { label: 'Fee Bps', value: String(ev.appliedFeeBps) },
                    { label: 'Block', value: String(ev.blockNumber) },
                    { label: 'Trader', value: `${ev.trader?.slice(0, 8)}...${ev.trader?.slice(-6)}` },
                  ].map(f => (
                    <div key={f.label}>
                      <div className="label" style={{ marginBottom: 3 }}>{f.label}</div>
                      <div className="mono" style={{ fontSize: 12, color: 'var(--fg)' }}>{f.value}</div>
                    </div>
                  ))}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div className="label" style={{ marginBottom: 3 }}>Storage Ref</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--fg)', wordBreak: 'break-all' }}>
                      {ev.storageRef ?? 'Not anchored'}
                    </div>
                  </div>
                  {ev.poolId && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div className="label" style={{ marginBottom: 3 }}>Pool ID</div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--fg)', wordBreak: 'break-all' }}>{ev.poolId}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
