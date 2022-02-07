//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract StunningPotato is ERC721 {
    // Enum representing resource types
    enum ResourceType {
        Frame,
        Animation
    }

    // A resource referenced by a token that can either be a frame or an
    // animation
    struct Resource {
        ResourceType resourceType;
        bytes data;
    }

    // Mapping from token ID to resources
    mapping(uint256 => Resource) private _resources;

    constructor() ERC721("EthGA", "EGA") {}

    function createFrame(address author, bytes calldata data)
        public
        returns (uint256)
    {
        uint256 tokenId = uint256(keccak256(data));
        _safeMint(author, tokenId);

        _resources[tokenId] = Resource(ResourceType.Frame, data);

        return tokenId;
    }

    /**
     * @dev Base URI for computing {tokenURI}. The resulting URI for each token
     * will be the concatenation of the `baseURI` and the `tokenId`.
     */
    function _baseURI() internal pure override returns (string memory) {
        return "https://ethga.xyz/t/";
    }

    /**
     * @dev Returns data associated to a token.
     */
    function tokenData(uint256 tokenId) public view returns (bytes memory) {
        require(_exists(tokenId), "Data query for nonexistent token");

        return _resources[tokenId].data;
    }
}
