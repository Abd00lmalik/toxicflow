export interface SwapToken {
  symbol: string
  name: string
  address: string | null
  decimals: number
  icon: 'eth' | 'usdc' | 'test'
  available: boolean
  unavailableReason?: string
}

// Real Sepolia USDC: always the output token for the main swap path
const SEPOLIA_USDC = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'

export function getTokens(): { input: SwapToken; output: SwapToken } {
  // Use env override if set, otherwise use the known Sepolia USDC address
  const usdcAddr = import.meta.env.VITE_USDC_ADDRESS ?? SEPOLIA_USDC
  return {
    input: { symbol: 'ETH', name: 'Sepolia ETH', address: null, decimals: 18, icon: 'eth', available: true },
    output: { symbol: 'USDC', name: 'USD Coin (Sepolia)', address: usdcAddr, decimals: 6, icon: 'usdc', available: true },
  }
}

export function tierLabel(tier: number): string {
  if (tier === 1) return 'Trusted'
  if (tier === 2) return 'Toxic'
  return 'Neutral'
}

export function tierFee(tier: number): { bps: number; pips: number; pct: string } {
  if (tier === 1) return { bps: 10, pips: 1000, pct: '0.10%' }
  if (tier === 2) return { bps: 80, pips: 8000, pct: '0.80%' }
  return { bps: 30, pips: 3000, pct: '0.30%' }
}
