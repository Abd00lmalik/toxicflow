// ─── Deployed on Sepolia 2026-05-02 ───────────────────────────────────────────
export const PASSPORT_REGISTRY = (
  import.meta.env.VITE_PASSPORT_REGISTRY ?? '0x101fd25Ff9B9EBC21359B15F0cdE8aD7C4f01D0e'
) as `0x${string}`

export const TOXIC_FLOW_HOOK = (
  import.meta.env.VITE_TOXIC_FLOW_HOOK ?? '0x024245B2CDBccf9581D1f6FbA533ca4061410080'
) as `0x${string}`

export const POOL_SWAP_TEST = (
  import.meta.env.VITE_POOL_SWAP_TEST ?? '0x9b6b46e2c869aa39918db7f52f5557fe577b6eee'
) as `0x${string}`

export const POOL_MANAGER = (
  import.meta.env.VITE_POOL_MANAGER ?? '0xE03A1074c86CFeDd5C142C4F04F1a1536e203543'
) as `0x${string}`

export const V4_QUOTER = import.meta.env.VITE_V4_QUOTER as `0x${string}` | undefined

// Initialized pool: ETH / Sepolia USDC, ToxicFlowHook attached
export const POOL_ID = (
  import.meta.env.VITE_POOL_ID ?? '0x7cd5aa906aadff2d0776a1c7fed113e19284420876110f9de18399546cf2148d'
) as string

// Real Sepolia USDC: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
export const USDC_ADDRESS = (
  import.meta.env.VITE_USDC_ADDRESS ?? '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
) as `0x${string}`

export const CHAIN_ID = 11155111
export const TOKEN_PAIR = 'ETH/USDC'
export const SELF_REGISTER_DEPLOYED = true
