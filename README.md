# ToxicFlow Passport

**Behavior-aware swap protection for Uniswap v4 on Sepolia testnet.**

ToxicFlow Passport is a trust-aware liquidity protection protocol that assigns on-chain behavioral tiers to wallets and routes dynamic fees through a Uniswap v4 hook. Toxic wallets pay higher fees; trusted LPs are protected.

---

## How It Works

1. **Wallet Registration** — traders self-register or are assigned a tier by the admin
2. **Tier Resolution** — `PassportRegistry` stores `Trusted / Neutral / Toxic` per address
3. **Dynamic Fee** — `ToxicFlowHook` reads the tier on every swap and applies 10 / 30 / 80 bps
4. **Pool Defense** — KeeperHub automation monitors flow composition and triggers circuit breakers
5. **Evidence Anchoring** — swap events are anchored to 0G decentralized storage for auditability

---

## Deployed Contracts (Sepolia)

| Contract | Address |
|---|---|
| PassportRegistry | `0x101fd25Ff9B9EBC21359B15F0cdE8aD7C4f01D0e` |
| ToxicFlowHook | `0x024245B2CDBccf9581D1f6FbA533ca4061410080` |
| PoolManager | `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543` |
| PoolSwapTest | `0x9b6b46e2c869aa39918db7f52f5557fe577b6eee` |
| Pool (ETH/USDC) | `0x7cd5aa906aadff2d0776a1c7fed113e19284420876110f9de18399546cf2148d` |
| Sepolia USDC | `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` |

---

## Repository Structure

```
├── artifacts/
│   ├── toxicflow/        # React + Vite frontend (production app)
│   └── api-server/       # Express 5 API server
├── contracts/            # Solidity 0.8.26 (Foundry)
│   ├── src/              # PassportRegistry, ToxicFlowHook
│   ├── script/           # Deploy, SetupPool, AddLiquidity
│   └── test/             # 13/13 unit tests passing
├── lib/                  # Shared TypeScript libraries (db, api-zod)
├── scripts/              # Utility scripts
└── vercel.json           # Vercel deployment config (builds artifacts/toxicflow)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, Tailwind CSS v4, wagmi v3, viem v2 |
| API | Express 5, TypeScript, Drizzle ORM, Zod |
| Contracts | Solidity 0.8.26, Foundry, Uniswap v4 |
| Database | PostgreSQL |
| Automation | KeeperHub |
| Storage | 0G decentralized storage |

---

## Frontend Pages

| Route | Description |
|---|---|
| `/` | Landing — hero, tier cards, how it works |
| `/dashboard` | System status, pool info, live events |
| `/passport` | Wallet tier card, self-registration |
| `/swap` | ETH→USDC swap with tier-based fee + Add Liquidity |
| `/records` | On-chain fee events + 0G anchoring status |
| `/pool-defense` | Risk gauge, flow composition, KeeperHub |
| `/developers` | Integration guide, testnet config |
| `/demo` | Guided walkthrough with admin tier controls |

---

## API Routes

```
GET  /api/healthz
GET  /api/diagnostics
GET  /api/resolver?trader=0x...
GET  /api/quote?amountIn=0.001&trader=0x...
GET  /api/events?limit=20
POST /api/evidence/anchor
GET  /api/evidence/anchored
POST /api/demo/set-tier
POST /api/keeperhub/trigger
POST /api/liquidity/add
GET  /api/liquidity/status
```

---

## Development

```bash
# Install dependencies
pnpm install

# Start frontend (requires PORT and BASE_PATH env vars)
pnpm --filter @workspace/toxicflow run dev

# Start API server
pnpm --filter @workspace/api-server run dev

# Build frontend (Vercel)
pnpm --filter @workspace/toxicflow run build

# Typecheck
pnpm run typecheck

# Foundry tests
forge test
```

---

## Vercel Deployment

Vercel builds `artifacts/toxicflow` as a static Vite SPA. The `vercel.json` at repo root configures this automatically. The API server deploys separately (e.g. Railway, Render, or any Node host).

---

## Fee Tiers

| Tier | Fee | Description |
|---|---|---|
| Trusted | 10 bps | Low-risk, long-standing LPs |
| Neutral | 30 bps | Default for unregistered wallets |
| Toxic | 80 bps | High-risk flow, protects pool from adverse selection |

---

## License

MIT
