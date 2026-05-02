import { useState } from 'react'
import { useAccount } from 'wagmi'
import { WalletModal } from './WalletModal'

export function WalletConnector() {
  const [open, setOpen] = useState(false)
  const { isConnected, address } = useAccount()

  const shortAddr = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ''

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn btn-accent btn-sm"
      >
        {isConnected ? shortAddr : 'Connect'}
      </button>
      <WalletModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
