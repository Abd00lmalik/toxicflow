// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {PassportRegistry} from "../../src/passport/PassportRegistry.sol";

/// @notice Seed initial wallet tiers in PassportRegistry
contract SeedTiers is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address registryAddr = vm.envAddress("NEXT_PUBLIC_PASSPORT_REGISTRY");

        PassportRegistry registry = PassportRegistry(registryAddr);
        address deployer = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        // Seed the deployer as trusted for initial testing
        registry.setTier(deployer, 1); // TIER_TRUSTED

        vm.stopBroadcast();

        console.log("Seeded:", deployer, "as Trusted");
    }
}
