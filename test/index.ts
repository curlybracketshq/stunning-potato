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
  let addrs

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
    const frameData = "0xabcdef";
    const createFrameTx = await stunningPotato.createFrame(
      addr1.address,
      frameData
    );

    // wait until the transaction is mined
    const createFrameRx = await createFrameTx.wait();
    const transfer = (createFrameRx.events ?? []).find(
      event => event.event === "Transfer"
    );
    const { tokenId } = transfer?.args ?? { tokenId: "" };

    expect(
      await stunningPotato.tokenURI(tokenId)
    ).to.equal(`https://ethga.xyz/t/${tokenId}`);

    expect(await stunningPotato.tokenData(tokenId)).to.equal(frameData);
  });

  it("Should reject duplicate frames", async function () {
    const frameData = "0xabcdef";
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
});
