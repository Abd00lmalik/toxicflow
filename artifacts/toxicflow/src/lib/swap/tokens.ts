export interface SwapToken {
  symbol: string
  name: string
  address: string | null
  decimals: number
  icon: 'eth' | 'usdc' | 'test'
  available: boolean
  unavailableReason?: string
}

export function getTokens(): { input: SwapToken; output: SwapToken } {
  const usdcAddr = import.meta.env.VITE_USDC_ADDRESS
  if (usdcAddr) {
    return {
      input: { symbol: 'ETH', name: 'Sepolia ETH', address: null, decimals: 18, icon: 'eth', available: true },
      output: { symbol: 'USDC', name: 'USD Coin', address: usdcAddr, decimals: 6, icon: 'usdc', available: true },
    }
  }
  const testAddr = import.meta.env.VITE_TEST_TOKEN
  return {
    input: { symbol: 'ETH', name: 'Sepolia ETH', address: null, decimals: 18, icon: 'eth', available: true },
    output: {
      symbol: 'TEST',
      name: 'Test Token',
      address: testAddr ?? '',
      decimals: 18,
      icon: 'test',
      available: Boolean(testAddr),
      unavailableReason: testAddr ? undefined : 'Test token not configured',
    },
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
