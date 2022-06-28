import { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import { useWallet } from "../components/wallet-context";

export default function HomePage() {
  const [balance, setBalance] = useState(0);
  const {
    ethProvider,
    connectedAccount,
    currentChain,
    cheapATokenContract,
    loaded,
  } = useWallet();

  useEffect(() => {
    const loadBalance = async () => {
      const prov = new ethers.providers.Web3Provider(ethProvider, "any");
      let temp = await cheapATokenContract.balanceOf(connectedAccount);
      temp = temp.toString();
      setBalance(temp);
    };
    connectedAccount && loaded && currentChain == 5 && loadBalance();
  }, [connectedAccount, loaded, currentChain]);

  const enableEth = async () => {
    ethProvider.request({ method: "eth_requestAccounts" });
  };

  return (
    <div className="homepage-main is-flex">
      <div className="columns is-multiline">
        <div className="column is-full">
          {connectedAccount ? (
            <div className="colums is-multiline">
              <div className="column is-12 pb-0 ml-1">
                <span className="is-size-5 has-text-weight-bold">
                  Account:{" "}
                </span>
                <span className="is-family-monospace beige-text">{connectedAccount}</span>
              </div>
              <div className="column is-size-1 pt-0">
                Balance: <strong className="has-text-primary">{balance}</strong> <span className="has-text-primary">CAT</span>
              </div>
              {currentChain != 5 && (
                <div className="notification has-text-white red-button">
                  Please connect to{" "}
                  <a
                    target="_blank"
                    href="https://goerli.net/"
                  >
                    Goerli Test Network
                  </a>
                </div>
              )}
            </div>
          ) : !ethProvider ? (
            <>
              <div className="notification is-warning">
                Wallet not detected!{` `}
                <a
                  target="_blank"
                  href="https://docs.metamask.io"
                >
                  Install MetaMask
                </a>
              </div>
            </>
          ) : (
            <button className="button is-primary is-medium" onClick={enableEth}>
              Connect MetaMask
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
