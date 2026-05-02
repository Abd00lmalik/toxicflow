// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {PassportRegistry} from "../src/PassportRegistry.sol";
import {ToxicFlowHook} from "../src/ToxicFlowHook.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {HookMiner} from "v4-periphery/src/utils/HookMiner.sol";

/// @notice Deploy PassportRegistry + ToxicFlowHook on Sepolia
contract Deploy is Script {
    // Sepolia Uniswap v4 PoolManager
    address constant POOL_MANAGER = 0xE03A1074c86CFeDd5C142C4F04F1a1536e203543;

    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        console.log("Deployer:", deployer);
        console.log("PoolManager:", POOL_MANAGER);

        vm.startBroadcast(deployerKey);

        // 1. Deploy PassportRegistry
        PassportRegistry registry = new PassportRegistry(deployer);
        console.log("PassportRegistry:", address(registry));

        // 2. Mine a hook address with the correct flags (beforeSwap = true)
        uint160 flags = uint160(Hooks.BEFORE_SWAP_FLAG);
        bytes memory constructorArgs = abi.encode(POOL_MANAGER, address(registry));
        (address hookAddress, bytes32 salt) = HookMiner.find(
            deployer,
            flags,
            type(ToxicFlowHook).creationCode,
            constructorArgs
        );
        console.log("Hook address (mined):", hookAddress);

        // 3. Deploy ToxicFlowHook at the mined address using CREATE2
        ToxicFlowHook hook = new ToxicFlowHook{salt: salt}(
            IPoolManager(POOL_MANAGER),
            registry
        );
        require(address(hook) == hookAddress, "Hook address mismatch");
        console.log("ToxicFlowHook:", address(hook));

        vm.stopBroadcast();

        // Output env vars for copy-paste
        console.log("---");
        console.log("NEXT_PUBLIC_PASSPORT_REGISTRY=", address(registry));
        console.log("NEXT_PUBLIC_TOXIC_FLOW_HOOK=", address(hook));
        console.log("NEXT_PUBLIC_POOL_MANAGER=", POOL_MANAGER);
    }
}
