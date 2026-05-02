// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IPassportRegistry {
    function getTier(address trader) external view returns (uint8);
    function hasPassport(address trader) external view returns (bool);
    function getTraderTier(address trader) external view returns (uint8);
    function hasActivePassport(address trader) external view returns (bool);
}
