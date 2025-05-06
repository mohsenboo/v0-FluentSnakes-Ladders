// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FluentBlenderNFT is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    string private _baseTokenURI;
    
    // Maximum number of NFTs that can be minted per address
    uint256 public constant MAX_PER_ADDRESS = 5;
    
    // Mapping to track how many NFTs each address has minted
    mapping(address => uint256) private _mintedPerAddress;

    constructor() ERC721("Fluent Blender", "FBLEND") {
        _baseTokenURI = "https://fluent-blender-nft.vercel.app/api/metadata/";
    }
    
    function mint() external returns (uint256) {
        require(_mintedPerAddress[msg.sender] < MAX_PER_ADDRESS, "Max NFTs per address reached");
        
        _mintedPerAddress[msg.sender]++;
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        
        return tokenId;
    }
    
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    function mintedByAddress(address owner) external view returns (uint256) {
        return _mintedPerAddress[owner];
    }
}
