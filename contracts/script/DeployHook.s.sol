// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {ToxicFlowHook} from "../src/ToxicFlowHook.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";
import {HookMiner} from "./HookMiner.sol";
import {IPassportRegistry} from "../src/interfaces/IPassportRegistry.sol";

/// @notice Re-deploy ToxicFlowHook using the exact-flag HookMiner (registry already deployed)
contract DeployHook is Script {
    address constant POOL_MANAGER = 0xE03A1074c86CFeDd5C142C4F04F1a1536e203543;
    address constant DEPLOY_FACTORY = 0x4e59b44847b379578588920cA78FbF26c0B4956C;

    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        // Use existing registry: no need to redeploy
        address registryAddr = vm.envOr(
            "VITE_PASSPORT_REGISTRY",
            address(0x101fd25Ff9B9EBC21359B15F0cdE8aD7C4f01D0e)
        );

        console.log("Deployer:", vm.addr(deployerKey));
        console.log("Registry:", registryAddr);
        console.log("PoolManager:", POOL_MANAGER);

        // BEFORE_SWAP_FLAG only: lower 14 bits must be exactly 0x0080
        uint160 exactFlags = Hooks.BEFORE_SWAP_FLAG;
        console.log("Target flag bits (lower 14):", exactFlags);

        bytes memory constructorArgs = abi.encode(address(IPoolManager(POOL_MANAGER)), registryAddr);
        (address hookAddress, bytes32 salt) = HookMiner.find(
            DEPLOY_FACTORY,
            exactFlags,
            type(ToxicFlowHook).creationCode,
            constructorArgs
        );
        console.log("Mined hook address:", hookAddress);
        console.log("Salt:", vm.toString(salt));
        console.log("Lower 14 bits:", uint160(hookAddress) & 0x3FFF);

        vm.startBroadcast(deployerKey);
        ToxicFlowHook hook = new ToxicFlowHook{salt: salt}(
            IPoolManager(POOL_MANAGER),
            IPassportRegistry(registryAddr)
        );
        require(address(hook) == hookAddress, "Hook address mismatch");
        console.log("ToxicFlowHook deployed:", address(hook));
        vm.stopBroadcast();

        console.log("=== UPDATE ENV VARS ===");
        console.log("VITE_TOXIC_FLOW_HOOK=", address(hook));
        console.log("NEXT_PUBLIC_TOXIC_FLOW_HOOK=", address(hook));
        console.log("=========================");
    }
}
