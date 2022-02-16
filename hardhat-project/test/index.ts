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
    ).to.equal('data:application/json;ascii,{"description":"Very expensive pixel art animations.","image":"data:image/gif;base64,PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMCIgeT0iMCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEiIHk9IjAiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIyIiB5PSIwIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMyIgeT0iMCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjQiIHk9IjAiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI1IiB5PSIwIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNiIgeT0iMCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjciIHk9IjAiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI4IiB5PSIwIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iOSIgeT0iMCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEwIiB5PSIwIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTEiIHk9IjAiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMiIgeT0iMCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEzIiB5PSIwIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTQiIHk9IjAiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxNSIgeT0iMCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjAiIHk9IjEiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxIiB5PSIxIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMiIgeT0iMSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjMiIHk9IjEiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI0IiB5PSIxIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNSIgeT0iMSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjYiIHk9IjEiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI3IiB5PSIxIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iOCIgeT0iMSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjkiIHk9IjEiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMCIgeT0iMSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjExIiB5PSIxIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTIiIHk9IjEiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMyIgeT0iMSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjE0IiB5PSIxIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTUiIHk9IjEiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIwIiB5PSIyIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMSIgeT0iMiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjIiIHk9IjIiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIzIiB5PSIyIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNCIgeT0iMiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjUiIHk9IjIiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI2IiB5PSIyIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNyIgeT0iMiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjgiIHk9IjIiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI5IiB5PSIyIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTAiIHk9IjIiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMSIgeT0iMiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEyIiB5PSIyIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTMiIHk9IjIiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxNCIgeT0iMiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjE1IiB5PSIyIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMCIgeT0iMyIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEiIHk9IjMiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIyIiB5PSIzIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMyIgeT0iMyIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjQiIHk9IjMiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI1IiB5PSIzIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNiIgeT0iMyIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjciIHk9IjMiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI4IiB5PSIzIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iOSIgeT0iMyIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEwIiB5PSIzIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTEiIHk9IjMiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMiIgeT0iMyIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEzIiB5PSIzIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTQiIHk9IjMiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxNSIgeT0iMyIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjAiIHk9IjQiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxIiB5PSI0Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMiIgeT0iNCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjMiIHk9IjQiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI0IiB5PSI0Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNSIgeT0iNCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjYiIHk9IjQiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI3IiB5PSI0Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iOCIgeT0iNCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjkiIHk9IjQiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMCIgeT0iNCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjExIiB5PSI0Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTIiIHk9IjQiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMyIgeT0iNCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjE0IiB5PSI0Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTUiIHk9IjQiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIwIiB5PSI1Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMSIgeT0iNSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjIiIHk9IjUiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIzIiB5PSI1Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNCIgeT0iNSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjUiIHk9IjUiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI2IiB5PSI1Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNyIgeT0iNSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjgiIHk9IjUiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI5IiB5PSI1Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTAiIHk9IjUiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMSIgeT0iNSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEyIiB5PSI1Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTMiIHk9IjUiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxNCIgeT0iNSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjE1IiB5PSI1Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMCIgeT0iNiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEiIHk9IjYiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIyIiB5PSI2Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMyIgeT0iNiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjQiIHk9IjYiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI1IiB5PSI2Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNiIgeT0iNiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjciIHk9IjYiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI4IiB5PSI2Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iOSIgeT0iNiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEwIiB5PSI2Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTEiIHk9IjYiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMiIgeT0iNiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEzIiB5PSI2Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTQiIHk9IjYiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxNSIgeT0iNiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjAiIHk9IjciLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxIiB5PSI3Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMiIgeT0iNyIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjMiIHk9IjciLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI0IiB5PSI3Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNSIgeT0iNyIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjYiIHk9IjciLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI3IiB5PSI3Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iOCIgeT0iNyIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjkiIHk9IjciLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMCIgeT0iNyIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjExIiB5PSI3Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTIiIHk9IjciLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMyIgeT0iNyIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjE0IiB5PSI3Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTUiIHk9IjciLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIwIiB5PSI4Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMSIgeT0iOCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjIiIHk9IjgiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIzIiB5PSI4Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNCIgeT0iOCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjUiIHk9IjgiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI2IiB5PSI4Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNyIgeT0iOCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjgiIHk9IjgiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI5IiB5PSI4Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTAiIHk9IjgiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMSIgeT0iOCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEyIiB5PSI4Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTMiIHk9IjgiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxNCIgeT0iOCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjE1IiB5PSI4Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMCIgeT0iOSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEiIHk9IjkiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIyIiB5PSI5Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMyIgeT0iOSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjQiIHk9IjkiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI1IiB5PSI5Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNiIgeT0iOSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjciIHk9IjkiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI4IiB5PSI5Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iOSIgeT0iOSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEwIiB5PSI5Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTEiIHk9IjkiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMiIgeT0iOSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEzIiB5PSI5Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTQiIHk9IjkiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxNSIgeT0iOSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjAiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMSIgeT0iMTAiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIyIiB5PSIxMCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjMiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNCIgeT0iMTAiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI1IiB5PSIxMCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjYiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNyIgeT0iMTAiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI4IiB5PSIxMCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjkiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTAiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTEiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTIiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTMiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTQiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTUiIHk9IjEwIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMCIgeT0iMTEiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxIiB5PSIxMSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjIiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMyIgeT0iMTEiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI0IiB5PSIxMSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjUiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNiIgeT0iMTEiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI3IiB5PSIxMSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjgiIHk9IjExIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iOSIgeT0iMTEiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMCIgeT0iMTEiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMSIgeT0iMTEiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMiIgeT0iMTEiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMyIgeT0iMTEiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxNCIgeT0iMTEiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxNSIgeT0iMTEiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIwIiB5PSIxMiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEiIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMiIgeT0iMTIiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIzIiB5PSIxMiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjQiIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNSIgeT0iMTIiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI2IiB5PSIxMiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjciIHk9IjEyIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iOCIgeT0iMTIiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI5IiB5PSIxMiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEwIiB5PSIxMiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjExIiB5PSIxMiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEyIiB5PSIxMiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEzIiB5PSIxMiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjE0IiB5PSIxMiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjE1IiB5PSIxMiIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjAiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMSIgeT0iMTMiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIyIiB5PSIxMyIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjMiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNCIgeT0iMTMiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI1IiB5PSIxMyIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjYiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNyIgeT0iMTMiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI4IiB5PSIxMyIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjkiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTAiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTEiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTIiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTMiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTQiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMTUiIHk9IjEzIi8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMCIgeT0iMTQiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxIiB5PSIxNCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjIiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMyIgeT0iMTQiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI0IiB5PSIxNCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjUiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNiIgeT0iMTQiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI3IiB5PSIxNCIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjgiIHk9IjE0Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iOSIgeT0iMTQiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMCIgeT0iMTQiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMSIgeT0iMTQiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMiIgeT0iMTQiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxMyIgeT0iMTQiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxNCIgeT0iMTQiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIxNSIgeT0iMTQiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIwIiB5PSIxNSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEiIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iMiIgeT0iMTUiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSIzIiB5PSIxNSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjQiIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iNSIgeT0iMTUiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI2IiB5PSIxNSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjciIHk9IjE1Ii8+PHJlY3QgZmlsbD0icmdiYSgwLDAsMCwxKSIgeD0iOCIgeT0iMTUiLz48cmVjdCBmaWxsPSJyZ2JhKDAsMCwwLDEpIiB4PSI5IiB5PSIxNSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEwIiB5PSIxNSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjExIiB5PSIxNSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEyIiB5PSIxNSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjEzIiB5PSIxNSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjE0IiB5PSIxNSIvPjxyZWN0IGZpbGw9InJnYmEoMCwwLDAsMSkiIHg9IjE1IiB5PSIxNSIvPg=="}');

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
