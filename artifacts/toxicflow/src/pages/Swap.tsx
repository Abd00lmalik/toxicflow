import { useState } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { sepolia } from 'wagmi/chains'
import { TokenIcon } from '@/components/icons/tokens/TokenIcon'
import { TierBadge } from '@/components/ui/TierBadge'
import { WalletModal } from '@/components/wallet/WalletModal'
import { usePassport } from '@/hooks/usePassport'
import { useSwapTransaction } from '@/hooks/useSwapTransaction'
import { useTokenState } from '@/hooks/useTokenState'
import { getTokens, tierFee } from '@/lib/swap/tokens'
import { POOL_SWAP_TEST, POOL_ID } from '@/lib/config/contracts'

export default function Swap() {
  const [modalOpen, setModalOpen] = useState(false)
  const [amountIn, setAmountIn] = useState('')
  const { address, isConnected, chainId } = useAccount()
  const { switchChain } = useSwitchChain()
  const passport = usePassport(address)
  const swap = useSwapTransaction()
  const tokens = getTokens()
  const fee = tierFee(passport.tier)

  const outputToken = tokens.output
  const tokenState = useTokenState(
    outputToken.address ? outputToken.address as `0x${string}` : undefined,
    address,
    POOL_SWAP_TEST,
  )

  const isWrongChain = isConnected && chainId !== sepolia.id
  const amountBig = amountIn ? parseEther(amountIn) : BigInt(0)
  const needsApproval = outputToken.address && tokenState.allowance < amountBig && amountBig > 0
  const estimatedOutput = amountIn ? (parseFloat(amountIn) * 2000 * (1 - fee.bps / 10000)).toFixed(4) : '-'

  const getAction = () => {
    if (!isConnected) return { label: 'Connect Wallet', action: () => setModalOpen(true) }
    if (isWrongChain) return { label: 'Switch to Sepolia', action: () => switchChain({ chainId: sepolia.id }) }
    if (!amountIn || amountBig === BigInt(0)) return { label: 'Enter amount', action: () => {}, disabled: true }
    if (!POOL_ID) return { label: 'Pool not configured', action: () => {}, disabled: true }
    if (needsApproval) return { label: `Approve ${outputToken.symbol}`, action: () => tokenState.approve(amountBig) }
    return { label: 'Swap', action: () => swap.executeSwap(amountBig, true) }
  }

  const action = getAction()
  const swapLoading = swap.isPending || swap.isConfirming
  const approveLoading = tokenState.approveLoading

  return (
    <div className="page-content" style={{ minHeight: '85vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 24px 80px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ marginBottom: 32 }}>
          <div className="label" style={{ marginBottom: 8 }}>Uniswap v4 · ToxicFlow Hook</div>
          <h1 className="display-md">Swap</h1>
        </div>

        <div className="card-elevated" style={{ padding: 24, marginBottom: 16 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span className="heading">Swap</span>
            {POOL_ID ? (
              <span style={{ fontSize: 11, padding: '3px 10px', background: 'var(--trusted-2)', color: 'var(--trusted)', borderRadius: 12, fontWeight: 600 }}>
                Pool Active
              </span>
            ) : (
              <span style={{ fontSize: 11, padding: '3px 10px', background: 'var(--neutral-2)', color: 'var(--neutral)', borderRadius: 12, fontWeight: 600 }}>
                Pool Not Configured
              </span>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '16px', background: 'var(--s1)', borderRadius: 'var(--r-md)', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="label">You Pay</span>
              {address && (
                <span className="caption">ETH on Sepolia</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="number"
                value={amountIn}
                onChange={e => setAmountIn(e.target.value)}
                placeholder="0.001"
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  fontSize: 28, fontWeight: 700, color: 'var(--fg)', minWidth: 0,
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--s3)', borderRadius: 'var(--r-md)', flexShrink: 0 }}>
                <TokenIcon icon="eth" size={20} />
                <span style={{ fontWeight: 700, fontSize: 14 }}>ETH</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
            <div style={{ padding: 8, background: 'var(--s3)', borderRadius: '50%', border: '1px solid var(--b-soft)' }}>↓</div>
          </div>

          {/* Output */}
          <div style={{ padding: '16px', background: 'var(--s1)', borderRadius: 'var(--r-md)', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="label">You Receive (est.)</span>
              <span className="caption">Estimated output: not a binding quote</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, fontSize: 28, fontWeight: 700, color: amountIn ? 'var(--fg)' : 'var(--fg-3)' }}>
                {estimatedOutput}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--s3)', borderRadius: 'var(--r-md)', flexShrink: 0 }}>
                <TokenIcon icon={outputToken.icon} size={20} />
                <span style={{ fontWeight: 700, fontSize: 14 }}>{outputToken.symbol}</span>
              </div>
            </div>
          </div>

          {/* Fee Breakdown */}
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
              <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>Network gas fee (paid to Sepolia)</span>
              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--fg-3)' }}>shown in wallet</span>
            </div>
          </div>

          {/* Liquidity notice */}
          {POOL_ID && (
            <div style={{ padding: '10px 14px', background: 'var(--amber-2)', border: '1px solid rgba(245,158,11,0.22)', borderRadius: 'var(--r-sm)', marginBottom: 16, fontSize: 12, color: 'var(--amber)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ flexShrink: 0, fontWeight: 700 }}>Note</span>
              <span>The pool is live on Sepolia, but may have limited liquidity. Swaps may revert if the pool depth is insufficient. Add liquidity via PoolModifyLiquidityTest to enable full trading.</span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={action.action}
            disabled={(action as { disabled?: boolean }).disabled || swapLoading || approveLoading}
            className="btn btn-primary btn-full btn-lg"
          >
            {swapLoading
              ? 'Confirming...'
              : approveLoading
              ? 'Approving...'
              : action.label}
          </button>
        </div>

        {/* Post-swap confirmation */}
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
                <span className="caption">ToxicFlow swap fee applied</span>
                <TierBadge tier={passport.tier} size="sm" showFee />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="caption">Record</span>
                <span style={{ fontSize: 12, color: 'var(--stale)' }}>Storing to 0G...</span>
              </div>
            </div>
          </div>
        )}

        {swap.error && (
          <div style={{ padding: '12px 16px', background: 'var(--toxic-2)', border: '1px solid var(--toxic)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--toxic)' }}>
            {swap.error.message}
          </div>
        )}
      </div>
      <WalletModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
