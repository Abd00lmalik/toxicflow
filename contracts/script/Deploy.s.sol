// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {PassportRegistry} from "../src/PassportRegistry.sol";
import {ToxicFlowHook} from "../src/ToxicFlowHook.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";
import {HookMiner} from "./HookMiner.sol";

/// @notice Deploy PassportRegistry + ToxicFlowHook on Sepolia
contract Deploy is Script {
    // Sepolia Uniswap v4 PoolManager
    address constant POOL_MANAGER = 0xE03A1074c86CFeDd5C142C4F04F1a1536e203543;

    // Foundry's standard CREATE2 factory — same address on every chain
    // https://github.com/Arachnid/deterministic-deployment-proxy
    // (named differently to avoid collision with forge-std's BASE.CREATE2_FACTORY)
    address constant DEPLOY_FACTORY = 0x4e59b44847b379578588920cA78FbF26c0B4956C;

    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        console.log("Deployer:", deployer);
        console.log("PoolManager:", POOL_MANAGER);
        console.log("CREATE2 Factory:", DEPLOY_FACTORY);

        vm.startBroadcast(deployerKey);

        // 1. Deploy PassportRegistry (normal CREATE — address determined by deployer nonce)
        PassportRegistry registry = new PassportRegistry(deployer);
        console.log("PassportRegistry:", address(registry));

        // 2. Mine a salt so CREATE2 produces an address with BEFORE_SWAP_FLAG (bit 7) set.
        //    Forge broadcasts `new Contract{salt:}` through CREATE2_FACTORY — so mine against it.
        uint160 flags = Hooks.BEFORE_SWAP_FLAG;
        bytes memory constructorArgs = abi.encode(address(IPoolManager(POOL_MANAGER)), address(registry));
        (address hookAddress, bytes32 salt) = HookMiner.find(
            DEPLOY_FACTORY,
            flags,
            type(ToxicFlowHook).creationCode,
            constructorArgs
        );
        console.log("Hook address (mined):", hookAddress);
        console.log("Salt:", vm.toString(salt));

        // 3. Deploy ToxicFlowHook at the mined address via CREATE2
        ToxicFlowHook hook = new ToxicFlowHook{salt: salt}(
            IPoolManager(POOL_MANAGER),
            registry
        );
        require(address(hook) == hookAddress, "Hook address mismatch");
        console.log("ToxicFlowHook deployed:", address(hook));

        vm.stopBroadcast();

        // Output env vars — Vite prefix for frontend, NEXT_PUBLIC for API server
        console.log("=== COPY THESE ENV VARS ===");
        console.log("VITE_PASSPORT_REGISTRY=", address(registry));
        console.log("VITE_TOXIC_FLOW_HOOK=", address(hook));
        console.log("VITE_USDC_ADDRESS=0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238");
        console.log("VITE_POOL_MANAGER=", POOL_MANAGER);
        console.log("---");
        console.log("NEXT_PUBLIC_PASSPORT_REGISTRY=", address(registry));
        console.log("NEXT_PUBLIC_TOXIC_FLOW_HOOK=", address(hook));
        console.log("NEXT_PUBLIC_USDC_ADDRESS=0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238");
        console.log("NEXT_PUBLIC_POOL_MANAGER=", POOL_MANAGER);
        console.log("=========================");
    }
}
