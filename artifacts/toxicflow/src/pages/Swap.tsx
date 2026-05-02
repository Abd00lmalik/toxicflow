import { useState } from 'react'
import { useAccount, useSwitchChain, useBalance } from 'wagmi'
import { parseEther, formatEther, formatUnits } from 'viem'
import { sepolia } from 'wagmi/chains'
import { TokenIcon } from '@/components/icons/tokens/TokenIcon'
import { TierBadge } from '@/components/ui/TierBadge'
import { WalletModal } from '@/components/wallet/WalletModal'
import { usePassport } from '@/hooks/usePassport'
import { useSwapTransaction } from '@/hooks/useSwapTransaction'
import { useTokenState } from '@/hooks/useTokenState'
import { useAddLiquidity } from '@/hooks/useAddLiquidity'
import { getTokens, tierFee } from '@/lib/swap/tokens'
import { POOL_SWAP_TEST, POOL_ID, USDC_ADDRESS } from '@/lib/config/contracts'

type SwapTab = 'swap' | 'liquidity'

const LIQUIDITY_PRESETS = [
  { label: '10 USDC', eth: '0.005', usdc: '10' },
  { label: '20 USDC', eth: '0.01',  usdc: '20' },
  { label: '50 USDC', eth: '0.025', usdc: '50' },
  { label: '100 USDC', eth: '0.05', usdc: '100' },
]

export default function Swap() {
  const [modalOpen, setModalOpen]         = useState(false)
  const [tab, setTab]                     = useState<SwapTab>('swap')
  const [amountIn, setAmountIn]           = useState('')
  const [liqEth, setLiqEth]              = useState('0.05')
  const [liqUsdc, setLiqUsdc]            = useState('100')
  const [showAdvanced, setShowAdvanced]   = useState(false)

  const { address, isConnected, chainId } = useAccount()
  const { switchChain }                   = useSwitchChain()
  const passport                          = usePassport(address)
  const swap                              = useSwapTransaction()
  const liquidity                         = useAddLiquidity()
  const tokens                            = getTokens()
  const fee                               = tierFee(passport.tier)

  const outputToken = tokens.output
  const tokenState  = useTokenState(
    outputToken.address ? outputToken.address as `0x${string}` : undefined,
    address,
    POOL_SWAP_TEST,
  )

  // ETH native balance
  const ethBalance = useBalance({ address, chainId: sepolia.id })

  const isWrongChain      = isConnected && chainId !== sepolia.id
  const amountBig         = amountIn ? parseEther(amountIn) : BigInt(0)
  const needsApproval     = outputToken.address && tokenState.allowance < amountBig && amountBig > 0
  const estimatedOutput   = amountIn ? (parseFloat(amountIn) * 2000 * (1 - fee.bps / 10000)).toFixed(4) : '-'

  const ethBalanceFormatted  = ethBalance.data ? parseFloat(formatEther(ethBalance.data.value)).toFixed(4) : '--'
  const usdcBalanceFormatted = tokenState.balance ? parseFloat(formatUnits(tokenState.balance, 6)).toFixed(2) : '--'

  const getSwapAction = () => {
    if (!isConnected) return { label: 'Connect Wallet', action: () => setModalOpen(true) }
    if (isWrongChain) return { label: 'Switch to Sepolia', action: () => switchChain({ chainId: sepolia.id }) }
    if (!amountIn || amountBig === BigInt(0)) return { label: 'Enter amount', action: () => {}, disabled: true }
    if (!POOL_ID) return { label: 'Pool not configured', action: () => {}, disabled: true }
    if (needsApproval) return { label: `Approve ${outputToken.symbol}`, action: () => tokenState.approve(amountBig) }
    return { label: 'Swap', action: () => swap.executeSwap(amountBig, true) }
  }

  const swapAction    = getSwapAction()
  const swapLoading   = swap.isPending || swap.isConfirming
  const approveLoading = tokenState.approveLoading

  const handleAddLiquidity = () => {
    if (liquidity.status === 'pending') return
    liquidity.addLiquidity(liqEth, liqUsdc)
  }

  const applyPreset = (preset: typeof LIQUIDITY_PRESETS[0]) => {
    setLiqEth(preset.eth)
    setLiqUsdc(preset.usdc)
    if (liquidity.status !== 'idle') liquidity.reset()
  }

  return (
    <div className="page-content" style={{ minHeight: '85vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 24px 80px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ marginBottom: 32 }}>
          <div className="label" style={{ marginBottom: 8 }}>Uniswap v4 · ToxicFlow Hook</div>
          <h1 className="display-md">Swap</h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, padding: 4, background: 'var(--s2)', borderRadius: 'var(--r-md)', border: '1px solid var(--b-dim)' }}>
          {(['swap', 'liquidity'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 'calc(var(--r-md) - 2px)',
                background: tab === t ? 'var(--s4)' : 'transparent',
                border: tab === t ? '1px solid var(--b-soft)' : '1px solid transparent',
                color: tab === t ? 'var(--fg)' : 'var(--fg-3)',
                fontWeight: tab === t ? 700 : 500,
                fontSize: 14, cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.01em',
              }}
            >
              {t === 'swap' ? 'Swap' : 'Add Liquidity'}
            </button>
          ))}
        </div>

        {/* ── SWAP TAB ── */}
        {tab === 'swap' && (
          <>
            <div className="card-elevated" style={{ padding: 24, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span className="heading">Swap</span>
                {POOL_ID ? (
                  <span style={{ fontSize: 11, padding: '3px 10px', background: 'var(--trusted-2)', color: 'var(--trusted)', borderRadius: 12, fontWeight: 600 }}>Pool Active</span>
                ) : (
                  <span style={{ fontSize: 11, padding: '3px 10px', background: 'var(--neutral-2)', color: 'var(--neutral)', borderRadius: 12, fontWeight: 600 }}>Pool Not Configured</span>
                )}
              </div>

              {/* ETH input */}
              <div style={{ padding: '16px', background: 'var(--s1)', borderRadius: 'var(--r-md)', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="label">You Pay</span>
                  {isConnected && <span className="caption">Balance: {ethBalanceFormatted} ETH</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="number"
                    value={amountIn}
                    onChange={e => setAmountIn(e.target.value)}
                    placeholder="0.001"
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 28, fontWeight: 700, color: 'var(--fg)', minWidth: 0 }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--s3)', borderRadius: 'var(--r-md)', flexShrink: 0 }}>
                    <TokenIcon icon="eth" size={20} />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>ETH</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                <div style={{ padding: 8, background: 'var(--s3)', borderRadius: '50%', border: '1px solid var(--b-soft)' }}>↓</div>
              </div>

              {/* USDC output */}
              <div style={{ padding: '16px', background: 'var(--s1)', borderRadius: 'var(--r-md)', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="label">You Receive (est.)</span>
                  {isConnected && <span className="caption">Balance: {usdcBalanceFormatted} USDC</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, fontSize: 28, fontWeight: 700, color: amountIn ? 'var(--fg)' : 'var(--fg-3)' }}>{estimatedOutput}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--s3)', borderRadius: 'var(--r-md)', flexShrink: 0 }}>
                    <TokenIcon icon={outputToken.icon} size={20} />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{outputToken.symbol}</span>
                  </div>
                </div>
              </div>

              {/* Fee */}
              <div style={{ padding: '16px', background: 'var(--s2)', borderRadius: 'var(--r-md)', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>ToxicFlow swap fee</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isConnected && <TierBadge tier={passport.tier} size="sm" />}
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{fee.pct}</span>
                  </div>
                </div>
                <div style={{ height: '1px', background: 'var(--b-dim)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>Network gas fee</span>
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--fg-3)' }}>shown in wallet</span>
                </div>
              </div>

              {/* Liquidity depth note */}
              {POOL_ID && (
                <div style={{ padding: '10px 14px', background: 'var(--amber-2)', border: '1px solid rgba(245,158,11,0.22)', borderRadius: 'var(--r-sm)', marginBottom: 16, fontSize: 12, color: 'var(--amber)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ flexShrink: 0, fontWeight: 700 }}>Depth</span>
                  <span>
                    Liquidity is what lets the pool quote realistic swaps. If the pool has 100 USDC, it cannot support a 200 USDC output safely.
                    Keep swap sizes to 0.001-0.005 ETH unless more liquidity has been added.
                    Use the <button onClick={() => setTab('liquidity')} style={{ color: 'var(--amber)', fontWeight: 700, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}>Add Liquidity</button> tab to deepen the pool.
                  </span>
                </div>
              )}

              <button
                onClick={swapAction.action}
                disabled={(swapAction as { disabled?: boolean }).disabled || swapLoading || approveLoading}
                className="btn btn-primary btn-full btn-lg"
              >
                {swapLoading ? 'Confirming...' : approveLoading ? 'Approving...' : swapAction.label}
              </button>
            </div>

            {/* Success */}
            {swap.isSuccess && swap.txHash && (
              <div className="card" style={{ padding: 24, borderColor: 'var(--trusted)', boxShadow: 'var(--sh-trusted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ color: 'var(--trusted)', fontSize: 20 }}>✓</span>
                  <span className="heading">Swap complete</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <div className="label" style={{ marginBottom: 4 }}>Transaction</div>
                    <a href={`https://sepolia.etherscan.io/tx/${swap.txHash}`} target="_blank" rel="noopener noreferrer" className="mono" style={{ fontSize: 12, color: 'var(--accent)' }}>
                      {swap.txHash.slice(0, 20)}...{swap.txHash.slice(-8)} ↗
                    </a>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="caption">ToxicFlow fee applied</span>
                    <TierBadge tier={passport.tier} size="sm" showFee />
                  </div>
                </div>
              </div>
            )}

            {swap.error && (
              <div style={{ padding: '12px 16px', background: 'var(--toxic-2)', border: '1px solid var(--toxic)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--toxic)' }}>
                {swap.error.message}
              </div>
            )}
          </>
        )}

        {/* ── LIQUIDITY TAB ── */}
        {tab === 'liquidity' && (
          <div className="card-elevated" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span className="heading">Add Liquidity</span>
              <span style={{ fontSize: 11, padding: '3px 10px', background: 'rgba(157,77,255,0.12)', color: 'var(--pool)', borderRadius: 12, fontWeight: 600 }}>ETH / USDC</span>
            </div>

            {/* Info banner */}
            <div style={{ padding: '10px 14px', background: 'var(--s2)', border: '1px solid var(--b-soft)', borderRadius: 'var(--r-sm)', marginBottom: 20, fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.6 }}>
              Liquidity is added from the <strong style={{ color: 'var(--fg)' }}>protocol deployer wallet</strong> server-side. This is a testnet convenience. In production, any wallet can provide liquidity via PositionManager. The transaction is signed on-chain and visible on Etherscan.
            </div>

            {/* Pool info row */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, padding: '12px 16px', background: 'var(--s2)', borderRadius: 'var(--r-sm)', textAlign: 'center' }}>
                <div className="label" style={{ marginBottom: 4 }}>Target Price</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>1 ETH = 2,000 USDC</div>
              </div>
              <div style={{ flex: 1, padding: '12px 16px', background: 'var(--s2)', borderRadius: 'var(--r-sm)', textAlign: 'center' }}>
                <div className="label" style={{ marginBottom: 4 }}>Range</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Full range</div>
              </div>
            </div>

            {/* Presets */}
            <div className="label" style={{ marginBottom: 8 }}>Quick presets</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
              {LIQUIDITY_PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  style={{
                    padding: '10px 6px', borderRadius: 'var(--r-sm)', fontSize: 12, fontWeight: 600,
                    background: liqUsdc === p.usdc ? 'rgba(0,209,102,0.12)' : 'var(--s3)',
                    border: `1px solid ${liqUsdc === p.usdc ? 'var(--accent)' : 'var(--b-soft)'}`,
                    color: liqUsdc === p.usdc ? 'var(--accent)' : 'var(--fg-2)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* ETH input */}
            <div style={{ padding: '14px', background: 'var(--s1)', borderRadius: 'var(--r-md)', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="label">ETH amount</span>
                {isConnected && <span className="caption">Wallet: {ethBalanceFormatted} ETH</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="number"
                  value={liqEth}
                  onChange={e => { setLiqEth(e.target.value); liquidity.reset() }}
                  placeholder="0.05"
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 22, fontWeight: 700, color: 'var(--fg)', minWidth: 0 }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'var(--s3)', borderRadius: 'var(--r-sm)', flexShrink: 0 }}>
                  <TokenIcon icon="eth" size={18} />
                  <span style={{ fontWeight: 700, fontSize: 13 }}>ETH</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0', color: 'var(--fg-3)', fontSize: 12 }}>+</div>

            {/* USDC input */}
            <div style={{ padding: '14px', background: 'var(--s1)', borderRadius: 'var(--r-md)', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="label">USDC amount</span>
                {isConnected && <span className="caption">Wallet: {usdcBalanceFormatted} USDC</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="number"
                  value={liqUsdc}
                  onChange={e => { setLiqUsdc(e.target.value); liquidity.reset() }}
                  placeholder="100"
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 22, fontWeight: 700, color: 'var(--fg)', minWidth: 0 }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'var(--s3)', borderRadius: 'var(--r-sm)', flexShrink: 0 }}>
                  <TokenIcon icon="usdc" size={18} />
                  <span style={{ fontWeight: 700, fontSize: 13 }}>USDC</span>
                </div>
              </div>
            </div>

            {/* Depth honesty note */}
            <div style={{ padding: '10px 14px', background: 'var(--amber-2)', border: '1px solid rgba(245,158,11,0.22)', borderRadius: 'var(--r-sm)', marginBottom: 20, fontSize: 12, color: 'var(--amber)', lineHeight: 1.6 }}>
              <strong>Realistic depth:</strong> With 100 USDC in the pool, the pool cannot safely output 200 USDC. After seeding 0.05 ETH + 100 USDC, test swaps of 0.001-0.005 ETH are realistic. For 0.1 ETH swaps, the pool needs at least 1 ETH + 2,000 USDC.
            </div>

            {/* Status displays */}
            {liquidity.status === 'pending' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--s2)', borderRadius: 'var(--r-md)', marginBottom: 16, fontSize: 13 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--fg)', marginBottom: 2 }}>Broadcasting transaction...</div>
                  <div style={{ color: 'var(--fg-3)' }}>Deploying liquidity router, approving USDC, and adding {liqEth} ETH + {liqUsdc} USDC. This takes ~30-60 seconds.</div>
                </div>
              </div>
            )}

            {liquidity.status === 'success' && (
              <div style={{ padding: '14px 16px', background: 'var(--trusted-2)', border: '1px solid var(--trusted)', borderRadius: 'var(--r-md)', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: 'var(--trusted)', fontSize: 18 }}>✓</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--trusted)' }}>Liquidity added</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 8 }}>
                  {liquidity.ethAmount} ETH + {liquidity.usdcAmount} USDC deposited into the ToxicFlow ETH/USDC pool.
                </div>
                {liquidity.txHash && (
                  <a href={`https://sepolia.etherscan.io/tx/${liquidity.txHash}`} target="_blank" rel="noopener noreferrer" className="mono" style={{ fontSize: 11, color: 'var(--accent)' }}>
                    {liquidity.txHash.slice(0, 22)}...{liquidity.txHash.slice(-8)} ↗
                  </a>
                )}
                <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(0,209,102,0.06)', borderRadius: 'var(--r-sm)', fontSize: 12, color: 'var(--trusted)' }}>
                  Pool funded. Recommended test swaps: up to 0.005 ETH. For larger swaps, add more liquidity.
                </div>
              </div>
            )}

            {liquidity.status === 'error' && (
              <div style={{ padding: '12px 16px', background: 'var(--toxic-2)', border: '1px solid var(--toxic)', borderRadius: 'var(--r-md)', marginBottom: 16, fontSize: 13, color: 'var(--toxic)' }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Liquidity operation failed</div>
                <div style={{ wordBreak: 'break-word', opacity: 0.85 }}>{liquidity.error}</div>
                <button onClick={liquidity.reset} style={{ marginTop: 8, fontSize: 12, color: 'var(--toxic)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Try again</button>
              </div>
            )}

            {/* Add button */}
            <button
              onClick={handleAddLiquidity}
              disabled={liquidity.status === 'pending' || !liqEth || !liqUsdc}
              className="btn btn-primary btn-full btn-lg"
              style={{ marginBottom: 12 }}
            >
              {liquidity.status === 'pending' ? 'Adding Liquidity...' : `Add ${liqEth} ETH + ${liqUsdc} USDC`}
            </button>

            {/* Advanced details toggle */}
            <button
              onClick={() => setShowAdvanced(v => !v)}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--fg-3)', padding: '4px 0' }}
            >
              {showAdvanced ? 'Hide' : 'Show'} advanced details
            </button>

            {showAdvanced && (
              <div style={{ marginTop: 12, padding: '12px 14px', background: 'var(--s2)', borderRadius: 'var(--r-sm)', fontSize: 11, color: 'var(--fg-3)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  ['Pool Manager', '0xE03A1074c86CFeDd5C142C4F04F1a1536e203543'],
                  ['Hook', '0x024245B2CDBccf9581D1f6FbA533ca4061410080'],
                  ['USDC', USDC_ADDRESS],
                  ['Tick lower', '-887220 (full range)'],
                  ['Tick upper', '887220 (full range)'],
                  ['Tick spacing', '60'],
                  ['sqrtPriceX96', '3543191142285914327220224'],
                  ['Fee flag', 'DYNAMIC_FEE_FLAG (0x800000)'],
                  ['Router', 'PoolModifyLiquidityTest (deployed per-tx)'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ flexShrink: 0 }}>{k}:</span>
                    <span className="mono" style={{ textAlign: 'right', wordBreak: 'break-all' }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <WalletModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
