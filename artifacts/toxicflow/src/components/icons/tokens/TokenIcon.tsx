import { ETHIcon } from './ETH'
import { USDCIcon } from './USDC'
import { TestTokenIcon } from './TestToken'

export function TokenIcon({ icon, size = 24 }: { icon: 'eth' | 'usdc' | 'test'; size?: number }) {
  if (icon === 'eth') return <ETHIcon size={size} />
  if (icon === 'usdc') return <USDCIcon size={size} />
  return <TestTokenIcon size={size} />
}
