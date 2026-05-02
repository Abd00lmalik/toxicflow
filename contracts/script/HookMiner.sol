// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title HookMiner
/// @notice Utility to find a CREATE2 salt that produces a hook address with EXACTLY the required
///         flag bits set (and no others) in the lower 14 bits, which Uniswap v4 PoolManager
///         validates via Hooks.validateHookPermissions.
///
///         Uniswap v4 allocates bits 0-13 of the hook address to specific hook callbacks:
///           bit 13: beforeInitialize
///           bit 12: afterInitialize
///           bit 11: beforeAddLiquidity
///           bit 10: afterAddLiquidity
///           bit 9:  beforeRemoveLiquidity
///           bit 8:  afterRemoveLiquidity
///           bit 7:  beforeSwap              ← BEFORE_SWAP_FLAG
///           bit 6:  afterSwap
///           bit 5:  beforeDonate
///           bit 4:  afterDonate
///           bit 3:  beforeSwapReturnDelta
///           bit 2:  afterSwapReturnDelta
///           bit 1:  afterAddLiquidityReturnDelta
///           bit 0:  afterRemoveLiquidityReturnDelta
library HookMiner {
    /// @dev Mask covering all 14 hook permission bits in a hook address
    uint160 internal constant HOOK_MASK = 0x3FFF;

    /// @notice Find a salt such that deployer.CREATE2(salt, initCode) produces an address where
    ///         (addr & HOOK_MASK) == exactFlags — i.e. EXACTLY the required bits are set.
    /// @param deployer      The address that will call CREATE2 (e.g. the Foundry CREATE2 factory)
    /// @param exactFlags    The exact lower-14-bit pattern required (use Hooks.BEFORE_SWAP_FLAG etc.)
    /// @param creationCode  type(Contract).creationCode
    /// @param constructorArgs ABI-encoded constructor arguments
    function find(
        address deployer,
        uint160 exactFlags,
        bytes memory creationCode,
        bytes memory constructorArgs
    ) internal pure returns (address hookAddress, bytes32 salt) {
        bytes32 initCodeHash = keccak256(abi.encodePacked(creationCode, constructorArgs));
        for (uint256 nonce = 0; nonce < 500_000; nonce++) {
            salt = bytes32(nonce);
            hookAddress = _computeAddress(deployer, salt, initCodeHash);
            // Require that the lower 14 bits match EXACTLY — no stray flag bits
            if (uint160(hookAddress) & HOOK_MASK == exactFlags & HOOK_MASK) {
                return (hookAddress, salt);
            }
        }
        revert("HookMiner: no valid salt found in 500k iterations");
    }

    function _computeAddress(
        address deployer,
        bytes32 salt,
        bytes32 initCodeHash
    ) internal pure returns (address) {
        return address(
            uint160(
                uint256(keccak256(abi.encodePacked(bytes1(0xff), deployer, salt, initCodeHash)))
            )
        );
    }
}
