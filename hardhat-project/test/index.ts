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

  const GAS_COST_CREATE_FRAME = '315134';
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
    const packedFields = '00';
    // EGA default 16 color palette
    // Color table (16 colors * 6 bits)
    const colorTable = '001083105507e39ebbf3dfbf';
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
    expect(createFrameRx.gasUsed.toString()).to.equal(GAS_COST_CREATE_FRAME);

    const transfer = (createFrameRx.events ?? []).find(
      event => event.event === "Transfer"
    );
    const { tokenId } = transfer?.args ?? { tokenId: "" };

    const metadata = await stunningPotato.tokenURI(tokenId);
    const metadataFixture = 'data:application/json,%7B%22description%22%3A%22Very%20expensive%20pixel%20art%20animations.%22%2C%22image%22%3A%22data%3Aimage%2Fsvg%3Bbase64%2C<rect fill="#000000FF" x=" 0" y=" 0" width="1" height="1"/><rect fill="#0000AAFF" x=" 1" y=" 0" width="1" height="1"/><rect fill="#00AA00FF" x=" 2" y=" 0" width="1" height="1"/><rect fill="#00AAAAFF" x=" 3" y=" 0" width="1" height="1"/><rect fill="#AA0000FF" x=" 4" y=" 0" width="1" height="1"/><rect fill="#AA00AAFF" x=" 5" y=" 0" width="1" height="1"/><rect fill="#AA5500FF" x=" 6" y=" 0" width="1" height="1"/><rect fill="#AAAAAAFF" x=" 7" y=" 0" width="1" height="1"/><rect fill="#555555FF" x=" 8" y=" 0" width="1" height="1"/><rect fill="#5555FFFF" x=" 9" y=" 0" width="1" height="1"/><rect fill="#55FF55FF" x="10" y=" 0" width="1" height="1"/><rect fill="#55FFFFFF" x="11" y=" 0" width="1" height="1"/><rect fill="#FF5555FF" x="12" y=" 0" width="1" height="1"/><rect fill="#FF55FFFF" x="13" y=" 0" width="1" height="1"/><rect fill="#FFFF55FF" x="14" y=" 0" width="1" height="1"/><rect fill="#FFFFFFFF" x="15" y=" 0" width="1" height="1"/><rect fill="#0000AAFF" x=" 0" y=" 1" width="1" height="1"/><rect fill="#00AA00FF" x=" 1" y=" 1" width="1" height="1"/><rect fill="#00AAAAFF" x=" 2" y=" 1" width="1" height="1"/><rect fill="#AA0000FF" x=" 3" y=" 1" width="1" height="1"/><rect fill="#AA00AAFF" x=" 4" y=" 1" width="1" height="1"/><rect fill="#AA5500FF" x=" 5" y=" 1" width="1" height="1"/><rect fill="#AAAAAAFF" x=" 6" y=" 1" width="1" height="1"/><rect fill="#555555FF" x=" 7" y=" 1" width="1" height="1"/><rect fill="#5555FFFF" x=" 8" y=" 1" width="1" height="1"/><rect fill="#55FF55FF" x=" 9" y=" 1" width="1" height="1"/><rect fill="#55FFFFFF" x="10" y=" 1" width="1" height="1"/><rect fill="#FF5555FF" x="11" y=" 1" width="1" height="1"/><rect fill="#FF55FFFF" x="12" y=" 1" width="1" height="1"/><rect fill="#FFFF55FF" x="13" y=" 1" width="1" height="1"/><rect fill="#FFFFFFFF" x="14" y=" 1" width="1" height="1"/><rect fill="#000000FF" x="15" y=" 1" width="1" height="1"/><rect fill="#00AA00FF" x=" 0" y=" 2" width="1" height="1"/><rect fill="#00AAAAFF" x=" 1" y=" 2" width="1" height="1"/><rect fill="#AA0000FF" x=" 2" y=" 2" width="1" height="1"/><rect fill="#AA00AAFF" x=" 3" y=" 2" width="1" height="1"/><rect fill="#AA5500FF" x=" 4" y=" 2" width="1" height="1"/><rect fill="#AAAAAAFF" x=" 5" y=" 2" width="1" height="1"/><rect fill="#555555FF" x=" 6" y=" 2" width="1" height="1"/><rect fill="#5555FFFF" x=" 7" y=" 2" width="1" height="1"/><rect fill="#55FF55FF" x=" 8" y=" 2" width="1" height="1"/><rect fill="#55FFFFFF" x=" 9" y=" 2" width="1" height="1"/><rect fill="#FF5555FF" x="10" y=" 2" width="1" height="1"/><rect fill="#FF55FFFF" x="11" y=" 2" width="1" height="1"/><rect fill="#FFFF55FF" x="12" y=" 2" width="1" height="1"/><rect fill="#FFFFFFFF" x="13" y=" 2" width="1" height="1"/><rect fill="#000000FF" x="14" y=" 2" width="1" height="1"/><rect fill="#0000AAFF" x="15" y=" 2" width="1" height="1"/><rect fill="#00AAAAFF" x=" 0" y=" 3" width="1" height="1"/><rect fill="#AA0000FF" x=" 1" y=" 3" width="1" height="1"/><rect fill="#AA00AAFF" x=" 2" y=" 3" width="1" height="1"/><rect fill="#AA5500FF" x=" 3" y=" 3" width="1" height="1"/><rect fill="#AAAAAAFF" x=" 4" y=" 3" width="1" height="1"/><rect fill="#555555FF" x=" 5" y=" 3" width="1" height="1"/><rect fill="#5555FFFF" x=" 6" y=" 3" width="1" height="1"/><rect fill="#55FF55FF" x=" 7" y=" 3" width="1" height="1"/><rect fill="#55FFFFFF" x=" 8" y=" 3" width="1" height="1"/><rect fill="#FF5555FF" x=" 9" y=" 3" width="1" height="1"/><rect fill="#FF55FFFF" x="10" y=" 3" width="1" height="1"/><rect fill="#FFFF55FF" x="11" y=" 3" width="1" height="1"/><rect fill="#FFFFFFFF" x="12" y=" 3" width="1" height="1"/><rect fill="#000000FF" x="13" y=" 3" width="1" height="1"/><rect fill="#0000AAFF" x="14" y=" 3" width="1" height="1"/><rect fill="#00AA00FF" x="15" y=" 3" width="1" height="1"/><rect fill="#AA0000FF" x=" 0" y=" 4" width="1" height="1"/><rect fill="#AA00AAFF" x=" 1" y=" 4" width="1" height="1"/><rect fill="#AA5500FF" x=" 2" y=" 4" width="1" height="1"/><rect fill="#AAAAAAFF" x=" 3" y=" 4" width="1" height="1"/><rect fill="#555555FF" x=" 4" y=" 4" width="1" height="1"/><rect fill="#5555FFFF" x=" 5" y=" 4" width="1" height="1"/><rect fill="#55FF55FF" x=" 6" y=" 4" width="1" height="1"/><rect fill="#55FFFFFF" x=" 7" y=" 4" width="1" height="1"/><rect fill="#FF5555FF" x=" 8" y=" 4" width="1" height="1"/><rect fill="#FF55FFFF" x=" 9" y=" 4" width="1" height="1"/><rect fill="#FFFF55FF" x="10" y=" 4" width="1" height="1"/><rect fill="#FFFFFFFF" x="11" y=" 4" width="1" height="1"/><rect fill="#000000FF" x="12" y=" 4" width="1" height="1"/><rect fill="#0000AAFF" x="13" y=" 4" width="1" height="1"/><rect fill="#00AA00FF" x="14" y=" 4" width="1" height="1"/><rect fill="#00AAAAFF" x="15" y=" 4" width="1" height="1"/><rect fill="#AA00AAFF" x=" 0" y=" 5" width="1" height="1"/><rect fill="#AA5500FF" x=" 1" y=" 5" width="1" height="1"/><rect fill="#AAAAAAFF" x=" 2" y=" 5" width="1" height="1"/><rect fill="#555555FF" x=" 3" y=" 5" width="1" height="1"/><rect fill="#5555FFFF" x=" 4" y=" 5" width="1" height="1"/><rect fill="#55FF55FF" x=" 5" y=" 5" width="1" height="1"/><rect fill="#55FFFFFF" x=" 6" y=" 5" width="1" height="1"/><rect fill="#FF5555FF" x=" 7" y=" 5" width="1" height="1"/><rect fill="#FF55FFFF" x=" 8" y=" 5" width="1" height="1"/><rect fill="#FFFF55FF" x=" 9" y=" 5" width="1" height="1"/><rect fill="#FFFFFFFF" x="10" y=" 5" width="1" height="1"/><rect fill="#000000FF" x="11" y=" 5" width="1" height="1"/><rect fill="#0000AAFF" x="12" y=" 5" width="1" height="1"/><rect fill="#00AA00FF" x="13" y=" 5" width="1" height="1"/><rect fill="#00AAAAFF" x="14" y=" 5" width="1" height="1"/><rect fill="#AA0000FF" x="15" y=" 5" width="1" height="1"/><rect fill="#AA5500FF" x=" 0" y=" 6" width="1" height="1"/><rect fill="#AAAAAAFF" x=" 1" y=" 6" width="1" height="1"/><rect fill="#555555FF" x=" 2" y=" 6" width="1" height="1"/><rect fill="#5555FFFF" x=" 3" y=" 6" width="1" height="1"/><rect fill="#55FF55FF" x=" 4" y=" 6" width="1" height="1"/><rect fill="#55FFFFFF" x=" 5" y=" 6" width="1" height="1"/><rect fill="#FF5555FF" x=" 6" y=" 6" width="1" height="1"/><rect fill="#FF55FFFF" x=" 7" y=" 6" width="1" height="1"/><rect fill="#FFFF55FF" x=" 8" y=" 6" width="1" height="1"/><rect fill="#FFFFFFFF" x=" 9" y=" 6" width="1" height="1"/><rect fill="#000000FF" x="10" y=" 6" width="1" height="1"/><rect fill="#0000AAFF" x="11" y=" 6" width="1" height="1"/><rect fill="#00AA00FF" x="12" y=" 6" width="1" height="1"/><rect fill="#00AAAAFF" x="13" y=" 6" width="1" height="1"/><rect fill="#AA0000FF" x="14" y=" 6" width="1" height="1"/><rect fill="#AA00AAFF" x="15" y=" 6" width="1" height="1"/><rect fill="#AAAAAAFF" x=" 0" y=" 7" width="1" height="1"/><rect fill="#555555FF" x=" 1" y=" 7" width="1" height="1"/><rect fill="#5555FFFF" x=" 2" y=" 7" width="1" height="1"/><rect fill="#55FF55FF" x=" 3" y=" 7" width="1" height="1"/><rect fill="#55FFFFFF" x=" 4" y=" 7" width="1" height="1"/><rect fill="#FF5555FF" x=" 5" y=" 7" width="1" height="1"/><rect fill="#FF55FFFF" x=" 6" y=" 7" width="1" height="1"/><rect fill="#FFFF55FF" x=" 7" y=" 7" width="1" height="1"/><rect fill="#FFFFFFFF" x=" 8" y=" 7" width="1" height="1"/><rect fill="#000000FF" x=" 9" y=" 7" width="1" height="1"/><rect fill="#0000AAFF" x="10" y=" 7" width="1" height="1"/><rect fill="#00AA00FF" x="11" y=" 7" width="1" height="1"/><rect fill="#00AAAAFF" x="12" y=" 7" width="1" height="1"/><rect fill="#AA0000FF" x="13" y=" 7" width="1" height="1"/><rect fill="#AA00AAFF" x="14" y=" 7" width="1" height="1"/><rect fill="#AA5500FF" x="15" y=" 7" width="1" height="1"/><rect fill="#555555FF" x=" 0" y=" 8" width="1" height="1"/><rect fill="#5555FFFF" x=" 1" y=" 8" width="1" height="1"/><rect fill="#55FF55FF" x=" 2" y=" 8" width="1" height="1"/><rect fill="#55FFFFFF" x=" 3" y=" 8" width="1" height="1"/><rect fill="#FF5555FF" x=" 4" y=" 8" width="1" height="1"/><rect fill="#FF55FFFF" x=" 5" y=" 8" width="1" height="1"/><rect fill="#FFFF55FF" x=" 6" y=" 8" width="1" height="1"/><rect fill="#FFFFFFFF" x=" 7" y=" 8" width="1" height="1"/><rect fill="#000000FF" x=" 8" y=" 8" width="1" height="1"/><rect fill="#0000AAFF" x=" 9" y=" 8" width="1" height="1"/><rect fill="#00AA00FF" x="10" y=" 8" width="1" height="1"/><rect fill="#00AAAAFF" x="11" y=" 8" width="1" height="1"/><rect fill="#AA0000FF" x="12" y=" 8" width="1" height="1"/><rect fill="#AA00AAFF" x="13" y=" 8" width="1" height="1"/><rect fill="#AA5500FF" x="14" y=" 8" width="1" height="1"/><rect fill="#AAAAAAFF" x="15" y=" 8" width="1" height="1"/><rect fill="#5555FFFF" x=" 0" y=" 9" width="1" height="1"/><rect fill="#55FF55FF" x=" 1" y=" 9" width="1" height="1"/><rect fill="#55FFFFFF" x=" 2" y=" 9" width="1" height="1"/><rect fill="#FF5555FF" x=" 3" y=" 9" width="1" height="1"/><rect fill="#FF55FFFF" x=" 4" y=" 9" width="1" height="1"/><rect fill="#FFFF55FF" x=" 5" y=" 9" width="1" height="1"/><rect fill="#FFFFFFFF" x=" 6" y=" 9" width="1" height="1"/><rect fill="#000000FF" x=" 7" y=" 9" width="1" height="1"/><rect fill="#0000AAFF" x=" 8" y=" 9" width="1" height="1"/><rect fill="#00AA00FF" x=" 9" y=" 9" width="1" height="1"/><rect fill="#00AAAAFF" x="10" y=" 9" width="1" height="1"/><rect fill="#AA0000FF" x="11" y=" 9" width="1" height="1"/><rect fill="#AA00AAFF" x="12" y=" 9" width="1" height="1"/><rect fill="#AA5500FF" x="13" y=" 9" width="1" height="1"/><rect fill="#AAAAAAFF" x="14" y=" 9" width="1" height="1"/><rect fill="#555555FF" x="15" y=" 9" width="1" height="1"/><rect fill="#55FF55FF" x=" 0" y="10" width="1" height="1"/><rect fill="#55FFFFFF" x=" 1" y="10" width="1" height="1"/><rect fill="#FF5555FF" x=" 2" y="10" width="1" height="1"/><rect fill="#FF55FFFF" x=" 3" y="10" width="1" height="1"/><rect fill="#FFFF55FF" x=" 4" y="10" width="1" height="1"/><rect fill="#FFFFFFFF" x=" 5" y="10" width="1" height="1"/><rect fill="#000000FF" x=" 6" y="10" width="1" height="1"/><rect fill="#0000AAFF" x=" 7" y="10" width="1" height="1"/><rect fill="#00AA00FF" x=" 8" y="10" width="1" height="1"/><rect fill="#00AAAAFF" x=" 9" y="10" width="1" height="1"/><rect fill="#AA0000FF" x="10" y="10" width="1" height="1"/><rect fill="#AA00AAFF" x="11" y="10" width="1" height="1"/><rect fill="#AA5500FF" x="12" y="10" width="1" height="1"/><rect fill="#AAAAAAFF" x="13" y="10" width="1" height="1"/><rect fill="#555555FF" x="14" y="10" width="1" height="1"/><rect fill="#5555FFFF" x="15" y="10" width="1" height="1"/><rect fill="#55FFFFFF" x=" 0" y="11" width="1" height="1"/><rect fill="#FF5555FF" x=" 1" y="11" width="1" height="1"/><rect fill="#FF55FFFF" x=" 2" y="11" width="1" height="1"/><rect fill="#FFFF55FF" x=" 3" y="11" width="1" height="1"/><rect fill="#FFFFFFFF" x=" 4" y="11" width="1" height="1"/><rect fill="#000000FF" x=" 5" y="11" width="1" height="1"/><rect fill="#0000AAFF" x=" 6" y="11" width="1" height="1"/><rect fill="#00AA00FF" x=" 7" y="11" width="1" height="1"/><rect fill="#00AAAAFF" x=" 8" y="11" width="1" height="1"/><rect fill="#AA0000FF" x=" 9" y="11" width="1" height="1"/><rect fill="#AA00AAFF" x="10" y="11" width="1" height="1"/><rect fill="#AA5500FF" x="11" y="11" width="1" height="1"/><rect fill="#AAAAAAFF" x="12" y="11" width="1" height="1"/><rect fill="#555555FF" x="13" y="11" width="1" height="1"/><rect fill="#5555FFFF" x="14" y="11" width="1" height="1"/><rect fill="#55FF55FF" x="15" y="11" width="1" height="1"/><rect fill="#FF5555FF" x=" 0" y="12" width="1" height="1"/><rect fill="#FF55FFFF" x=" 1" y="12" width="1" height="1"/><rect fill="#FFFF55FF" x=" 2" y="12" width="1" height="1"/><rect fill="#FFFFFFFF" x=" 3" y="12" width="1" height="1"/><rect fill="#000000FF" x=" 4" y="12" width="1" height="1"/><rect fill="#0000AAFF" x=" 5" y="12" width="1" height="1"/><rect fill="#00AA00FF" x=" 6" y="12" width="1" height="1"/><rect fill="#00AAAAFF" x=" 7" y="12" width="1" height="1"/><rect fill="#AA0000FF" x=" 8" y="12" width="1" height="1"/><rect fill="#AA00AAFF" x=" 9" y="12" width="1" height="1"/><rect fill="#AA5500FF" x="10" y="12" width="1" height="1"/><rect fill="#AAAAAAFF" x="11" y="12" width="1" height="1"/><rect fill="#555555FF" x="12" y="12" width="1" height="1"/><rect fill="#5555FFFF" x="13" y="12" width="1" height="1"/><rect fill="#55FF55FF" x="14" y="12" width="1" height="1"/><rect fill="#55FFFFFF" x="15" y="12" width="1" height="1"/><rect fill="#FF55FFFF" x=" 0" y="13" width="1" height="1"/><rect fill="#FFFF55FF" x=" 1" y="13" width="1" height="1"/><rect fill="#FFFFFFFF" x=" 2" y="13" width="1" height="1"/><rect fill="#000000FF" x=" 3" y="13" width="1" height="1"/><rect fill="#0000AAFF" x=" 4" y="13" width="1" height="1"/><rect fill="#00AA00FF" x=" 5" y="13" width="1" height="1"/><rect fill="#00AAAAFF" x=" 6" y="13" width="1" height="1"/><rect fill="#AA0000FF" x=" 7" y="13" width="1" height="1"/><rect fill="#AA00AAFF" x=" 8" y="13" width="1" height="1"/><rect fill="#AA5500FF" x=" 9" y="13" width="1" height="1"/><rect fill="#AAAAAAFF" x="10" y="13" width="1" height="1"/><rect fill="#555555FF" x="11" y="13" width="1" height="1"/><rect fill="#5555FFFF" x="12" y="13" width="1" height="1"/><rect fill="#55FF55FF" x="13" y="13" width="1" height="1"/><rect fill="#55FFFFFF" x="14" y="13" width="1" height="1"/><rect fill="#FF5555FF" x="15" y="13" width="1" height="1"/><rect fill="#FFFF55FF" x=" 0" y="14" width="1" height="1"/><rect fill="#FFFFFFFF" x=" 1" y="14" width="1" height="1"/><rect fill="#000000FF" x=" 2" y="14" width="1" height="1"/><rect fill="#0000AAFF" x=" 3" y="14" width="1" height="1"/><rect fill="#00AA00FF" x=" 4" y="14" width="1" height="1"/><rect fill="#00AAAAFF" x=" 5" y="14" width="1" height="1"/><rect fill="#AA0000FF" x=" 6" y="14" width="1" height="1"/><rect fill="#AA00AAFF" x=" 7" y="14" width="1" height="1"/><rect fill="#AA5500FF" x=" 8" y="14" width="1" height="1"/><rect fill="#AAAAAAFF" x=" 9" y="14" width="1" height="1"/><rect fill="#555555FF" x="10" y="14" width="1" height="1"/><rect fill="#5555FFFF" x="11" y="14" width="1" height="1"/><rect fill="#55FF55FF" x="12" y="14" width="1" height="1"/><rect fill="#55FFFFFF" x="13" y="14" width="1" height="1"/><rect fill="#FF5555FF" x="14" y="14" width="1" height="1"/><rect fill="#FF55FFFF" x="15" y="14" width="1" height="1"/><rect fill="#FFFFFFFF" x=" 0" y="15" width="1" height="1"/><rect fill="#000000FF" x=" 1" y="15" width="1" height="1"/><rect fill="#0000AAFF" x=" 2" y="15" width="1" height="1"/><rect fill="#00AA00FF" x=" 3" y="15" width="1" height="1"/><rect fill="#00AAAAFF" x=" 4" y="15" width="1" height="1"/><rect fill="#AA0000FF" x=" 5" y="15" width="1" height="1"/><rect fill="#AA00AAFF" x=" 6" y="15" width="1" height="1"/><rect fill="#AA5500FF" x=" 7" y="15" width="1" height="1"/><rect fill="#AAAAAAFF" x=" 8" y="15" width="1" height="1"/><rect fill="#555555FF" x=" 9" y="15" width="1" height="1"/><rect fill="#5555FFFF" x="10" y="15" width="1" height="1"/><rect fill="#55FF55FF" x="11" y="15" width="1" height="1"/><rect fill="#55FFFFFF" x="12" y="15" width="1" height="1"/><rect fill="#FF5555FF" x="13" y="15" width="1" height="1"/><rect fill="#FF55FFFF" x="14" y="15" width="1" height="1"/><rect fill="#FFFF55FF" x="15" y="15" width="1" height="1"/>%22%7D';
    expect(metadata).to.equal(metadataFixture);

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
