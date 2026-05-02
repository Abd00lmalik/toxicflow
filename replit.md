# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Full-stack Web3 dApp: **ToxicFlow Passport** on Sepolia testnet + Express API server.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

---

## ToxicFlow Passport dApp

### Architecture

- **Frontend**: `artifacts/toxicflow/` — React + Vite, wagmi v3, viem v2, Tailwind CSS v4, wouter routing
- **API**: `artifacts/api-server/` — Express 5 with ToxicFlow routes
- **Contracts**: `contracts/` — Solidity 0.8.26 with Foundry

### Frontend Pages

- `/` — Landing (hero, how it works, tier cards, CTA)
- `/dashboard` — System status, pool info, live event summary
- `/passport` — Wallet tier card, self-registration, collapsible details
- `/swap` — ETH→TOKEN swap with tier-based fee, Uniswap v4 PoolSwapTest
- `/records` — Fee events from ToxicFlowHook + 0G Storage anchoring status
- `/pool-defense` — Risk gauge, flow composition, KeeperHub automation
- `/developers` — Integration guide, code blocks, testnet config table
- `/demo` — Guided walkthrough with admin tier assignment

### API Routes (all under `/api/`)

- `GET /api/healthz` — health check
- `GET /api/diagnostics` — full system status
- `GET /api/resolver?trader=0x...` — on-chain tier resolution
- `GET /api/quote?amountIn=0.001&trader=0x...` — fee-adjusted quote
- `GET /api/events?limit=20` — SwapFeeApplied events from hook
- `POST /api/evidence/anchor` — anchor tx evidence to 0G Storage
- `GET /api/evidence/anchored` — list cached anchored records
- `POST /api/demo/set-tier` — admin tier assignment (uses DEPLOYER_PRIVATE_KEY)
- `POST /api/keeperhub/trigger` — trigger KeeperHub pool defense workflow

### Smart Contracts (`contracts/`)

- `src/PassportRegistry.sol` — on-chain wallet tier registry with selfRegister + admin setTier
- `src/ToxicFlowHook.sol` — Uniswap v4 hook: reads tier, applies dynamic fee, emits SwapFeeApplied
- `src/interfaces/` — IPassportRegistry, ITierResolver
- `script/Deploy.s.sol` — deploy registry + mine hook address + deploy hook
- `script/SetupPool.s.sol` — initialize v4 pool with dynamic fee flag
- `script/SeedTiers.s.sol` — batch assign initial tiers
- `test/ToxicFlowHook.t.sol` — Foundry unit tests

### Deploy Contracts (when Foundry available)

```bash
cd contracts
forge install foundry-rs/forge-std
forge install Uniswap/v4-core
forge install Uniswap/v4-periphery
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast
forge script script/SetupPool.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast
```

Then set env vars:
```
VITE_PASSPORT_REGISTRY=0x...
VITE_TOXIC_FLOW_HOOK=0x...
VITE_POOL_ID=0x...
NEXT_PUBLIC_PASSPORT_REGISTRY=0x...     # for API server
NEXT_PUBLIC_TOXIC_FLOW_HOOK=0x...       # for API server
NEXT_PUBLIC_POOL_ID=0x...               # for API server
```

### Design System

- Dark space theme: `--bg: #04060e`, aurora gradients, CSS grid texture
- Tiers: Trusted = green (`#34d399`), Neutral = slate (`#94a3b8`), Toxic = red (`#f87171`)
- Fee classes: 10 bps / 30 bps / 80 bps
- All custom CSS in `artifacts/toxicflow/src/index.css` using CSS custom properties

### Secrets Used

- `SEPOLIA_RPC_URL` — RPC for chain reads (API server + contract deployment)
- `DEPLOYER_PRIVATE_KEY` — contract deployment + demo tier assignment
- `ZG_SIGNER_PRIVATE_KEY` — 0G Storage signing (address: 0x73092e88D49946ac32b6Eb1a394f81bb553e411a)
- `KEEPERHUB_API_KEY` / `KEEPERHUB_API_URL` / `KEEPERHUB_WORKFLOW_ID` — automation
- `SESSION_SECRET` — session management

### Runtime Flags

The frontend reads `VITE_*` env vars. The API server reads `NEXT_PUBLIC_*` and private vars.
Until contracts are deployed, the app runs in "pre-deployment" mode — all pages are fully functional, API endpoints return graceful not-configured messages.
