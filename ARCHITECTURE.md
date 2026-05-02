# ToxicFlow Passport — Architecture

## Overview

pnpm workspace monorepo using TypeScript. Full-stack Web3 dApp on Sepolia testnet.

## Stack

- **Monorepo**: pnpm workspaces
- **Node.js**: 24
- **TypeScript**: 5.9
- **Frontend**: React 19, Vite 7, Tailwind CSS v4, wagmi v3, viem v2
- **API**: Express 5, esbuild bundle
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **Contracts**: Solidity 0.8.26, Foundry

## Workspace Packages

| Package | Path | Purpose |
|---|---|---|
| `@workspace/toxicflow` | `artifacts/toxicflow/` | React + Vite frontend |
| `@workspace/api-server` | `artifacts/api-server/` | Express 5 API |
| `@workspace/db` | `lib/db/` | Drizzle ORM schema + migrations |
| `@workspace/api-zod` | `lib/api-zod/` | Zod schemas generated from OpenAPI |

## Key Commands

```bash
pnpm run typecheck              # Full typecheck
pnpm run build                  # Typecheck + build all packages
pnpm --filter @workspace/api-server run dev    # Run API server
pnpm --filter @workspace/toxicflow run build   # Build frontend
pnpm --filter @workspace/db run push           # Push DB schema (dev only)
```

## Frontend (`artifacts/toxicflow/`)

- **Router**: wouter
- **State**: TanStack Query + wagmi hooks
- **Fonts**: Space Grotesk (headings), Newsreader (hero), Inter (body), JetBrains Mono (code)
- **Design tokens**: Emerald `#00D166` (primary), Amethyst `#9D4DFF` (pool defense), Amber `#F59E0B` (warnings)
- **Build output**: `artifacts/toxicflow/dist/public/`

## API Server (`artifacts/api-server/`)

Express 5 server exposing all `/api/*` routes. Runs on-chain reads via viem, executes Forge scripts for liquidity operations.

### Routes

| Route | Method | Description |
|---|---|---|
| `/api/healthz` | GET | Health check |
| `/api/diagnostics` | GET | Full system status |
| `/api/resolver` | GET | On-chain tier resolution for a wallet |
| `/api/quote` | GET | Fee-adjusted swap quote |
| `/api/events` | GET | SwapFeeApplied events from hook |
| `/api/evidence/anchor` | POST | Anchor tx evidence to 0G Storage |
| `/api/evidence/anchored` | GET | List cached anchored records |
| `/api/demo/set-tier` | POST | Admin tier assignment |
| `/api/keeperhub/trigger` | POST | Trigger KeeperHub workflow |
| `/api/liquidity/add` | POST | Add liquidity via Forge script |
| `/api/liquidity/status` | GET | Pool liquidity config |

## Contracts (`contracts/`)

| Contract | Description |
|---|---|
| `src/PassportRegistry.sol` | On-chain tier registry (selfRegister + admin setTier) |
| `src/ToxicFlowHook.sol` | Uniswap v4 beforeSwap hook — reads tier, applies dynamic fee |
| `src/interfaces/` | IPassportRegistry, ITierResolver |
| `script/Deploy.s.sol` | Deploy registry + mine hook address + deploy hook |
| `script/DeployHook.s.sol` | Redeploy hook only |
| `script/SetupPool.s.sol` | Initialize v4 pool with dynamic fee flag |
| `script/AddLiquidity.s.sol` | Add full-range liquidity via PoolModifyLiquidityTest |
| `script/HookMiner.sol` | CREATE2 address miner for exact hook flag matching |
| `test/ToxicFlowHook.t.sol` | 13/13 Foundry unit tests |

## Deployed Contracts (Sepolia, 2026-05-02)

| Contract | Address |
|---|---|
| PassportRegistry | `0x101fd25Ff9B9EBC21359B15F0cdE8aD7C4f01D0e` |
| ToxicFlowHook | `0x024245B2CDBccf9581D1f6FbA533ca4061410080` |
| PoolManager | `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543` |
| PoolSwapTest | `0x9b6b46e2c869aa39918db7f52f5557fe577b6eee` |
| Pool (ETH/USDC) | `0x7cd5aa906aadff2d0776a1c7fed113e19284420876110f9de18399546cf2148d` |
| Sepolia USDC | `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` |

## Hook Address Constraint

ToxicFlowHook implements only `beforeSwap`. Its address must have **exactly bit 7 set** in the lower 14 bits (`addr & 0x3FFF == 0x0080`). HookMiner uses exact-match, not subset-match. Deployed with salt `0x17c`.

## Vercel Deployment

`vercel.json` at repo root targets `artifacts/toxicflow`:

```json
{
  "buildCommand": "pnpm --filter @workspace/toxicflow run build",
  "outputDirectory": "artifacts/toxicflow/dist/public",
  "env": { "BASE_PATH": "/" }
}
```

## Environment Variables

| Variable | Used By | Description |
|---|---|---|
| `SEPOLIA_RPC_URL` | API server, Forge | Sepolia RPC endpoint |
| `DEPLOYER_PRIVATE_KEY` | API server, Forge | Contract deployment + demo tier ops |
| `ZG_SIGNER_PRIVATE_KEY` | API server | 0G Storage signing |
| `KEEPERHUB_API_KEY` | API server | KeeperHub automation |
| `KEEPERHUB_API_URL` | API server | KeeperHub endpoint |
| `KEEPERHUB_WORKFLOW_ID` | API server | KeeperHub workflow ref |
| `SESSION_SECRET` | API server | Session management |
| `VITE_*` | Frontend build | Contract addresses, pool config |

## Fee Tiers

| Tier | Fee (bps) | Description |
|---|---|---|
| Trusted | 10 | Low-risk wallets |
| Neutral | 30 | Default (unregistered) |
| Toxic | 80 | High-risk, adverse selection protection |
