// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-core/types/BeforeSwapDelta.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {LPFeeLibrary} from "v4-core/libraries/LPFeeLibrary.sol";
import {SwapParams, ModifyLiquidityParams} from "v4-core/types/PoolOperation.sol";
import {IPassportRegistry} from "../passport/interfaces/IPassportRegistry.sol";
import {ITierResolver} from "./interfaces/ITierResolver.sol";

/// @title ToxicFlowHook
/// @notice Uniswap v4 hook that applies tier-based dynamic fees via the PassportRegistry
/// @dev Implements beforeSwap to return a dynamic fee override. Deployed at a CREATE2 address
///      with BEFORE_SWAP_FLAG (bit 7) set in the lower address bits.
contract ToxicFlowHook is IHooks, ITierResolver {
    using PoolIdLibrary for PoolKey;

    // ─── Fee constants ─────────────────────────────────────────────────────────
    /// @notice 1000 pips = 10 bps = 0.10%
    uint24 public constant FEE_TRUSTED = 1000;
    /// @notice 3000 pips = 30 bps = 0.30%
    uint24 public constant FEE_NEUTRAL = 3000;
    /// @notice 8000 pips = 80 bps = 0.80%
    uint24 public constant FEE_TOXIC   = 8000;

    IPoolManager public immutable poolManager;
    IPassportRegistry public immutable registry;

    event SwapFeeApplied(
        bytes32 indexed poolId,
        address indexed trader,
        uint8  tier,
        uint24 appliedFee,
        int256 amountSpecified,
        bool   hadPassport,
        uint256 blockNumber
    );

    error NotPoolManager();

    modifier onlyPoolManager() {
        if (msg.sender != address(poolManager)) revert NotPoolManager();
        _;
    }

    constructor(IPoolManager _poolManager, IPassportRegistry _registry) {
        poolManager = _poolManager;
        registry = _registry;
    }

    // ─── Hook logic ────────────────────────────────────────────────────────────

    function beforeSwap(
        address,
        PoolKey calldata key,
        SwapParams calldata params,
        bytes calldata
    ) external override onlyPoolManager returns (bytes4, BeforeSwapDelta, uint24) {
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

        return (IHooks.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, fee | LPFeeLibrary.OVERRIDE_FEE_FLAG);
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

    // ─── IHooks stubs (only beforeSwap is active) ──────────────────────────────

    function beforeInitialize(address, PoolKey calldata, uint160) external pure override returns (bytes4) {
        revert("not implemented");
    }
    function afterInitialize(address, PoolKey calldata, uint160, int24) external pure override returns (bytes4) {
        revert("not implemented");
    }
    function beforeAddLiquidity(address, PoolKey calldata, ModifyLiquidityParams calldata, bytes calldata) external pure override returns (bytes4) {
        revert("not implemented");
    }
    function afterAddLiquidity(address, PoolKey calldata, ModifyLiquidityParams calldata, BalanceDelta, BalanceDelta, bytes calldata) external pure override returns (bytes4, BalanceDelta) {
        revert("not implemented");
    }
    function beforeRemoveLiquidity(address, PoolKey calldata, ModifyLiquidityParams calldata, bytes calldata) external pure override returns (bytes4) {
        revert("not implemented");
    }
    function afterRemoveLiquidity(address, PoolKey calldata, ModifyLiquidityParams calldata, BalanceDelta, BalanceDelta, bytes calldata) external pure override returns (bytes4, BalanceDelta) {
        revert("not implemented");
    }
    function afterSwap(address, PoolKey calldata, SwapParams calldata, BalanceDelta, bytes calldata) external pure override returns (bytes4, int128) {
        revert("not implemented");
    }
    function beforeDonate(address, PoolKey calldata, uint256, uint256, bytes calldata) external pure override returns (bytes4) {
        revert("not implemented");
    }
    function afterDonate(address, PoolKey calldata, uint256, uint256, bytes calldata) external pure override returns (bytes4) {
        revert("not implemented");
    }

    // ─── Internal ──────────────────────────────────────────────────────────────

    function _feeForTier(uint8 tier) internal pure returns (uint24) {
        if (tier == 1) return FEE_TRUSTED;
        if (tier == 2) return FEE_TOXIC;
        return FEE_NEUTRAL;
    }
}
