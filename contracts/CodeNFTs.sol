//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract CodeNFTs is ERC721URIStorage, Ownable, VRFConsumerBase {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    bytes32 internal keyHash;
    uint256 internal fee;


    mapping(uint256 => NFTAttributes) public nftAttributes;
    mapping(bytes32 => uint256) private requestToTokenId;
    mapping(bytes32 => address) private requestToSender;

    struct NFTAttributes {      
        uint themeId;
    }

    constructor(address _VRFCoordinator, address _LinkToken, bytes32 _keyhash)
    VRFConsumerBase(_VRFCoordinator, _LinkToken) 
    ERC721("CodeNFTs", "CODE")
    {
        _tokenIds.increment();
        keyHash = _keyhash;
        fee = 0.1 * 10 ** 18; // 0.1 LINK 
    }   
  

    function requestRandomTheme () public {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        bytes32 requestId = requestRandomness(keyHash, fee);
        requestToTokenId[requestId] = _tokenIds.current();
        requestToSender[requestId] = _msgSender();
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomNumber) internal override {
        uint256 itemId = requestToTokenId[requestId];
        uint256 themeId = (randomNumber % 10) + 1;

        nftAttributes[itemId] = NFTAttributes({
            themeId: themeId
        });

        _safeMint(requestToSender[requestId], itemId);
        _tokenIds.increment();

        emit NFTMinted(requestToSender[requestId], itemId, themeId);
    }

    function setTokenURI (uint256 tokenId, string memory tokenUri) public {
        require(
                _isApprovedOrOwner(_msgSender(), tokenId),
                "ERC721: transfer caller is not owner nor approved"
            );
        _setTokenURI(tokenId, tokenUri);
    }

    function burn (uint256 id) public {
        _burn(id);
        emit NFTBurned(_msgSender(), id);
    }

    event NFTMinted(address sender, uint256 tokenId, uint256 themeId);
    event NFTBurned(address sender, uint256 tokenId);
}