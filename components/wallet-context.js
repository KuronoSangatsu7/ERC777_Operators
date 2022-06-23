import React, { createContext, useContext, useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import abi from "../utils/contracts/CheapAToken.sol/CheapAToken.json";
import { ethers } from "ethers";

const WalletContext = createContext({});

export const WalletContextProvider = ({ children }) => {
  const [ethProvider, setEthProvider] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [cheapATokenContract, setCheapATokenContract] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const cheapATokenAddress = "0x8c4122f2e86eD7880bC0cF590F1166E30Ef0c5b1";
      const cheapATokenAbi = abi.abi;
      const prov = new ethers.providers.Web3Provider(provider);
      const tempContract = new ethers.Contract(cheapATokenAddress, cheapATokenAbi, prov.getSigner());

      setCheapATokenContract(tempContract);

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



  return (
    <WalletContext.Provider value={{ ethProvider, setEthProvider, connectedAccount, setConnectedAccount, cheapATokenContract }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);