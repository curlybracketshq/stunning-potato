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

  const PRICE_FRAME = ethers.utils.parseEther("0.01");
  const PRICE_ANIMATION = ethers.utils.parseEther("0.01");

  const GAS_COST_CREATE_FRAME = '213966';
  const GAS_COST_CREATE_ANIMATION = '411301';
  const GAS_COST_CREATE_ANIMATION_LARGE = '615022';

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
      frameData,
      { value: ethers.utils.parseEther("0.1") }
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
    ).to.equal('data:application/json;ascii,{"description":"Very expensive pixel art animations.","image":"data:image/gif;base64,PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDAiIHk9IiAwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDEiIHk9IiAwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDIiIHk9IiAwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDMiIHk9IiAwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDQiIHk9IiAwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDUiIHk9IiAwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDYiIHk9IiAwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDciIHk9IiAwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDgiIHk9IiAwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDkiIHk9IiAwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTAiIHk9IiAwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTEiIHk9IiAwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTIiIHk9IiAwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTMiIHk9IiAwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTQiIHk9IiAwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTUiIHk9IiAwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDAiIHk9IiAxIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDEiIHk9IiAxIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDIiIHk9IiAxIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDMiIHk9IiAxIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDQiIHk9IiAxIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDUiIHk9IiAxIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDYiIHk9IiAxIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDciIHk9IiAxIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDgiIHk9IiAxIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDkiIHk9IiAxIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTAiIHk9IiAxIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTEiIHk9IiAxIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTIiIHk9IiAxIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTMiIHk9IiAxIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTQiIHk9IiAxIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTUiIHk9IiAxIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDAiIHk9IiAyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDEiIHk9IiAyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDIiIHk9IiAyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDMiIHk9IiAyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDQiIHk9IiAyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDUiIHk9IiAyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDYiIHk9IiAyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDciIHk9IiAyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDgiIHk9IiAyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDkiIHk9IiAyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTAiIHk9IiAyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTEiIHk9IiAyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTIiIHk9IiAyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTMiIHk9IiAyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTQiIHk9IiAyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTUiIHk9IiAyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDAiIHk9IiAzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDEiIHk9IiAzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDIiIHk9IiAzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDMiIHk9IiAzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDQiIHk9IiAzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDUiIHk9IiAzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDYiIHk9IiAzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDciIHk9IiAzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDgiIHk9IiAzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDkiIHk9IiAzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTAiIHk9IiAzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTEiIHk9IiAzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTIiIHk9IiAzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTMiIHk9IiAzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTQiIHk9IiAzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTUiIHk9IiAzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDAiIHk9IiA0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDEiIHk9IiA0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDIiIHk9IiA0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDMiIHk9IiA0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDQiIHk9IiA0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDUiIHk9IiA0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDYiIHk9IiA0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDciIHk9IiA0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDgiIHk9IiA0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDkiIHk9IiA0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTAiIHk9IiA0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTEiIHk9IiA0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTIiIHk9IiA0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTMiIHk9IiA0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTQiIHk9IiA0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTUiIHk9IiA0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDAiIHk9IiA1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDEiIHk9IiA1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDIiIHk9IiA1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDMiIHk9IiA1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDQiIHk9IiA1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDUiIHk9IiA1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDYiIHk9IiA1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDciIHk9IiA1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDgiIHk9IiA1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDkiIHk9IiA1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTAiIHk9IiA1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTEiIHk9IiA1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTIiIHk9IiA1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTMiIHk9IiA1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTQiIHk9IiA1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTUiIHk9IiA1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDAiIHk9IiA2Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDEiIHk9IiA2Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDIiIHk9IiA2Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDMiIHk9IiA2Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDQiIHk9IiA2Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDUiIHk9IiA2Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDYiIHk9IiA2Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDciIHk9IiA2Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDgiIHk9IiA2Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDkiIHk9IiA2Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTAiIHk9IiA2Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTEiIHk9IiA2Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTIiIHk9IiA2Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTMiIHk9IiA2Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTQiIHk9IiA2Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTUiIHk9IiA2Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDAiIHk9IiA3Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDEiIHk9IiA3Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDIiIHk9IiA3Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDMiIHk9IiA3Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDQiIHk9IiA3Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDUiIHk9IiA3Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDYiIHk9IiA3Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDciIHk9IiA3Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDgiIHk9IiA3Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDkiIHk9IiA3Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTAiIHk9IiA3Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTEiIHk9IiA3Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTIiIHk9IiA3Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTMiIHk9IiA3Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTQiIHk9IiA3Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTUiIHk9IiA3Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDAiIHk9IiA4Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDEiIHk9IiA4Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDIiIHk9IiA4Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDMiIHk9IiA4Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDQiIHk9IiA4Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDUiIHk9IiA4Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDYiIHk9IiA4Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDciIHk9IiA4Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDgiIHk9IiA4Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDkiIHk9IiA4Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTAiIHk9IiA4Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTEiIHk9IiA4Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTIiIHk9IiA4Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTMiIHk9IiA4Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTQiIHk9IiA4Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTUiIHk9IiA4Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDAiIHk9IiA5Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDEiIHk9IiA5Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDIiIHk9IiA5Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDMiIHk9IiA5Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDQiIHk9IiA5Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDUiIHk9IiA5Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDYiIHk9IiA5Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDciIHk9IiA5Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDgiIHk9IiA5Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDkiIHk9IiA5Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTAiIHk9IiA5Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTEiIHk9IiA5Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTIiIHk9IiA5Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTMiIHk9IiA5Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTQiIHk9IiA5Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTUiIHk9IiA5Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDAiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDEiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDIiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDMiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDQiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDUiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDYiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDciIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDgiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDkiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTAiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTEiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTIiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTMiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTQiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTUiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDAiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDEiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDIiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDMiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDQiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDUiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDYiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDciIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDgiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDkiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTAiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTEiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTIiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTMiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTQiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTUiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDAiIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDEiIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDIiIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDMiIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDQiIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDUiIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDYiIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDciIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDgiIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDkiIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTAiIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTEiIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTIiIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTMiIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTQiIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTUiIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDAiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDEiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDIiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDMiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDQiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDUiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDYiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDciIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDgiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDkiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTAiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTEiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTIiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTMiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTQiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTUiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDAiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDEiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDIiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDMiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDQiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDUiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDYiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDciIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDgiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDkiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTAiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTEiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTIiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTMiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTQiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTUiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDAiIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDEiIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDIiIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDMiIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDQiIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDUiIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDYiIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDciIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDgiIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iIDkiIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTAiIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTEiIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTIiIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTMiIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTQiIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgxMjMsMTIzLDEyMywxKSIgeD0iMTUiIHk9IjE1Ii8+"}');

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
    ).to.be.revertedWith("Data must be valid");
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
    const frameData = `0x${"0".repeat(282)}`;
    const animationData = `0x0000${frameData.slice(2)}`;
    const createAnimationTx = await stunningPotato.createAnimation(
      addr1.address,
      animationData,
      { value: ethers.utils.parseEther("0.1") }
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

    const contractBalance = await ethers.provider.getBalance(stunningPotato.address);
    expect(contractBalance.toString()).to.equal(PRICE_ANIMATION.add(PRICE_FRAME));
  });

  it("Should create a new animation (largest animation possible)", async function () {
    const frameData = `0x${"0".repeat(282)}`;
    const animationData = `0xf000${frameData.slice(2).repeat(16)}`;
    const createAnimationTx = await stunningPotato.createAnimation(
      addr1.address,
      animationData,
      { value: ethers.utils.parseEther("0.1") }
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
    ).to.be.revertedWith("Frames count is invalid");
  });

  it("Should reject invalid animation data (frames count doesn't match)", async function () {
    const animationData = `0x1000${"0".repeat(282)}`;
    await expect(
      stunningPotato.createAnimation(
        addr1.address,
        animationData,
        { value: ethers.utils.parseEther("0.1") }
      )
    ).to.be.revertedWith("Frames count is invalid");
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
