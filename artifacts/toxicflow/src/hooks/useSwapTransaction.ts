import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { PoolSwapTestABI } from '@/lib/config/abis/PoolSwapTest'
import { POOL_SWAP_TEST } from '@/lib/config/contracts'
import { buildPoolKey, buildSwapParams, buildTestSettings } from '@/lib/swap/swapBuilder'

export function useSwapTransaction() {
  const { writeContract, data: txHash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({ hash: txHash })

  const executeSwap = async (amountIn: bigint, zeroForOne: boolean) => {
    const poolKey = buildPoolKey()
    const swapParams = buildSwapParams(amountIn, zeroForOne)
    const testSettings = buildTestSettings()

    writeContract({
      address: POOL_SWAP_TEST,
      abi: PoolSwapTestABI,
      functionName: 'swap',
      args: [poolKey, swapParams, testSettings, '0x'],
      value: zeroForOne ? amountIn : BigInt(0),
    })

    // After confirmation, trigger evidence anchoring as background task
    if (txHash) {
      fetch('/api/evidence/anchor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash }),
      }).catch(() => { /* non-blocking */ })
    }
  }

  return {
    executeSwap,
    txHash,
    isPending,
    isConfirming,
    isSuccess,
    receipt,
    error,
  }
}
