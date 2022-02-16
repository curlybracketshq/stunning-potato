// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "hardhat/console.sol";

/**
 * Functions for rendering frames and animations as SVG.
 */
library SVG {
    uint8 private constant IMAGE_WIDTH = 16;
    uint8 private constant IMAGE_HEIGHT = 16;
    uint8 private constant COLORS_NUMBER = 16;

    bytes private constant HEX_CHARS = "0123456789ABCDEF";

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
        Color[] memory colorTable = _encodeColorTable(data);
        for (uint256 y = 0; y < 16; y++) {
            encoded = abi.encodePacked(
                encoded,
                _encodeRect(colorTable[0], 1, 0, y),
                _encodeRect(colorTable[0], 1, 1, y),
                _encodeRect(colorTable[0], 1, 2, y),
                _encodeRect(colorTable[0], 1, 3, y),
                _encodeRect(colorTable[0], 1, 4, y),
                _encodeRect(colorTable[0], 1, 5, y),
                _encodeRect(colorTable[0], 1, 6, y),
                _encodeRect(colorTable[0], 1, 7, y),
                _encodeRect(colorTable[0], 1, 8, y),
                _encodeRect(colorTable[0], 1, 9, y),
                _encodeRect(colorTable[0], 1, 10, y),
                _encodeRect(colorTable[0], 1, 11, y),
                _encodeRect(colorTable[0], 1, 12, y),
                _encodeRect(colorTable[0], 1, 13, y),
                _encodeRect(colorTable[0], 1, 14, y),
                _encodeRect(colorTable[0], 1, 15, y)
            );
        }
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
        uint8 alpha,
        uint256 x,
        uint256 y
    ) internal pure returns (bytes memory rect) {
        rect = abi.encodePacked(
            "<rect fill=",
            _encodeCSSColor(color, alpha),
            ' x="',
            x,
            '" y="',
            y,
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

    function _encodeCSSColor(Color memory color, uint8 alpha)
        internal
        pure
        returns (bytes memory cssColor)
    {
        cssColor = abi.encodePacked(
            "rgba(",
            color.r,
            ",",
            color.g,
            ",",
            color.b,
            ",",
            alpha,
            ")"
        );
    }

    function _encodeHex(uint8 n) internal pure returns (bytes memory h) {
        h = abi.encodePacked(HEX_CHARS[n >> 4], HEX_CHARS[n & 0xf]);
    }
}
