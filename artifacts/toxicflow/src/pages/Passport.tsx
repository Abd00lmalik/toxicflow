import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { TierBadge } from '@/components/ui/TierBadge'
import { usePassport } from '@/hooks/usePassport'
import { PASSPORT_REGISTRY, SELF_REGISTER_DEPLOYED } from '@/lib/config/contracts'
import { PassportRegistryABI } from '@/lib/config/abis/PassportRegistry'
import { WalletModal } from '@/components/wallet/WalletModal'
import { tierFee } from '@/lib/swap/tokens'

export default function Passport() {
  const { address, isConnected } = useAccount()
  const passport = usePassport(address)
  const [modalOpen, setModalOpen] = useState(false)
  const [showTechDetails, setShowTechDetails] = useState(false)
  const [showTierInfo, setShowTierInfo] = useState(false)

  const { writeContract, data: txHash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  const selfRegister = () => {
    if (!PASSPORT_REGISTRY) return
    writeContract({ address: PASSPORT_REGISTRY, abi: PassportRegistryABI, functionName: 'selfRegister', args: [] })
  }

  const fee = tierFee(passport.tier)
  const tierGlows = ['var(--neutral)', 'var(--sh-trusted)', 'var(--sh-toxic)']
  const tierColors = ['var(--neutral-2)', 'var(--trusted-2)', 'var(--toxic-2)']
  const tierBorders = ['var(--neutral)', 'var(--trusted)', 'var(--toxic)']

  if (!isConnected) {
    return (
      <div className="page-content" style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🛂</div>
        <h1 className="display-md" style={{ marginBottom: 16 }}>Your ToxicFlow Passport</h1>
        <p className="body-lg" style={{ maxWidth: 400, marginBottom: 32 }}>Connect your wallet to view your passport tier and manage your registration.</p>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary btn-lg">Connect Wallet</button>
        <WalletModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    )
  }

  return (
    <div className="page-content" style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 80px' }}>
      <div style={{ marginBottom: 40 }}>
        <div className="label" style={{ marginBottom: 8 }}>On-Chain Identity</div>
        <h1 className="display-md">Your Passport</h1>
      </div>

      {/* Passport Card */}
      {passport.isLoading ? (
        <div className="skeleton" style={{ height: 280, borderRadius: 'var(--r-xl)', marginBottom: 24 }} />
      ) : (
        <div className="passport-shine" style={{
          borderRadius: 'var(--r-xl)',
          padding: 32,
          background: `linear-gradient(135deg, ${tierColors[passport.tier]}, var(--s3))`,
          border: `1px solid ${tierBorders[passport.tier]}44`,
          boxShadow: passport.tier === 1 ? 'var(--sh-trusted)' : passport.tier === 2 ? 'var(--sh-toxic)' : 'var(--sh-md)',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div className="label" style={{ marginBottom: 8 }}>ToxicFlow Passport</div>
              <TierBadge tier={passport.tier} size="lg" />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="label">Sepolia Testnet</div>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>Chain ID 11155111</div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div className="label" style={{ marginBottom: 6 }}>Wallet Address</div>
            <div className="mono" style={{ fontSize: 13, wordBreak: 'break-all', color: 'var(--fg)' }}>{address}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              <div className="label" style={{ marginBottom: 4 }}>Swap Fee</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: tierBorders[passport.tier] }}>{fee.pct}</div>
            </div>
            <div>
              <div className="label" style={{ marginBottom: 4 }}>In Pips</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{fee.pips}</div>
            </div>
            <div>
              <div className="label" style={{ marginBottom: 4 }}>Status</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: passport.hasPassport ? 'var(--trusted)' : 'var(--neutral)' }}>
                {passport.hasPassport ? 'Registered' : 'Unregistered'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Self-register CTA */}
      {!passport.isLoading && (
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          {SELF_REGISTER_DEPLOYED ? (
            !passport.hasPassport ? (
              <div>
                <h3 className="heading" style={{ marginBottom: 8 }}>Create Your Passport</h3>
                <p className="body" style={{ marginBottom: 16 }}>Register on-chain to receive your Neutral tier passport. You'll be assigned a fee class based on your future behavior.</p>
                {isSuccess ? (
                  <div style={{ padding: '12px 16px', background: 'var(--trusted-2)', border: '1px solid var(--trusted)', borderRadius: 'var(--r-md)', color: 'var(--trusted)', fontWeight: 600 }}>
                    ✓ Passport created! Your tier is now active.
                  </div>
                ) : (
                  <button
                    onClick={selfRegister}
                    disabled={isPending || isConfirming}
                    className="btn btn-primary"
                  >
                    {isPending ? 'Confirm in wallet...' : isConfirming ? 'Creating passport...' : 'Create Passport'}
                  </button>
                )}
                {txHash && (
                  <div style={{ marginTop: 12 }}>
                    <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="mono" style={{ fontSize: 12, color: 'var(--accent)' }}>
                      View tx ↗
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="heading" style={{ marginBottom: 8 }}>Passport Active</h3>
                <p className="body">Your passport is registered on-chain. Your tier is applied automatically to every swap through the ToxicFlow pool hook.</p>
              </div>
            )
          ) : (
            <div>
              <h3 className="heading" style={{ marginBottom: 8 }}>Passport Assignment</h3>
              <p className="body">Passport assignment is handled by the protocol registry. Connect your wallet to view your current tier.</p>
            </div>
          )}
        </div>
      )}

      {/* Tier Info */}
      <div className="card" style={{ marginBottom: 16, overflow: 'hidden' }}>
        <button
          onClick={() => setShowTierInfo(v => !v)}
          style={{ width: '100%', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg)' }}
        >
          <span className="heading">Tier Explanation</span>
          <span style={{ color: 'var(--fg-3)' }}>{showTierInfo ? '−' : '+'}</span>
        </button>
        {showTierInfo && (
          <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { tier: 1, desc: 'Awarded to wallets demonstrating consistent, non-exploitative trading. Earns the lowest 10 bps fee.' },
              { tier: 0, desc: 'Default tier for all wallets. Applied when no behavior history or passport exists. 30 bps fee.' },
              { tier: 2, desc: 'Applied to wallets identified as arbitrage bots or sandwich attackers. 80 bps fee to protect LPs.' },
            ].map(t => (
              <div key={t.tier} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <TierBadge tier={t.tier} />
                <div className="body" style={{ fontSize: 13 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Technical Details */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <button
          onClick={() => setShowTechDetails(v => !v)}
          style={{ width: '100%', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg)' }}
        >
          <span className="heading">Technical Details</span>
          <span style={{ color: 'var(--fg-3)' }}>{showTechDetails ? '−' : '+'}</span>
        </button>
        {showTechDetails && (
          <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Tier (uint8)', value: String(passport.tier) },
              { label: 'Has Passport', value: String(passport.hasPassport) },
              { label: 'Fee Pips', value: String(passport.feePips) },
              { label: 'Fee Bps', value: String(passport.feeBps) },
              { label: 'Registry', value: PASSPORT_REGISTRY ?? 'Not deployed' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
                <span className="caption">{r.label}</span>
                <span className="mono" style={{ color: 'var(--fg)', fontSize: 12 }}>{r.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
