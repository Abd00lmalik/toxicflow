# ToxicFlow Passport — Deployment Guide

## Prerequisites

- Foundry installed (`curl -L https://foundry.paradigm.xyz | bash && foundryup`)
- Sepolia ETH in deployer wallet (get from https://sepoliafaucet.com)
- Sepolia USDC in deployer wallet (get from https://faucet.circle.com)
- Environment variables configured (see `.env.example`)

## Environment Variables

```bash
DEPLOYER_PRIVATE_KEY=<64-char hex, no 0x prefix>
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<key>
ETHERSCAN_API_KEY=<optional, for verification>
```

## Step 1 — Deploy Contracts

Deploy PassportRegistry and ToxicFlowHook together:

```bash
cd contracts
export PATH="$HOME/.foundry/bin:$PATH"

forge script script/deploy/Deploy.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --legacy \
  -vvv
```

Copy the env vars printed at the end into Replit Secrets or `.env.local`.

## Step 2 — Initialize Pool

```bash
forge script script/deploy/SetupPool.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --legacy \
  -vvv
```

Copy `VITE_POOL_ID` from the output.

## Step 3 — Add Initial Liquidity

```bash
ADD_LIQ_ETH_WEI=50000000000000000 \
ADD_LIQ_USDC_RAW=100000000 \
forge script script/liquidity/AddLiquidity.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --legacy \
  -vvv
```

## Step 4 — Seed Initial Tiers (optional)

```bash
forge script script/seed/SeedTiers.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --legacy
```

## Redeploy Hook Only

If only the hook needs redeployment (registry stays):

```bash
VITE_PASSPORT_REGISTRY=0x101fd25Ff9B9EBC21359B15F0cdE8aD7C4f01D0e \
forge script script/deploy/DeployHook.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --legacy \
  -vvv
```

## Deployed Addresses (Sepolia)

| Contract | Address |
|---|---|
| PassportRegistry | `0x101fd25Ff9B9EBC21359B15F0cdE8aD7C4f01D0e` |
| ToxicFlowHook | `0x024245B2CDBccf9581D1f6FbA533ca4061410080` |
| PoolManager | `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543` |
| PoolSwapTest | `0x9b6b46e2c869aa39918db7f52f5557fe577b6eee` |
| Pool (ETH/USDC) | `0x7cd5aa906aadff2d0776a1c7fed113e19284420876110f9de18399546cf2148d` |
| Sepolia USDC | `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` |

## Hook Address Constraint

ToxicFlowHook must have **exactly bit 7 set** (`addr & 0x3FFF == 0x0080`) in the lower 14 bits. `HookMiner.sol` brute-forces CREATE2 salts until this condition is satisfied. Current deployment used salt `0x17c`.
