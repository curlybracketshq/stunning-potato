import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { StunningPotato } from "../typechain";

describe("StunningPotato", function () {
  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.
  let StunningPotato;
  let stunningPotato: StunningPotato;
  let owner;
  let addr1: SignerWithAddress;
  let addrs;

  const GAS_COST_CREATE_FRAME = '206575';
  const GAS_COST_CREATE_ANIMATION = '403872';
  const GAS_COST_CREATE_ANIMATION_LARGE = '607593';

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
    const frameData = `0x${"0".repeat(282)}`;
    const createFrameTx = await stunningPotato.createFrame(
      addr1.address,
      frameData
    );

    // wait until the transaction is mined
    const createFrameRx = await createFrameTx.wait();
    expect(createFrameRx.gasUsed.toString()).to.equal(GAS_COST_CREATE_FRAME);

    const transfer = (createFrameRx.events ?? []).find(
      event => event.event === "Transfer"
    );
    const { tokenId } = transfer?.args ?? { tokenId: "" };

    expect(
      await stunningPotato.tokenURI(tokenId)
    ).to.equal(`https://ethga.xyz/t/${tokenId}`);

    expect(await stunningPotato.tokenData(tokenId)).to.equal(frameData);

    const salePrice = 99;
    const [receiver, amount] = await stunningPotato.royaltyInfo(tokenId, salePrice);
    expect(receiver).to.equal(addr1.address);
    expect(amount.toString()).to.equal('3');
  });

  it("Should reject invalid frame data", async function () {
    const frameData = "0xabcdef";
    await expect(
      stunningPotato.createFrame(addr1.address, frameData)
    ).to.be.revertedWith("Data must be valid");
  });

  it("Should reject duplicate frames", async function () {
    const frameData = `0x${"0".repeat(282)}`;
    const createFrameTx = await stunningPotato.createFrame(
      addr1.address,
      frameData
    );

    // wait until the transaction is mined
    await createFrameTx.wait();

    await expect(
      stunningPotato.createFrame(addr1.address, frameData)
    ).to.be.revertedWith("ERC721: token already minted");
  });

  it("Should create a new animation", async function () {
    const frameData = `0x${"0".repeat(282)}`;
    const animationData = `0x0000${frameData.slice(2)}`;
    const createAnimationTx = await stunningPotato.createAnimation(
      addr1.address,
      animationData
    );

    // wait until the transaction is mined
    const createAnimationRx = await createAnimationTx.wait();
    expect(createAnimationRx.gasUsed.toString()).to.equal(GAS_COST_CREATE_ANIMATION);

    const [
      frameTokenTransfer,
      animationTokenTransfer
    ] = (createAnimationRx.events ?? []).filter(
      event => event.event === "Transfer"
    );
    const { tokenId: frameId } = frameTokenTransfer.args ?? { tokenId: "" };
    const { tokenId: animationId } = animationTokenTransfer.args ?? { tokenId: "" };

    // animation token is present
    expect(
      await stunningPotato.tokenURI(animationId)
    ).to.equal(`https://ethga.xyz/t/${animationId}`);

    expect(await stunningPotato.tokenData(animationId)).to.equal(animationData);

    // frame token is present
    expect(
      await stunningPotato.tokenURI(frameId)
    ).to.equal(`https://ethga.xyz/t/${frameId}`);

    expect(await stunningPotato.tokenData(frameId)).to.equal(frameData);

    const salePrice = 99;
    const [receiver, amount] = await stunningPotato.royaltyInfo(animationId, salePrice);
    expect(receiver).to.equal(addr1.address);
    expect(amount.toString()).to.equal('3');
  });

  it("Should create a new animation (largest animation possible)", async function () {
    const frameData = `0x${"0".repeat(282)}`;
    const animationData = `0xf000${frameData.slice(2).repeat(16)}`;
    const createAnimationTx = await stunningPotato.createAnimation(
      addr1.address,
      animationData
    );

    // wait until the transaction is mined
    const createAnimationRx = await createAnimationTx.wait();
    expect(createAnimationRx.gasUsed.toString()).to.equal(GAS_COST_CREATE_ANIMATION_LARGE);

    const [
      frameTokenTransfer,
      animationTokenTransfer
    ] = (createAnimationRx.events ?? []).filter(
      event => event.event === "Transfer"
    );
    const { tokenId: frameId } = frameTokenTransfer.args ?? { tokenId: "" };
    const { tokenId: animationId } = animationTokenTransfer.args ?? { tokenId: "" };

    // animation token is present
    expect(
      await stunningPotato.tokenURI(animationId)
    ).to.equal(`https://ethga.xyz/t/${animationId}`);

    expect(await stunningPotato.tokenData(animationId)).to.equal(animationData);

    // frame token is present
    expect(
      await stunningPotato.tokenURI(frameId)
    ).to.equal(`https://ethga.xyz/t/${frameId}`);

    expect(await stunningPotato.tokenData(frameId)).to.equal(frameData);

    const salePrice = 99;
    const [receiver, amount] = await stunningPotato.royaltyInfo(animationId, salePrice);
    expect(receiver).to.equal(addr1.address);
    expect(amount.toString()).to.equal('3');
  });

  it("Should reject duplicate animations", async function () {
    const animationData = `0x0000${"0".repeat(282)}`;
    const createAnimationTx = await stunningPotato.createAnimation(
      addr1.address,
      animationData
    );

    // wait until the transaction is mined
    await createAnimationTx.wait();

    await expect(
      stunningPotato.createAnimation(addr1.address, animationData)
    ).to.be.revertedWith("ERC721: token already minted");
  });

  it("Should reject invalid animation data (too short)", async function () {
    const animationData = "0xabcdef";
    await expect(
      stunningPotato.createAnimation(addr1.address, animationData)
    ).to.be.revertedWith("Frames count is invalid");
  });

  it("Should reject invalid animation data (frames count doesn't match)", async function () {
    const animationData = `0x1000${"0".repeat(282)}`;
    await expect(
      stunningPotato.createAnimation(addr1.address, animationData)
    ).to.be.revertedWith("Frames count is invalid");
  });
});
