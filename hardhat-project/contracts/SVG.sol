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

    uint256 private constant RECT_SIZE = 40;
    bytes private constant RECT = '<rect fill="%23        " x="  " y="  "/>';

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
        // Output length
        uint256 encodedLength = RECT_SIZE * IMAGE_WIDTH * IMAGE_HEIGHT;

        // Load the rect element into memory
        bytes memory rect = RECT;
        // Load hex chars into memory
        bytes memory hexChars = HEX_CHARS;

        // Allocate a new bytes variable
        encoded = new bytes(encodedLength);

        assembly {
            // rect ptr, jump over length
            let rectPtr := add(rect, 32)
            let hexCharsPtr := add(hexChars, 1)

            // encoded ptr, jump over length
            let encodedPtr := add(encoded, 32)
            let encodedEndPtr := add(encodedPtr, encodedLength)

            for {
                let i := 0
            } lt(encodedPtr, encodedEndPtr) {
                i := add(i, 1)
            } {
                // copy rect data (the first chunk of 32 bytes)
                mstore(encodedPtr, mload(rectPtr))
                // copy rect data (the remaining bytes)
                mstore(add(encodedPtr, 32), mload(add(rectPtr, 32)))

                // move to first color position
                encodedPtr := add(encodedPtr, 15)

                // red
                mstore8(encodedPtr, mload(add(hexCharsPtr, 1)))
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, mload(add(hexCharsPtr, 2)))
                encodedPtr := add(encodedPtr, 1)

                // green
                mstore8(encodedPtr, mload(add(hexCharsPtr, 3)))
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, mload(add(hexCharsPtr, 4)))
                encodedPtr := add(encodedPtr, 1)

                // blue
                mstore8(encodedPtr, mload(add(hexCharsPtr, 5)))
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, mload(add(hexCharsPtr, 6)))
                encodedPtr := add(encodedPtr, 1)

                // alpha
                mstore8(encodedPtr, mload(add(hexCharsPtr, 15)))
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, mload(add(hexCharsPtr, 15)))
                encodedPtr := add(encodedPtr, 6)

                // x
                let j := gt(mod(i, IMAGE_WIDTH), 9)
                if j {
                    mstore8(encodedPtr, 49)
                }
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, add(mod(mod(i, IMAGE_WIDTH), 10), 48))
                encodedPtr := add(encodedPtr, 6)

                // y
                j := gt(mod(i, IMAGE_HEIGHT), 9)
                if j {
                    mstore8(encodedPtr, 49)
                }
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, add(mod(div(i, IMAGE_WIDTH), 10), 48))
                // move to the end of the rect element
                encodedPtr := add(encodedPtr, 4)
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
