# ToxicFlow Contracts

## Contracts

### PassportRegistry.sol
On-chain wallet tier registry. Admin assigns tiers (0=Neutral, 1=Trusted, 2=Toxic). Wallets can self-register to get a Neutral passport.

### ToxicFlowHook.sol
Uniswap v4 `beforeSwap` hook. Reads tier from PassportRegistry, applies the appropriate dynamic fee, emits `SwapFeeApplied`.

Fee classes:
- Trusted: 1000 pips = 10 bps = 0.10%
- Neutral: 3000 pips = 30 bps = 0.30%
- Toxic: 8000 pips = 80 bps = 0.80%

## Deploy to Sepolia

```bash
# Install dependencies
forge install foundry-rs/forge-std
forge install Uniswap/v4-core
forge install Uniswap/v4-periphery

# Set env vars
export DEPLOYER_PRIVATE_KEY=0x...
export SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com

# Deploy
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast -vvv

# Initialize pool (after setting NEXT_PUBLIC_TOXIC_FLOW_HOOK)
forge script script/SetupPool.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast -vvv

# Run tests
forge test -vv
```

## Uniswap v4 Addresses (Sepolia)

- PoolManager: `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543`
- PoolSwapTest: `0x9b6b46e2c869aa39918db7f52f5557fe577b6eee`
