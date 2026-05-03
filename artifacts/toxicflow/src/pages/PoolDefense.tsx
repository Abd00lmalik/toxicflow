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

interface CircuitBreakerStatus {
  paused: boolean
  reason: string | null
  txHash: string | null
  pausedAt: string | null
}

type PauseStatus = 'idle' | 'pending' | 'success' | 'error'
type TriggerStatus = 'idle' | 'triggering' | 'success' | 'error'

export default function PoolDefense() {
  const [summary, setSummary]       = useState<EventSummary | null>(null)
  const [loading, setLoading]       = useState(true)
  const [cbStatus, setCbStatus]     = useState<CircuitBreakerStatus>({ paused: false, reason: null, txHash: null, pausedAt: null })

  const [triggerStatus, setTriggerStatus] = useState<TriggerStatus>('idle')
  const [triggerMsg, setTriggerMsg]       = useState('')
  const [pauseStatus, setPauseStatus]     = useState<PauseStatus>('idle')
  const [pauseMsg, setPauseMsg]           = useState('')
  const [showDevDetails, setShowDevDetails] = useState(false)

  useEffect(() => {
    fetch('/api/events?limit=50')
      .then(r => r.json())
      .then(d => { if (d.summary) setSummary(d.summary) })
      .catch(() => {})
      .finally(() => setLoading(false))

    fetch('/api/pool-defense/status')
      .then(r => r.json())
      .then(d => { if (d.circuitBreaker) setCbStatus(d.circuitBreaker) })
      .catch(() => {})
  }, [])

  const triggerKeeperHub = async () => {
    setTriggerStatus('triggering')
    try {
      const r = await fetch('/api/keeperhub/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manual: true, summary }),
      })
      const d = await r.json()
      if (d.triggered) { setTriggerStatus('success'); setTriggerMsg(d.message ?? 'Triggered') }
      else              { setTriggerStatus('error');   setTriggerMsg(d.error ?? 'Trigger failed') }
    } catch { setTriggerStatus('error'); setTriggerMsg('Network error') }
  }

  const toxicShare = summary ? summary.computedToxicShareBps / 100 : 0
  const threshold  = summary ? summary.triggerThresholdBps / 100 : 30
  const exceeded   = summary?.thresholdExceeded ?? false
  const swapsPaused = cbStatus.paused

  const trustedPct = summary && summary.totalEvents > 0 ? Math.round(100 * summary.trustedEvents / summary.totalEvents) : 0
  const neutralPct = summary && summary.totalEvents > 0 ? Math.round(100 * summary.neutralEvents / summary.totalEvents) : 0
  const toxicPct   = summary && summary.totalEvents > 0 ? Math.round(100 * summary.toxicEvents  / summary.totalEvents) : 0

  const cbState = swapsPaused ? 'paused' : exceeded ? 'breached' : toxicShare > threshold / 2 ? 'watching' : 'normal'

  const stateColor: Record<string, string> = {
    normal: 'var(--trusted)', watching: 'var(--stale)', breached: 'var(--toxic)', paused: 'var(--toxic)',
  }
  const stateLabel: Record<string, string> = {
    normal: 'Normal', watching: 'Watching', breached: 'Threshold Breached', paused: 'Swaps Paused',
  }

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
              { label: 'Total Swaps',  value: String(summary.totalEvents) },
              { label: 'Toxic Events', value: String(summary.toxicEvents) },
              { label: 'Toxic Share',  value: `${toxicShare.toFixed(1)}%` },
              { label: 'Threshold',    value: `${threshold}%` },
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
          <div style={{
            position: 'absolute', top: -4, bottom: -4, left: `${threshold}%`,
            width: 2, background: 'var(--stale)', borderRadius: 1,
          }}>
            <div style={{ position: 'absolute', top: -20, left: -16, fontSize: 10, color: 'var(--stale)', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {threshold}% limit
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span className="caption">0%</span>
          <span className="caption" style={{ color: exceeded ? 'var(--toxic)' : 'var(--fg-2)' }}>Current: {toxicShare.toFixed(1)}%</span>
          <span className="caption">100%</span>
        </div>
      </div>

      {/* 3. Flow Composition */}
      <div className="card-elevated" style={{ padding: 24, marginBottom: 20 }}>
        <h2 className="heading" style={{ marginBottom: 20 }}>Flow Composition</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: `Trusted ${trustedPct}%`,  bg: 'var(--trusted-2)', border: 'var(--trusted)', color: 'var(--trusted)' },
            { label: `Neutral ${neutralPct}%`,  bg: 'var(--neutral-2)', border: 'var(--neutral)', color: 'var(--neutral)' },
            { label: `Toxic ${toxicPct}%`,      bg: 'var(--toxic-2)',   border: 'var(--toxic)',   color: 'var(--toxic)'   },
          ].map(s => (
            <div key={s.label} style={{ padding: '6px 16px', background: s.bg, border: `1px solid ${s.border}`, borderRadius: 20, fontSize: 13, fontWeight: 600, color: s.color }}>
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Circuit Breaker */}
      <div className="card-elevated" style={{ padding: 24, marginBottom: 20, borderColor: swapsPaused ? 'var(--toxic)' : exceeded ? 'rgba(239,68,68,0.3)' : undefined }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h2 className="heading" style={{ marginBottom: 6 }}>Circuit Breaker</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: stateColor[cbState], display: 'inline-block', boxShadow: swapsPaused ? '0 0 10px var(--toxic)' : undefined }} />
              <span className="caption" style={{ color: stateColor[cbState], fontWeight: 600 }}>{stateLabel[cbState]}</span>
            </div>
          </div>
        </div>

        {swapsPaused && (
          <div style={{ padding: '12px 16px', background: 'var(--toxic-2)', border: '1px solid var(--toxic)', borderRadius: 'var(--r-md)', marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--toxic)', fontWeight: 700, marginBottom: 4 }}>Swaps are currently PAUSED</div>
            {cbStatus.reason && <div className="caption">Reason: {cbStatus.reason}</div>}
            {cbStatus.txHash && (
              <a href={`https://sepolia.etherscan.io/tx/${cbStatus.txHash}`} target="_blank" rel="noopener noreferrer"
                className="mono caption" style={{ fontSize: 11, color: 'var(--accent)', wordBreak: 'break-all' }}>
                {cbStatus.txHash}
              </a>
            )}
            {cbStatus.pausedAt && <div className="caption" style={{ marginTop: 4 }}>Paused: {new Date(cbStatus.pausedAt).toLocaleString()}</div>}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            { key: 'normal',   label: 'Normal',              desc: 'Toxic share below 50% of threshold. Pool operating normally.' },
            { key: 'watching', label: 'Watching',            desc: 'Toxic share elevated. Automation monitoring closely.' },
            { key: 'breached', label: 'Threshold Breached',  desc: 'Threshold exceeded. KeeperHub automation triggered with PAUSE_SWAPS action.' },
            { key: 'paused',   label: 'Swaps Paused',        desc: 'Circuit breaker active. All swaps through this pool are reverted at the hook level.' },
          ].map(s => (
            <div key={s.key} style={{
              display: 'flex', gap: 12, padding: '12px 16px',
              background: s.key === cbState ? `color-mix(in srgb, ${stateColor[s.key]} 8%, var(--s3))` : 'var(--s3)',
              border: `1px solid ${s.key === cbState ? stateColor[s.key] : 'var(--b-dim)'}`,
              borderRadius: 'var(--r-md)', transition: 'all 0.2s',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: stateColor[s.key], marginTop: 5, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: s.key === cbState ? stateColor[s.key] : 'var(--fg)', marginBottom: 2 }}>{s.label}</div>
                <div className="caption">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={async () => {
              setPauseStatus('pending'); setPauseMsg('')
              try {
                const r = await fetch('/api/pool-defense/pause', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_KEEPERHUB_API_KEY ?? ''}` },
                  body: JSON.stringify({ reason: 'MANUAL_ADMIN_PAUSE' }),
                })
                const d = await r.json()
                if (d.paused) {
                  setPauseStatus('success')
                  setCbStatus(prev => ({ ...prev, paused: true, reason: 'MANUAL_ADMIN_PAUSE', txHash: d.txHash, pausedAt: new Date().toISOString() }))
                  setPauseMsg('Paused: ' + d.txHash)
                } else {
                  setPauseStatus('error')
                  setPauseMsg(d.note ?? d.error ?? 'Failed — hook V2 required')
                }
              } catch { setPauseStatus('error'); setPauseMsg('Network error') }
            }}
            disabled={pauseStatus === 'pending' || swapsPaused}
            className="btn btn-secondary btn-sm"
          >
            {pauseStatus === 'pending' ? 'Pausing...' : 'Pause Swaps'}
          </button>
          <button
            onClick={async () => {
              setPauseStatus('pending'); setPauseMsg('')
              try {
                const r = await fetch('/api/pool-defense/resume', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_KEEPERHUB_API_KEY ?? ''}` },
                })
                const d = await r.json()
                if (d.resumed) {
                  setPauseStatus('idle')
                  setCbStatus(prev => ({ ...prev, paused: false, reason: null }))
                  setPauseMsg('Resumed: ' + d.txHash)
                } else {
                  setPauseStatus('error'); setPauseMsg(d.error ?? 'Failed')
                }
              } catch { setPauseStatus('error'); setPauseMsg('Network error') }
            }}
            disabled={pauseStatus === 'pending' || !swapsPaused}
            className="btn btn-ghost btn-sm"
          >
            Resume Swaps
          </button>
        </div>

        {pauseMsg && (
          <div style={{ marginTop: 10, fontSize: 12, fontFamily: 'var(--font-mono)', color: pauseStatus === 'error' ? 'var(--toxic)' : 'var(--trusted)', wordBreak: 'break-all' }}>
            {pauseMsg}
          </div>
        )}
      </div>

      {/* 5. Automation */}
      <div className="card-elevated" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="heading">KeeperHub Automation</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StatusDot status={RUNTIME_MODE.keeperHubConfigured ? 'live' : 'offline'} />
            <span className="caption">{RUNTIME_MODE.keeperHubConfigured ? 'KeeperHub Active' : 'Not configured'}</span>
          </div>
        </div>
        <p className="body" style={{ marginBottom: 16 }}>
          {RUNTIME_MODE.keeperHubConfigured
            ? 'Automation is active. When the toxic flow threshold is exceeded, KeeperHub sends action: "PAUSE_SWAPS" to the callback route, which submits a pause transaction to ToxicFlowHookV2.'
            : 'KeeperHub automation is not configured. Set KEEPERHUB_API_URL, KEEPERHUB_API_KEY, and KEEPERHUB_WORKFLOW_ID to enable automated pool protection.'}
        </p>
        <button onClick={triggerKeeperHub} disabled={triggerStatus === 'triggering'} className="btn btn-secondary btn-sm">
          {triggerStatus === 'triggering' ? 'Triggering...' : 'Test Trigger'}
        </button>
        {triggerMsg && (
          <div style={{ marginTop: 12, fontSize: 13, color: triggerStatus === 'success' ? 'var(--trusted)' : 'var(--toxic)' }}>{triggerMsg}</div>
        )}
      </div>

      {/* 6. Developer Details */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <button onClick={() => setShowDevDetails(v => !v)} style={{ width: '100%', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg)' }}>
          <span className="heading">Developer Details</span>
          <span style={{ color: 'var(--fg-3)' }}>{showDevDetails ? '−' : '+'}</span>
        </button>
        {showDevDetails && (
          <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Hook Address',  value: TOXIC_FLOW_HOOK ?? 'Not deployed' },
              { label: 'Pool ID',       value: POOL_ID ?? 'Not configured' },
              { label: 'Threshold',     value: `${threshold}% (${(threshold * 100).toFixed(0)} bps)` },
              { label: 'Toxic Share',   value: `${toxicShare.toFixed(2)}%` },
              { label: 'Pool State',    value: swapsPaused ? 'Paused' : 'Active' },
              { label: 'Pause Route',   value: 'POST /api/pool-defense/pause (Bearer KEEPERHUB_API_KEY)' },
              { label: 'Resume Route',  value: 'POST /api/pool-defense/resume (Bearer KEEPERHUB_API_KEY)' },
              { label: 'Circuit Breaker Note', value: 'pause/resume call the hook\'s pauseSwaps(bytes32) and resumeSwaps() functions — requires hook to have circuit breaker support' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
                <span className="caption" style={{ flexShrink: 0 }}>{r.label}</span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg)', wordBreak: 'break-all', textAlign: 'right' }}>{r.value}</span>
              </div>
            ))}
            {summary && (
              <div style={{ marginTop: 12 }}>
                <div className="label" style={{ marginBottom: 8 }}>KeeperHub Trigger Payload</div>
                <pre style={{ fontSize: 11, background: 'var(--s1)', padding: 12, borderRadius: 8, overflow: 'auto', color: 'var(--fg-2)' }}>
                  {JSON.stringify({
                    action: exceeded ? 'PAUSE_SWAPS' : 'MONITOR',
                    protocol: 'toxicflow-passport',
                    chainId: 11155111,
                    hookAddress: TOXIC_FLOW_HOOK,
                    poolId: POOL_ID,
                    toxicShareBps: summary.computedToxicShareBps,
                    thresholdBps: summary.triggerThresholdBps,
                    thresholdExceeded: summary.thresholdExceeded,
                    callbackUrl: '/api/pool-defense/pause',
                    reason: exceeded ? 'TOXIC_THRESHOLD_EXCEEDED' : 'MONITOR',
                  }, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
