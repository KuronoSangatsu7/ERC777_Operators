import { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

export default function HomePage() {
  const [ethProvider, setEthProvider] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      /*const faucetAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const faucetAbi = abi.abi;
      const tempWeb3 = new Web3(provider);
      const contract = await new tempWeb3.eth.Contract(faucetAbi, faucetAddress);*/

      if (provider) {
        setEthProvider(provider);
      }
    };

    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await ethProvider.request({ method: "eth_accounts" });
      setConnectedAccount(accounts[0]);
    };

    ethProvider && getAccount();
    ethProvider && ethProvider.on("accountsChanged", getAccount);
  }, [ethProvider]);

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
