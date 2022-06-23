import { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import { useWallet } from "../components/wallet-context";

export default function HomePage() {
  const [balance, setBalance] = useState(null);
  const { ethProvider, connectedAccount } = useWallet();

  useEffect(() => {
    const loadBalance = async () => {
      const prov = new ethers.providers.Web3Provider(ethProvider);
      let temp = await prov.getBalance(connectedAccount);
      temp = ethers.utils.formatEther(temp);

      setBalance(temp);
    };
    connectedAccount && loadBalance();
  }, [connectedAccount]);

  const enableEth = async () => {
    ethProvider.request({ method: "eth_requestAccounts" });
  };

  return (
    <>
      {connectedAccount ? (
        <div>{connectedAccount} , {balance}</div>
      ) : !ethProvider ? (
        <>
          <div className="notification is-warning is-size-6 is-rounded">
            Wallet not detected!{` `}
            <a
              className="is-block"
              target="_blank"
              href="https://docs.metamask.io"
            >
              Install MetaMask
            </a>
          </div>
        </>
      ) : (
        <button className="button is-small" onClick={enableEth}>
          Connect MetaMask
        </button>
      )}
    </>
  );
}
