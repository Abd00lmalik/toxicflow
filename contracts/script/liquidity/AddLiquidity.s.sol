// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {Currency} from "v4-core/types/Currency.sol";
import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {LPFeeLibrary} from "v4-core/libraries/LPFeeLibrary.sol";
import {ModifyLiquidityParams} from "v4-core/types/PoolOperation.sol";
import {PoolModifyLiquidityTest} from "v4-core/test/PoolModifyLiquidityTest.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";

/// @notice Seeds ETH/USDC liquidity into the ToxicFlow hooked pool on Sepolia.
/// @dev    Deploys a fresh PoolModifyLiquidityTest helper each run.
///         Computes liquidity delta inline using full-range approximation.
///         Set ADD_LIQ_ETH_WEI and ADD_LIQ_USDC_RAW env vars before broadcasting.
contract AddLiquidity is Script {
    address constant POOL_MANAGER = 0xE03A1074c86CFeDd5C142C4F04F1a1536e203543;
    address constant SEPOLIA_USDC = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;

    /// @dev sqrtPriceX96 for 1 ETH = 2000 USDC  (raw ratio: 2000e6 / 1e18 = 2e-9)
    ///      sqrtPriceX96 = sqrt(2e-9) * 2^96 ≈ 3543191142285914327220224
    uint160 constant SQRT_PRICE_X96 = 3543191142285914327220224;

    /// Full-range ticks that are multiples of tickSpacing 60
    int24 constant TICK_LOWER = -887220;
    int24 constant TICK_UPPER =  887220;

    /// 2^96 — used in fixed-point liquidity math
    uint256 constant Q96 = 1 << 96;

    /// @notice Computes the full-range liquidity delta for a given ETH + USDC deposit
    ///         at the current sqrtPriceX96.
    ///
    ///         Full-range approximation (sqrtLower ≈ 0, sqrtUpper >> sqrtP):
    ///           L from amount0 ≈ amount0 * sqrtP / Q96
    ///           L from amount1 ≈ amount1 * Q96 / sqrtP
    ///           L = min(L0, L1)   (binding constraint)
    function _computeLiquidity(uint256 amount0, uint256 amount1)
        internal pure returns (uint128)
    {
        uint256 l0 = (amount0 * SQRT_PRICE_X96) / Q96;
        uint256 l1 = (amount1 * Q96)             / SQRT_PRICE_X96;
        return uint128(l0 < l1 ? l0 : l1);
    }

    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address hookAddress = vm.envAddress("VITE_TOXIC_FLOW_HOOK");

        // Raw units: wei for ETH, micro-USDC (6 decimals) for USDC
        uint256 ethAmount  = vm.envOr("ADD_LIQ_ETH_WEI",  uint256(0.05 ether));
        uint256 usdcAmount = vm.envOr("ADD_LIQ_USDC_RAW", uint256(100_000_000)); // 100 USDC

        // ETH (address 0) < USDC address → ETH is currency0
        address eth = address(0);
        (address c0, address c1) = eth < SEPOLIA_USDC ? (eth, SEPOLIA_USDC) : (SEPOLIA_USDC, eth);

        PoolKey memory key = PoolKey({
            currency0:   Currency.wrap(c0),
            currency1:   Currency.wrap(c1),
            fee:         LPFeeLibrary.DYNAMIC_FEE_FLAG,
            tickSpacing: 60,
            hooks:       IHooks(hookAddress)
        });

        uint128 liquidity = _computeLiquidity(ethAmount, usdcAmount);

        console.log("=== ToxicFlow AddLiquidity ===");
        console.log("Hook:          ", hookAddress);
        console.log("ETH  (wei):    ", ethAmount);
        console.log("USDC (raw):    ", usdcAmount);
        console.log("Liquidity:     ", uint256(liquidity));

        vm.startBroadcast(deployerKey);

        // Deploy a fresh PoolModifyLiquidityTest as the unlock-callback router
        PoolModifyLiquidityTest router = new PoolModifyLiquidityTest(IPoolManager(POOL_MANAGER));
        console.log("Router:        ", address(router));

        // Approve USDC to the router so it can pull USDC during unlock callback
        IERC20(SEPOLIA_USDC).approve(address(router), usdcAmount);
        console.log("USDC approved");

        ModifyLiquidityParams memory params = ModifyLiquidityParams({
            tickLower:      TICK_LOWER,
            tickUpper:      TICK_UPPER,
            liquidityDelta: int256(uint256(liquidity)),
            salt:           bytes32(0)
        });

        // ETH sent as msg.value; router holds it and pays PoolManager inside unlockCallback
        router.modifyLiquidity{value: ethAmount}(key, params, "");

        console.log("=== Liquidity added successfully ===");

        vm.stopBroadcast();
    }
}
