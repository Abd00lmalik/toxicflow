// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {PassportRegistry} from "../src/PassportRegistry.sol";
import {ToxicFlowHook} from "../src/ToxicFlowHook.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";

contract ToxicFlowHookTest is Test {
    PassportRegistry registry;
    address admin = makeAddr("admin");
    address trusted = makeAddr("trusted");
    address neutral = makeAddr("neutral");
    address toxic = makeAddr("toxic");

    function setUp() public {
        registry = new PassportRegistry(admin);

        vm.startPrank(admin);
        registry.setTier(trusted, 1);
        registry.setTier(toxic,   2);
        vm.stopPrank();
    }

    function test_defaultTierIsNeutral() public view {
        assertEq(registry.getTier(neutral), 0);
        assertFalse(registry.hasPassport(neutral));
    }

    function test_trustedTier() public view {
        assertEq(registry.getTier(trusted), 1);
        assertTrue(registry.hasPassport(trusted));
    }

    function test_toxicTier() public view {
        assertEq(registry.getTier(toxic), 2);
        assertTrue(registry.hasPassport(toxic));
    }

    function test_selfRegister() public {
        vm.prank(neutral);
        registry.selfRegister();
        assertTrue(registry.hasPassport(neutral));
        assertEq(registry.getTier(neutral), 0); // Still neutral after self-register
    }

    function test_selfRegisterTwiceReverts() public {
        vm.prank(neutral);
        registry.selfRegister();
        vm.expectRevert(PassportRegistry.AlreadyRegistered.selector);
        vm.prank(neutral);
        registry.selfRegister();
    }

    function test_onlyAdminCanSetTier() public {
        vm.expectRevert(PassportRegistry.NotAdmin.selector);
        vm.prank(neutral);
        registry.setTier(neutral, 1);
    }

    function test_invalidTierReverts() public {
        vm.expectRevert(PassportRegistry.InvalidTier.selector);
        vm.prank(admin);
        registry.setTier(neutral, 3);
    }

    function test_batchSetTiers() public {
        address[] memory traders = new address[](2);
        uint8[]   memory tiers   = new uint8[](2);
        traders[0] = makeAddr("a");
        traders[1] = makeAddr("b");
        tiers[0]   = 1;
        tiers[1]   = 2;

        vm.prank(admin);
        registry.batchSetTiers(traders, tiers);

        assertEq(registry.getTier(traders[0]), 1);
        assertEq(registry.getTier(traders[1]), 2);
    }

    function test_batchLengthMismatchReverts() public {
        address[] memory traders = new address[](2);
        uint8[]   memory tiers   = new uint8[](1);
        vm.expectRevert(PassportRegistry.LengthMismatch.selector);
        vm.prank(admin);
        registry.batchSetTiers(traders, tiers);
    }

    function test_transferAdmin() public {
        address newAdmin = makeAddr("newAdmin");
        vm.prank(admin);
        registry.transferAdmin(newAdmin);
        assertEq(registry.admin(), newAdmin);
    }
}
