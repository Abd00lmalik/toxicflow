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
- `/swap` — ETH→USDC swap with tier-based fee, Uniswap v4 PoolSwapTest
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
- `script/HookMiner.sol` — exact-flag CREATE2 address miner (lower-14-bit match only)
- `script/Deploy.s.sol` — deploy registry + mine hook address + deploy hook
- `script/DeployHook.s.sol` — redeploy hook only (registry already deployed)
- `script/SetupPool.s.sol` — initialize v4 pool with dynamic fee flag
- `script/SeedTiers.s.sol` — batch assign initial tiers
- `test/ToxicFlowHook.t.sol` — 13/13 Foundry unit tests passing

### Deployed Contracts — Sepolia (2026-05-02)

| Contract | Address |
|---|---|
| PassportRegistry | `0x101fd25Ff9B9EBC21359B15F0cdE8aD7C4f01D0e` |
| ToxicFlowHook | `0x024245B2CDBccf9581D1f6FbA533ca4061410080` |
| Pool (ETH/USDC) | ID: `0x7cd5aa906aadff2d0776a1c7fed113e19284420876110f9de18399546cf2148d` |
| PoolManager | `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543` |
| PoolSwapTest | `0x9b6b46e2c869aa39918db7f52f5557fe577b6eee` |
| Sepolia USDC | `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` |

**Hook address note**: ToxicFlowHook implements only `beforeSwap`. Its address must have EXACTLY bit 7 set in the lower 14 bits (`addr & 0x3FFF == 0x0080`). The HookMiner.sol uses exact-match check, not subset-match. The original failed hook `0x03aE...dd` had lower-14 bits = `0x24dd` (many extra flags set), causing `HookAddressNotValid`. Redeployed with salt `0x17c` giving correct `0x...80` address.

**Pool status**: Initialized. Liquidity not yet added (deployer needs Sepolia USDC — get from https://faucet.circle.com).

### Foundry Setup (required for contract deployment)

```bash
export PATH="$HOME/.foundry/bin:$PATH"
# Or install: curl -L https://foundry.paradigm.xyz | bash && foundryup
```

### Deploy Flow

1. Registry already deployed — do NOT redeploy unless explicitly needed
2. To redeploy hook only: `forge script script/DeployHook.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --legacy`
3. To re-init pool: `forge script script/SetupPool.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --legacy`
4. Set VITE_* and NEXT_PUBLIC_* env vars to match

### CREATE2 Details

- **Factory**: `0x4e59b44847b379578588920cA78FbF26c0B4956C` (Foundry default)
- Foundry's `new Contract{salt: s}(...)` routes through this factory, not the deployer EOA

### Design System

- Dark space theme: `--bg: #04060e`, aurora gradients, CSS grid texture
- Tiers: Trusted = green (`#34d399`), Neutral = slate (`#94a3b8`), Toxic = red (`#f87171`)
- Fee classes: 10 bps / 30 bps / 80 bps
- All custom CSS in `artifacts/toxicflow/src/index.css` using CSS custom properties

### Secrets Used

- `SEPOLIA_RPC_URL` — RPC for chain reads (API server + contract deployment)
- `DEPLOYER_PRIVATE_KEY` — contract deployment + demo tier assignment
- `ZG_SIGNER_PRIVATE_KEY` — 0G Storage signing (address: `0x73092e88D49946ac32b6Eb1a394f81bb553e411a`)
- `KEEPERHUB_API_KEY` / `KEEPERHUB_API_URL` / `KEEPERHUB_WORKFLOW_ID` — automation
- `SESSION_SECRET` — session management

### Runtime Flags (`runtimeMode.ts`)

All flags now `true` except `realQuoteLive` (no V4Quoter yet) and `zeroGStorageLive` (0G not configured).
The frontend reads `VITE_*` env vars. The API server reads `NEXT_PUBLIC_*` and private vars.
