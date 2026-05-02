// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface ITierResolver {
    function previewFee(address trader) external view returns (uint24 feePips, uint8 tier, bool hasPassport);
    function getTraderTier(address trader) external view returns (uint8);
    function hasActivePassport(address trader) external view returns (bool);
}
