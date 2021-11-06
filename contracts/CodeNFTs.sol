//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract CodeNFTs is ERC1155{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC1155("") {
        _tokenIds.increment();
    }

    function mint (address account) public {
         uint256 newItemId = _tokenIds.current();
        _mint(account, newItemId, 1, "");
        console.log("Minted NFT w/ tokenId %s", newItemId);
        _tokenIds.increment();

        emit NFTMinted(msg.sender, newItemId);
    }

    function burn (address account, uint256 id) public {
        _burn(account, id, 1);
        emit NFTBurned(msg.sender, id);
    }

    event NFTMinted(address sender, uint256 tokenId);
    event NFTBurned(address sender, uint256 tokenId);
}