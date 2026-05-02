// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {Currency} from "v4-core/src/types/Currency.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {LPFeeLibrary} from "v4-core/src/libraries/LPFeeLibrary.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";

contract SetupPool is Script {
    using PoolIdLibrary for PoolKey;

    address constant POOL_MANAGER = 0xE03A1074c86CFeDd5C142C4F04F1a1536e203543;

    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address hookAddress = vm.envAddress("NEXT_PUBLIC_TOXIC_FLOW_HOOK");
        address token1 = vm.envOr("NEXT_PUBLIC_USDC_ADDRESS", vm.envOr("NEXT_PUBLIC_TEST_TOKEN", address(0)));

        console.log("Hook:", hookAddress);
        console.log("Token1:", token1);

        address eth = address(0);
        (address currency0, address currency1) = eth < token1 ? (eth, token1) : (token1, eth);

        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(currency0),
            currency1: Currency.wrap(currency1),
            fee: LPFeeLibrary.DYNAMIC_FEE_FLAG,
            tickSpacing: 60,
            hooks: IHooks(hookAddress)
        });

        // sqrtPriceX96 for 1 ETH = 2000 TOKEN
        uint160 sqrtPriceX96 = 3543191142285914205922034323214;

        vm.startBroadcast(deployerKey);
        IPoolManager(POOL_MANAGER).initialize(key, sqrtPriceX96);
        vm.stopBroadcast();

        bytes32 poolId = PoolId.unwrap(key.toId());
        console.log("Pool initialized!");
        console.log("NEXT_PUBLIC_POOL_ID=");
        console.logBytes32(poolId);
    }
}
