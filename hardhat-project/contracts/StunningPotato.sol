// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SVG.sol";

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
    uint256 private constant DEFAULT_ROYALTY_PERCENTAGE = 4;

    /**
     * Frame data size in bytes
     *
     * - 1 byte: packed fields
     * - 12 bytes: color palette
     * - 128 bytes: bitmap
     *
     * See the "Frame format specification" section in the project README for
     * more information about the frame data spec.
     */
    uint256 private constant FRAME_DATA_SIZE = 141;

    /**
     * Animation data header size in bytes
     *
     * - 1 byte: packed fields
     * - 1 byte: loop count
     *
     * See the "Animation format specification" section in the project README
     * for more information about the animation data spec.
     */
    uint256 private constant APPLICATION_DATA_HEADER_SIZE = 2;

    /**
     * Price for creating a new frame
     */
    uint256 public constant PRICE_FRAME = 0.01 ether;

    /**
     * Price for creating a new animation
     */
    uint256 public constant PRICE_ANIMATION = 0.01 ether;

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
        payable
        returns (uint256 tokenId)
    {
        require(msg.value >= PRICE_FRAME, "Invalid amount");

        tokenId = _createFrame(author, data);

        // Send any excess ETH back to the caller
        uint256 excess = msg.value - PRICE_ANIMATION;
        if (excess > 0) {
            (bool success, ) = msg.sender.call{value: excess}("");
            require(success, "Return transaction failure");
        }
    }

    function _createFrame(address author, bytes calldata data)
        private
        returns (uint256 tokenId)
    {
        _validateFrameData(data);
        tokenId = _createResource(author, data, ResourceType.Frame);
    }

    /**
     * Any FRAME_DATA_SIZE bytes array can be interpreted as valid frame data.
     *
     * Frame data:
     *
     * - 1 byte: packed fields
     * - 12 bytes: color palette
     * - 128 bytes: bitmap
     *
     * See the "Frame format specification" section in the project README for
     * more information about the frame data spec.
     */
    function _validateFrameData(bytes calldata data) internal pure {
        require(data.length == FRAME_DATA_SIZE, "Data must be valid");
    }

    /**
     * Store a animation resource and mint a new token.
     */
    function createAnimation(address author, bytes calldata data)
        external
        payable
    {
        uint256 packedFields = uint8(data[0]);
        uint256 framesCount = (packedFields >> 4) + 1;
        uint256 newFramesCount = 0;
        _validateAnimationData(data, framesCount);

        for (uint256 i = 0; i < framesCount; i++) {
            uint256 offset = APPLICATION_DATA_HEADER_SIZE + i * FRAME_DATA_SIZE;
            bytes calldata frameData = data[offset:offset + FRAME_DATA_SIZE];
            // TODO: Use this value to build a list of frame references
            uint256 frameId = uint256(keccak256(frameData));
            if (!_exists(frameId)) {
                newFramesCount++;
                _createFrame(author, frameData);
            }
        }

        uint256 totalPrice = PRICE_ANIMATION + newFramesCount * PRICE_FRAME;
        require(msg.value >= totalPrice, "Invalid amount");

        // TODO: Store a list of frame references instead of raw frame data
        _createResource(author, data, ResourceType.Animation);

        // Send any excess ETH back to the caller
        uint256 excess = msg.value - totalPrice;
        if (excess > 0) {
            (bool success, ) = msg.sender.call{value: excess}("");
            require(success, "Return transaction failure");
        }
    }

    /**
     * Animation data is valid if:
     *
     * - the animation has at least one frame
     * - the number of frames corresponds with the data size
     *
     * Animation data:
     *
     * - 1 byte: packed fields
     * - 1 byte: loop count
     * - FRAME_DATA_SIZE bytes: 1st frame
     * - FRAME_DATA_SIZE bytes: 2nd frame
     * - ...
     * - FRAME_DATA_SIZE bytes: 16th frame
     *
     * See the "Animation format specification" section in the project README
     * for more information about the animation data spec.
     *
     * Requirements:
     *
     * - `framesCount` must be greater than 0 and less than or equal to 16.
     */
    function _validateAnimationData(bytes calldata data, uint256 framesCount)
        private
        pure
    {
        require(
            data.length ==
                APPLICATION_DATA_HEADER_SIZE + FRAME_DATA_SIZE * framesCount,
            "Frames count is invalid"
        );
    }

    /**
     * @dev Returns whether `tokenId` exists and is a frame resource.
     */
    function _isFrame(uint256 tokenId) internal view virtual returns (bool) {
        return
            _exists(tokenId) &&
            _resources[tokenId].resourceType == ResourceType.Frame;
    }

    /**
     * Creates a new resource of the specified type.
     *
     * Data must be validated by the caller.
     */
    function _createResource(
        address author,
        bytes calldata data,
        ResourceType resourceType
    ) private returns (uint256 tokenId) {
        tokenId = uint256(keccak256(data));
        _safeMint(author, tokenId);

        _resources[tokenId] = Resource(resourceType, data);
        _authors[tokenId] = author;
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
        returns (address author, uint256 royaltyAmount)
    {
        require(_exists(tokenId), "Royalty info for nonexistent token");

        author = _authors[tokenId];
        royaltyAmount = (salePrice * DEFAULT_ROYALTY_PERCENTAGE) / 100;
    }

    /**
     * Withdraw sale proceeds
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool success, ) = owner().call{value: address(this).balance}("");
            require(success, "Transaction failure");
        }
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        return _metadata(tokenId);
    }

    /**
     * Token metadata is a data URL that contains a JSON that conforms to the
     * ERC721 Metadata JSON Schema.
     *
     * See https://eips.ethereum.org/EIPS/eip-721
     * See https://datatracker.ietf.org/doc/html/rfc2397
     */
    function _metadata(uint256 tokenId)
        private
        view
        returns (string memory metadata)
    {
        require(_exists(tokenId), "Token doesn't exists");

        bytes memory imageData;
        if (_resources[tokenId].resourceType == ResourceType.Frame) {
            imageData = SVG.encodeFrame(_resources[tokenId].data);
        } else {
            imageData = SVG.encodeAnimation(_resources[tokenId].data);
        }

        metadata = string(
            abi.encodePacked(
                "data:application/json,%7B%22description%22%3A%22Very%20expensive%20pixel%20art%20animations.%22%2C%22image%22%3A%22data%3Aimage%2Fsvg%2Bxml%2C",
                imageData,
                "%22%7D"
            )
        );
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
