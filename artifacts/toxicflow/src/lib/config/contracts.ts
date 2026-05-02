export const PASSPORT_REGISTRY = import.meta.env.VITE_PASSPORT_REGISTRY as `0x${string}` | undefined
export const TOXIC_FLOW_HOOK = import.meta.env.VITE_TOXIC_FLOW_HOOK as `0x${string}` | undefined
export const POOL_SWAP_TEST = (import.meta.env.VITE_POOL_SWAP_TEST ?? '0x9b6b46e2c869aa39918db7f52f5557fe577b6eee') as `0x${string}`
export const POOL_MANAGER = (import.meta.env.VITE_POOL_MANAGER ?? '0xE03A1074c86CFeDd5C142C4F04F1a1536e203543') as `0x${string}`
export const V4_QUOTER = import.meta.env.VITE_V4_QUOTER as `0x${string}` | undefined
export const POOL_ID = import.meta.env.VITE_POOL_ID as string | undefined
export const USDC_ADDRESS = import.meta.env.VITE_USDC_ADDRESS as `0x${string}` | undefined
export const TEST_TOKEN = import.meta.env.VITE_TEST_TOKEN as `0x${string}` | undefined
export const CHAIN_ID = 11155111
export const TOKEN_PAIR = USDC_ADDRESS ? 'ETH/USDC' : 'ETH/TEST'
export const SELF_REGISTER_DEPLOYED = import.meta.env.VITE_SELF_REGISTER_DEPLOYED === 'true'
