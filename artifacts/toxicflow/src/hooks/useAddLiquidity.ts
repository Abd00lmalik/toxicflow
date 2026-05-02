import { useState } from 'react'

export type LiquidityStatus = 'idle' | 'pending' | 'success' | 'error'

export interface AddLiquidityState {
  status: LiquidityStatus
  txHash?: string
  error?: string
  ethAmount?: string
  usdcAmount?: string
}

export function useAddLiquidity() {
  const [state, setState] = useState<AddLiquidityState>({ status: 'idle' })

  const addLiquidity = async (ethAmount: string, usdcAmount: string) => {
    setState({ status: 'pending', ethAmount, usdcAmount })
    try {
      const res = await fetch('/api/liquidity/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ethAmount, usdcAmount }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setState({ status: 'success', txHash: data.txHash, ethAmount, usdcAmount })
      } else {
        setState({
          status: 'error',
          error: data.error ?? 'Script failed',
          ethAmount,
          usdcAmount,
        })
      }
    } catch (err) {
      setState({
        status: 'error',
        error: err instanceof Error ? err.message : 'Network error',
        ethAmount,
        usdcAmount,
      })
    }
  }

  const reset = () => setState({ status: 'idle' })

  return { ...state, addLiquidity, reset }
}
