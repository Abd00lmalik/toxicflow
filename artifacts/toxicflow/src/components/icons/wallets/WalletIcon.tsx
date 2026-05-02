import { MetaMaskIcon } from './MetaMaskIcon'

function RabbyIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#7B61FF"/>
      <ellipse cx="12" cy="12" rx="3" ry="5.5" fill="white" opacity="0.92"/>
      <ellipse cx="20" cy="12" rx="3" ry="5.5" fill="white" opacity="0.92"/>
      <ellipse cx="12" cy="13" rx="1.5" ry="3.8" fill="#7B61FF" opacity="0.55"/>
      <ellipse cx="20" cy="13" rx="1.5" ry="3.8" fill="#7B61FF" opacity="0.55"/>
      <ellipse cx="16" cy="21" rx="6" ry="5" fill="white" opacity="0.92"/>
      <circle cx="13.5" cy="20.5" r="1.1" fill="#7B61FF"/>
      <circle cx="18.5" cy="20.5" r="1.1" fill="#7B61FF"/>
      <path d="M14 23 Q16 24.5 18 23" stroke="#7B61FF" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

function OKXIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#131314"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white"/>
      <rect x="17" y="9" width="6" height="6" rx="1.5" fill="white"/>
      <rect x="9" y="17" width="6" height="6" rx="1.5" fill="white"/>
      <rect x="17" y="17" width="6" height="6" rx="1.5" fill="white"/>
    </svg>
  )
}

function ZerionIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#2962EF"/>
      <path d="M9 11.5 L23 11.5 L9 20.5 L23 20.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}

function CoinbaseIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#0052FF"/>
      <circle cx="16" cy="16" r="9" fill="white"/>
      <circle cx="16" cy="16" r="6" fill="#0052FF"/>
    </svg>
  )
}

function BrowserWalletIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" strokeWidth="1"/>
      <circle cx="16" cy="16" r="7" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" fill="none"/>
      <path d="M16 9 C14 12.5 14 19.5 16 23" stroke="rgba(255,255,255,0.65)" strokeWidth="1.3" fill="none"/>
      <path d="M16 9 C18 12.5 18 19.5 16 23" stroke="rgba(255,255,255,0.65)" strokeWidth="1.3" fill="none"/>
      <path d="M9.5 13 Q16 11 22.5 13" stroke="rgba(255,255,255,0.65)" strokeWidth="1.3" fill="none"/>
      <path d="M9.5 19 Q16 21 22.5 19" stroke="rgba(255,255,255,0.65)" strokeWidth="1.3" fill="none"/>
    </svg>
  )
}

export function WalletIcon({ iconKey, size = 24 }: { iconKey: string; size?: number }) {
  if (iconKey === 'metamask') return <MetaMaskIcon size={size} />
  if (iconKey === 'rabby')    return <RabbyIcon size={size} />
  if (iconKey === 'okx')      return <OKXIcon size={size} />
  if (iconKey === 'zerion')   return <ZerionIcon size={size} />
  if (iconKey === 'coinbase') return <CoinbaseIcon size={size} />
  return <BrowserWalletIcon size={size} />
}
