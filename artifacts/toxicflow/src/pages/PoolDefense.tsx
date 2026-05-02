import { useEffect, useState } from 'react'
import { StatusDot } from '@/components/ui/StatusDot'
import { RUNTIME_MODE } from '@/lib/config/runtimeMode'
import { TOXIC_FLOW_HOOK, POOL_ID } from '@/lib/config/contracts'

interface EventSummary {
  totalEvents: number
  toxicEvents: number
  trustedEvents: number
  neutralEvents: number
  computedToxicShareBps: number
  triggerThresholdBps: number
  thresholdExceeded: boolean
}

export default function PoolDefense() {
  const [summary, setSummary] = useState<EventSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [triggerStatus, setTriggerStatus] = useState<'idle' | 'triggering' | 'success' | 'error'>('idle')
  const [triggerMsg, setTriggerMsg] = useState('')
  const [showDevDetails, setShowDevDetails] = useState(false)

  useEffect(() => {
    fetch('/api/events?limit=50')
      .then(r => r.json())
      .then(d => { if (d.summary) setSummary(d.summary) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const triggerKeeperHub = async () => {
    setTriggerStatus('triggering')
    try {
      const r = await fetch('/api/keeperhub/trigger', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ manual: true, summary }) })
      const d = await r.json()
      if (d.triggered) { setTriggerStatus('success'); setTriggerMsg(d.message ?? 'Triggered successfully') }
      else { setTriggerStatus('error'); setTriggerMsg(d.error ?? 'Trigger failed') }
    } catch { setTriggerStatus('error'); setTriggerMsg('Network error') }
  }

  const toxicShare = summary ? summary.computedToxicShareBps / 100 : 0
  const threshold = summary ? summary.triggerThresholdBps / 100 : 30
  const exceeded = summary?.thresholdExceeded ?? false

  const trustedPct = summary && summary.totalEvents > 0 ? Math.round(100 * summary.trustedEvents / summary.totalEvents) : 0
  const neutralPct = summary && summary.totalEvents > 0 ? Math.round(100 * summary.neutralEvents / summary.totalEvents) : 0
  const toxicPct = summary && summary.totalEvents > 0 ? Math.round(100 * summary.toxicEvents / summary.totalEvents) : 0

  return (
    <div className="page-content" style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 80px' }}>
      <div style={{ marginBottom: 40 }}>
        <div className="label" style={{ marginBottom: 8 }}>LP Protection</div>
        <h1 className="display-md">Pool Defense</h1>
        <p className="body-lg" style={{ maxWidth: 640, marginTop: 12 }}>
          Pool Defense watches recent fee records. If risky flow becomes too concentrated, an automated response triggers to protect your liquidity.
        </p>
      </div>

      {/* 1. Flow Monitor */}
      <div className="card-elevated" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="heading">Flow Monitor</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StatusDot status={RUNTIME_MODE.eventIndexingLive ? 'live' : 'offline'} />
            <span className="caption">{RUNTIME_MODE.eventIndexingLive ? 'Monitoring' : 'Not configured'}</span>
          </div>
        </div>
        {loading ? (
          <div className="skeleton" style={{ height: 80 }} />
        ) : summary ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 20 }}>
            {[
              { label: 'Total Swaps', value: String(summary.totalEvents) },
              { label: 'Toxic Events', value: String(summary.toxicEvents) },
              { label: 'Toxic Share', value: `${toxicShare.toFixed(1)}%` },
              { label: 'Threshold', value: `${threshold}%` },
            ].map(s => (
              <div key={s.label}>
                <div className="label" style={{ marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{s.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="body" style={{ color: 'var(--fg-3)' }}>No event data. Hook not configured or no swaps yet.</div>
        )}
      </div>

      {/* 2. Risk Gauge */}
      <div className="card-elevated" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="heading">Risk Gauge</h2>
          {exceeded && (
            <span style={{ padding: '4px 12px', background: 'var(--toxic-2)', border: '1px solid var(--toxic)', borderRadius: 'var(--r-sm)', fontSize: 12, color: 'var(--toxic)', fontWeight: 600 }}>
              THRESHOLD EXCEEDED
            </span>
          )}
        </div>
        <div style={{ position: 'relative', height: 12, background: 'var(--s4)', borderRadius: 6, overflow: 'visible', marginBottom: 8 }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${Math.min(100, toxicShare)}%`,
            background: exceeded ? 'var(--toxic)' : toxicShare > threshold / 2 ? 'var(--stale)' : 'var(--trusted)',
            borderRadius: 6, transition: 'width 0.8s ease, background 0.5s',
          }} />
          {/* Threshold line */}
          <div style={{
            position: 'absolute', top: -4, bottom: -4,
            left: `${threshold}%`,
            width: 2, background: 'var(--stale)',
            borderRadius: 1,
          }}>
            <div style={{ position: 'absolute', top: -20, left: -16, fontSize: 10, color: 'var(--stale)', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {threshold}% limit
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span className="caption">0%</span>
          <span className="caption" style={{ color: exceeded ? 'var(--toxic)' : 'var(--fg-2)' }}>
            Current: {toxicShare.toFixed(1)}%
          </span>
          <span className="caption">100%</span>
        </div>
      </div>

      {/* 3. Flow Composition */}
      <div className="card-elevated" style={{ padding: 24, marginBottom: 20 }}>
        <h2 className="heading" style={{ marginBottom: 20 }}>Flow Composition</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ padding: '6px 16px', background: 'var(--trusted-2)', border: '1px solid var(--trusted)', borderRadius: 20, fontSize: 13, fontWeight: 600, color: 'var(--trusted)' }}>
            Trusted {trustedPct}%
          </div>
          <div style={{ padding: '6px 16px', background: 'var(--neutral-2)', border: '1px solid var(--neutral)', borderRadius: 20, fontSize: 13, fontWeight: 600, color: 'var(--neutral)' }}>
            Neutral {neutralPct}%
          </div>
          <div style={{ padding: '6px 16px', background: 'var(--toxic-2)', border: '1px solid var(--toxic)', borderRadius: 20, fontSize: 13, fontWeight: 600, color: 'var(--toxic)' }}>
            Toxic {toxicPct}%
          </div>
        </div>
      </div>

      {/* 4. Automation */}
      <div className="card-elevated" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="heading">Automation</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StatusDot status={RUNTIME_MODE.keeperHubConfigured ? 'live' : 'offline'} />
            <span className="caption">{RUNTIME_MODE.keeperHubConfigured ? 'KeeperHub Active' : 'Not configured'}</span>
          </div>
        </div>
        {RUNTIME_MODE.keeperHubConfigured ? (
          <p className="body" style={{ marginBottom: 16 }}>
            Automation is active. When the toxic flow threshold is exceeded, KeeperHub triggers an automated protective response.
          </p>
        ) : (
          <p className="body" style={{ marginBottom: 16 }}>
            KeeperHub automation is not configured. Configure KEEPERHUB_API_URL and KEEPERHUB_API_KEY to enable automated pool protection.
          </p>
        )}
        <button
          onClick={triggerKeeperHub}
          disabled={triggerStatus === 'triggering'}
          className="btn btn-secondary btn-sm"
        >
          {triggerStatus === 'triggering' ? 'Triggering...' : 'Test Trigger'}
        </button>
        {triggerMsg && (
          <div style={{ marginTop: 12, fontSize: 13, color: triggerStatus === 'success' ? 'var(--trusted)' : 'var(--toxic)' }}>
            {triggerMsg}
          </div>
        )}
      </div>

      {/* 5. Developer Details */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <button
          onClick={() => setShowDevDetails(v => !v)}
          style={{ width: '100%', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg)' }}
        >
          <span className="heading">Developer Details</span>
          <span style={{ color: 'var(--fg-3)' }}>{showDevDetails ? '−' : '+'}</span>
        </button>
        {showDevDetails && (
          <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Hook Address', value: TOXIC_FLOW_HOOK ?? 'Not deployed' },
              { label: 'Pool ID', value: POOL_ID ?? 'Not configured' },
              { label: 'Threshold', value: `${threshold}% (${(threshold * 100).toFixed(0)} bps)` },
              { label: 'Toxic Share', value: `${toxicShare.toFixed(2)}%` },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
                <span className="caption">{r.label}</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--fg)', wordBreak: 'break-all', textAlign: 'right' }}>{r.value}</span>
              </div>
            ))}
            {summary && (
              <div style={{ marginTop: 12 }}>
                <div className="label" style={{ marginBottom: 8 }}>Trigger Payload Preview</div>
                <pre style={{ fontSize: 11, background: 'var(--s1)', padding: 12, borderRadius: 8, overflow: 'auto', color: 'var(--fg-2)' }}>
                  {JSON.stringify({ toxicShareBps: summary.computedToxicShareBps, thresholdBps: summary.triggerThresholdBps, thresholdExceeded: summary.thresholdExceeded, totalEvents: summary.totalEvents, hookAddress: TOXIC_FLOW_HOOK }, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
