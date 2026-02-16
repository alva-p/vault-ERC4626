// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {Simple4626Vault} from "../src/Simple4626Vault.sol";
import {MockERC20} from "../src/mocks/MockERC20.sol";

contract Simple4626VaultTest is Test {
    MockERC20 asset;
    Simple4626Vault vault;

    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    function setUp() public {
        asset = new MockERC20("Mock USD", "mUSD");
        vault = new Simple4626Vault(asset);

        asset.mint(alice, 1_000e18);
    }

    function testDepositMintsShares() public {
        vm.startPrank(alice);

        asset.approve(address(vault), 100e18);

        uint256 expectedShares = vault.previewDeposit(100e18);
        uint256 shares = vault.deposit(100e18, alice);

        assertEq(shares, expectedShares, "shares != previewDeposit");
        assertEq(vault.balanceOf(alice), shares, "share balance wrong");
        assertEq(asset.balanceOf(address(vault)), 100e18, "vault assets wrong");

        vm.stopPrank();
    }

    function testRedeemAfterYieldGivesMoreAssets() public {
        vm.startPrank(alice);
        asset.approve(address(vault), 100e18);
        uint256 shares = vault.deposit(100e18, alice);
        vm.stopPrank();

        asset.mint(address(vault), 20e18);

        vm.startPrank(alice);
        uint256 assetsOut = vault.redeem(shares, alice, alice);
        vm.stopPrank();

        assertApproxEqAbs(assetsOut, 120e18, 1, "assets out should include yield");
        assertApproxEqAbs(asset.balanceOf(alice), 1_000e18 + 20e18, 1, "alice final balance wrong");
    }

    function testWithdrawExactAssetsBurnsShares() public {
        vm.startPrank(alice);
        asset.approve(address(vault), 200e18);
        vault.deposit(200e18, alice);

        uint256 sharesBefore = vault.balanceOf(alice);

        uint256 sharesBurned = vault.withdraw(50e18, alice, alice);
        uint256 sharesAfter = vault.balanceOf(alice);

        assertEq(sharesBefore - sharesAfter, sharesBurned, "burned shares mismatch");
        assertEq(asset.balanceOf(alice), 1_000e18 - 200e18 + 50e18, "asset balance wrong");
        vm.stopPrank();
    }

    function testShareTransferMovesOwnership() public {
        vm.startPrank(alice);
        asset.approve(address(vault), 100e18);
        uint256 shares = vault.deposit(100e18, alice);
        vault.transfer(bob, shares / 2);
        vm.stopPrank();

        assertEq(vault.balanceOf(bob), shares / 2, "bob share balance wrong");

        vm.startPrank(bob);
        uint256 assetsOut = vault.redeem(shares / 2, bob, bob);
        vm.stopPrank();

        assertApproxEqAbs(assetsOut, 50e18, 1, "bob assets out wrong");
    }

    function testDepositUpdatesTotals() public {
        vm.startPrank(alice);
        asset.approve(address(vault), 100e18);
        vault.deposit(100e18, alice);
        vm.stopPrank();

        assertEq(vault.totalAssets(), 100e18, "total assets wrong");
        assertEq(vault.totalSupply(), vault.balanceOf(alice), "total supply wrong");
    }

    function testPreviewDepositMatchesDeposit() public {
        vm.startPrank(alice);
        asset.approve(address(vault), 75e18);
        uint256 expectedShares = vault.previewDeposit(75e18);
        uint256 shares = vault.deposit(75e18, alice);
        vm.stopPrank();

        assertApproxEqAbs(shares, expectedShares, 1, "previewDeposit mismatch");
    }

    function testPreviewRedeemMatchesRedeem() public {
        vm.startPrank(alice);
        asset.approve(address(vault), 80e18);
        uint256 shares = vault.deposit(80e18, alice);
        uint256 expectedAssets = vault.previewRedeem(shares);
        uint256 assetsOut = vault.redeem(shares, alice, alice);
        vm.stopPrank();

        assertApproxEqAbs(assetsOut, expectedAssets, 1, "previewRedeem mismatch");
    }

    function testConvertRoundTrip() public {
        vm.startPrank(alice);
        asset.approve(address(vault), 120e18);
        vault.deposit(120e18, alice);
        vm.stopPrank();

        uint256 assets = 50e18;
        uint256 shares = vault.convertToShares(assets);
        uint256 assetsBack = vault.convertToAssets(shares);

        assertApproxEqAbs(assetsBack, assets, 1, "round trip mismatch");
    }

    function testRedeemAllClearsBalance() public {
        vm.startPrank(alice);
        asset.approve(address(vault), 90e18);
        uint256 shares = vault.deposit(90e18, alice);
        vault.redeem(shares, alice, alice);
        vm.stopPrank();

        assertEq(vault.balanceOf(alice), 0, "share balance should be zero");
    }

    function testWithdrawRevertsWithoutShares() public {
        vm.startPrank(alice);
        asset.approve(address(vault), 10e18);
        vm.expectRevert();
        vault.withdraw(10e18, alice, alice);
        vm.stopPrank();
    }
}
