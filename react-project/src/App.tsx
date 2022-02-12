import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import StunningPotato from "./contracts/StunningPotato.json";

declare global {
  interface Window {
    ethereum: any;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly REACT_APP_STUNNING_POTATO_CONTRACT_ADDRESS: string;
      readonly NODE_ENV: "development" | "production" | "test";
    }
  }
}

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.error("Make sure you have Metamask installed");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length === 0) {
      console.log("No authorized accounts");
      return;
    }

    console.log("Accounts", accounts);
    setCurrentAccount(accounts[0]);

    console.log(
      "Contract address",
      process.env.REACT_APP_STUNNING_POTATO_CONTRACT_ADDRESS
    );
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const stunningPotato = new ethers.Contract(
      process.env.REACT_APP_STUNNING_POTATO_CONTRACT_ADDRESS,
      StunningPotato.abi,
      signer
    );

    const totalSupply = await stunningPotato.totalSupply();
    console.log("Total supply", totalSupply.toString());
    let index = ethers.BigNumber.from(0);
    while (index.lt(totalSupply)) {
      const tokenID = await stunningPotato.tokenByIndex(index);
      console.log("Token at index", index.toString(), tokenID.toString());
      index = index.add(1);
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.error("Make sure you have Metamask installed");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log("Accounts", accounts);
    setCurrentAccount(accounts[0]);
  };

  const mintNftHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.error("Make sure you have Metamask installed");
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const stunningPotato = new ethers.Contract(
      process.env.REACT_APP_STUNNING_POTATO_CONTRACT_ADDRESS,
      StunningPotato.abi,
      signer
    );

    console.log("Create frame");
    const frameData = [];
    // A valid frame is any 141 bytes array
    for (let i = 0; i < 282; i++) {
      frameData.push(Math.floor(Math.random() * 16).toString(16));
    }
    const tx = await stunningPotato.createFrame(
      currentAccount,
      `0x${frameData.join('')}`,
      {
        value: ethers.utils.parseEther("0.1"),
      }
    );

    console.log("Mining...");
    await tx.wait();

    console.log("Done");
  };

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className="cta-button mint-nft-button">
        Mint NFT
      </button>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className="main-app">
      <h1>Stunning Potato</h1>
      <div>{currentAccount ? mintNftButton() : connectWalletButton()}</div>
    </div>
  );
}

export default App;
