import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { SepoliaUSDCABI } from '@/lib/config/abis/SepoliaUSDC'
import { sepolia } from 'wagmi/chains'
import { parseUnits } from 'viem'

export function useTokenState(
  tokenAddress: `0x${string}` | undefined,
  ownerAddress: `0x${string}` | undefined,
  spenderAddress: `0x${string}` | undefined,
) {
  const enabled = Boolean(tokenAddress && ownerAddress)

  const balance = useReadContract({
    address: tokenAddress,
    abi: SepoliaUSDCABI,
    functionName: 'balanceOf',
    args: ownerAddress ? [ownerAddress] : undefined,
    chainId: sepolia.id,
    query: { enabled, staleTime: 15_000 },
  })

  const allowance = useReadContract({
    address: tokenAddress,
    abi: SepoliaUSDCABI,
    functionName: 'allowance',
    args: ownerAddress && spenderAddress ? [ownerAddress, spenderAddress] : undefined,
    chainId: sepolia.id,
    query: { enabled: enabled && Boolean(spenderAddress), staleTime: 15_000 },
  })

  const { writeContract, data: approveTxHash, isPending: approveLoading } = useWriteContract()
  const { isLoading: approveConfirming, isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveTxHash })

  const approve = (amount: bigint) => {
    if (!tokenAddress || !spenderAddress) return
    writeContract({ address: tokenAddress, abi: SepoliaUSDCABI, functionName: 'approve', args: [spenderAddress, amount] })
  }

  const { writeContract: writeMint, data: mintTxHash, isPending: mintLoading } = useWriteContract()
  const { isLoading: mintConfirming, isSuccess: mintSuccess } = useWaitForTransactionReceipt({ hash: mintTxHash })

  const mint = (amount: string, decimals: number) => {
    if (!tokenAddress || !ownerAddress) return
    writeMint({ address: tokenAddress, abi: SepoliaUSDCABI, functionName: 'mint', args: [ownerAddress, parseUnits(amount, decimals)] })
  }

  return {
    balance: balance.data ?? BigInt(0),
    allowance: allowance.data ?? BigInt(0),
    balanceLoading: balance.isLoading,
    approve,
    approveLoading: approveLoading || approveConfirming,
    approveSuccess,
    mint,
    mintLoading: mintLoading || mintConfirming,
    mintSuccess,
    refetch: () => { balance.refetch(); allowance.refetch() },
  }
}
