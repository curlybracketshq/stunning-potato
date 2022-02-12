# stunning-potato <!-- omit in toc -->

Project codename "Stunning Potato" is a decentralized app (dapp) for creating
and trading tiny pixel art animations. Pixel art generated using the dapp is
stored on the Ethereum blockchain and it's backed by non-fungible tokens (NFT).

## Table of contents <!-- omit in toc -->

- [1. Project inspiration](#1-project-inspiration)
  - [1.1. Similarities with Draw!](#11-similarities-with-draw)
  - [1.2. Differences from Draw!](#12-differences-from-draw)
- [2. Data storage](#2-data-storage)
  - [2.1. Rejected alternative: IPFS](#21-rejected-alternative-ipfs)
- [3. Frames and animations](#3-frames-and-animations)
  - [3.1. Frames](#31-frames)
  - [3.2. Animations](#32-animations)
- [4. Palette](#4-palette)
- [5. Colors](#5-colors)
- [6. Transparency](#6-transparency)
- [7. Forks (aka stems, derivatives)](#7-forks-aka-stems-derivatives)
  - [7.1. Why is forking important?](#71-why-is-forking-important)
  - [7.2. Forking a frame](#72-forking-a-frame)
  - [7.3. Forking an animation](#73-forking-an-animation)
- [8. Forma specification](#8-forma-specification)
  - [8.1. Frame format specification](#81-frame-format-specification)
  - [8.2. Animation format specification](#82-animation-format-specification)
- [9. Smart contract](#9-smart-contract)
  - [9.1. Token ID generation](#91-token-id-generation)
  - [9.2. Royalties](#92-royalties)
- [10. Metadata storage](#10-metadata-storage)
- [11. Animation storage](#11-animation-storage)
- [12. Resources](#12-resources)
- [13. Appendix](#13-appendix)
  - [13.1. Project name proposals](#131-project-name-proposals)
  - [13.2. TODO](#132-todo)

## 1. Project inspiration

This project takes inspiration from [Draw!](http://drawbang.com), a web based
pixel art editor capable of generating 16x16 pixel animations.

### 1.1. Similarities with Draw!

Most of the frame format constraints remain:

- 16x16 pixels
- 16 colors

Animations are constrained to have at most 16 frames.

The animation editor is very similar, apart from the color palette management,
that is missing from Draw!.

Existing animations can be used as [templates](#7-forks-aka-stems-derivatives)
for creating new content.

### 1.2. Differences from Draw!

The main difference is that Stunning Potato is a dapp and doesn't rely on a
central server for storing animations metadata. In contrast Draw! is a web
application that stores data on AWS S3 and metadata in a Redis database.

Draw! animations can use at most 16 colors chosen from the standard EGA palette.
Stunning Potato's animation format relaxes this constraint. Each frame can
define a custom [16 colors palette](#4-palette) chosen from the standard
[6-bit EGA color space](#5-colors).

Each frame and animation generated using the dapp is unique. This is not the
case with Draw!, where the app allows the creation of duplicate content.

## 2. Data storage

All content generated using the dapp is stored on the Ethereum blockchain.

This design choice determines higher transaction fees, but it allows to reduce
the number of dependencies and the overall system complexity.

### 2.1. Rejected alternative: IPFS

An alternative approach that has been evaluated is to store data on IPFS. This
would allow to lower transaction fees, because animations data would be stored
off-chain, but at the cost of an increased system complexity.

In order to store content on IPFS the dapp would need either to rely on a server
for managing authentication and interaction with an IPFS pinning service or to
rely on a storage bridge, e.g. [eth.storage](https://eth.storage/docs/).

## 3. Frames and animations

There are two main types of resources that can be created using the dapp:
_frames_ and _animations_.

All resources are identified by a token id that is computed by applying a hash
function on the resource data.

Frames and animations share the same addressable space, that means that there
might be hash collisions across different resource types. Using the same set of
token ids for all resource types makes it easier to define a single contract
implementing the EIP-721 standard interface.

### 3.1. Frames

A frame is composed by:

- transparency metadata
- color palette
- bitmap

All frames have a fixed size of 16x16 pixels.

Transparency metadata includes a _transparency flag_ and _transparency index_.
For more information about transparency metadata go to
[Transparency](#6-transparency).

All frames have a fixed color palette size of 16 colors. For more information
about colors go to [Colors](#5-colors). For more information about color
palettes go to [Palette](#4-palette).

Frames include references to:

- parent (forked) frame
- forks
- animations containing the frame

For more information about forks go to [Forks](#7-forks-aka-stems-derivatives).

### 3.2. Animations

An animation is composed by:

- metadata
- list of frames data

Animation metadata include:

- number of frames
- animation style (ping pong, loop)
- loop count (0 for infinite loops)
- frame rate (4 speeds: 10 fps, 25 fps, 50 fps, 100 fps)

The number of frames is an integer value >= 1 and <= 16. It's encoded as a uint4
that satisfy the equation _val = number of frames - 1_.

Animation styles:

- _Loop_ - Iterate over all frames, when the iteration is over start back at
  frame 1
- _Ping pong_ - Iterate over all frames, when the iteration is over iterate over
  all frames in reverse order starting from the last frame from the previous
  iteration

Loop count is the number of iterations of the animation. It is an integer
value >= 0 and <= 255. The value _0_ means an infinite number of iterations.

Animations include references to:

- parent (forked) animation
- forks

For more information about forks go to [Forks](#7-forks-aka-stems-derivatives).

## 4. Palette

A _color palette_ is a list that contains the 16 colors that can be displayed in
a frame. Color indexes in a frame bitmap reference colors in the palette.

Frames must define a color palette.

## 5. Colors

Palette colors can be chosen from the
_[EGA](https://en.wikipedia.org/wiki/Enhanced_Graphics_Adapter) standard 6-bit
color space_.

## 6. Transparency

Each frame contains metadata about transparency, divided into a _transparency
flag_ and _transparency index_. If the transparency flag is set to true, the
transparency index is the transparent color index in the palette.

## 7. Forks (aka stems, derivatives)

A key Stunning Potato feature, that is also present in Draw!, is the ability to
_fork an animation_.

Forking an animation means starting the process of creation of a new animation
using the forked one (original) as a template. The new animation is initially
identical to the original animation. The _unique animations constraint_ prevents
the creation of non-original forks. That means that the rule that forbids to
create duplicates of existing animations, applies to forks as well.

The author of the fork holds ownership rights on the new animation.

A _parentID_ property in the fork's metadata, is used to maintain a
_parent-child relationship_ with the forked resource.

### 7.1. Why is forking important?

Forking promotes creativity and original content creation because it reduces
friction to produce new animations.

Forking promotes content discoverability because it adds meaningful
relationships between resources.

### 7.2. Forking a frame

TODO

### 7.3. Forking an animation

TODO

## 8. Forma specification

### 8.1. Frame format specification

- 0x00 - Packed fields
  - 1 bit - Transparency flag (boolean)
  - 4 bits - Transparency index (uint4)
  - 3 bits - Reserved
- 0x01..0x0C - Color palette (16 \* uint6)
- 0x0D..0x8C - Bitmap (256 \* uint4)

### 8.2. Animation format specification

- 0x0000 - Packed fields
  - 4 bits - Number of frames minus one (uint4)
  - 1 bit - Animation loop style (0: loop, 1: ping pong)
  - 2 bits - Frame rate (0: 10 fps, 1: 25 fps, 2: 50 fps, 3: 100 fps)
  - 1 bit - Reserved
- 0x0001 - Loop count (0 for infinite loops) (uint8)
- 0x0002..0x008E - 1st frame data (141 bytes)
- 0x008F..0x011B - 2nd frame data (141 bytes)
- ...
- 0x0845..0x08D1 - 16th frame data (141 bytes)

## 9. Smart contract

TODO

### 9.1. Token ID generation

TODO

### 9.2. Royalties

TODO

## 10. Metadata storage

TODO

## 11. Animation storage

TODO

## 12. Resources

- [Intro to NFT standard contract](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/)
- [GIF89a Specification](https://www.w3.org/Graphics/GIF/spec-gif89a.txt)
- [EIP-721: Non-Fungible Token Standard](https://eips.ethereum.org/EIPS/eip-721)
  - Example implementation:
    https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
- [EIP-2981: NFT Royalty Standard](https://eips.ethereum.org/EIPS/eip-2981)
- IPFS
  - [Best Practices for Storing NFT Data using IPFS](https://docs.ipfs.io/how-to/best-practices-for-nft-data/)
- [Setup a node and start developing smart contracts](https://docs.openzeppelin.com/learn/)

## 13. Appendix

### 13.1. Project name proposals

"Stunning Potato" is a just a project codename.

Name candidates:

- Animation format constraints
  - 16x16.xyz
  - 16x16x16x16.com
- 8-bit art and variations
  - ethb.it
  - ethbitart.com
  - 8bitart.xyz
- Draw! variations
  - drawmint.xyz
- Clip variations
  - cleep.xyz
  - clipbit.xyz
  - bitclip.xyz
- EGA variations
  - ethga.xyz (Ethereum Graphics Adapter)
- A ranch for bits, similar to "branch"
  - bitranch.xyz

### 13.2. TODO

- Generate a CID on a contract to verify that the content from the contract call
  match the data stored on IPFS
  - https://discuss.ipfs.io/t/sha256-content-hashing-in-solidoty/11793
  - https://github.com/nihilium/solidity-ipfs-utils/blob/main/contracts/IpfsFunctions.sol
- IPFS CID implementation using Multihash
  - https://multiformats.io/multihash/
  - https://richardschneider.github.io/net-ipfs-core/articles/multihash.html
- Durability of resources on IPFS using pinning services
  - https://docs.ipfs.io/concepts/persistence/#pinning-services
  - An example pinning service: https://www.pinata.cloud/
- Filecoin Storage Bridge
  - https://eth.storage/docs/
  - https://www.youtube.com/watch?v=PXbIrzBUpR8
  - https://github.com/textileio/storage-js-basic-demo/tree/main/eth
