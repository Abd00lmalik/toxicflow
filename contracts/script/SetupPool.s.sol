// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {Currency} from "v4-core/types/Currency.sol";
import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {LPFeeLibrary} from "v4-core/libraries/LPFeeLibrary.sol";
import {TickMath} from "v4-core/libraries/TickMath.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";

contract SetupPool is Script {
    using PoolIdLibrary for PoolKey;

    address constant POOL_MANAGER = 0xE03A1074c86CFeDd5C142C4F04F1a1536e203543;

    // Real Sepolia USDC: 6 decimals
    address constant SEPOLIA_USDC = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;

    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address hookAddress = vm.envAddress("VITE_TOXIC_FLOW_HOOK");

        address usdcAddr = vm.envOr("VITE_USDC_ADDRESS", SEPOLIA_USDC);

        console.log("Hook:", hookAddress);
        console.log("USDC:", usdcAddr);

        // ETH (address 0) is always currency0 since 0 < any real token address
        address eth = address(0);
        // currency0 must be < currency1 by address
        (address currency0, address currency1) = eth < usdcAddr
            ? (eth, usdcAddr)
            : (usdcAddr, eth);

        console.log("currency0:", currency0);
        console.log("currency1:", currency1);

        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(currency0),
            currency1: Currency.wrap(currency1),
            fee: LPFeeLibrary.DYNAMIC_FEE_FLAG,
            tickSpacing: 60,
            hooks: IHooks(hookAddress)
        });

        // sqrtPriceX96 for 1 ETH = 2000 USDC where USDC has 6 decimals
        // price_ratio = token1/token0 in raw units = 2000 * 1e6 / 1e18 = 2e-9
        // sqrtPriceX96 = sqrt(2e-9) * 2^96 ≈ 3543191142285914327220224
        uint160 sqrtPriceX96 = 3543191142285914327220224;

        vm.startBroadcast(deployerKey);
        IPoolManager(POOL_MANAGER).initialize(key, sqrtPriceX96);
        vm.stopBroadcast();

        bytes32 poolId = PoolId.unwrap(key.toId());
        console.log("Pool initialized! ETH/USDC hooked pool live.");
        console.log("VITE_POOL_ID=");
        console.logBytes32(poolId);
        console.log("NEXT_PUBLIC_POOL_ID=");
        console.logBytes32(poolId);
    }
}
