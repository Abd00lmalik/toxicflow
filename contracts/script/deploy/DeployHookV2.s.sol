// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console2} from "forge-std/Script.sol";
import {ToxicFlowHookV2} from "../../src/hooks/ToxicFlowHookV2.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {IPassportRegistry} from "../../src/passport/interfaces/IPassportRegistry.sol";

/// @notice Deploy ToxicFlowHookV2 (circuit breaker edition).
///
/// IMPORTANT: Deploying a new hook requires initializing a NEW POOL because the hook
/// address is embedded in PoolKey. Migrate liquidity from the V1 pool after deployment.
///
/// Usage:
///   forge script contracts/script/deploy/DeployHookV2.s.sol \
///     --rpc-url $SEPOLIA_RPC_URL \
///     --broadcast \
///     --verify
///
/// Required env vars:
///   DEPLOYER_PRIVATE_KEY  — deployer / owner wallet
///   POOL_MANAGER_ADDRESS  — Uniswap v4 PoolManager on target chain
///   PASSPORT_REGISTRY     — deployed PassportRegistry address
///   CIRCUIT_BREAKER_ADDRESS — (optional) KeeperHub signer address
///
/// After deployment:
///   1. Copy new hook address to NEXT_PUBLIC_TOXIC_FLOW_HOOK env var.
///   2. Initialize new pool with SetupPool.s.sol pointed at new hook.
///   3. Add liquidity to new pool.
///   4. Update frontend VITE_POOL_ID and VITE_HOOK_ADDRESS.
contract DeployHookV2 is Script {
    function run() external {
        address poolManager  = vm.envAddress("POOL_MANAGER_ADDRESS");
        address registry     = vm.envAddress("PASSPORT_REGISTRY");
        uint256 deployerKey  = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployerAddr = vm.addr(deployerKey);

        address circuitBreakerAddr = vm.envOr("CIRCUIT_BREAKER_ADDRESS", address(0));

        console2.log("Deployer          :", deployerAddr);
        console2.log("PoolManager       :", poolManager);
        console2.log("PassportRegistry  :", registry);
        console2.log("CircuitBreaker    :", circuitBreakerAddr);

        vm.startBroadcast(deployerKey);

        ToxicFlowHookV2 hook = new ToxicFlowHookV2(
            IPoolManager(poolManager),
            IPassportRegistry(registry)
        );

        if (circuitBreakerAddr != address(0)) {
            hook.setCircuitBreaker(circuitBreakerAddr);
            console2.log("Circuit breaker set to:", circuitBreakerAddr);
        }

        vm.stopBroadcast();

        console2.log("ToxicFlowHookV2 deployed at:", address(hook));
        console2.log("Next steps:");
        console2.log("  1. Add NEXT_PUBLIC_TOXIC_FLOW_HOOK =", address(hook), "to .env");
        console2.log("  2. Run SetupPool.s.sol to initialize a new pool with this hook");
        console2.log("  3. Add liquidity to the new pool");
        console2.log("  4. Redeploy frontend with updated hook/pool addresses");
    }
}
