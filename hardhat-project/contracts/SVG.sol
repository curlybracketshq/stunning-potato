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

    uint256 private constant RECT_SIZE = 115;
    // Double URL encoded because it will be part of the image data URI that is
    // embedded in the metadata URL encoded data URI
    bytes private constant RECT =
        "%253Crect%2520fill%253D'%2523        '%2520x%253D'  '%2520y%253D'  '%2520width%253D'1'%2520height%253D'1'%252F%253E";

    function encodeFrame(bytes memory data)
        internal
        pure
        returns (bytes memory encoded)
    {
        // Double URL encoded because it will be part of the image data URI that
        // is embedded in the metadata URL encoded data URI
        encoded = abi.encodePacked(
            "%253Csvg%2520version%253D'1.1'%2520width%253D'16'%2520height%253D'16'%2520xmlns%253D'http%253A%252F%252Fwww.w3.org%252F2000%252Fsvg'%253E",
            _encodeBitmap(data),
            "%253C%252Fsvg%253E"
        );
    }

    function encodeAnimation(bytes memory data)
        internal
        pure
        returns (bytes memory encoded)
    {
        // TODO
        encoded = abi.encodePacked("");
    }

    function _encodeBitmap(bytes memory data)
        internal
        pure
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

        bytes memory colorTable = _encodeColorTable(data);

        assembly {
            // Rect ptr, jump over length
            let rectPtr := add(rect, 32)
            let hexCharsPtr := add(hexChars, 1)

            // Encoded ptr, jump over length
            let encodedPtr := add(encoded, 32)
            let encodedEndPtr := add(encodedPtr, encodedLength)

            // Color table ptr, jump over length
            let colorTablePtr := add(colorTable, 1)

            // Data ptr
            // Jump over length (1) + packed fields (1) + color table (12)
            let dataPtr := add(data, 14)

            function byteToHex(b, hexTable) -> h, l {
                h := mload(add(hexTable, shr(4, and(b, 0xf0))))
                l := mload(add(hexTable, and(b, 0xf)))
            }

            /**
             * Same as: let h, _ := byteToHex(b, hexTable)
             */
            function byteToHexH(b, hexTable) -> h {
                h := mload(add(hexTable, shr(4, and(b, 0xf0))))
            }

            /**
             * Same as: let _, l := byteToHex(b, hexTable)
             */
            function byteToHexL(b, hexTable) -> l {
                l := mload(add(hexTable, and(b, 0xf)))
            }

            // DEBUG DATA CONTENT
            // for {
            //     let i := 0
            // } lt(i, 256) {
            //     i := add(i, 1)
            // } {
            //     let p := i
            //     let word := mload(add(dataPtr, p))
            //     let h, l := byteToHex(word, hexCharsPtr)
            //     mstore8(encodedPtr, h)
            //     encodedPtr := add(encodedPtr, 1)
            //     mstore8(encodedPtr, l)
            //     encodedPtr := add(encodedPtr, 1)
            // }

            for {
                let i := 0
            } lt(encodedPtr, encodedEndPtr) {
                i := add(i, 1)
            } {
                // Copy rect data (the first chunk of 32 bytes)
                mstore(encodedPtr, mload(rectPtr))
                // Copy rect data (the second chunk of 32 bytes)
                mstore(add(encodedPtr, 32), mload(add(rectPtr, 32)))
                // Copy rect data (the third chunk of 32 bytes)
                mstore(add(encodedPtr, 64), mload(add(rectPtr, 64)))
                // Copy rect data (the remaining bytes)
                mstore(add(encodedPtr, 96), mload(add(rectPtr, 96)))

                // Move to first color position
                encodedPtr := add(encodedPtr, 29)

                // Get the color index (4 bits)
                let couple := mload(add(dataPtr, div(i, 2)))
                let mask := shr(mul(mod(i, 2), 4), 0xf0)
                let colorIndex := shr(
                    mul(mod(add(i, 1), 2), 4),
                    and(couple, mask)
                )

                // Red
                let r := mload(add(colorTablePtr, mul(colorIndex, 3)))
                mstore8(encodedPtr, byteToHexH(r, hexCharsPtr))
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, byteToHexL(r, hexCharsPtr))
                encodedPtr := add(encodedPtr, 1)

                // Green
                let g := mload(add(colorTablePtr, add(mul(colorIndex, 3), 1)))
                mstore8(encodedPtr, byteToHexH(g, hexCharsPtr))
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, byteToHexL(g, hexCharsPtr))
                encodedPtr := add(encodedPtr, 1)

                // Blue
                let b := mload(add(colorTablePtr, add(mul(colorIndex, 3), 2)))
                mstore8(encodedPtr, byteToHexH(b, hexCharsPtr))
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, byteToHexL(b, hexCharsPtr))
                encodedPtr := add(encodedPtr, 1)

                // Alpha
                mstore8(encodedPtr, mload(add(hexCharsPtr, 15)))
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, mload(add(hexCharsPtr, 15)))
                // Move to the beginning of the x coordinate
                encodedPtr := add(encodedPtr, 14)

                // Coord: x
                let j := gt(mod(i, IMAGE_WIDTH), 9)
                if j {
                    mstore8(encodedPtr, 49)
                }
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, add(mod(mod(i, IMAGE_WIDTH), 10), 48))
                // Move to the beginning of the y coordinate
                encodedPtr := add(encodedPtr, 14)

                // Coord: y
                j := gt(div(i, IMAGE_HEIGHT), 9)
                if j {
                    mstore8(encodedPtr, 49)
                }
                encodedPtr := add(encodedPtr, 1)
                mstore8(encodedPtr, add(mod(div(i, IMAGE_WIDTH), 10), 48))
                // Move to the end of the rect element
                encodedPtr := add(encodedPtr, 49)
            }
        }
    }

    function _encodeColorTable(bytes memory data)
        internal
        pure
        returns (bytes memory colorTable)
    {
        // CSS colors in the 24-bit color space
        colorTable = new bytes(COLORS_NUMBER * 3);
        for (uint256 i = 0; i < 4; i++) {
            // Skip the first byte that contains packed fields
            uint256 offset = 1 + i * 3;
            bytes3 colorsGroup = bytes3(data[offset]) |
                (bytes3(data[offset + 1]) >> 8) |
                (bytes3(data[offset + 2]) >> 16);

            // Extract each color in the 4 colors pack
            //
            // These are the colors position in the group of three bytes:
            //
            // 1. colorsGroup >> 18 & 0x3f
            // 2. colorsGroup >> 12 & 0x3f
            // 3. colorsGroup >> 6 & 0x3f
            // 4. colorsGroup & 0x3f
            for (uint256 j = 0; j < 4; j++) {
                // jth color in the 4 colors pack
                bytes3 color = _encode24BitColor(
                    bytes1((colorsGroup >> (6 * (3 - j))) << 16) & 0x3f
                );
                uint256 colorIndex = (i * 4 + j) * 3;
                // Red
                colorTable[colorIndex] = color[0];
                // Green
                colorTable[colorIndex + 1] = color[1];
                // Blue
                colorTable[colorIndex + 2] = color[2];
            }
        }
    }

    function _encode24BitColor(bytes1 color6Bit)
        internal
        pure
        returns (bytes3 color)
    {
        uint8 colNum = uint8(color6Bit);

        uint8 lowR = (colNum & 0x20) >> 5;
        uint8 lowG = (colNum & 0x10) >> 4;
        uint8 lowB = (colNum & 0x8) >> 3;
        uint8 hiR = (colNum & 0x4) >> 2;
        uint8 hiG = (colNum & 0x2) >> 1;
        uint8 hiB = colNum & 0x1;

        bytes1 r = bytes1(0x55 * lowR + 0xaa * hiR);
        bytes1 g = bytes1(0x55 * lowG + 0xaa * hiG);
        bytes1 b = bytes1(0x55 * lowB + 0xaa * hiB);

        color = bytes3(r) | (bytes3(g) >> 8) | (bytes3(b) >> 16);
    }
}
