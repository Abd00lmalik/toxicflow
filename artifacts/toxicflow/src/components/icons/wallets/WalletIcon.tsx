import { MetaMaskIcon } from './MetaMaskIcon'

export function WalletIcon({ iconKey, size = 24 }: { iconKey: string; size?: number }) {
  if (iconKey === 'metamask') return <MetaMaskIcon size={size} />
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
      <rect x="14" y="13" width="5" height="3" rx="1" fill="currentColor" opacity="0.6"/>
    </svg>
  )
}
