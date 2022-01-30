# stunning-potato

Project codename "Stunning Potato" is a decentralized app (dapp) for creating
and trading tiny pixel art animations. Animations generated using the dapp are
backed by non-fungible tokens (NFT) on the Ethereum blockchain.

This project takes inspiration from [Draw!](http://drawbang.com), a web based
pixel art editor capable of generating 16x16 pixel animations.

## Similarities with Draw!

Most of the animation format constraints will be kept:

- 16x16 pixels
- 16 colors
- at most 16 frames

The image editor will be very similar, apart from the color palette management,
that is missing from Draw!.

## Differences from Draw!

The main difference is that Stunning Potato is a dapp and doesn't rely on a
central server for storing animations metadata. In contrast Draw! is a web
application that stores data in a Redis database.

Draw! enforces a constraint on the number of colors of an animation: 16.
Stunning Potato's animation format relaxes this constraint by supporting _color
palettes_. Each frame can define a custom 16 colors palette.

Animations generated using the dapp are unique. This is not the case using
Draw!, where the app allows the creation of duplicate animations.

## Forks

A key Stunning Potato feature, that is also present in Draw!, is the ability to
_fork an animation_.

Forking an animation means starting the process of creation of a new animation
using the forked one (original) as a template. The new animation is initially
identical to the original animation. The _unique animations constraint_ prevents
the creation of non-original forks. That means that the rule that forbids to
create duplicates of existing animations, applies to forks as well.

The author of the fork holds ownership rights on the new animation.

A _parentID_ property in the fork's metadata, is used to maintain a _parent
relationship_ with the forked image.

Forking promotes creativity and original content creation because it reduces
friction to produce new animations.

## Colors

The 16 colors of a palette can be chosen from the 24-bit RGB color space.

Depending on how transparency is encoded, colors might have a transparency flag.

## Transparency

Transparency can be encoded either as the absence of color in a pixel, that is a
pixel without any color information, or as part of the color information of a
pixel.

### Transparency as the absence of color

This approach allows to use all 16 colors of a palette for visible colors.

Pros:

- All color information is retained

Cons:

- Inconsistent encoding of colors in the frame

### Transparency as part of the color information

If a palette color is flagged as transparent it won't be visible in the frame.

Pros:

- Consistent encoding of colors in the frame

Cons:

- Color information is discarded

## Optional features

Additional animation metadata:

- animation style (ping pong, loop)
- loop repetitions (-1 for infinite loops)
- frame rate

## Project name proposals

"Stunning Potato" is a just a project codename.

Name candidates:

- 16x16x16x16.com
- ethb.it
- ethbitart.com

## Image format specification

TODO

## Smart contract

TODO

### Token ID generation

TODO

### Royalties

TODO

## Metadata storage

TODO

## Animation storage

TODO

## Resources

- [Intro to NFT standard contract](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/)
- [GIF89a Specification](https://www.w3.org/Graphics/GIF/spec-gif89a.txt)
- [EIP-721: Non-Fungible Token Standard](https://eips.ethereum.org/EIPS/eip-721)
  - Example implementation:
    https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
- [EIP-2981: NFT Royalty Standard](https://eips.ethereum.org/EIPS/eip-2981)
- IPFS
  - [Best Practices for Storing NFT Data using IPFS](https://docs.ipfs.io/how-to/best-practices-for-nft-data/)
- [Setup a node and start developing smart contracts](https://docs.openzeppelin.com/learn/)
