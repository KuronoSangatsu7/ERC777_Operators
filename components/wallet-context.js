import React, { createContext, useContext, useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import abi from "../utils/contracts/CheapAToken.sol/CheapAToken.json";
import { ethers } from "ethers";

const WalletContext = createContext({});

export const WalletContextProvider = ({ children }) => {
  const [ethProvider, setEthProvider] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [currentChain, setCurrentChain] = useState(null);
  const [cheapATokenContract, setCheapATokenContract] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        setEthProvider(provider);
      }
    };

    loadProvider();
  }, []);

  useEffect(() => {
    const loadTokenContract = async () => {
      const cheapATokenAddress = "0x53f2eBCe16A22411627D01Ec898514A774A800A7";
      const cheapATokenAbi = abi.abi;
      const prov = new ethers.providers.Web3Provider(ethProvider, "any");
      const tempContract = new ethers.Contract(cheapATokenAddress, cheapATokenAbi, prov.getSigner());

      setCheapATokenContract(tempContract);
    };

    ethProvider && loadTokenContract();
  }, [ethProvider]);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await ethProvider.request({ method: "eth_accounts" });
      setConnectedAccount(accounts[0]);

    };

    const getChain = async () => {
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      chainId = ethers.BigNumber.from(chainId).toNumber()
      setCurrentChain(chainId);
    };

    ethProvider && getAccount();
    ethProvider && getChain();
    ethProvider && ethProvider.on("accountsChanged", getAccount);
    ethProvider && ethProvider.on("chainChanged", getChain);
  }, [ethProvider]);

  (ethProvider && connectedAccount && cheapATokenContract && currentChain && !loaded) && setLoaded(true);

  return (
    <WalletContext.Provider value={{ ethProvider, setEthProvider, connectedAccount, setConnectedAccount, cheapATokenContract, loaded, currentChain }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);