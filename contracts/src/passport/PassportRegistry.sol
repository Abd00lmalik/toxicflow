// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./interfaces/IPassportRegistry.sol";

/// @title PassportRegistry
/// @notice Manages wallet tiers for ToxicFlow fee classification
/// @dev Tiers: 0 = Neutral (default), 1 = Trusted, 2 = Toxic
contract PassportRegistry is IPassportRegistry {
    uint8 public constant TIER_NEUTRAL = 0;
    uint8 public constant TIER_TRUSTED = 1;
    uint8 public constant TIER_TOXIC   = 2;

    address public admin;

    struct Passport {
        uint8   tier;
        bool    registered;
        uint48  registeredAt;
        uint48  updatedAt;
    }

    mapping(address => Passport) private _passports;

    event PassportRegistered(address indexed trader);
    event TierUpdated(address indexed trader, uint8 tier, address indexed setBy);
    event AdminTransferred(address indexed prev, address indexed next);

    error NotAdmin();
    error InvalidTier();
    error AlreadyRegistered();
    error LengthMismatch();

    constructor(address _admin) {
        admin = _admin;
    }

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    // ─── Self-registration ─────────────────────────────────────────────────────

    /// @notice Any wallet can register and receive a Neutral passport
    function selfRegister() external {
        if (_passports[msg.sender].registered) revert AlreadyRegistered();
        _passports[msg.sender] = Passport({
            tier: TIER_NEUTRAL,
            registered: true,
            registeredAt: uint48(block.timestamp),
            updatedAt: uint48(block.timestamp)
        });
        emit PassportRegistered(msg.sender);
    }

    // ─── Admin functions ───────────────────────────────────────────────────────

    /// @notice Set tier for a single trader (creates passport if needed)
    function setTier(address trader, uint8 tier) external onlyAdmin {
        if (tier > TIER_TOXIC) revert InvalidTier();
        Passport storage p = _passports[trader];
        if (!p.registered) {
            p.registered = true;
            p.registeredAt = uint48(block.timestamp);
            emit PassportRegistered(trader);
        }
        p.tier = tier;
        p.updatedAt = uint48(block.timestamp);
        emit TierUpdated(trader, tier, msg.sender);
    }

    /// @notice Batch set tiers
    function batchSetTiers(address[] calldata traders, uint8[] calldata tiers) external onlyAdmin {
        if (traders.length != tiers.length) revert LengthMismatch();
        for (uint256 i; i < traders.length; ) {
            if (tiers[i] > TIER_TOXIC) revert InvalidTier();
            Passport storage p = _passports[traders[i]];
            if (!p.registered) {
                p.registered = true;
                p.registeredAt = uint48(block.timestamp);
                emit PassportRegistered(traders[i]);
            }
            p.tier = tiers[i];
            p.updatedAt = uint48(block.timestamp);
            emit TierUpdated(traders[i], tiers[i], msg.sender);
            unchecked { ++i; }
        }
    }

    function transferAdmin(address newAdmin) external onlyAdmin {
        emit AdminTransferred(admin, newAdmin);
        admin = newAdmin;
    }

    // ─── Views ──────────────────────────────────────────────────────────────────

    function getTier(address trader) external view returns (uint8) {
        return _passports[trader].tier;
    }

    function hasPassport(address trader) external view returns (bool) {
        return _passports[trader].registered;
    }

    function getTraderTier(address trader) external view returns (uint8) {
        return _passports[trader].tier;
    }

    function hasActivePassport(address trader) external view returns (bool) {
        return _passports[trader].registered;
    }

    function getPassport(address trader) external view returns (Passport memory) {
        return _passports[trader];
    }
}
