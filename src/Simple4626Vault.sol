// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * MVP: Vault ERC-4626 pasivo.
 * - Mantiene el asset en el contrato.
 * - Si el balance del vault aumenta por yield externo, el precio por share sube.
 */
contract Simple4626Vault is ERC4626 {
    constructor(IERC20 asset_) ERC20("Simple Vault Share", "SVS") ERC4626(asset_) {}
}
