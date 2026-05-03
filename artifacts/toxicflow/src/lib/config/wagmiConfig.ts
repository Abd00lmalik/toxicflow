import { createConfig, http, fallback } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [sepolia],
  ssr: false,
  connectors: [injected()],
  transports: {
    [sepolia.id]: fallback([
      http(import.meta.env.VITE_RPC_URL ?? ''),
      http('https://ethereum-sepolia-rpc.publicnode.com'),
      http('https://rpc.sepolia.org'),
    ]),
  },
})
