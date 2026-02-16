// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {AlvaToken} from "../src/AlvaToken.sol";
import {Simple4626Vault} from "../src/Simple4626Vault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeployTokenAndVault is Script {
    function run() external returns (AlvaToken token, Simple4626Vault vault) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerKey);
        token = new AlvaToken();
        vault = new Simple4626Vault(IERC20(address(token)));
        vm.stopBroadcast();

        console2.log("Token deployed at:", address(token));
        console2.log("Vault deployed at:", address(vault));
    }
}
