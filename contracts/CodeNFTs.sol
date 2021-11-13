//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract CodeNFTs is ERC721URIStorage, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct NFTAttributes {      
        uint themeId;
    }

    mapping(uint256 => NFTAttributes) public nftAttributes;

    constructor() ERC721("Code Snippet NFTs", "CODE") {
        _tokenIds.increment();
    }

    function mint () public {
         uint256 themeId = 1;
         uint256 newItemId = _tokenIds.current();

        _safeMint(_msgSender(), newItemId);
       

        nftAttributes[newItemId] = NFTAttributes({
            themeId: themeId
        });

        console.log("Minted NFT w/ tokenId %s and themeId %s", newItemId, themeId);

        _tokenIds.increment();
        emit NFTMinted(_msgSender(), newItemId, themeId);
    }


    function setTokenURI (uint256 tokenId, string memory tokenUri) public {
        require(
                _isApprovedOrOwner(_msgSender(), tokenId),
                "ERC721: transfer caller is not owner nor approved"
            );
        require(bytes(tokenURI(tokenId)).length == 0, "ERC721: metadata URI for this token already exists");
        _setTokenURI(tokenId, tokenUri);
    }

    function burn (uint256 id) public {
        _burn(id);
        emit NFTBurned(_msgSender(), id);
    }

    event NFTMinted(address sender, uint256 tokenId, uint256 themeId);
    event NFTBurned(address sender, uint256 tokenId);
}