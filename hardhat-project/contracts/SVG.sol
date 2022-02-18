// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

/**
 * Functions for rendering frames and animations as SVG.
 */
library SVG {
    uint8 private constant IMAGE_WIDTH = 16;
    uint8 private constant IMAGE_HEIGHT = 16;
    uint8 private constant COLORS_NUMBER = 16;

    bytes private constant HEX_CHARS = "0123456789ABCDEF";
    bytes private constant RECTS =
        '<rect fill="rgba(   ,   ,   ,1)" x=" 0" y=" 0"/><rect fill="rgba(   ,   ,   ,1)" x=" 1" y=" 0"/><rect fill="rgba(   ,   ,   ,1)" x=" 2" y=" 0"/><rect fill="rgba(   ,   ,   ,1)" x=" 3" y=" 0"/><rect fill="rgba(   ,   ,   ,1)" x=" 4" y=" 0"/><rect fill="rgba(   ,   ,   ,1)" x=" 5" y=" 0"/><rect fill="rgba(   ,   ,   ,1)" x=" 6" y=" 0"/><rect fill="rgba(   ,   ,   ,1)" x=" 7" y=" 0"/><rect fill="rgba(   ,   ,   ,1)" x=" 8" y=" 0"/><rect fill="rgba(   ,   ,   ,1)" x=" 9" y=" 0"/><rect fill="rgba(   ,   ,   ,1)" x="10" y=" 0"/><rect fill="rgba(   ,   ,   ,1)" x="11" y=" 0"/><rect fill="rgba(   ,   ,   ,1)" x="12" y=" 0"/><rect fill="rgba(   ,   ,   ,1)" x="13" y=" 0"/><rect fill="rgba(   ,   ,   ,1)" x="14" y=" 0"/><rect fill="rgba(   ,   ,   ,1)" x="15" y=" 0"/><rect fill="rgba(   ,   ,   ,1)" x=" 0" y=" 1"/><rect fill="rgba(   ,   ,   ,1)" x=" 1" y=" 1"/><rect fill="rgba(   ,   ,   ,1)" x=" 2" y=" 1"/><rect fill="rgba(   ,   ,   ,1)" x=" 3" y=" 1"/><rect fill="rgba(   ,   ,   ,1)" x=" 4" y=" 1"/><rect fill="rgba(   ,   ,   ,1)" x=" 5" y=" 1"/><rect fill="rgba(   ,   ,   ,1)" x=" 6" y=" 1"/><rect fill="rgba(   ,   ,   ,1)" x=" 7" y=" 1"/><rect fill="rgba(   ,   ,   ,1)" x=" 8" y=" 1"/><rect fill="rgba(   ,   ,   ,1)" x=" 9" y=" 1"/><rect fill="rgba(   ,   ,   ,1)" x="10" y=" 1"/><rect fill="rgba(   ,   ,   ,1)" x="11" y=" 1"/><rect fill="rgba(   ,   ,   ,1)" x="12" y=" 1"/><rect fill="rgba(   ,   ,   ,1)" x="13" y=" 1"/><rect fill="rgba(   ,   ,   ,1)" x="14" y=" 1"/><rect fill="rgba(   ,   ,   ,1)" x="15" y=" 1"/><rect fill="rgba(   ,   ,   ,1)" x=" 0" y=" 2"/><rect fill="rgba(   ,   ,   ,1)" x=" 1" y=" 2"/><rect fill="rgba(   ,   ,   ,1)" x=" 2" y=" 2"/><rect fill="rgba(   ,   ,   ,1)" x=" 3" y=" 2"/><rect fill="rgba(   ,   ,   ,1)" x=" 4" y=" 2"/><rect fill="rgba(   ,   ,   ,1)" x=" 5" y=" 2"/><rect fill="rgba(   ,   ,   ,1)" x=" 6" y=" 2"/><rect fill="rgba(   ,   ,   ,1)" x=" 7" y=" 2"/><rect fill="rgba(   ,   ,   ,1)" x=" 8" y=" 2"/><rect fill="rgba(   ,   ,   ,1)" x=" 9" y=" 2"/><rect fill="rgba(   ,   ,   ,1)" x="10" y=" 2"/><rect fill="rgba(   ,   ,   ,1)" x="11" y=" 2"/><rect fill="rgba(   ,   ,   ,1)" x="12" y=" 2"/><rect fill="rgba(   ,   ,   ,1)" x="13" y=" 2"/><rect fill="rgba(   ,   ,   ,1)" x="14" y=" 2"/><rect fill="rgba(   ,   ,   ,1)" x="15" y=" 2"/><rect fill="rgba(   ,   ,   ,1)" x=" 0" y=" 3"/><rect fill="rgba(   ,   ,   ,1)" x=" 1" y=" 3"/><rect fill="rgba(   ,   ,   ,1)" x=" 2" y=" 3"/><rect fill="rgba(   ,   ,   ,1)" x=" 3" y=" 3"/><rect fill="rgba(   ,   ,   ,1)" x=" 4" y=" 3"/><rect fill="rgba(   ,   ,   ,1)" x=" 5" y=" 3"/><rect fill="rgba(   ,   ,   ,1)" x=" 6" y=" 3"/><rect fill="rgba(   ,   ,   ,1)" x=" 7" y=" 3"/><rect fill="rgba(   ,   ,   ,1)" x=" 8" y=" 3"/><rect fill="rgba(   ,   ,   ,1)" x=" 9" y=" 3"/><rect fill="rgba(   ,   ,   ,1)" x="10" y=" 3"/><rect fill="rgba(   ,   ,   ,1)" x="11" y=" 3"/><rect fill="rgba(   ,   ,   ,1)" x="12" y=" 3"/><rect fill="rgba(   ,   ,   ,1)" x="13" y=" 3"/><rect fill="rgba(   ,   ,   ,1)" x="14" y=" 3"/><rect fill="rgba(   ,   ,   ,1)" x="15" y=" 3"/><rect fill="rgba(   ,   ,   ,1)" x=" 0" y=" 4"/><rect fill="rgba(   ,   ,   ,1)" x=" 1" y=" 4"/><rect fill="rgba(   ,   ,   ,1)" x=" 2" y=" 4"/><rect fill="rgba(   ,   ,   ,1)" x=" 3" y=" 4"/><rect fill="rgba(   ,   ,   ,1)" x=" 4" y=" 4"/><rect fill="rgba(   ,   ,   ,1)" x=" 5" y=" 4"/><rect fill="rgba(   ,   ,   ,1)" x=" 6" y=" 4"/><rect fill="rgba(   ,   ,   ,1)" x=" 7" y=" 4"/><rect fill="rgba(   ,   ,   ,1)" x=" 8" y=" 4"/><rect fill="rgba(   ,   ,   ,1)" x=" 9" y=" 4"/><rect fill="rgba(   ,   ,   ,1)" x="10" y=" 4"/><rect fill="rgba(   ,   ,   ,1)" x="11" y=" 4"/><rect fill="rgba(   ,   ,   ,1)" x="12" y=" 4"/><rect fill="rgba(   ,   ,   ,1)" x="13" y=" 4"/><rect fill="rgba(   ,   ,   ,1)" x="14" y=" 4"/><rect fill="rgba(   ,   ,   ,1)" x="15" y=" 4"/><rect fill="rgba(   ,   ,   ,1)" x=" 0" y=" 5"/><rect fill="rgba(   ,   ,   ,1)" x=" 1" y=" 5"/><rect fill="rgba(   ,   ,   ,1)" x=" 2" y=" 5"/><rect fill="rgba(   ,   ,   ,1)" x=" 3" y=" 5"/><rect fill="rgba(   ,   ,   ,1)" x=" 4" y=" 5"/><rect fill="rgba(   ,   ,   ,1)" x=" 5" y=" 5"/><rect fill="rgba(   ,   ,   ,1)" x=" 6" y=" 5"/><rect fill="rgba(   ,   ,   ,1)" x=" 7" y=" 5"/><rect fill="rgba(   ,   ,   ,1)" x=" 8" y=" 5"/><rect fill="rgba(   ,   ,   ,1)" x=" 9" y=" 5"/><rect fill="rgba(   ,   ,   ,1)" x="10" y=" 5"/><rect fill="rgba(   ,   ,   ,1)" x="11" y=" 5"/><rect fill="rgba(   ,   ,   ,1)" x="12" y=" 5"/><rect fill="rgba(   ,   ,   ,1)" x="13" y=" 5"/><rect fill="rgba(   ,   ,   ,1)" x="14" y=" 5"/><rect fill="rgba(   ,   ,   ,1)" x="15" y=" 5"/><rect fill="rgba(   ,   ,   ,1)" x=" 0" y=" 6"/><rect fill="rgba(   ,   ,   ,1)" x=" 1" y=" 6"/><rect fill="rgba(   ,   ,   ,1)" x=" 2" y=" 6"/><rect fill="rgba(   ,   ,   ,1)" x=" 3" y=" 6"/><rect fill="rgba(   ,   ,   ,1)" x=" 4" y=" 6"/><rect fill="rgba(   ,   ,   ,1)" x=" 5" y=" 6"/><rect fill="rgba(   ,   ,   ,1)" x=" 6" y=" 6"/><rect fill="rgba(   ,   ,   ,1)" x=" 7" y=" 6"/><rect fill="rgba(   ,   ,   ,1)" x=" 8" y=" 6"/><rect fill="rgba(   ,   ,   ,1)" x=" 9" y=" 6"/><rect fill="rgba(   ,   ,   ,1)" x="10" y=" 6"/><rect fill="rgba(   ,   ,   ,1)" x="11" y=" 6"/><rect fill="rgba(   ,   ,   ,1)" x="12" y=" 6"/><rect fill="rgba(   ,   ,   ,1)" x="13" y=" 6"/><rect fill="rgba(   ,   ,   ,1)" x="14" y=" 6"/><rect fill="rgba(   ,   ,   ,1)" x="15" y=" 6"/><rect fill="rgba(   ,   ,   ,1)" x=" 0" y=" 7"/><rect fill="rgba(   ,   ,   ,1)" x=" 1" y=" 7"/><rect fill="rgba(   ,   ,   ,1)" x=" 2" y=" 7"/><rect fill="rgba(   ,   ,   ,1)" x=" 3" y=" 7"/><rect fill="rgba(   ,   ,   ,1)" x=" 4" y=" 7"/><rect fill="rgba(   ,   ,   ,1)" x=" 5" y=" 7"/><rect fill="rgba(   ,   ,   ,1)" x=" 6" y=" 7"/><rect fill="rgba(   ,   ,   ,1)" x=" 7" y=" 7"/><rect fill="rgba(   ,   ,   ,1)" x=" 8" y=" 7"/><rect fill="rgba(   ,   ,   ,1)" x=" 9" y=" 7"/><rect fill="rgba(   ,   ,   ,1)" x="10" y=" 7"/><rect fill="rgba(   ,   ,   ,1)" x="11" y=" 7"/><rect fill="rgba(   ,   ,   ,1)" x="12" y=" 7"/><rect fill="rgba(   ,   ,   ,1)" x="13" y=" 7"/><rect fill="rgba(   ,   ,   ,1)" x="14" y=" 7"/><rect fill="rgba(   ,   ,   ,1)" x="15" y=" 7"/><rect fill="rgba(   ,   ,   ,1)" x=" 0" y=" 8"/><rect fill="rgba(   ,   ,   ,1)" x=" 1" y=" 8"/><rect fill="rgba(   ,   ,   ,1)" x=" 2" y=" 8"/><rect fill="rgba(   ,   ,   ,1)" x=" 3" y=" 8"/><rect fill="rgba(   ,   ,   ,1)" x=" 4" y=" 8"/><rect fill="rgba(   ,   ,   ,1)" x=" 5" y=" 8"/><rect fill="rgba(   ,   ,   ,1)" x=" 6" y=" 8"/><rect fill="rgba(   ,   ,   ,1)" x=" 7" y=" 8"/><rect fill="rgba(   ,   ,   ,1)" x=" 8" y=" 8"/><rect fill="rgba(   ,   ,   ,1)" x=" 9" y=" 8"/><rect fill="rgba(   ,   ,   ,1)" x="10" y=" 8"/><rect fill="rgba(   ,   ,   ,1)" x="11" y=" 8"/><rect fill="rgba(   ,   ,   ,1)" x="12" y=" 8"/><rect fill="rgba(   ,   ,   ,1)" x="13" y=" 8"/><rect fill="rgba(   ,   ,   ,1)" x="14" y=" 8"/><rect fill="rgba(   ,   ,   ,1)" x="15" y=" 8"/><rect fill="rgba(   ,   ,   ,1)" x=" 0" y=" 9"/><rect fill="rgba(   ,   ,   ,1)" x=" 1" y=" 9"/><rect fill="rgba(   ,   ,   ,1)" x=" 2" y=" 9"/><rect fill="rgba(   ,   ,   ,1)" x=" 3" y=" 9"/><rect fill="rgba(   ,   ,   ,1)" x=" 4" y=" 9"/><rect fill="rgba(   ,   ,   ,1)" x=" 5" y=" 9"/><rect fill="rgba(   ,   ,   ,1)" x=" 6" y=" 9"/><rect fill="rgba(   ,   ,   ,1)" x=" 7" y=" 9"/><rect fill="rgba(   ,   ,   ,1)" x=" 8" y=" 9"/><rect fill="rgba(   ,   ,   ,1)" x=" 9" y=" 9"/><rect fill="rgba(   ,   ,   ,1)" x="10" y=" 9"/><rect fill="rgba(   ,   ,   ,1)" x="11" y=" 9"/><rect fill="rgba(   ,   ,   ,1)" x="12" y=" 9"/><rect fill="rgba(   ,   ,   ,1)" x="13" y=" 9"/><rect fill="rgba(   ,   ,   ,1)" x="14" y=" 9"/><rect fill="rgba(   ,   ,   ,1)" x="15" y=" 9"/><rect fill="rgba(   ,   ,   ,1)" x=" 0" y="10"/><rect fill="rgba(   ,   ,   ,1)" x=" 1" y="10"/><rect fill="rgba(   ,   ,   ,1)" x=" 2" y="10"/><rect fill="rgba(   ,   ,   ,1)" x=" 3" y="10"/><rect fill="rgba(   ,   ,   ,1)" x=" 4" y="10"/><rect fill="rgba(   ,   ,   ,1)" x=" 5" y="10"/><rect fill="rgba(   ,   ,   ,1)" x=" 6" y="10"/><rect fill="rgba(   ,   ,   ,1)" x=" 7" y="10"/><rect fill="rgba(   ,   ,   ,1)" x=" 8" y="10"/><rect fill="rgba(   ,   ,   ,1)" x=" 9" y="10"/><rect fill="rgba(   ,   ,   ,1)" x="10" y="10"/><rect fill="rgba(   ,   ,   ,1)" x="11" y="10"/><rect fill="rgba(   ,   ,   ,1)" x="12" y="10"/><rect fill="rgba(   ,   ,   ,1)" x="13" y="10"/><rect fill="rgba(   ,   ,   ,1)" x="14" y="10"/><rect fill="rgba(   ,   ,   ,1)" x="15" y="10"/><rect fill="rgba(   ,   ,   ,1)" x=" 0" y="11"/><rect fill="rgba(   ,   ,   ,1)" x=" 1" y="11"/><rect fill="rgba(   ,   ,   ,1)" x=" 2" y="11"/><rect fill="rgba(   ,   ,   ,1)" x=" 3" y="11"/><rect fill="rgba(   ,   ,   ,1)" x=" 4" y="11"/><rect fill="rgba(   ,   ,   ,1)" x=" 5" y="11"/><rect fill="rgba(   ,   ,   ,1)" x=" 6" y="11"/><rect fill="rgba(   ,   ,   ,1)" x=" 7" y="11"/><rect fill="rgba(   ,   ,   ,1)" x=" 8" y="11"/><rect fill="rgba(   ,   ,   ,1)" x=" 9" y="11"/><rect fill="rgba(   ,   ,   ,1)" x="10" y="11"/><rect fill="rgba(   ,   ,   ,1)" x="11" y="11"/><rect fill="rgba(   ,   ,   ,1)" x="12" y="11"/><rect fill="rgba(   ,   ,   ,1)" x="13" y="11"/><rect fill="rgba(   ,   ,   ,1)" x="14" y="11"/><rect fill="rgba(   ,   ,   ,1)" x="15" y="11"/><rect fill="rgba(   ,   ,   ,1)" x=" 0" y="12"/><rect fill="rgba(   ,   ,   ,1)" x=" 1" y="12"/><rect fill="rgba(   ,   ,   ,1)" x=" 2" y="12"/><rect fill="rgba(   ,   ,   ,1)" x=" 3" y="12"/><rect fill="rgba(   ,   ,   ,1)" x=" 4" y="12"/><rect fill="rgba(   ,   ,   ,1)" x=" 5" y="12"/><rect fill="rgba(   ,   ,   ,1)" x=" 6" y="12"/><rect fill="rgba(   ,   ,   ,1)" x=" 7" y="12"/><rect fill="rgba(   ,   ,   ,1)" x=" 8" y="12"/><rect fill="rgba(   ,   ,   ,1)" x=" 9" y="12"/><rect fill="rgba(   ,   ,   ,1)" x="10" y="12"/><rect fill="rgba(   ,   ,   ,1)" x="11" y="12"/><rect fill="rgba(   ,   ,   ,1)" x="12" y="12"/><rect fill="rgba(   ,   ,   ,1)" x="13" y="12"/><rect fill="rgba(   ,   ,   ,1)" x="14" y="12"/><rect fill="rgba(   ,   ,   ,1)" x="15" y="12"/><rect fill="rgba(   ,   ,   ,1)" x=" 0" y="13"/><rect fill="rgba(   ,   ,   ,1)" x=" 1" y="13"/><rect fill="rgba(   ,   ,   ,1)" x=" 2" y="13"/><rect fill="rgba(   ,   ,   ,1)" x=" 3" y="13"/><rect fill="rgba(   ,   ,   ,1)" x=" 4" y="13"/><rect fill="rgba(   ,   ,   ,1)" x=" 5" y="13"/><rect fill="rgba(   ,   ,   ,1)" x=" 6" y="13"/><rect fill="rgba(   ,   ,   ,1)" x=" 7" y="13"/><rect fill="rgba(   ,   ,   ,1)" x=" 8" y="13"/><rect fill="rgba(   ,   ,   ,1)" x=" 9" y="13"/><rect fill="rgba(   ,   ,   ,1)" x="10" y="13"/><rect fill="rgba(   ,   ,   ,1)" x="11" y="13"/><rect fill="rgba(   ,   ,   ,1)" x="12" y="13"/><rect fill="rgba(   ,   ,   ,1)" x="13" y="13"/><rect fill="rgba(   ,   ,   ,1)" x="14" y="13"/><rect fill="rgba(   ,   ,   ,1)" x="15" y="13"/><rect fill="rgba(   ,   ,   ,1)" x=" 0" y="14"/><rect fill="rgba(   ,   ,   ,1)" x=" 1" y="14"/><rect fill="rgba(   ,   ,   ,1)" x=" 2" y="14"/><rect fill="rgba(   ,   ,   ,1)" x=" 3" y="14"/><rect fill="rgba(   ,   ,   ,1)" x=" 4" y="14"/><rect fill="rgba(   ,   ,   ,1)" x=" 5" y="14"/><rect fill="rgba(   ,   ,   ,1)" x=" 6" y="14"/><rect fill="rgba(   ,   ,   ,1)" x=" 7" y="14"/><rect fill="rgba(   ,   ,   ,1)" x=" 8" y="14"/><rect fill="rgba(   ,   ,   ,1)" x=" 9" y="14"/><rect fill="rgba(   ,   ,   ,1)" x="10" y="14"/><rect fill="rgba(   ,   ,   ,1)" x="11" y="14"/><rect fill="rgba(   ,   ,   ,1)" x="12" y="14"/><rect fill="rgba(   ,   ,   ,1)" x="13" y="14"/><rect fill="rgba(   ,   ,   ,1)" x="14" y="14"/><rect fill="rgba(   ,   ,   ,1)" x="15" y="14"/><rect fill="rgba(   ,   ,   ,1)" x=" 0" y="15"/><rect fill="rgba(   ,   ,   ,1)" x=" 1" y="15"/><rect fill="rgba(   ,   ,   ,1)" x=" 2" y="15"/><rect fill="rgba(   ,   ,   ,1)" x=" 3" y="15"/><rect fill="rgba(   ,   ,   ,1)" x=" 4" y="15"/><rect fill="rgba(   ,   ,   ,1)" x=" 5" y="15"/><rect fill="rgba(   ,   ,   ,1)" x=" 6" y="15"/><rect fill="rgba(   ,   ,   ,1)" x=" 7" y="15"/><rect fill="rgba(   ,   ,   ,1)" x=" 8" y="15"/><rect fill="rgba(   ,   ,   ,1)" x=" 9" y="15"/><rect fill="rgba(   ,   ,   ,1)" x="10" y="15"/><rect fill="rgba(   ,   ,   ,1)" x="11" y="15"/><rect fill="rgba(   ,   ,   ,1)" x="12" y="15"/><rect fill="rgba(   ,   ,   ,1)" x="13" y="15"/><rect fill="rgba(   ,   ,   ,1)" x="14" y="15"/><rect fill="rgba(   ,   ,   ,1)" x="15" y="15"/>';

    struct Color {
        uint8 r;
        uint8 g;
        uint8 b;
    }

    function encodeFrame(bytes memory data)
        internal
        view
        returns (bytes memory encoded)
    {
        encoded = RECTS;
        assembly {
            // encoded ptr, jump over length
            let encodedPtr := add(encoded, 32)
            // let encodedEndPtr := add(12288, 32)
            let encodedEndPtr := add(encodedPtr, mload(encoded))

            for {

            } lt(encodedPtr, encodedEndPtr) {

            } {
                // move to first color position
                encodedPtr := add(encodedPtr, 17)

                // red
                mstore8(encodedPtr, 49)
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, 50)
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, 51)
                encodedPtr := add(encodedPtr, 2)

                // green
                mstore8(encodedPtr, 49)
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, 50)
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, 51)
                encodedPtr := add(encodedPtr, 2)

                // blue
                mstore8(encodedPtr, 49)
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, 50)
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, 51)

                // move to the end of the rect element
                encodedPtr := add(encodedPtr, 21)
            }
        }
        // Color[] memory colorTable = _encodeColorTable(data);
        // for (uint256 y = 0; y < IMAGE_HEIGHT; y++) {
        //     for (uint256 x = 0; x < IMAGE_WIDTH; x++) {
        //         encoded = abi.encodePacked(
        //             encoded,
        //             // _encodeRect(colorTable[0], 1, x, y)
        //             '<rect fill="rgba(',
        //             Strings.toString(colorTable[0].r),
        //             ",",
        //             Strings.toString(colorTable[0].g),
        //             ",",
        //             Strings.toString(colorTable[0].b),
        //             ",",
        //             Strings.toString(1),
        //             ')" x="',
        //             Strings.toString(x),
        //             '" y="',
        //             Strings.toString(y),
        //             '"/>'
        //         );
        //     }
        // }
    }

    function encodeAnimation(bytes memory data)
        internal
        pure
        returns (bytes memory encoded)
    {
        // TODO
        encoded = abi.encodePacked("");
    }

    function _encodeRect(
        Color memory color,
        uint256 alpha,
        uint256 x,
        uint256 y
    ) internal pure returns (bytes memory rect) {
        rect = abi.encodePacked(
            '<rect fill="',
            _encodeCSSColor(color, alpha),
            '" x="',
            Strings.toString(x),
            '" y="',
            Strings.toString(y),
            '"/>'
        );
    }

    function _encodeColorTable(bytes memory data)
        internal
        view
        returns (Color[] memory colorTable)
    {
        colorTable = new Color[](COLORS_NUMBER);
        for (uint256 i = 0; i < 4; i++) {
            uint256 offset = 1 + i * 3;
            console.log(offset);
            bytes3 quadruplet = (data[offset + 2] << 16) |
                (data[offset + 1] << 8) |
                (data[offset]);
            console.logBytes3(quadruplet);
            colorTable[i * 4] = _encode24BitColor(
                bytes1(quadruplet >> 18) & 0x3f
            );
            colorTable[i * 4 + 1] = _encode24BitColor(
                bytes1(quadruplet >> 12) & 0x3f
            );
            colorTable[i * 4 + 2] = _encode24BitColor(
                bytes1(quadruplet >> 6) & 0x3f
            );
            colorTable[i * 4 + 3] = _encode24BitColor(
                bytes1(quadruplet) & 0x3f
            );
        }
    }

    function _encode24BitColor(bytes1 color6Bit)
        internal
        view
        returns (Color memory color)
    {
        uint8 colNum = uint8(color6Bit);

        uint8 lowR = colNum & 0x20;
        uint8 lowG = colNum & 0x10;
        uint8 lowB = colNum & 0x8;
        uint8 hiR = colNum & 0x4;
        uint8 hiG = colNum & 0x2;
        uint8 hiB = colNum & 0x1;

        uint8 r = 0x55 * lowR + 0xaa * hiR;
        uint8 g = 0x55 * lowG + 0xaa * hiG;
        uint8 b = 0x55 * lowB + 0xaa * hiB;

        color = Color(r, g, b);
    }

    function _encodeCSSColor(Color memory color, uint256 alpha)
        internal
        pure
        returns (bytes memory cssColor)
    {
        cssColor = abi.encodePacked(
            "rgba(",
            Strings.toString(color.r),
            ",",
            Strings.toString(color.g),
            ",",
            Strings.toString(color.b),
            ",",
            Strings.toString(alpha),
            ")"
        );
    }

    function _encodeHex(uint8 n) internal pure returns (bytes memory h) {
        h = abi.encodePacked(HEX_CHARS[n >> 4], HEX_CHARS[n & 0xf]);
    }
}
