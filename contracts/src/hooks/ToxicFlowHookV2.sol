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

/// @title ToxicFlowHookV2
/// @notice Uniswap v4 hook with tier-based dynamic fees AND a KeeperHub circuit breaker.
/// @dev Adds a pause mechanism on top of V1. The circuitBreaker address (set by owner)
///      can call pauseSwaps(). Only the owner can resume. Deploying this hook requires
///      a new pool (hook address is embedded in PoolKey and cannot be changed).
contract ToxicFlowHookV2 is IHooks, ITierResolver {
    using PoolIdLibrary for PoolKey;

    // ─── Fee constants ─────────────────────────────────────────────────────────
    uint24 public constant FEE_TRUSTED = 1000;
    uint24 public constant FEE_NEUTRAL = 3000;
    uint24 public constant FEE_TOXIC   = 8000;

    IPoolManager        public immutable poolManager;
    IPassportRegistry   public immutable registry;

    // ─── Circuit breaker state ─────────────────────────────────────────────────
    address public owner;
    address public circuitBreaker;
    bool    public paused;
    bytes32 public pauseReason;
    uint256 public pausedAt;
    uint256 public resumedAt;
    address public lastPausedBy;
    address public lastResumedBy;

    // ─── Events ────────────────────────────────────────────────────────────────
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event CircuitBreakerUpdated(address indexed previousBreaker, address indexed newBreaker);
    event SwapsPaused(address indexed caller, bytes32 reason, uint256 timestamp);
    event SwapsResumed(address indexed caller, uint256 timestamp);
    event SwapFeeApplied(
        bytes32 indexed poolId,
        address indexed trader,
        uint8   tier,
        uint24  appliedFee,
        int256  amountSpecified,
        bool    hadPassport,
        uint256 blockNumber
    );

    // ─── Errors ────────────────────────────────────────────────────────────────
    error NotPoolManager();
    error NotOwner();
    error NotCircuitBreaker();
    error SwapsPausedError(bytes32 reason);

    // ─── Modifiers ─────────────────────────────────────────────────────────────
    modifier onlyPoolManager() {
        if (msg.sender != address(poolManager)) revert NotPoolManager();
        _;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyCircuitBreakerOrOwner() {
        if (msg.sender != circuitBreaker && msg.sender != owner) revert NotCircuitBreaker();
        _;
    }

    // ─── Constructor ───────────────────────────────────────────────────────────
    constructor(IPoolManager _poolManager, IPassportRegistry _registry) {
        poolManager    = _poolManager;
        registry       = _registry;
        owner          = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    // ─── Admin ─────────────────────────────────────────────────────────────────
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /// @notice Set the circuit breaker address. Only the owner can do this.
    ///         The circuit breaker is typically an automated keeper (KeeperHub signer).
    function setCircuitBreaker(address newBreaker) external onlyOwner {
        emit CircuitBreakerUpdated(circuitBreaker, newBreaker);
        circuitBreaker = newBreaker;
    }

    /// @notice Pause all swaps through pools using this hook.
    /// @param reason A bytes32 identifier (e.g. "TOXIC_THRESHOLD_EXCEEDED").
    function pauseSwaps(bytes32 reason) external onlyCircuitBreakerOrOwner {
        paused      = true;
        pauseReason = reason;
        pausedAt    = block.timestamp;
        lastPausedBy = msg.sender;
        emit SwapsPaused(msg.sender, reason, block.timestamp);
    }

    /// @notice Resume swaps. Only the owner can resume.
    function resumeSwaps() external onlyOwner {
        paused       = false;
        pauseReason  = bytes32(0);
        resumedAt    = block.timestamp;
        lastResumedBy = msg.sender;
        emit SwapsResumed(msg.sender, block.timestamp);
    }

    // ─── Hook logic ────────────────────────────────────────────────────────────
    function beforeSwap(
        address,
        PoolKey calldata key,
        SwapParams calldata params,
        bytes calldata
    ) external override onlyPoolManager returns (bytes4, BeforeSwapDelta, uint24) {
        if (paused) revert SwapsPausedError(pauseReason);

        address trader     = tx.origin;
        uint8   tier       = registry.getTier(trader);
        bool    hadPassport = registry.hasPassport(trader);
        uint24  fee        = _feeForTier(tier);

        emit SwapFeeApplied(
            PoolId.unwrap(key.toId()),
            trader, tier, fee,
            params.amountSpecified,
            hadPassport, block.number
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

    // ─── IHooks stubs ──────────────────────────────────────────────────────────
    function beforeInitialize(address, PoolKey calldata, uint160) external pure override returns (bytes4) { revert("not implemented"); }
    function afterInitialize(address, PoolKey calldata, uint160, int24) external pure override returns (bytes4) { revert("not implemented"); }
    function beforeAddLiquidity(address, PoolKey calldata, ModifyLiquidityParams calldata, bytes calldata) external pure override returns (bytes4) { revert("not implemented"); }
    function afterAddLiquidity(address, PoolKey calldata, ModifyLiquidityParams calldata, BalanceDelta, BalanceDelta, bytes calldata) external pure override returns (bytes4, BalanceDelta) { revert("not implemented"); }
    function beforeRemoveLiquidity(address, PoolKey calldata, ModifyLiquidityParams calldata, bytes calldata) external pure override returns (bytes4) { revert("not implemented"); }
    function afterRemoveLiquidity(address, PoolKey calldata, ModifyLiquidityParams calldata, BalanceDelta, BalanceDelta, bytes calldata) external pure override returns (bytes4, BalanceDelta) { revert("not implemented"); }
    function afterSwap(address, PoolKey calldata, SwapParams calldata, BalanceDelta, bytes calldata) external pure override returns (bytes4, int128) { revert("not implemented"); }
    function beforeDonate(address, PoolKey calldata, uint256, uint256, bytes calldata) external pure override returns (bytes4) { revert("not implemented"); }
    function afterDonate(address, PoolKey calldata, uint256, uint256, bytes calldata) external pure override returns (bytes4) { revert("not implemented"); }

    // ─── Internal ──────────────────────────────────────────────────────────────
    function _feeForTier(uint8 tier) internal pure returns (uint24) {
        if (tier == 1) return FEE_TRUSTED;
        if (tier == 2) return FEE_TOXIC;
        return FEE_NEUTRAL;
    }
}
