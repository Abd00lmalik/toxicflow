import { useEffect, useRef } from 'react'
import { Link } from 'wouter'
import { TierBadge } from '@/components/ui/TierBadge'
import { PASSPORT_REGISTRY, TOXIC_FLOW_HOOK, TOKEN_PAIR } from '@/lib/config/contracts'

const FLOW_STEPS = ['Wallet', 'Passport', 'Fee Class', 'Swap', 'Record', 'Pool Defense']

export default function Landing() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    ref.current?.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="page-content" style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ marginBottom: 24 }} className="anim-fade-in">
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 14px', borderRadius: 20,
            background: 'var(--trusted-2)', border: '1px solid var(--trusted-g)',
            fontSize: 12, fontWeight: 600, color: 'var(--trusted)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--trusted)', boxShadow: '0 0 8px var(--trusted)', display: 'inline-block' }} />
            Live on Sepolia Testnet
          </span>
        </div>

        <h1 className="display-xl anim-fade-up" style={{ maxWidth: 800, marginBottom: 24 }}>
          Your trading behavior{' '}
          <span style={{ background: 'linear-gradient(135deg, var(--accent), var(--trusted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            shapes your fee.
          </span>
        </h1>
        <p className="body-lg anim-fade-up d1" style={{ maxWidth: 520, marginBottom: 40 }}>
          ToxicFlow gives every wallet a behavior-based passport. Your tier determines your swap fee — automatically applied by the pool hook.
        </p>
        <div className="anim-fade-up d2" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }}>
          <Link href="/swap" className="btn btn-primary btn-lg">Start Swapping</Link>
          <Link href="/developers" className="btn btn-secondary btn-lg">See How It Works</Link>
        </div>

        {/* Flow diagram */}
        <div className="anim-fade-up d3" style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', justifyContent: 'center' }}>
          {FLOW_STEPS.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                padding: '8px 16px', borderRadius: 20,
                background: 'var(--s3)', border: '1px solid var(--b-soft)',
                fontSize: 13, fontWeight: 600, color: 'var(--fg-2)',
                animation: `flowPulse 2s ease-in-out ${i * 0.3}s infinite`,
              }}>
                {step}
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div style={{ width: 24, height: 1, background: 'var(--b-soft)', margin: '0 4px', flexShrink: 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', marginLeft: 'auto', marginTop: -3, opacity: 0.6 }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <div className="label" style={{ marginBottom: 16 }}>The Problem</div>
            <h2 className="display-md" style={{ marginBottom: 20 }}>Every wallet pays the same fee. That's not fair.</h2>
            <p className="body-lg">Most AMM liquidity pools charge a flat fee to all traders — regardless of whether they're long-term liquidity providers, arbitrage bots, or sandwich attackers. This exposes LPs to toxic flow with no protection.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Safe Trader', tier: 1, fee: '0.10%', desc: 'Long-term, honest flow' },
              { label: 'Average Wallet', tier: 0, fee: '0.30%', desc: 'Default — no passport' },
              { label: 'Toxic Wallet', tier: 2, fee: '0.80%', desc: 'Arbitrage / sandwich attack' },
            ].map(row => (
              <div key={row.label} className="card-elevated" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <TierBadge tier={row.tier} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{row.label}</div>
                  <div className="caption">{row.desc}</div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: row.tier === 1 ? 'var(--trusted)' : row.tier === 2 ? 'var(--toxic)' : 'var(--neutral)', fontVariantNumeric: 'tabular-nums' }}>
                  {row.fee}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="label" style={{ marginBottom: 12 }}>Protocol</div>
          <h2 className="display-md">How It Works</h2>
        </div>
        <div className="reveal d1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          {[
            { n: '01', title: 'Connect', desc: 'Connect your wallet to Sepolia testnet' },
            { n: '02', title: 'Register', desc: 'Claim your passport on-chain via selfRegister()' },
            { n: '03', title: 'Get Scored', desc: 'The protocol analyzes your on-chain behavior and assigns a tier' },
            { n: '04', title: 'Swap', desc: 'The pool hook reads your tier and applies the correct fee automatically' },
            { n: '05', title: 'Record', desc: 'Every swap event is anchored to 0G decentralized storage' },
          ].map(s => (
            <div key={s.n} className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--b-base)', lineHeight: 1, marginBottom: 12 }}>{s.n}</div>
              <div className="heading" style={{ marginBottom: 8 }}>{s.title}</div>
              <div className="body" style={{ fontSize: 13 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tier Cards */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="label" style={{ marginBottom: 12 }}>Fee Classes</div>
          <h2 className="display-md">Three Tiers, Three Fee Classes</h2>
        </div>
        <div className="reveal d1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {[
            { tier: 1, pct: '0.10%', desc: 'Earned by wallets demonstrating safe, honest trading behavior over time.' },
            { tier: 0, pct: '0.30%', desc: 'The default tier — applied to all wallets without a passport or established history.' },
            { tier: 2, pct: '0.80%', desc: 'Applied to wallets identified as arbitrage bots or sandwich attackers.' },
          ].map(({ tier, pct, desc }) => {
            const colors = ['var(--neutral)', 'var(--trusted)', 'var(--toxic)']
            const labels = ['Neutral', 'Trusted', 'Toxic']
            const c = colors[tier]
            return (
              <div key={tier} className="card" style={{ padding: 28, borderTop: `3px solid ${c}` }}>
                <TierBadge tier={tier} size="md" />
                <div style={{ fontSize: 48, fontWeight: 800, color: c, margin: '16px 0 8px', letterSpacing: '-0.03em' }}>{pct}</div>
                <div className="label" style={{ marginBottom: 12 }}>swap fee</div>
                <div className="body">{desc}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* For Traders / LPs */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          <div className="card-elevated" style={{ padding: 32 }}>
            <div className="label" style={{ color: 'var(--trusted)', marginBottom: 16 }}>For Traders</div>
            <h3 className="heading" style={{ marginBottom: 12 }}>Better behavior, lower fees</h3>
            <p className="body">Build your on-chain reputation and earn the Trusted tier. Every swap at 0.10% saves you real money compared to the 0.30% neutral rate.</p>
          </div>
          <div className="card-elevated" style={{ padding: 32 }}>
            <div className="label" style={{ color: 'var(--accent)', marginBottom: 16 }}>For LPs</div>
            <h3 className="heading" style={{ marginBottom: 12 }}>Automated protection against toxic flow</h3>
            <p className="body">Pool Defense monitors the composition of incoming flow. When toxic share exceeds the threshold, KeeperHub triggers an automated response to protect your liquidity.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px' }}>
        <div className="reveal" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div className="card-glass" style={{ padding: '48px 40px', boxShadow: 'var(--sh-glow)' }}>
            <h2 className="display-md" style={{ marginBottom: 16 }}>Start with your passport</h2>
            <p className="body-lg" style={{ marginBottom: 32 }}>Register on Sepolia, get scored, and swap with your tier-adjusted fee. Everything happens on-chain.</p>
            <Link href="/passport" className="btn btn-primary btn-lg">Get My Passport</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--b-dim)', padding: '48px 24px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 32 }}>
          <div>
            <div className="label" style={{ marginBottom: 16 }}>Product</div>
            {['Passport', 'Swap', 'Records', 'Pool Defense', 'Demo'].map(l => (
              <div key={l} style={{ marginBottom: 8 }}>
                <Link href={`/${l.toLowerCase().replace(' ', '-')}`} style={{ color: 'var(--fg-2)', fontSize: 14, textDecoration: 'none' }}>{l}</Link>
              </div>
            ))}
          </div>
          <div>
            <div className="label" style={{ marginBottom: 16 }}>Protocol</div>
            <div style={{ marginBottom: 8 }}><Link href="/developers" style={{ color: 'var(--fg-2)', fontSize: 14, textDecoration: 'none' }}>Developers</Link></div>
            <div style={{ marginBottom: 8 }}><Link href="/dashboard" style={{ color: 'var(--fg-2)', fontSize: 14, textDecoration: 'none' }}>Dashboard</Link></div>
          </div>
          <div>
            <div className="label" style={{ marginBottom: 16 }}>Testnet</div>
            {PASSPORT_REGISTRY && (
              <div style={{ marginBottom: 8 }}>
                <a href={`https://sepolia.etherscan.io/address/${PASSPORT_REGISTRY}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--fg-2)', fontSize: 13, textDecoration: 'none', fontFamily: 'monospace' }}>
                  Registry ↗
                </a>
              </div>
            )}
            {TOXIC_FLOW_HOOK && (
              <div>
                <a href={`https://sepolia.etherscan.io/address/${TOXIC_FLOW_HOOK}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--fg-2)', fontSize: 13, textDecoration: 'none', fontFamily: 'monospace' }}>
                  Hook ↗
                </a>
              </div>
            )}
            {!PASSPORT_REGISTRY && <div className="caption">Contracts not yet deployed</div>}
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--b-dim)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>ToxicFlow Passport</div>
          <div className="caption">Sepolia testnet · Uniswap v4 · {TOKEN_PAIR}</div>
        </div>
      </footer>
    </div>
  )
}
