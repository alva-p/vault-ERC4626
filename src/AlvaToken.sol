// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

/**
 * ERC20 faucet token with a capped supply and per-wallet cooldown.
 */
contract AlvaToken is ERC20Capped {
    uint256 public constant FAUCET_AMOUNT = 1_000e18;
    uint256 public constant COOLDOWN = 1 days;

    mapping(address => uint256) public lastMintAt;

    constructor() ERC20("AlvaToken", "4LVA") ERC20Capped(1_000_000e18) {}

    function mintFaucet() external {
        uint256 lastMint = lastMintAt[msg.sender];
        require(block.timestamp >= lastMint + COOLDOWN, "Faucet cooldown");
        lastMintAt[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
    }

    function remainingCooldown(address account) external view returns (uint256) {
        uint256 lastMint = lastMintAt[account];
        if (block.timestamp >= lastMint + COOLDOWN) {
            return 0;
        }
        return (lastMint + COOLDOWN) - block.timestamp;
    }
}
