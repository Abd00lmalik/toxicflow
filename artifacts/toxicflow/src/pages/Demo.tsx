import { useState } from 'react'
import { useAccount } from 'wagmi'
import { TierBadge } from '@/components/ui/TierBadge'
import { WalletModal } from '@/components/wallet/WalletModal'
import { usePassport } from '@/hooks/usePassport'
import { tierFee } from '@/lib/swap/tokens'

const DEMO_TIERS = [
  { tier: 0, label: 'Neutral', color: 'var(--neutral)', desc: 'Default fee class: 30 bps', fee: '0.30%' },
  { tier: 1, label: 'Trusted', color: 'var(--trusted)', desc: 'Lower fee: earned by safe trading: 10 bps', fee: '0.10%' },
  { tier: 2, label: 'Toxic', color: 'var(--toxic)', desc: 'Higher fee: applied to risky flow: 80 bps', fee: '0.80%' },
]

export default function Demo() {
  const { address, isConnected } = useAccount()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [activating, setActivating] = useState(false)
  const [activated, setActivated] = useState(false)
  const [activateError, setActivateError] = useState('')
  const passport = usePassport(address)

  const activateTier = async (tier: number) => {
    if (!address) return
    setActivating(true)
    setActivateError('')
    try {
      const r = await fetch('/api/demo/set-tier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trader: address, tier }),
      })
      const d = await r.json()
      if (d.success) {
        setSelectedTier(tier)
        setActivated(true)
        passport.refetch()
      } else {
        setActivateError(d.error ?? 'Failed to set tier')
      }
    } catch {
      setActivateError('Network error: server may not be configured')
    } finally {
      setActivating(false)
    }
  }

  const fee = selectedTier !== null ? tierFee(selectedTier) : null

  return (
    <div className="page-content" style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Gate section */}
      <div style={{ marginBottom: 48 }}>
        <div className="label" style={{ marginBottom: 8 }}>Guided Walkthrough</div>
        <h1 className="display-md" style={{ marginBottom: 20 }}>Demo Flow</h1>
        <div className="card" style={{ padding: 20, borderColor: 'var(--stale)', background: 'rgba(251,191,36,0.04)' }}>
          <div style={{ fontSize: 13, color: 'var(--stale)', marginBottom: 8, fontWeight: 700 }}>⚠ Demo Notice</div>
          <p className="body" style={{ fontSize: 13 }}>
            This guided demo shows ToxicFlow in real time. You use your actual wallet. You sign real transactions. The only demo element is choosing which passport tier to demonstrate. Selecting a tier uses admin access to set your wallet's tier in the testnet registry: your connected wallet signs a real Sepolia transaction. The ToxicFlow swap fee shown is the actual fee applied by the pool: this is separate from the Ethereum network gas fee shown in your wallet.
          </p>
        </div>
      </div>

      {/* Step 1: Connect */}
      <div className="card-elevated" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: isConnected ? 'var(--trusted)' : 'var(--s4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: isConnected ? '#04060e' : 'var(--fg-3)' }}>1</div>
          <h2 className="heading">Connect Wallet</h2>
          {isConnected && <span style={{ fontSize: 12, color: 'var(--trusted)', fontWeight: 600 }}>✓ Connected</span>}
        </div>
        {isConnected ? (
          <div className="mono" style={{ fontSize: 13, color: 'var(--fg-2)' }}>{address}</div>
        ) : (
          <button onClick={() => setModalOpen(true)} className="btn btn-primary">Connect Wallet</button>
        )}
      </div>

      {/* Step 2: Choose Tier */}
      <div className="card-elevated" style={{ padding: 28, marginBottom: 20, opacity: isConnected ? 1 : 0.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: activated ? 'var(--trusted)' : 'var(--s4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: activated ? '#04060e' : 'var(--fg-3)' }}>2</div>
          <h2 className="heading">Choose Tier</h2>
          {activated && selectedTier !== null && <TierBadge tier={selectedTier} />}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
          {DEMO_TIERS.map(t => (
            <button
              key={t.tier}
              onClick={() => isConnected && !activating && activateTier(t.tier)}
              disabled={!isConnected || activating}
              style={{
                padding: '20px 16px', textAlign: 'left',
                background: selectedTier === t.tier ? `${t.color}1a` : 'var(--s3)',
                border: `1px solid ${selectedTier === t.tier ? t.color : 'var(--b-soft)'}`,
                borderRadius: 'var(--r-md)', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, color: t.color, marginBottom: 6 }}>{t.fee}</div>
              <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--fg)' }}>{t.label}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{t.desc}</div>
            </button>
          ))}
        </div>

        {activating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--fg-2)', fontSize: 13 }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
            Activating passport tier...
          </div>
        )}

        {activated && selectedTier !== null && (
          <div style={{ padding: '12px 16px', background: 'var(--trusted-2)', border: '1px solid var(--trusted)', borderRadius: 'var(--r-md)', color: 'var(--trusted)', fontWeight: 600, fontSize: 13 }}>
            ✓ Your passport is now set to {DEMO_TIERS[selectedTier].label}. The pool will apply {DEMO_TIERS[selectedTier].fee} to your swap.
          </div>
        )}

        {activateError && (
          <div style={{ padding: '12px 16px', background: 'var(--toxic-2)', border: '1px solid var(--toxic)', borderRadius: 'var(--r-md)', color: 'var(--toxic)', fontSize: 13 }}>
            {activateError}
          </div>
        )}
      </div>

      {/* Step 3: Swap */}
      <div className="card-elevated" style={{ padding: 28, marginBottom: 20, opacity: activated ? 1 : 0.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--s4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--fg-3)' }}>3</div>
          <h2 className="heading">Execute Swap</h2>
        </div>
        {activated && selectedTier !== null && fee ? (
          <div>
            <p className="body" style={{ marginBottom: 16 }}>
              Your passport is set to <strong>{DEMO_TIERS[selectedTier].label}</strong>. The pool will apply <strong>{fee.pct}</strong> ({fee.pips} pips) to your swap: automatically, via the ToxicFlow hook.
            </p>
            <a href="/swap" className="btn btn-primary">Go to Swap Page →</a>
          </div>
        ) : (
          <p className="body" style={{ color: 'var(--fg-3)' }}>Select a tier in step 2 first.</p>
        )}
      </div>

      {/* Step 4: Comparison */}
      {activated && selectedTier !== null && (
        <div className="card-elevated" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--s4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--fg-3)' }}>4</div>
            <h2 className="heading">Fee Comparison</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {DEMO_TIERS.map(t => (
              <div key={t.tier} style={{
                padding: '16px', borderRadius: 'var(--r-md)',
                background: t.tier === selectedTier ? `${t.color}1a` : 'var(--s3)',
                border: `1px solid ${t.tier === selectedTier ? t.color : 'var(--b-dim)'}`,
              }}>
                <TierBadge tier={t.tier} size="sm" />
                <div style={{ fontSize: 24, fontWeight: 700, color: t.color, marginTop: 8 }}>{t.fee}</div>
                {t.tier === selectedTier && <div style={{ fontSize: 11, color: t.color, fontWeight: 600, marginTop: 4 }}>ACTIVE</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: LP Section */}
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--s4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--fg-3)' }}>5</div>
          <h2 className="heading">Pool Monitoring Impact</h2>
        </div>
        <p className="body">
          Every swap you execute contributes to Pool Defense monitoring. The flow composition (Trusted / Neutral / Toxic) is tracked in real time. If the toxic share exceeds the threshold, KeeperHub triggers an automated response to protect liquidity providers.
        </p>
        <div style={{ marginTop: 16 }}>
          <a href="/pool-defense" className="btn btn-secondary btn-sm">View Pool Defense →</a>
        </div>
      </div>

      <WalletModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
