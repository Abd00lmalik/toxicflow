import { useConnect, useDisconnect, useAccount } from 'wagmi'
import { WalletIcon } from '@/components/icons/wallets/WalletIcon'

function resolveConnector(connector: { id: string; name: string }): { displayName: string; iconKey: string } {
  const id = connector.id.toLowerCase()
  const name = connector.name.toLowerCase()
  if (id === 'metamask' || name.includes('metamask')) return { displayName: 'MetaMask', iconKey: 'metamask' }
  if (name.includes('rabby')) return { displayName: 'Rabby', iconKey: 'rabby' }
  if (name.includes('okx')) return { displayName: 'OKX Wallet', iconKey: 'okx' }
  if (name.includes('zerion')) return { displayName: 'Zerion', iconKey: 'zerion' }
  if (name.includes('coinbase')) return { displayName: 'Coinbase Wallet', iconKey: 'coinbase' }
  if (id === 'injected' || name === 'injected') {
    if (typeof window !== 'undefined') {
      const eth = (window as unknown as { ethereum?: { isRabby?: boolean; isOKExWallet?: boolean; isOKX?: boolean; isMetaMask?: boolean } }).ethereum
      if (eth?.isRabby) return { displayName: 'Rabby', iconKey: 'rabby' }
      if (eth?.isOKExWallet || eth?.isOKX) return { displayName: 'OKX Wallet', iconKey: 'okx' }
      if (eth?.isMetaMask) return { displayName: 'MetaMask', iconKey: 'metamask' }
    }
    return { displayName: 'Browser Wallet', iconKey: 'browser' }
  }
  return { displayName: connector.name, iconKey: 'browser' }
}

interface WalletModalProps {
  open: boolean
  onClose: () => void
}

export function WalletModal({ open, onClose }: WalletModalProps) {
  const { connectors, connect, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { isConnected, address } = useAccount()

  if (!open) return null

  const resolved = connectors.map(c => ({ connector: c, ...resolveConnector(c) }))
  const seen = new Set<string>()
  const deduplicated = resolved.filter(r => {
    if (seen.has(r.displayName)) return false
    seen.add(r.displayName)
    return true
  })

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onKeyDown={handleKey}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.18s ease both',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', width: '100%', maxWidth: 420,
          background: 'var(--s2)', border: '1px solid var(--b-base)',
          borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-lg)',
          padding: '28px', animation: 'modalIn 0.2s cubic-bezier(0.16,1,0.3,1) both',
          margin: '0 16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 className="heading">{isConnected ? 'Wallet Connected' : 'Connect Wallet'}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: 18, lineHeight: 1 }}>×</button>
        </div>

        {isConnected && address ? (
          <div>
            <div style={{ padding: '12px 16px', background: 'var(--s3)', borderRadius: 'var(--r-md)', marginBottom: 16 }}>
              <div className="label" style={{ marginBottom: 6 }}>Connected Address</div>
              <div className="mono" style={{ fontSize: 13, color: 'var(--fg)', wordBreak: 'break-all' }}>{address}</div>
            </div>
            <button
              onClick={() => { disconnect(); onClose() }}
              className="btn btn-secondary btn-full"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div>
            {deduplicated.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--fg-2)' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🦊</div>
                <div className="body" style={{ marginBottom: 8 }}>No wallet detected</div>
                <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-sm">
                  Install MetaMask
                </a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {deduplicated.map(({ connector, displayName, iconKey }) => (
                  <button
                    key={connector.uid}
                    onClick={() => { connect({ connector }); onClose() }}
                    disabled={isPending}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 16px',
                      background: 'var(--s3)', border: '1px solid var(--b-soft)',
                      borderRadius: 'var(--r-md)', cursor: 'pointer',
                      transition: 'border-color 0.15s, background 0.15s',
                      width: '100%', textAlign: 'left',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--b-base)'; (e.currentTarget as HTMLElement).style.background = 'var(--s4)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--b-soft)'; (e.currentTarget as HTMLElement).style.background = 'var(--s3)' }}
                  >
                    <WalletIcon iconKey={iconKey} size={28} />
                    <span style={{ color: 'var(--fg)', fontWeight: 600, fontSize: 15 }}>{displayName}</span>
                  </button>
                ))}
              </div>
            )}
            {error && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--toxic-2)', border: '1px solid var(--toxic)', borderRadius: 'var(--r-sm)', fontSize: 13, color: 'var(--toxic)' }}>
                {error.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
