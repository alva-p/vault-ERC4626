// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Simple4626Vault} from "../src/Simple4626Vault.sol";

contract DeployVault is Script {
    function run() external returns (Simple4626Vault vault) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address asset = vm.envAddress("ASSET_ADDRESS");

        vm.startBroadcast(deployerKey);
        vault = new Simple4626Vault(IERC20(asset));
        vm.stopBroadcast();

        console2.log("Vault deployed at:", address(vault));
        console2.log("Asset:", asset);
    }
}
