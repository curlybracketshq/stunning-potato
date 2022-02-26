import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { StunningPotato } from "../typechain";
import { JSDOM } from "jsdom";

function encodeColorTable(...colors: number[]): string {
  return [0, 4, 8, 12].reduce(
    (res, offset) =>
      res + (
        colors[offset + 0] << 6 * 3 |
        colors[offset + 1] << 6 * 2 |
        colors[offset + 2] << 6 * 1 |
        colors[offset + 3]
      ).toString(16).padStart(6, "0")
    , ""
  )
}

/**
 * A valid image should have exactly 256 pixels (rects) and it should have the
 * expected number of rects for each colors in the input dictionary.
 */
function expectValidBitmap(
  imageDoc: Document | Element,
  colors: { [key: string]: number }
) {
  expect(
    imageDoc.getElementsByTagNameNS("http://www.w3.org/2000/svg", "rect").length
  ).to.equal(256);

  for (let color in colors) {
    expect(
      imageDoc.querySelectorAll(`rect[fill="${color}"]`).length
    ).to.equal(colors[color], `Wrong number of rects of color ${color}`)
  }
}


/**
 * Parse data URI and performs some trivial check on the frame metadata.
 *
 * It expects the image to be composed by a specific number of pixels (rects)
 * for each input color.
 */
function expectValidFrameMetadata(
  dataURI: string,
  colors: { [key: string]: number }
) {
  // Get data URI content
  const metadataContent = dataURI.split(",").pop();
  if (metadataContent == null) {
    throw "Unexpected empty metadata content";
  }
  const metadataDecoded = decodeURIComponent(metadataContent);
  const metadata = JSON.parse(metadataDecoded);
  expect(metadata.description).to.equal("Very expensive pixel art animations.");
  const imageDataURI = metadata.image;
  // Get data URI content
  const imageContent = imageDataURI.split(",").pop();
  if (imageContent == null) {
    throw "Unexpected empty image content";
  }
  const image = decodeURIComponent(imageContent);
  const imageDoc = new JSDOM(image).window.document;
  expectValidBitmap(imageDoc, colors);
}

/**
 * Parse data URI and performs some trivial check on the animation metadata.
 *
 * It expects the animation to define a list of frames. Each frame is should be
 * composed by a specific number of pixels (rects) for each input color.
 */
function expectValidAnimationMetadata(
  dataURI: string,
  frames: Array<{ [key: string]: number }>
) {
  // Get data URI content
  const metadataContent = dataURI.split(",").pop();
  if (metadataContent == null) {
    throw "Unexpected empty metadata content";
  }
  const metadataDecoded = decodeURIComponent(metadataContent);
  const metadata = JSON.parse(metadataDecoded);
  expect(metadata.description).to.equal("Very expensive pixel art animations.");
  const imageDataURI = metadata.image;
  // Get data URI content
  const imageContent = imageDataURI.split(",").pop();
  if (imageContent == null) {
    throw "Unexpected empty image content";
  }
  const image = decodeURIComponent(imageContent);
  var imageDoc = new JSDOM(image).window.document;
  frames.forEach((colors, i) => {
    const frameId = `#f${i.toString(16).toUpperCase()}`;
    const frame = imageDoc.querySelector(frameId);
    if (frame == null) {
      throw `Frame '${frameId}' is missing`;
    }
    expectValidBitmap(frame, colors);
  });
}

function testFrameData(): string {
  const packedFields = (0b00000000).toString(16).padStart(2, '0');

  // Color table, EGA default 16 color palette (16 colors * 6 bits)
  const colorTable = encodeColorTable(
    0b000000,
    0b000001,
    0b000010,
    0b000011,
    0b000100,
    0b000101,
    0b010100,
    0b000111,
    0b111000,
    0b111001,
    0b111010,
    0b111011,
    0b111100,
    0b111101,
    0b111110,
    0b111111
  );

  // Bitmap (256 pixels * 4 bits)
  const bitmap =
    '0123456789abcdef' +
    '123456789abcdef0' +
    '23456789abcdef01' +
    '3456789abcdef012' +
    '456789abcdef0123' +
    '56789abcdef01234' +
    '6789abcdef012345' +
    '789abcdef0123456' +
    '89abcdef01234567' +
    '9abcdef012345678' +
    'abcdef0123456789' +
    'bcdef0123456789a' +
    'cdef0123456789ab' +
    'def0123456789abc' +
    'ef0123456789abcd' +
    'f0123456789abcde';

  return `0x${packedFields}${colorTable}${bitmap}`;
}

describe("StunningPotato", function () {
  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.
  let StunningPotato;
  let stunningPotato: StunningPotato;
  let owner;
  let addr1: SignerWithAddress;
  let addrs;

  const PRICE_FRAME = ethers.utils.parseEther("0.01");
  const PRICE_ANIMATION = ethers.utils.parseEther("0.01");

  const TEST_GAS_COST = false;
  const GAS_COST_CREATE_FRAME = '313382';
  const GAS_COST_CREATE_FRAME_WITH_TRANSPARENCY = '313394';
  const GAS_COST_CREATE_ANIMATION = '440604';
  const GAS_COST_CREATE_ANIMATION_LARGE = '796187';

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    StunningPotato = await ethers.getContractFactory("StunningPotato");
    [owner, addr1, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    stunningPotato = await StunningPotato.deploy();
    await stunningPotato.deployed();
  });

  it("Should create a new frame", async function () {
    const frameData = testFrameData();

    const createFrameTx = await stunningPotato.createFrame(
      addr1.address,
      frameData,
      { value: ethers.utils.parseEther("0.1") }
    );

    // wait until the transaction is mined
    const createFrameRx = await createFrameTx.wait();

    if (TEST_GAS_COST) {
      expect(createFrameRx.gasUsed.toString()).to.equal(GAS_COST_CREATE_FRAME);
    }

    const transfer = (createFrameRx.events ?? []).find(
      event => event.event === "Transfer"
    );
    const { tokenId } = transfer?.args ?? { tokenId: "" };

    const metadataDataURI = await stunningPotato.tokenURI(tokenId);
    expectValidFrameMetadata(
      metadataDataURI,
      {
        "#000000FF": 16,
        "#0000AAFF": 16,
        "#00AA00FF": 16,
        "#00AAAAFF": 16,
        "#AA0000FF": 16,
        "#AA00AAFF": 16,
        "#AA5500FF": 16,
        "#AAAAAAFF": 16,
        "#555555FF": 16,
        "#5555FFFF": 16,
        "#55FF55FF": 16,
        "#55FFFFFF": 16,
        "#FF5555FF": 16,
        "#FF55FFFF": 16,
        "#FFFF55FF": 16,
        "#FFFFFFFF": 16
      }
    );

    expect(await stunningPotato.tokenData(tokenId)).to.equal(frameData);

    const salePrice = 99;
    const [receiver, amount] = await stunningPotato.royaltyInfo(tokenId, salePrice);
    expect(receiver).to.equal(addr1.address);
    expect(amount.toString()).to.equal('3');

    const contractBalance = await ethers.provider.getBalance(stunningPotato.address);
    expect(contractBalance.toString()).to.equal(PRICE_FRAME);
  });

  it("Should create a new frame with a trasparent color", async function () {
    // The first bit is the transparency flag, in this case it's true
    // Bits 2 to 5 are the transparency index, in this case it's 0
    const packedFields = (0b10000000).toString(16).padStart(2, '0');
    // Color table, EGA default 16 color palette (16 colors * 6 bits)
    const colorTable = encodeColorTable(
      0b000000,
      0b000001,
      0b000010,
      0b000011,
      0b000100,
      0b000101,
      0b010100,
      0b000111,
      0b111000,
      0b111001,
      0b111010,
      0b111011,
      0b111100,
      0b111101,
      0b111110,
      0b111111
    );
    // Bitmap (256 pixels * 4 bits)
    const bitmap =
      '0123456789abcdef' +
      '123456789abcdef0' +
      '23456789abcdef01' +
      '3456789abcdef012' +
      '456789abcdef0123' +
      '56789abcdef01234' +
      '6789abcdef012345' +
      '789abcdef0123456' +
      '89abcdef01234567' +
      '9abcdef012345678' +
      'abcdef0123456789' +
      'bcdef0123456789a' +
      'cdef0123456789ab' +
      'def0123456789abc' +
      'ef0123456789abcd' +
      'f0123456789abcde';
    const frameData = `0x${packedFields}${colorTable}${bitmap}`;

    const createFrameTx = await stunningPotato.createFrame(
      addr1.address,
      frameData,
      { value: ethers.utils.parseEther("0.1") }
    );

    // wait until the transaction is mined
    const createFrameRx = await createFrameTx.wait();

    if (TEST_GAS_COST) {
      expect(createFrameRx.gasUsed.toString()).to.equal(
        GAS_COST_CREATE_FRAME_WITH_TRANSPARENCY
      );
    }

    const transfer = (createFrameRx.events ?? []).find(
      event => event.event === "Transfer"
    );
    const { tokenId } = transfer?.args ?? { tokenId: "" };

    const metadataDataURI = await stunningPotato.tokenURI(tokenId);
    expectValidFrameMetadata(
      metadataDataURI,
      {
        "#00000000": 16, // Transparent color
        "#0000AAFF": 16,
        "#00AA00FF": 16,
        "#00AAAAFF": 16,
        "#AA0000FF": 16,
        "#AA00AAFF": 16,
        "#AA5500FF": 16,
        "#AAAAAAFF": 16,
        "#555555FF": 16,
        "#5555FFFF": 16,
        "#55FF55FF": 16,
        "#55FFFFFF": 16,
        "#FF5555FF": 16,
        "#FF55FFFF": 16,
        "#FFFF55FF": 16,
        "#FFFFFFFF": 16
      }
    );

    expect(await stunningPotato.tokenData(tokenId)).to.equal(frameData);

    const salePrice = 99;
    const [receiver, amount] = await stunningPotato.royaltyInfo(tokenId, salePrice);
    expect(receiver).to.equal(addr1.address);
    expect(amount.toString()).to.equal('3');

    const contractBalance = await ethers.provider.getBalance(stunningPotato.address);
    expect(contractBalance.toString()).to.equal(PRICE_FRAME);
  });

  it("Should reject invalid frame data", async function () {
    const frameData = "0xabcdef";
    await expect(
      stunningPotato.createFrame(
        addr1.address,
        frameData,
        { value: ethers.utils.parseEther("0.1") }
      )
    ).to.be.revertedWith("E04");
  });

  it("Should reject duplicate frames", async function () {
    const frameData = `0x${"0".repeat(282)}`;
    const createFrameTx = await stunningPotato.createFrame(
      addr1.address,
      frameData,
      { value: ethers.utils.parseEther("0.1") }
    );

    // wait until the transaction is mined
    await createFrameTx.wait();

    await expect(
      stunningPotato.createFrame(
        addr1.address,
        frameData,
        { value: ethers.utils.parseEther("0.1") }
      )
    ).to.be.revertedWith("ERC721: token already minted");
  });

  it("Should create a new animation", async function () {
    const frameData = testFrameData();
    const animationData = `0x0000${frameData.slice(2)}`;
    const createAnimationTx = await stunningPotato.createAnimation(
      addr1.address,
      animationData,
      { value: ethers.utils.parseEther("0.1") }
    );

    // wait until the transaction is mined
    const createAnimationRx = await createAnimationTx.wait();

    if (TEST_GAS_COST) {
      expect(createAnimationRx.gasUsed.toString()).to.equal(
        GAS_COST_CREATE_ANIMATION
      );
    }

    const [
      frameTokenTransfer,
      animationTokenTransfer
    ] = (createAnimationRx.events ?? []).filter(
      event => event.event === "Transfer"
    );
    const { tokenId: frameId } = frameTokenTransfer.args ?? { tokenId: "" };
    const { tokenId: animationId } = animationTokenTransfer.args ?? { tokenId: "" };

    const metadataDataURI = await stunningPotato.tokenURI(animationId);
    expectValidAnimationMetadata(
      metadataDataURI,
      [{
        "#000000FF": 16,
        "#0000AAFF": 16,
        "#00AA00FF": 16,
        "#00AAAAFF": 16,
        "#AA0000FF": 16,
        "#AA00AAFF": 16,
        "#AA5500FF": 16,
        "#AAAAAAFF": 16,
        "#555555FF": 16,
        "#5555FFFF": 16,
        "#55FF55FF": 16,
        "#55FFFFFF": 16,
        "#FF5555FF": 16,
        "#FF55FFFF": 16,
        "#FFFF55FF": 16,
        "#FFFFFFFF": 16
      }]
    );

    // The contract stores just a reference to the frame instead of storing the
    // raw frame data, that is already stored on-chain
    const animationStorageData = `0x0000${frameId.toHexString().slice(2)}`;
    expect(await stunningPotato.tokenData(animationId)).to.equal(animationStorageData);

    // frame token is present
    expect(await stunningPotato.tokenData(frameId)).to.equal(frameData);

    const salePrice = 99;
    const [receiver, amount] = await stunningPotato.royaltyInfo(animationId, salePrice);
    expect(receiver).to.equal(addr1.address);
    expect(amount.toString()).to.equal('3');

    const contractBalance = await ethers.provider.getBalance(stunningPotato.address);
    expect(contractBalance.toString()).to.equal(PRICE_ANIMATION.add(PRICE_FRAME));
  });

  it("Should create a new animation (largest animation possible)", async function () {
    const frameData = testFrameData();
    const animationData = `0xf000${frameData.slice(2).repeat(16)}`;
    const createAnimationTx = await stunningPotato.createAnimation(
      addr1.address,
      animationData,
      { value: ethers.utils.parseEther("0.1") }
    );

    // wait until the transaction is mined
    const createAnimationRx = await createAnimationTx.wait();

    if (TEST_GAS_COST) {
      expect(createAnimationRx.gasUsed.toString()).to.equal(
        GAS_COST_CREATE_ANIMATION_LARGE
      );
    }

    const [
      frameTokenTransfer,
      animationTokenTransfer
    ] = (createAnimationRx.events ?? []).filter(
      event => event.event === "Transfer"
    );
    const { tokenId: frameId } = frameTokenTransfer.args ?? { tokenId: "" };
    const { tokenId: animationId } = animationTokenTransfer.args ?? { tokenId: "" };

    const metadataDataURI = await stunningPotato.tokenURI(animationId);
    expectValidAnimationMetadata(
      metadataDataURI,
      Array(16).fill({
        "#000000FF": 16,
        "#0000AAFF": 16,
        "#00AA00FF": 16,
        "#00AAAAFF": 16,
        "#AA0000FF": 16,
        "#AA00AAFF": 16,
        "#AA5500FF": 16,
        "#AAAAAAFF": 16,
        "#555555FF": 16,
        "#5555FFFF": 16,
        "#55FF55FF": 16,
        "#55FFFFFF": 16,
        "#FF5555FF": 16,
        "#FF55FFFF": 16,
        "#FFFF55FF": 16,
        "#FFFFFFFF": 16
      })
    );

    // The contract stores just a reference to the frame instead of storing the
    // raw frame data, that is already stored on-chain
    const animationStorageData = `0xf000${frameId.toHexString().slice(2).repeat(16)}`;
    expect(await stunningPotato.tokenData(animationId)).to.equal(animationStorageData);

    // frame token is present
    expect(await stunningPotato.tokenData(frameId)).to.equal(frameData);

    const salePrice = 99;
    const [receiver, amount] = await stunningPotato.royaltyInfo(animationId, salePrice);
    expect(receiver).to.equal(addr1.address);
    expect(amount.toString()).to.equal('3');

    const contractBalance = await ethers.provider.getBalance(stunningPotato.address);
    expect(contractBalance.toString()).to.equal(PRICE_ANIMATION.add(PRICE_FRAME));
  });

  it("Should reject duplicate animations", async function () {
    const animationData = `0x0000${"0".repeat(282)}`;
    const createAnimationTx = await stunningPotato.createAnimation(
      addr1.address,
      animationData,
      { value: ethers.utils.parseEther("0.1") }
    );

    // wait until the transaction is mined
    await createAnimationTx.wait();

    await expect(
      stunningPotato.createAnimation(
        addr1.address,
        animationData,
        { value: ethers.utils.parseEther("0.1") }
      )
    ).to.be.revertedWith("ERC721: token already minted");
  });

  it("Should reject invalid animation data (too short)", async function () {
    const animationData = "0xabcdef";
    await expect(
      stunningPotato.createAnimation(
        addr1.address,
        animationData,
        { value: ethers.utils.parseEther("0.1") }
      )
    ).to.be.revertedWith("E04");
  });

  it("Should reject invalid animation data (frames count doesn't match)", async function () {
    const animationData = `0x1000${"0".repeat(282)}`;
    await expect(
      stunningPotato.createAnimation(
        addr1.address,
        animationData,
        { value: ethers.utils.parseEther("0.1") }
      )
    ).to.be.revertedWith("E04");
  });

  it("Should allow the owner to withdraw funds", async function () {
    const frameData = `0x${"0".repeat(282)}`;
    const createFrameTx = await stunningPotato.createFrame(
      addr1.address,
      frameData,
      { value: ethers.utils.parseEther("0.1") }
    );

    // wait until the transaction is mined
    await createFrameTx.wait();

    const contractBalance = await ethers.provider.getBalance(stunningPotato.address);
    expect(contractBalance.toString()).to.equal(PRICE_FRAME);

    const withdrawTx = await stunningPotato.withdraw();
    // wait until the transaction is mined
    await createFrameTx.wait();

    const newContractBalance = await ethers.provider.getBalance(stunningPotato.address);
    expect(newContractBalance.toString()).to.equal(ethers.utils.parseEther("0"));
  });

  it("Should not allow non-owners to withdraw funds", async function () {
    const frameData = `0x${"0".repeat(282)}`;
    const createFrameTx = await stunningPotato.createFrame(
      addr1.address,
      frameData,
      { value: ethers.utils.parseEther("0.1") }
    );

    // wait until the transaction is mined
    await createFrameTx.wait();

    const contractBalance = await ethers.provider.getBalance(stunningPotato.address);
    expect(contractBalance.toString()).to.equal(PRICE_FRAME);

    await expect(
      stunningPotato.connect(addr1).withdraw()
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
