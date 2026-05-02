# ToxicFlow Passport — Security Notes

## Threat Model

ToxicFlow Passport is a **testnet protocol** (Sepolia). The security posture described here reflects production design intent, not current audit status.

## Access Control

### PassportRegistry

- `admin` is set at deploy time to the deployer EOA
- Only `admin` can call `setTier`, `batchSetTiers`, `transferAdmin`
- Any wallet can call `selfRegister` (assigns Neutral tier)
- No upgradeability — registry is immutable once deployed

### ToxicFlowHook

- `onlyPoolManager` modifier on `beforeSwap` — only the Uniswap v4 PoolManager can call the hook
- Hook address is CREATE2-deterministic: lower 14 bits must match `BEFORE_SWAP_FLAG` exactly
- No admin functions on the hook itself

## Fee Override Mechanism

`beforeSwap` returns `fee | LPFeeLibrary.OVERRIDE_FEE_FLAG` to instruct the PoolManager to use the tier-based fee instead of the pool's default. The hook cannot drain funds; it only influences fee routing.

## tx.origin Usage

The hook uses `tx.origin` to identify the end trader rather than `msg.sender` (which would be the PoolManager or a router). This is intentional for tier resolution — the fee should reflect the originating wallet's risk profile.

**Implication**: Contracts that route swaps on behalf of users will be classified by the contract's originating EOA, not the contract address itself.

## Known Limitations

1. **No passport expiry** — tiers are permanent until explicitly changed by admin
2. **No appeal mechanism** — Toxic wallets cannot appeal tier assignment on-chain
3. **Centralized admin** — single EOA controls all tier assignments; no multisig or DAO governance
4. **No circuit breaker** — hook cannot pause itself; would require PoolManager-level action
5. **Testnet only** — no formal audit conducted

## Private Key Security

The following keys are used in this project and must be kept secret:

| Key | Purpose |
|---|---|
| `DEPLOYER_PRIVATE_KEY` | Contract deployment, admin tier ops, forge scripts |
| `ZG_SIGNER_PRIVATE_KEY` | 0G Storage signing |

These are stored as Replit Secrets and are never committed to the repository.

## Future Improvements

- Multisig admin (Gnosis Safe)
- On-chain appeal + dispute resolution
- Time-based tier decay (Toxic → Neutral after 90 days of clean activity)
- Formal audit before mainnet deployment
- Slashing/staking mechanism for tier-based collateral
