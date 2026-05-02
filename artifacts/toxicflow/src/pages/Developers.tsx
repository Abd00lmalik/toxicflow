import { CodeBlock } from '@/components/ui/CodeBlock'
import { PASSPORT_REGISTRY, TOXIC_FLOW_HOOK, POOL_SWAP_TEST, POOL_MANAGER, POOL_ID, TOKEN_PAIR, CHAIN_ID } from '@/lib/config/contracts'

const tierTableRows = [
  { tier: 'Trusted', uint: 1, pips: 1000, bps: 10, pct: '0.10%' },
  { tier: 'Neutral', uint: 0, pips: 3000, bps: 30, pct: '0.30%' },
  { tier: 'Toxic', uint: 2, pips: 8000, bps: 80, pct: '0.80%' },
]

export default function Developers() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'
  const resolverUrl = `${baseUrl}/api/resolver?trader=0x...&method=all`

  const copyText = (text: string) => navigator.clipboard.writeText(text)

  return (
    <div className="page-content" style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Hero */}
      <div style={{ marginBottom: 56 }}>
        <div className="label" style={{ marginBottom: 8 }}>Integration Guide</div>
        <h1 className="display-md" style={{ marginBottom: 16 }}>Integrate ToxicFlow Passport</h1>
        <p className="body-lg" style={{ maxWidth: 640 }}>
          For AMMs, DEXes, and swap interfaces. Read a wallet's tier on-chain in one call: the pool hook applies the correct fee automatically.
        </p>
      </div>

      {/* Quick Integration */}
      <section style={{ marginBottom: 48 }}>
        <h2 className="heading" style={{ marginBottom: 20 }}>Quick Integration</h2>
        <CodeBlock language="solidity" code={`// Resolver interface: call on PassportRegistry or ToxicFlowHook

// Returns 0 = Neutral, 1 = Trusted, 2 = Toxic
function getTraderTier(address trader) external view returns (uint8);

// Returns true if wallet has claimed a passport on-chain
function hasActivePassport(address trader) external view returns (bool);

// Returns fee in pips, tier as uint8, and passport status in one call
// feePips: 1000 = 10 bps, 3000 = 30 bps, 8000 = 80 bps
function previewFee(address trader)
  external view
  returns (uint24 feePips, uint8 tier, bool hasPassport);`} />
      </section>

      {/* API Resolver */}
      <section style={{ marginBottom: 48 }}>
        <h2 className="heading" style={{ marginBottom: 20 }}>API Resolver</h2>
        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="label">Endpoint</div>
            <button onClick={() => copyText(resolverUrl)} className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>Copy</button>
          </div>
          <code className="mono" style={{ fontSize: 13, color: 'var(--accent)', wordBreak: 'break-all' }}>
            GET {resolverUrl}
          </code>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['trader (required): 0x wallet address', 'method: "all" returns all resolver fields'].map(p => (
              <div key={p} className="caption">• {p}</div>
            ))}
          </div>
        </div>
        <CodeBlock language="json" code={JSON.stringify({
          trader: '0x...',
          tier: 1,
          tierLabel: 'trusted',
          hasActivePassport: true,
          feeBps: 10,
          feePips: 1000,
          resolverType: 'on-chain',
          contracts: { registry: PASSPORT_REGISTRY ?? '0x...', hook: TOXIC_FLOW_HOOK ?? '0x...' }
        }, null, 2)} />
      </section>

      {/* Integration Flow */}
      <section style={{ marginBottom: 48 }}>
        <h2 className="heading" style={{ marginBottom: 20 }}>Integration Flow</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            {
              step: '1',
              title: 'Deploy with hook',
              code: `PoolKey memory key = PoolKey({
  currency0: Currency.wrap(address(0)),   // ETH
  currency1: Currency.wrap(usdcAddress),
  fee: LPFeeLibrary.DYNAMIC_FEE_FLAG,    // 0x800000
  tickSpacing: 60,
  hooks: IHooks(address(toxicFlowHook))
});
poolManager.initialize(key, sqrtPriceX96);`,
            },
            {
              step: '2',
              title: 'The hook reads tier on every swap',
              code: `// ToxicFlowHook.beforeSwap(): called automatically
address trader = tx.origin;
uint8 tier = registry.getTier(trader);
uint24 fee = tier == 1 ? 1000 : tier == 2 ? 8000 : 3000;
emit SwapFeeApplied(poolId, trader, tier, fee, ...);
return (selector, ZERO_DELTA, fee);`,
            },
            {
              step: '3',
              title: 'Preview fee before swap',
              code: `(uint24 feePips, uint8 tier, bool hasPassport) =
  IToxicFlowHook(hookAddress).previewFee(traderAddress);

// feePips → bps: divide by 100
uint24 feeBps = feePips / 100;  // 10, 30, or 80`,
            },
          ].map(s => (
            <div key={s.step} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--b-base)', lineHeight: 1, flexShrink: 0 }}>0{s.step}</div>
                <div style={{ flex: 1 }}>
                  <div className="heading" style={{ marginBottom: 12 }}>{s.title}</div>
                  <CodeBlock language="solidity" code={s.code} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fee Class Mapping */}
      <section style={{ marginBottom: 48 }}>
        <h2 className="heading" style={{ marginBottom: 20 }}>Fee Class Mapping</h2>
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--b-soft)' }}>
                {['Tier', 'uint8', 'Pips', 'Bps', 'Percentage'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--fg-3)', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tierTableRows.map(row => (
                <tr key={row.tier} style={{ borderBottom: '1px solid var(--b-dim)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>{row.tier}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{row.uint}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{row.pips}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{row.bps}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>{row.pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Testnet Config */}
      <section style={{ marginBottom: 48 }}>
        <h2 className="heading" style={{ marginBottom: 20 }}>Testnet Configuration</h2>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { label: 'Chain', value: `Sepolia (${CHAIN_ID})` },
              { label: 'RPC', value: 'https://ethereum-sepolia-rpc.publicnode.com' },
              { label: 'Pool Manager', value: POOL_MANAGER },
              { label: 'PoolSwapTest', value: POOL_SWAP_TEST },
              { label: 'PassportRegistry', value: PASSPORT_REGISTRY ?? 'Not deployed' },
              { label: 'ToxicFlowHook', value: TOXIC_FLOW_HOOK ?? 'Not deployed' },
              { label: 'Pool ID', value: POOL_ID ?? 'Not configured' },
              { label: 'Token Pair', value: TOKEN_PAIR },
              { label: '/api/resolver', value: `${baseUrl}/api/resolver` },
              { label: '/api/events', value: `${baseUrl}/api/events` },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div className="label">{r.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--fg)', wordBreak: 'break-all', flex: 1 }}>{r.value}</span>
                  {r.value !== 'Not deployed' && r.value !== 'Not configured' && (
                    <button onClick={() => copyText(r.value)} className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px', flexShrink: 0 }}>Copy</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hook immutability */}
      <section style={{ marginBottom: 48 }}>
        <h2 className="heading" style={{ marginBottom: 16 }}>Hook Immutability and Public Pools</h2>
        <div className="card" style={{ padding: 24, borderColor: 'rgba(245,158,11,0.22)', background: 'rgba(245,158,11,0.03)' }}>
          <div style={{ fontSize: 13, color: 'var(--amber)', marginBottom: 10, fontWeight: 700 }}>Important: Hooks are fixed at pool creation</div>
          <div className="body" style={{ marginBottom: 12, fontSize: 14 }}>
            In Uniswap v4, the hook address is embedded in the <span className="mono" style={{ fontSize: 12 }}>PoolKey</span>. This means:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'A pool with no hook cannot have one added later.',
              'A pool with a different hook cannot be switched to ToxicFlow.',
              'Public Uniswap pools (ETH/USDC, etc.) were deployed without the ToxicFlow hook: they cannot use tier-based fees.',
              'To use ToxicFlow, you must deploy a new pool with the ToxicFlow hook from day one.',
            ].map(point => (
              <div key={point} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--amber)', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>·</span>
                <span className="body" style={{ fontSize: 14 }}>{point}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--s2)', borderRadius: 'var(--r-sm)', fontSize: 13, color: 'var(--fg-2)' }}>
            The ToxicFlow ETH/USDC pool deployed on Sepolia (<span className="mono" style={{ fontSize: 12 }}>tickSpacing: 60</span>, <span className="mono" style={{ fontSize: 12 }}>fee: DYNAMIC_FEE_FLAG</span>) is a dedicated pool with the hook set at initialization. It is separate from all other ETH/USDC pools.
          </div>
        </div>
      </section>

      {/* Providing Liquidity */}
      <section style={{ marginBottom: 48 }}>
        <h2 className="heading" style={{ marginBottom: 16 }}>Providing Liquidity to a ToxicFlow Pool</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {
              title: 'Liquidity only works with the ToxicFlow hook',
              desc: 'ToxicFlow fee logic applies only to pools initialized with the ToxicFlow hook. Liquidity added to a standard ETH/USDC pool does not benefit from tier-based protection.',
            },
            {
              title: 'Deeper liquidity improves quote quality',
              desc: 'With limited liquidity, large swaps will fail or slip badly. A pool seeded with 0.05 ETH + 100 USDC can safely support swaps of 0.001-0.005 ETH. For 0.1 ETH swaps, you need at least 1 ETH + 2,000 USDC.',
            },
            {
              title: 'LPs are protected by tier fees',
              desc: 'Because toxic flow pays 8x more in fees than trusted flow, liquidity providers are compensated for taking on risky counterparty exposure. Pool Defense also monitors toxic concentration and can trigger automated defense responses via KeeperHub.',
            },
            {
              title: 'Public pools cannot be retrofitted',
              desc: 'Existing Uniswap ETH/USDC pools were deployed without the ToxicFlow hook. Their hook address is fixed at pool creation. To use ToxicFlow, deploy a new pool with the hook from day one.',
            },
          ].map(s => (
            <div key={s.title} className="card" style={{ padding: 20 }}>
              <div className="heading" style={{ marginBottom: 6, fontSize: 14 }}>{s.title}</div>
              <div className="body" style={{ fontSize: 13 }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--s2)', borderRadius: 'var(--r-sm)', fontSize: 13, color: 'var(--fg-2)' }}>
          The ToxicFlow ETH/USDC Sepolia pool accepts liquidity via <span className="mono" style={{ fontSize: 12 }}>PoolModifyLiquidityTest</span> (testnet) or the canonical <span className="mono" style={{ fontSize: 12 }}>PositionManager</span> in production deployments. LP positions are full-range (<span className="mono" style={{ fontSize: 12 }}>tickLower: -887220, tickUpper: 887220</span>, tickSpacing: 60).
        </div>
      </section>

      {/* Demo Recording Guide */}
      <section style={{ marginBottom: 48 }}>
        <div className="card" style={{ padding: 24, background: 'rgba(0,209,102,0.04)', borderColor: 'rgba(0,209,102,0.22)' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>🎬</div>
            <div>
              <div className="heading" style={{ marginBottom: 6 }}>Recording a demo?</div>
              <div className="body" style={{ fontSize: 14, marginBottom: 12 }}>
                The repo includes a step-by-step demo recording guide covering setup, the recommended flow, a voiceover script, and troubleshooting.
              </div>
              <code className="mono" style={{ fontSize: 12, color: 'var(--accent)' }}>docs/DEMO_RECORDING_GUIDE.md</code>
            </div>
          </div>
        </div>
      </section>

      {/* LP Explanation */}
      <section>
        <h2 className="heading" style={{ marginBottom: 16 }}>How Pool Defense Works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { title: 'Dynamic fee protection', desc: 'The ToxicFlowHook charges higher fees to wallets identified as toxic flow. This makes sandwich attacks and arbitrage more expensive, directly protecting LP returns.' },
            { title: 'Threshold monitoring', desc: 'Pool Defense tracks the composition of recent swaps. When the toxic share exceeds the configured threshold, KeeperHub triggers an automated protective response.' },
            { title: 'Why integrate ToxicFlow', desc: 'DEXes and AMMs integrating ToxicFlow get an out-of-the-box tier resolver, an on-chain fee classification system, and a KeeperHub automation layer: without any custom smart contract development.' },
          ].map(s => (
            <div key={s.title} className="card" style={{ padding: 24 }}>
              <div className="heading" style={{ marginBottom: 8 }}>{s.title}</div>
              <div className="body">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
