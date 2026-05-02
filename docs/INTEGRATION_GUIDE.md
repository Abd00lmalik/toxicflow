# ToxicFlow Passport — Integration Guide

External DEXes, AMMs, and liquidity venues can integrate ToxicFlow tier resolution without deploying the full hook. The resolver interface gives read-only access to wallet tiers via the API, the on-chain contract, or a future SDK.

---

## Integration Options

| Method | Best for | Latency |
|---|---|---|
| REST API | Off-chain routing, backends, dashboards | ~100ms |
| On-chain (ITierResolver) | Solidity hooks, on-chain fee routing | 1 SLOAD |
| Direct registry read | Lightweight Solidity consumers | 1 SLOAD |

---

## Option 1: REST API

No contract dependency. Call the resolver endpoint from any backend or frontend.

### Resolve tier for a wallet

```http
GET /api/resolver?trader=0xYourAddress&method=all
```

**Response**

```json
{
  "trader": "0x1234...abcd",
  "tier": 1,
  "tierLabel": "Trusted",
  "hasActivePassport": true,
  "feeBps": 10,
  "resolverType": "on-chain"
}
```

**Tier values**

| `tier` | `tierLabel` | `feeBps` |
|---|---|---|
| `0` | `Neutral` | `30` |
| `1` | `Trusted` | `10` |
| `2` | `Toxic` | `80` |

### Preview fee for a swap quote

```http
GET /api/quote?amountIn=0.01&trader=0xYourAddress
```

**Response**

```json
{
  "amountIn": "0.01",
  "trader": "0xYourAddress",
  "tier": 0,
  "tierLabel": "Neutral",
  "feeBps": 30,
  "feeAmount": "0.000003",
  "amountAfterFee": "0.009997"
}
```

---

## Option 2: On-Chain via ITierResolver

Import the interface and call any deployed ToxicFlowHook. The hook implements `ITierResolver` alongside `IHooks`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface ITierResolver {
    function previewFee(address trader)
        external view
        returns (uint24 feePips, uint8 tier, bool hasPassport);

    function getTraderTier(address trader)
        external view
        returns (uint8);

    function hasActivePassport(address trader)
        external view
        returns (bool);
}
```

**Usage in a Solidity integration:**

```solidity
ITierResolver resolver = ITierResolver(TOXIC_FLOW_HOOK_ADDRESS);

(uint24 feePips, uint8 tier, bool hasPassport) = resolver.previewFee(trader);

// feePips: 1000 = 0.10%, 3000 = 0.30%, 8000 = 0.80%
// tier: 0 = Neutral, 1 = Trusted, 2 = Toxic
// hasPassport: true if wallet has a registered passport
```

**Deployed hook address on Sepolia:**
```
0x024245B2CDBccf9581D1f6FbA533ca4061410080
```

---

## Option 3: Direct PassportRegistry Read

For use cases that only need the tier number without the fee logic:

```solidity
interface IPassportRegistry {
    function getTier(address trader) external view returns (uint8);
    function hasPassport(address trader) external view returns (bool);
}

IPassportRegistry registry = IPassportRegistry(REGISTRY_ADDRESS);

uint8 tier       = registry.getTier(trader);
bool  registered = registry.hasPassport(trader);
```

**Deployed registry address on Sepolia:**
```
0x101fd25Ff9B9EBC21359B15F0cdE8aD7C4f01D0e
```

---

## Integrating ToxicFlow Fees in a Uniswap v4 Hook

If you are building your own Uniswap v4 hook and want to incorporate ToxicFlow tier data:

```solidity
import {ITierResolver} from "path/to/ITierResolver.sol";

contract MyHook is IHooks {
    ITierResolver public immutable toxicFlowResolver;

    constructor(ITierResolver _resolver) {
        toxicFlowResolver = _resolver;
    }

    function beforeSwap(
        address,
        PoolKey calldata key,
        SwapParams calldata params,
        bytes calldata
    ) external returns (bytes4, BeforeSwapDelta, uint24) {
        (uint24 feePips, , ) = toxicFlowResolver.previewFee(tx.origin);
        // apply feePips as your override fee
        return (IHooks.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA,
                feePips | LPFeeLibrary.OVERRIDE_FEE_FLAG);
    }
}
```

---

## Using a ToxicFlow-Enabled Pool

Your AMM or router must route swaps through the ToxicFlow hooked pool to enforce passport-based fees. A ToxicFlow pool is identified by its `PoolKey`, which includes the hook address in the `hooks` field.

```solidity
PoolKey memory key = PoolKey({
    currency0:   Currency.wrap(address(0)),            // ETH
    currency1:   Currency.wrap(SEPOLIA_USDC),
    fee:         LPFeeLibrary.DYNAMIC_FEE_FLAG,        // 0x800000
    tickSpacing: 60,
    hooks:       IHooks(TOXIC_FLOW_HOOK_ADDRESS)
});
```

Swapping through a pool with a different key (even if currencies match) will not trigger ToxicFlow fee logic.

---

## Checking Wallet Status Before a Swap

A good UX pattern is to resolve the wallet's tier before the swap so you can show the expected fee:

```typescript
// Frontend (TypeScript)
const res = await fetch(`/api/resolver?trader=${address}&method=all`);
const { tier, tierLabel, feeBps, hasActivePassport } = await res.json();

console.log(`Wallet: ${tierLabel} tier — expected fee: ${feeBps} bps`);
if (!hasActivePassport) {
  console.log("No passport registered. Using Neutral (30 bps) default.");
}
```

---

## Rate Limits and Caching

The REST API performs one `eth_call` per resolver request. For high-frequency applications:

- Cache tier results client-side for 60 seconds (tiers change infrequently)
- Batch multiple addresses by calling `getTier` directly via `multicall`
- For on-chain consumers, a single SLOAD is the full cost

---

## Testnet Values

| Parameter | Value |
|---|---|
| Network | Sepolia (chainId 11155111) |
| PassportRegistry | `0x101fd25Ff9B9EBC21359B15F0cdE8aD7C4f01D0e` |
| ToxicFlowHook | `0x024245B2CDBccf9581D1f6FbA533ca4061410080` |
| PoolManager | `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543` |
| Sepolia USDC | `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` |
| USDC faucet | https://faucet.circle.com |
| Sepolia ETH faucet | https://sepoliafaucet.com |
