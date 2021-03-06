// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * Functions for rendering frames and animations as SVG.
 */
library SVG {
    uint8 private constant IMAGE_WIDTH = 16;
    uint8 private constant IMAGE_HEIGHT = 16;
    uint8 private constant COLORS_NUMBER = 16;

    bytes private constant HEX_CHARS = "0123456789ABCDEF";

    bytes private constant SVG_HEADER =
        "%253Csvg%2520version%253D'1.1'%2520width%253D'16'%2520height%253D'16'%2520xmlns%253D'http%253A%252F%252Fwww.w3.org%252F2000%252Fsvg'%253E%253Cstyle%253Erect%2520%257Bwidth%253A1px%253Bheight%253A1px%253B%257D%253C%252Fstyle%253E";

    uint256 private constant RECT_SIZE = 78;
    // Double URL encoded because it will be part of the image data URI that is
    // embedded in the metadata URL encoded data URI
    bytes private constant RECT =
        "%253Crect%2520fill%253D'%2523        '%2520x%253D'  '%2520y%253D'  '%252F%253E";

    function encodeFrame(bytes memory data)
        internal
        pure
        returns (bytes memory encoded)
    {
        // Double URL encoded because it will be part of the image data URI that
        // is embedded in the metadata URL encoded data URI
        encoded = abi.encodePacked(
            SVG_HEADER,
            _encodeBitmap(data, 0),
            "%253C%252Fsvg%253E"
        );
    }

    function encodeAnimation(bytes memory data)
        internal
        pure
        returns (bytes memory encoded)
    {
        // Bits 1 to 4 in the packed fields is the number of frames minus one
        uint8 framesCount = ((uint8(data[0]) & 0xf0) >> 4) + 1;

        // Bit 5 in the packed fields is the animation loop style
        // 0: loop
        // 1: ping pong
        bool isPingPongLoopStyle = uint8(data[0]) & 0x8 == 0x8;

        // Bits 6 to 7 in the packed fields is the animation frame rate
        // 0: 10 fps
        // 1: 25 fps
        // 2: 50 fps
        // 3: 100 fps
        uint8 frameRateClass = (uint8(data[0]) & 0x6) >> 1;
        bytes memory frameDurationMs;
        if (frameRateClass == 0) {
            frameDurationMs = "100";
        } else if (frameRateClass == 1) {
            frameDurationMs = "40";
        } else if (frameRateClass == 2) {
            frameDurationMs = "20";
        } else if (frameRateClass == 3) {
            frameDurationMs = "10";
        }

        // Loop count
        uint8 loopCount = uint8(data[1]);
        string memory repeatCount;
        if (loopCount == 0) {
            repeatCount = "indefinite";
        } else {
            repeatCount = Strings.toString(loopCount);
        }

        // Define each frame
        bytes memory defs = _encodeAnimationFrames(framesCount, data);

        // Refs start always at the first frame that is required to be present
        bytes memory frameRefs = "%2523f0";
        for (uint256 f = 1; f < framesCount;) {
            frameRefs = abi.encodePacked(
                frameRefs,
                "%253B%2523f",
                HEX_CHARS[f]
            );
            unchecked {
              f++;
            }
        }

        // If the loop style is ping-pong, add all the frames in reverse order
        //
        // Note: SVG doesn't support this animation style yet, see
        // https://github.com/w3c/svgwg/issues/130
        if (isPingPongLoopStyle) {
            for (uint256 f = framesCount - 2; f >= 0;) {
                frameRefs = abi.encodePacked(
                    frameRefs,
                    "%253B%2523f",
                    HEX_CHARS[f]
                );
                unchecked {
                  f--;
                }
            }
        }

        encoded = abi.encodePacked(
            SVG_HEADER,
            "%253Cdefs%253E",
            defs,
            "%253C%252Fdefs%253E%253Cuse%2520href%253D'%2523f0'%253E%253Canimate%2520attributeName%253D'href'%2520values%253D'",
            frameRefs,
            "'%2520dur%253D'",
            frameDurationMs,
            "ms'%2520repeatCount%253D'",
            repeatCount,
            "'%252F%253E%253C%252Fuse%253E%253C%252Fsvg%253E"
        );
    }

    function _encodeBitmap(bytes memory data, uint256 dataOffset)
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

        bytes memory colorTable = _encodeColorTable(data, dataOffset);

        // Jump over packed fields (1) + color table (12)
        dataOffset += 13;

        assembly {
            // Rect ptr, jump over length
            let rectPtr := add(rect, 32)
            let hexCharsPtr := add(hexChars, 1)

            // Encoded ptr, jump over length
            let encodedPtr := add(encoded, 32)
            let encodedEndPtr := add(encodedPtr, encodedLength)

            // Color table ptr, jump over length
            let colorTablePtr := add(colorTable, 1)

            // Data ptr, jump over length
            let dataPtr := add(add(data, dataOffset), 1)

            /**
             * Returns two bytes that represent the input byte `b` encoded as a
             * hexadecimal string.
             *
             * `hexTable` is the pointer to the hexadecimal chars table (0-F).
             *
             * Examples:
             *
             * - `byteToHex(255, hexCharsPtr)` -> h = 'F', l = 'F'
             * - `byteToHex(128, hexCharsPtr)` -> h = '8', l = '0'
             * - `byteToHex(15,  hexCharsPtr)` -> h = '0', l = 'F'
             */
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

            /*
             * DUMP MEMORY CONTENT
             *
             * Use this piece of code for dump the content of a variable in the
             * output bytes string in hex format for debugging purpose.
             */
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
                // Copy rect data (the remaining bytes)
                mstore(add(encodedPtr, 64), mload(add(rectPtr, 64)))

                // Move to first color position
                encodedPtr := add(encodedPtr, 29)

                // Get the color index (4 bits)
                let couple := mload(add(dataPtr, div(i, 2)))
                let mask := shr(mul(mod(i, 2), 4), 0xf0)
                let colorIndex := shr(
                    mul(mod(add(i, 1), 2), 4),
                    and(couple, mask)
                )

                // Write fill color
                // Iterate over each byte of the color: red, green, blue, alpha
                for {
                    let j := 0
                } lt(j, 4) {
                    j := add(j, 1)
                } {
                    let v := mload(
                        add(colorTablePtr, add(mul(colorIndex, 4), j))
                    )
                    mstore8(encodedPtr, byteToHexH(v, hexCharsPtr))
                    encodedPtr := add(encodedPtr, 1)
                    mstore8(encodedPtr, byteToHexL(v, hexCharsPtr))
                    encodedPtr := add(encodedPtr, 1)
                }

                // Move to the beginning of the x coordinate
                encodedPtr := add(encodedPtr, 13)

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
                encodedPtr := add(encodedPtr, 12)
            }
        }
    }

    function _encodeAnimationFrames(uint8 framesCount, bytes memory data)
        internal
        pure
        returns (bytes memory defs)
    {
        // Load hex chars into memory
        bytes memory hexChars = HEX_CHARS;

        // Output length
        //
        // 43 is the number of bytes used by the <g> container element:
        //
        // - 20 bytes - header
        // -  1 byte  - id (a single hex char is enought to encode at most 16
        //              different frames)
        // -  6 bytes - header closing
        // - 16 bytes - footer
        uint256 defLength = RECT_SIZE * IMAGE_WIDTH * IMAGE_HEIGHT + 43;

        // Allocate a new bytes variable
        defs = new bytes(defLength * framesCount);

        // Offset for reading frame data
        // Jump over frames count (1) and packed fields (1)
        uint256 frameDataOffset = 2;
        // Offset for storing data in the defs bytes
        uint256 defsOffset = 0;

        for (uint256 f = 0; f < framesCount;) {
            bytes memory bitmap = _encodeBitmap(data, frameDataOffset);

            assembly {
                /**
                 * Returns two bytes that represent the input byte `b` encoded as a
                 * hexadecimal string.
                 *
                 * `hexTable` is the pointer to the hexadecimal chars table (0-F).
                 *
                 * Examples:
                 *
                 * - `byteToHex(255, hexCharsPtr)` -> h = 'F', l = 'F'
                 * - `byteToHex(128, hexCharsPtr)` -> h = '8', l = '0'
                 * - `byteToHex(15,  hexCharsPtr)` -> h = '0', l = 'F'
                 */
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

                // Defs ptr, jump over length, jump over existing defs
                let defsPtr := add(add(defs, 32), defsOffset)
                // Bitmap ptr, jump over length
                let bitmapPtr := add(bitmap, 32)
                let hexCharsPtr := add(hexChars, 1)

                // Copy <g> header data
                mstore(defsPtr, "%253Cg%2520id%253D'f")
                defsPtr := add(defsPtr, 20)

                /*
                 * DUMP MEMORY CONTENT
                 *
                 * Use this piece of code for dump the content of a variable in
                 * the output bytes string in hex format for debugging purpose.
                 */
                // for {
                //     let i := 0
                // } lt(i, 256) {
                //     i := add(i, 1)
                // } {
                //     let p := i
                //     let word := mload(add(defsPtr, p))
                //     mstore8(
                //         add(defsPtr, mul(i, 2)),
                //         byteToHexH(word, hexCharsPtr)
                //     )
                //     mstore8(
                //         add(defsPtr, add(mul(i, 2), 1)),
                //         byteToHexL(word, hexCharsPtr)
                //     )
                // }

                // Store frame def id
                mstore8(defsPtr, mload(add(hexCharsPtr, f)))
                defsPtr := add(defsPtr, 1)

                // Copy <g> header closing data
                mstore(defsPtr, "'%253E")
                defsPtr := add(defsPtr, 6)

                // Bitmap data size is set by `_encodeBitmap` as:
                //
                //   RECT_SIZE * IMAGE_WIDTH * IMAGE_HEIGHT
                //
                // It could also be loaded using `mload` of the first 32 bytes
                // at the memory location pointed by `bitmap`, but this
                // implementation is a bit cheaper in terms of contract size
                // (-7 bytes).
                let bitmapSize := mul(RECT_SIZE, mul(IMAGE_WIDTH, IMAGE_HEIGHT))

                // Compute number of chunks required to copy bitmap data:
                //
                //   ceil(bitmapSize / 32)
                //
                // In this implementation `gt(mod(bitmapSize, 32), 0)` returns 1
                // or 0 whether `mod(bitmapSize, 32)` is greater than zero.
                let chunks := add(
                    div(bitmapSize, 32),
                    gt(mod(bitmapSize, 32), 0)
                )
                // Copy bitmap data in chunks
                for {
                    let i := 0
                } lt(i, chunks) {
                    i := add(i, 1)
                } {
                    mstore(defsPtr, mload(add(bitmapPtr, mul(i, 32))))
                    defsPtr := add(defsPtr, 32)
                }

                // Reset defs ptr
                defsPtr := add(
                    add(add(add(defs, 32), defsOffset), bitmapSize),
                    27 // header (20) + frame id (1) + header closing (6)
                )

                // Copy <g> footer data
                mstore(defsPtr, "%253C%252Fg%253E")
            }

            unchecked {
              frameDataOffset += 141;
              defsOffset += defLength;
              f++;
            }
        }
    }

    function _encodeColorTable(bytes memory data, uint256 dataOffset)
        internal
        pure
        returns (bytes memory colorTable)
    {
        // The first bit in the packed fields is the transparency flag
        bool hasTransparency = uint8(data[dataOffset]) & 0x80 == 0x80;
        // Bits 2 to 5 in the packed fields are the transparency index
        uint8 transparencyIndex = (uint8(data[dataOffset]) & 0x78) >> 3;
        // CSS colors in the 24-bit color space (3 bytes) + alpha
        colorTable = new bytes(COLORS_NUMBER * 4);
        // Skip the first byte that contains packed fields
        dataOffset++;
        for (uint256 i = 0; i < 4;) {
            bytes3 colorsPack = bytes3(data[dataOffset]) |
                (bytes3(data[dataOffset + 1]) >> 8) |
                (bytes3(data[dataOffset + 2]) >> 16);

            // Extract each color in the 4 colors pack
            //
            // These are the colors position in the group of three bytes:
            //
            // 1. colorsPack >> 18 & 0x3f
            // 2. colorsPack >> 12 & 0x3f
            // 3. colorsPack >> 6 & 0x3f
            // 4. colorsPack & 0x3f
            for (uint256 j = 0; j < 4;) {
                // jth color in the 4 colors pack
                bytes3 color = _encode24BitColor(
                    bytes1((colorsPack >> (6 * (3 - j))) << 16) & 0x3f
                );
                uint256 colorIndex = (i * 4 + j) * 4;
                // Red
                colorTable[colorIndex] = color[0];
                // Green
                colorTable[colorIndex + 1] = color[1];
                // Blue
                colorTable[colorIndex + 2] = color[2];
                // Alpha
                if (hasTransparency && transparencyIndex == i * 4 + j) {
                    colorTable[colorIndex + 3] = 0;
                } else {
                    colorTable[colorIndex + 3] = 0xff;
                }
                unchecked {
                  j++;
                }
            }

            unchecked {
              dataOffset += 3;
              i++;
            }
        }
    }

    /**
     * Transforms a 6-bit color, encoded with the EGA format, in a 24-bit color.
     *
     * The binary representation of a 6-bit color is in the form "rgbRGB" where
     * the lowercase letters are the low-intensity bits, and uppercase letters
     * are high-intensity bits.
     *
     * Low-intensity colors translate to a 0x55 value in the corresponding 8-bit
     * channel, high-intensity colors translate to a 0xAA value in the
     * corresponding 8-bit channel. When both low-intensity and high-intensity
     * bits are on in the same channel, the resulting 8-bit value is the sum of
     * the two values, that is 0x55 + 0xAA = 0xFF.
     *
     * See https://en.wikipedia.org/wiki/Enhanced_Graphics_Adapter#Color_palette
     */
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
