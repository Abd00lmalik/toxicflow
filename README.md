# ToxicFlow Passport

**Trust-aware swap and pool-defense protocol built on Uniswap v4.**

ToxicFlow Passport gives wallets a behavior-based trading passport. When a wallet swaps through a ToxicFlow-enabled pool, the pool reads the wallet's passport tier and applies a fee class based on that tier. Trusted wallets receive lower fees. Neutral wallets pay the base rate. Wallets classified as toxic flow pay a higher fee that compensates LPs for the additional adverse selection risk.

Every fee decision emits an on-chain event. Those events are anchored to 0G decentralized storage for auditability and can be used to build reputation systems, flow analytics, and pool-defense logic.

**Network:** Sepolia testnet · **Status:** live

---

## Why ToxicFlow Exists

Most AMMs price all wallets the same even though wallet behavior differs significantly. A recurring benign trader and an extractive or toxic-flow wallet can hit the same pool and receive identical fee treatment. This is inefficient for liquidity providers: toxic flow extracts value while paying the same base fee as healthier flow.

ToxicFlow solves this by pricing behavior into the swap path itself. The fee is not a post-hoc penalty — it is applied at the protocol layer before the trade settles.

---

## Core Insight

> Liquidity should not only price asset risk. It should also price flow quality.

ToxicFlow adds a wallet-level trust layer that DEXes, AMMs, and liquidity venues can integrate without rebuilding their core infrastructure.

---

## How It Works

```
1.  Wallet connects to a ToxicFlow-enabled application
2.  Wallet holds a ToxicFlow Passport (self-registered or admin-assigned)
3.  Passport has an active tier: Trusted | Neutral | Toxic
4.  Wallet initiates a swap through the ToxicFlow hooked pool
5.  ToxicFlowHook intercepts the beforeSwap callback
6.  Hook reads wallet tier from PassportRegistry
7.  Fee class is computed and returned to PoolManager as an override
8.  SwapFeeApplied event is emitted with tier, fee, and pool context
9.  Evidence layer anchors the event to 0G decentralized storage
10. Pool Defense aggregates recent flow and monitors concentration
11. If toxic flow exceeds threshold, KeeperHub automation can respond
```

---

## Fee Classes

| Tier | Fee | Basis Points | Description |
|---|---|---|---|
| Trusted | 0.10% | 10 bps | Established, low-risk flow |
| Neutral | 0.30% | 30 bps | Default for unregistered wallets |
| Toxic | 0.80% | 80 bps | High-risk or adversarial flow |

These values are testnet parameters. Fee levels and tier definitions are configurable per deployment and can be governed on-chain in future versions.

---

## System Architecture

### Passport Registry

`PassportRegistry` is the on-chain source of truth for wallet tiers. It stores whether a wallet has a passport and what tier it holds.

- Any wallet can self-register and receive a Neutral passport
- An authorized admin can set or batch-set tiers
- Admin key can be transferred to a multisig or DAO

Contract: [`contracts/src/passport/PassportRegistry.sol`](contracts/src/passport/PassportRegistry.sol)

### Tier Resolver Interface

`ITierResolver` is the standard read interface for dApps and external DEXes integrating ToxicFlow.

```solidity
interface ITierResolver {
    function previewFee(address trader)
        external view returns (uint24 feePips, uint8 tier, bool hasPassport);

    function getTraderTier(address trader)
        external view returns (uint8);

    function hasActivePassport(address trader)
        external view returns (bool);
}
```

Interface: [`contracts/src/hooks/interfaces/ITierResolver.sol`](contracts/src/hooks/interfaces/ITierResolver.sol)

### ToxicFlow Hook

`ToxicFlowHook` is a Uniswap v4 hook that intercepts every swap via the `beforeSwap` callback. It reads the trader's tier from `PassportRegistry`, computes the appropriate fee, and returns it as a dynamic fee override to the PoolManager.

The hook must be deployed at a CREATE2 address where the lower 14 bits match `BEFORE_SWAP_FLAG` exactly. `HookMiner.sol` handles the salt search at deploy time.

Contract: [`contracts/src/hooks/ToxicFlowHook.sol`](contracts/src/hooks/ToxicFlowHook.sol)

### Evidence and Records Layer

Every `SwapFeeApplied` event emitted by the hook can be picked up and anchored to 0G decentralized storage. This creates an immutable, externally verifiable record of every fee decision. Users can inspect their own records on the `/records` page.

### Pool Defense

The Pool Defense module aggregates recent swap events and computes the toxic-flow concentration across a sliding window. When the concentration exceeds a configurable threshold, a KeeperHub workflow can be triggered to alert or take protective action on behalf of the pool.

### Developer Integration

External DEXes and applications can query wallet tier without running the full hook. The API exposes a resolver endpoint that any application can call:

```
GET /api/resolver?trader=0xYourAddress&method=all
```

A full integration guide is at [`docs/INTEGRATION_GUIDE.md`](docs/INTEGRATION_GUIDE.md).

---

## Deployed Contracts (Sepolia)

| Contract | Address |
|---|---|
| PassportRegistry | [`0x101fd25Ff9B9EBC21359B15F0cdE8aD7C4f01D0e`](https://sepolia.etherscan.io/address/0x101fd25Ff9B9EBC21359B15F0cdE8aD7C4f01D0e) |
| ToxicFlowHook | [`0x024245B2CDBccf9581D1f6FbA533ca4061410080`](https://sepolia.etherscan.io/address/0x024245B2CDBccf9581D1f6FbA533ca4061410080) |
| Uniswap v4 PoolManager | `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543` |
| PoolSwapTest | `0x9b6b46e2c869aa39918db7f52f5557fe577b6eee` |
| Pool (ETH/USDC) | `0x7cd5aa906...cf2148d` ¹ |
| Sepolia USDC | [`0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`](https://sepolia.etherscan.io/address/0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238) |

¹ Full pool ID: `0x7cd5aa906aadff2d0776a1c7fed113e19284420876110f9de18399546cf2148d`

Full deployment manifest: [`contracts/deployment.json`](contracts/deployment.json)

> **Note:** Pool is initialized on Sepolia. Liquidity is pending — see [Liquidity Provisioning](#liquidity-provisioning) below.


---


## Repository Structure

```
/
├── artifacts/
│   ├── toxicflow/              # React 19 + Vite 7 frontend
│   │   └── src/
│   │       ├── pages/          # Landing, Dashboard, Passport, Swap, Records,
│   │       │                   # PoolDefense, Demo, Developers
│   │       ├── components/     # UI components, wallet connector, layout
│   │       ├── hooks/          # React hooks for passport, swap, liquidity
│   │       └── lib/            # Swap config, utilities
│   └── api-server/             # Express 5 API server
│       └── src/
│           ├── routes/         # healthz, resolver, quote, events, evidence,
│           │                   # keeperhub, liquidity, demo
│           └── lib/            # Shared server utilities
│
├── contracts/                  # Solidity 0.8.26 — Foundry
│   ├── src/
│   │   ├── passport/           # PassportRegistry + IPassportRegistry
│   │   └── hooks/              # ToxicFlowHook + ITierResolver
│   ├── script/
│   │   ├── deploy/             # Deploy.s.sol, DeployHook.s.sol, SetupPool.s.sol
│   │   ├── liquidity/          # AddLiquidity.s.sol
│   │   ├── seed/               # SeedTiers.s.sol
│   │   └── utils/              # HookMiner.sol
│   └── test/                   # 13 unit tests (all passing)
│
├── lib/                        # Shared TypeScript workspace packages
│   ├── api-spec/               # OpenAPI spec + codegen
│   ├── api-zod/                # Zod schemas (generated)
│   ├── api-client-react/       # React Query hooks (generated)
│   └── db/                     # Drizzle ORM schema + migrations
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   ├── INTEGRATION_GUIDE.md
│   ├── LIQUIDITY.md
│   └── SECURITY.md
│
├── scripts/                    # Workspace utility scripts
├── vercel.json                 # Vercel config — builds artifacts/toxicflow
└── README.md
```

---

## Frontend Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, tier overview, how it works |
| `/dashboard` | System status, pool info, live swap events |
| `/passport` | Wallet tier card, self-registration |
| `/swap` | ETH → USDC swap with passport-aware fee preview |
| `/records` | On-chain fee events, 0G anchoring status |
| `/pool-defense` | Risk gauge, toxic-flow concentration, KeeperHub status |
| `/developers` | Integration guide, testnet config, API explorer |
| `/demo` | Guided walkthrough with tier simulation controls |

---

## API Reference

All routes are served from the API server at `/api`.

```
GET  /api/healthz                        Health check
GET  /api/diagnostics                    Config and connectivity status
GET  /api/resolver?trader=0x...          Resolve tier for a wallet address
GET  /api/resolver?trader=0x...&method=all  Full resolver response
GET  /api/quote?amountIn=0.001&trader=0x... Fee quote with tier context
GET  /api/events?limit=20               Recent SwapFeeApplied events
POST /api/evidence/anchor               Anchor swap event to 0G storage
GET  /api/evidence/anchored             List anchored records
POST /api/demo/set-tier                 Set tier (demo mode only)
POST /api/keeperhub/trigger             Trigger KeeperHub workflow
POST /api/liquidity/add                 Add ETH/USDC liquidity via deployer
GET  /api/liquidity/status              Pool and liquidity configuration
```

**Example resolver response:**

```json
{
  "trader": "0xYourAddress",
  "tier": 0,
  "tierLabel": "Neutral",
  "hasActivePassport": false,
  "feeBps": 30,
  "resolverType": "on-chain"
}
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
| Evidence storage | 0G decentralized storage |
| Monorepo | pnpm workspaces |

---

## Roadmap

- [ ] Deeper ETH/USDC liquidity on Sepolia
- [ ] Time-decay on tier classifications (Toxic → Neutral after clean activity period)
- [ ] On-chain tier appeal and dispute resolution
- [ ] Additional DEX integrations via the resolver interface
- [ ] Advanced flow scoring using historical event data
- [ ] Multisig admin and on-chain governance for fee parameters
- [ ] Production security audit
- [ ] Mainnet deployment

---

## License

MIT
