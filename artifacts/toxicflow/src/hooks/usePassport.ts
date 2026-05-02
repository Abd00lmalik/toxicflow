import { useReadContract } from 'wagmi'
import { PASSPORT_REGISTRY, TOXIC_FLOW_HOOK } from '@/lib/config/contracts'
import { PassportRegistryABI } from '@/lib/config/abis/PassportRegistry'
import { ToxicFlowHookABI } from '@/lib/config/abis/ToxicFlowHook'
import { sepolia } from 'wagmi/chains'

export function usePassport(address?: `0x${string}`) {
  const enabled = Boolean(address && PASSPORT_REGISTRY)

  const tierResult = useReadContract({
    address: PASSPORT_REGISTRY,
    abi: PassportRegistryABI,
    functionName: 'getTier',
    args: address ? [address] : undefined,
    chainId: sepolia.id,
    query: { enabled, staleTime: 30_000 },
  })

  const passportResult = useReadContract({
    address: PASSPORT_REGISTRY,
    abi: PassportRegistryABI,
    functionName: 'hasPassport',
    args: address ? [address] : undefined,
    chainId: sepolia.id,
    query: { enabled, staleTime: 30_000 },
  })

  const feeResult = useReadContract({
    address: TOXIC_FLOW_HOOK,
    abi: ToxicFlowHookABI,
    functionName: 'previewFee',
    args: address ? [address] : undefined,
    chainId: sepolia.id,
    query: { enabled: enabled && Boolean(TOXIC_FLOW_HOOK), staleTime: 30_000 },
  })

  const tier = typeof tierResult.data === 'number' ? tierResult.data : Number(tierResult.data ?? 0)
  const hasPassport = passportResult.data ?? false
  const feePips = feeResult.data ? Number(feeResult.data[0]) : 3000
  const feeBps = feePips / 100

  return {
    tier,
    hasPassport,
    feePips,
    feeBps,
    isLoading: tierResult.isLoading || passportResult.isLoading,
    isError: tierResult.isError || passportResult.isError,
    refetch: () => { tierResult.refetch(); passportResult.refetch(); feeResult.refetch() },
  }
}
