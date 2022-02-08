// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StunningPotato is
    ERC721,
    ERC721Enumerable,
    Pausable,
    Ownable,
    IERC2981
{
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

    // Default royalty percentage for authors
    uint8 private constant DEFAULT_ROYALTY_PERCENTAGE = 4;

    // Mapping from token ID to resources
    mapping(uint256 => Resource) private _resources;

    // Mapping from token ID to the original author
    mapping(uint256 => address) private _authors;

    constructor() ERC721("EthGA", "EGA") {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /**
     * Store a frame resource and mint a new token.
     */
    function createFrame(address author, bytes calldata data)
        public
        returns (uint256)
    {
        require(_isFrameDataValid(data), "Data must be valid");

        uint256 tokenId = uint256(keccak256(data));
        _safeMint(author, tokenId);

        _resources[tokenId] = Resource(ResourceType.Frame, data);
        _authors[tokenId] = author;

        return tokenId;
    }

    /**
     * Returns whether the frame data in input is valid.
     *
     * See the "Frame format specification" section in the project README for
     * more information about the frame data spec.
     */
    function _isFrameDataValid(bytes calldata data)
        private
        pure
        returns (bool)
    {
        // Any 140 bytes array can be interpreted as a frame
        return data.length == 140;
    }

    /**
     * Store a animation resource and mint a new token.
     */
    function createAnimation(address author, bytes calldata data)
        public
        returns (uint256)
    {
        uint256 tokenId = uint256(keccak256(data));
        _safeMint(author, tokenId);

        _resources[tokenId] = Resource(ResourceType.Animation, data);
        _authors[tokenId] = author;

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

    /**
     * @inheritdoc IERC2981
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        virtual
        override
        returns (address, uint256)
    {
        require(_exists(tokenId), "Royalty info for nonexistent token");

        uint256 royaltyAmount = (salePrice * DEFAULT_ROYALTY_PERCENTAGE) / 100;

        return (_authors[tokenId], royaltyAmount);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
