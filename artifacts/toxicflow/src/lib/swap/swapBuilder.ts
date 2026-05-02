import { TOXIC_FLOW_HOOK, POOL_MANAGER } from '../config/contracts'
import { USDC_ADDRESS, TEST_TOKEN } from '../config/contracts'

export const DYNAMIC_FEE_FLAG = 0x800000 // LPFeeLibrary.DYNAMIC_FEE_FLAG

export function buildPoolKey() {
  const hookAddr = TOXIC_FLOW_HOOK ?? '0x0000000000000000000000000000000000000000'
  const tokenAddr = (USDC_ADDRESS ?? TEST_TOKEN ?? '0x0000000000000000000000000000000000000000') as `0x${string}`
  const ethAddr = '0x0000000000000000000000000000000000000000' as `0x${string}`

  const [currency0, currency1] =
    ethAddr.toLowerCase() < tokenAddr.toLowerCase()
      ? [ethAddr, tokenAddr]
      : [tokenAddr, ethAddr]

  return {
    currency0,
    currency1,
    fee: DYNAMIC_FEE_FLAG,
    tickSpacing: 60,
    hooks: hookAddr as `0x${string}`,
  }
}

export function buildSwapParams(amountIn: bigint, zeroForOne: boolean) {
  return {
    zeroForOne,
    amountSpecified: -amountIn, // exact input
    sqrtPriceLimitX96: zeroForOne
      ? BigInt('4295128740') // MIN_SQRT_PRICE + 1
      : BigInt('1461446703485210103287273052203988822378723970341'), // MAX_SQRT_PRICE - 1
  }
}

export function buildTestSettings() {
  return { takeClaims: false, settleUsingBurn: false }
}
