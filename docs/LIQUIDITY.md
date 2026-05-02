# ToxicFlow Passport — Liquidity Guide

## Overview

ToxicFlow uses an ETH/USDC Uniswap v4 pool with the `ToxicFlowHook` applied. Liquidity provisioning on Sepolia testnet is handled server-side via the `AddLiquidity.s.sol` forge script, run by the protocol deployer wallet.

## Pool Configuration

| Parameter | Value |
|---|---|
| Token 0 (currency0) | ETH (`address(0)`) |
| Token 1 (currency1) | USDC (`0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`) |
| Fee | Dynamic (`DYNAMIC_FEE_FLAG = 0x800000`) |
| Tick spacing | 60 |
| Hook | ToxicFlowHook (`0x024245B2CDBccf9581D1f6FbA533ca4061410080`) |
| Target price | 1 ETH = 2,000 USDC |
| Full-range ticks | -887220 / +887220 |

## Adding Liquidity via API

```bash
POST /api/liquidity/add
Content-Type: application/json

{
  "ethAmount": "0.05",
  "usdcAmount": "100"
}
```

Response:
```json
{
  "success": true,
  "txHash": "0x...",
  "ethAmount": "0.05",
  "usdcAmount": "100",
  "message": "Liquidity added: 0.05 ETH + 100 USDC"
}
```

## Adding Liquidity via Forge

```bash
cd contracts
export PATH="$HOME/.foundry/bin:$PATH"

ADD_LIQ_ETH_WEI=50000000000000000 \   # 0.05 ETH in wei
ADD_LIQ_USDC_RAW=100000000 \           # 100 USDC in micro-USDC (6 decimals)
forge script script/liquidity/AddLiquidity.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --legacy \
  -vvv
```

## Liquidity Math

The script computes full-range liquidity using inline approximation (no LiquidityAmounts import needed):

```
L from ETH  = amount0 × sqrtPrice / 2^96
L from USDC = amount1 × 2^96 / sqrtPrice
L = min(L_ETH, L_USDC)
```

At current price (1 ETH = 2000 USDC), 0.05 ETH + 100 USDC yields approximately `L ≈ 2.23 × 10¹²`.

## Deployment Requirement

`PoolModifyLiquidityTest` is not deployed at a fixed address on Sepolia. The script deploys a fresh instance each run as the unlock-callback router. This is a testnet convenience — production deployments would use Uniswap's `PositionManager`.

## Status Check

```bash
GET /api/liquidity/status
```

Returns current pool configuration and whether the deployer wallet is configured.
