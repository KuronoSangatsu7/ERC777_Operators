//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

contract CheapAToken is ERC777 {
    constructor(
        uint256 initialSupply,
        address[] memory defaultOperators
    )
        ERC777("CheapAToken", "CAT", defaultOperators)
        public
    {
        _mint(msg.sender, initialSupply, "", "");
    }
}