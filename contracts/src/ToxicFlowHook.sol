// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {BaseHook} from "v4-periphery/src/base/hooks/BaseHook.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-core/src/types/BeforeSwapDelta.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {LPFeeLibrary} from "v4-core/src/libraries/LPFeeLibrary.sol";
import {IPassportRegistry} from "./interfaces/IPassportRegistry.sol";
import {ITierResolver} from "./interfaces/ITierResolver.sol";

/// @title ToxicFlowHook
/// @notice Uniswap v4 hook that applies tier-based dynamic fees via the PassportRegistry
/// @dev Implements beforeSwap to return a dynamic fee override
contract ToxicFlowHook is BaseHook, ITierResolver {
    using PoolIdLibrary for PoolKey;

    // ─── Fee constants ─────────────────────────────────────────────────────────
    /// @notice 1000 pips = 10 bps = 0.10%
    uint24 public constant FEE_TRUSTED = 1000;
    /// @notice 3000 pips = 30 bps = 0.30%
    uint24 public constant FEE_NEUTRAL = 3000;
    /// @notice 8000 pips = 80 bps = 0.80%
    uint24 public constant FEE_TOXIC   = 8000;

    IPassportRegistry public immutable registry;

    event SwapFeeApplied(
        bytes32 indexed poolId,
        address indexed trader,
        uint8  tier,
        uint24 appliedFee,
        int128 amountSpecified,
        bool   hadPassport,
        uint256 blockNumber
    );

    constructor(IPoolManager _poolManager, IPassportRegistry _registry) BaseHook(_poolManager) {
        registry = _registry;
    }

    // ─── Hook permissions ──────────────────────────────────────────────────────

    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize:              false,
            afterInitialize:               false,
            beforeAddLiquidity:            false,
            afterAddLiquidity:             false,
            beforeRemoveLiquidity:         false,
            afterRemoveLiquidity:          false,
            beforeSwap:                    true,
            afterSwap:                     false,
            beforeDonate:                  false,
            afterDonate:                   false,
            beforeSwapReturnDelta:         false,
            afterSwapReturnDelta:          false,
            afterAddLiquidityReturnDelta:  false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    // ─── Hook logic ────────────────────────────────────────────────────────────

    function beforeSwap(
        address,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata
    ) external override returns (bytes4, BeforeSwapDelta, uint24) {
        address trader = tx.origin;
        uint8  tier       = registry.getTier(trader);
        bool   hadPassport = registry.hasPassport(trader);
        uint24 fee        = _feeForTier(tier);

        emit SwapFeeApplied(
            PoolId.unwrap(key.toId()),
            trader,
            tier,
            fee,
            params.amountSpecified,
            hadPassport,
            block.number
        );

        // Return fee override — pool applies it for this swap
        return (BaseHook.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, fee | LPFeeLibrary.OVERRIDE_FEE_FLAG);
    }

    // ─── ITierResolver ─────────────────────────────────────────────────────────

    function previewFee(address trader) external view returns (uint24 fee, uint8 tier, bool hasPassport) {
        tier       = registry.getTier(trader);
        hasPassport = registry.hasPassport(trader);
        fee        = _feeForTier(tier);
    }

    function getTraderTier(address trader) external view returns (uint8) {
        return registry.getTier(trader);
    }

    function hasActivePassport(address trader) external view returns (bool) {
        return registry.hasPassport(trader);
    }

    // ─── Internal ──────────────────────────────────────────────────────────────

    function _feeForTier(uint8 tier) internal pure returns (uint24) {
        if (tier == 1) return FEE_TRUSTED;
        if (tier == 2) return FEE_TOXIC;
        return FEE_NEUTRAL;
    }
}
