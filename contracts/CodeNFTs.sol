//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract CodeNFTs is ERC1155 {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct NFTAttributes {      
        uint themeId;
    }

    mapping(uint256 => NFTAttributes) public nftAttributes;

    constructor() ERC1155("") {
        _tokenIds.increment();
    }

    function mint () public {
         uint256 themeId = 1;
         uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId, 1, "");
        nftAttributes[newItemId] = NFTAttributes({
            themeId: themeId
        });

        console.log("Minted NFT w/ tokenId %s and themeId %s", newItemId, themeId);

        _tokenIds.increment();
        emit NFTMinted(msg.sender, newItemId, themeId);
    }

    function burn (address account, uint256 id) public {
        _burn(account, id, 1);
        emit NFTBurned(msg.sender, id);
    }

    event NFTMinted(address sender, uint256 tokenId, uint256 themeId);
    event NFTBurned(address sender, uint256 tokenId);
}