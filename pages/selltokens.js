import { useEffect, useState } from "react";
import { useWallet, WalletContextProvider } from "../components/wallet-context";
import { ethers } from "ethers";
import abi from "../utils/contracts/FixedPriceSeller.sol/FixedPriceSeller.json";
import { parseEther } from "ethers/lib/utils";

export default function SellTokens() {
  const [numOfListings, setNumOfListings] = useState(0);
  const [listings, setListings] = useState([]);
  const [prices, setPrices] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [showListModal, setShowListModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyPrice, setBuyPrice] = useState("");
  const [listedPrice, setListedPrice] = useState("");
  const [fixedPriceSellerContract, setFixedPriceSellerContract] = useState(null);
  const [shouldReload, reload] = useState(null);
  const [buyingFrom, setBuyingFrom] = useState(null);
  const fixedPriceSellerAddress = "0xd71648dc75217f53E3D317c4F53a5cF32200e496";
  const fixedPriceSellerAbi = abi.abi;
  const { ethProvider, connectedAccount, cheapATokenContract, loaded } = useWallet();

  const reloadEffect = () => reload(shouldReload => !shouldReload);

  useEffect(() => {
    const initializeFixedPriceSellerContract = async () => {
      const prov = new ethers.providers.Web3Provider(ethProvider);
      const tempContract = new ethers.Contract(fixedPriceSellerAddress, fixedPriceSellerAbi, prov.getSigner());
      setFixedPriceSellerContract(tempContract);
    };

    loaded && initializeFixedPriceSellerContract();
  }, [loaded]);

  useEffect(() => {
    const getListings = async () => {
      let currentSellers = await fixedPriceSellerContract.getCurrentSellers(cheapATokenContract.address);
      currentSellers = currentSellers.filter(address => address != ethers.constants.AddressZero);
      setNumOfListings(currentSellers.length);
      setListings(currentSellers);
    };
    
    fixedPriceSellerContract && getListings();
  }, [fixedPriceSellerContract, shouldReload]);

  useEffect(() => {
    const getAmounts = async () => {
      let tempAmounts = await Promise.all(listings.map(async (address) => {
        let amount = await cheapATokenContract.balanceOf(address);

        amount = amount.toNumber();

        return amount;
      }));
      
      setAmounts(tempAmounts);
    };

    const getPrices = async () => {
      let tempPrices = await Promise.all(listings.map(async (address) => {
        let price = await fixedPriceSellerContract.getPricePerToken(cheapATokenContract.address, address);

        price = ethers.utils.formatEther(price)
        price = price.toString();

        return price;
      }));

      setPrices(tempPrices);
    };

    listings && getAmounts();
    listings && getPrices();
  }, [listings]);

  const handleAddListing = async () => {
    const addTx = await fixedPriceSellerContract.setPricePerToken(cheapATokenContract.address, ethers.utils.parseEther(listedPrice));

    await addTx.wait();

    reloadEffect();
  }

  const handleBuyTokens = async () => {

    const value = ethers.utils.parseUnits(buyPrice);

    const buyTx = await fixedPriceSellerContract.send(cheapATokenContract.address, buyingFrom, {value: value});
    
    await buyTx.wait();

    console.log(buyTx);

    reloadEffect();
  };

  return (
    <>
      <div className="columns is-centered">
        <div className="column is-three-quarters is-centered">
          <div className="">
            <fieldset>
              {listings.map((listing, i) => (
                <div key={i} className="box">
                  <div className="field columns is-multiline">
                    <div className="field column is-three-quarters">
                      <label className="label is-size-5">Address: </label>
                      <div className="control is-family-monospace">{listing}</div>
                    </div>
                    <div className="field column is-one-quarter">
                      <label className="label is-size-5">Amount: </label>
                      <div className="control">
                        <div className="is-family-monospace has-text-weight-semibold">{amounts[i]} CATs</div>
                      </div>
                    </div>

                    <div className="field column is-3">
                      <label className="label is-size-5">Price per token:</label>
                      <div className='field columns label'>
                      <div className="is-size-3 column is-offset-2">
                        {prices[i]}
                      </div>
                      <img src="eth.svg" className="column is-6 eth-icon"></img>
                      </div>
                    </div>

                    <div className="field column is-offset-6">
                      <button
                        className="control button is-primary is-medium is-fullwidth mt-6"
                        onClick={() => {setShowBuyModal(true); setBuyingFrom(listing)}}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </fieldset>
            <button
              className="control button is-link is-medium is-fullwidth mt-5"
              onClick={() => setShowListModal(true)}
            >
              Add or modify listing
            </button>
          </div>
        </div>
      </div>

      <div className={"modal " + (showListModal ? "is-active" : "")}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">List CATs</p>
            <button
              className="delete"
              onClick={() => setShowListModal(false)}
            ></button>
          </header>
          <section className="modal-card-body">
            <div>
              Put your <strong className="is-italic">CheapATokens</strong> up
              for sale for a static price. Set the price to <strong>0</strong> to remove your listing.
            </div>
            <label className="label mt-4 is-size-5">Price per token:</label>
            <div className="columns mt-2 ml-2">
              <input
                className="input column is-3 mt-5"
                value={listedPrice}
                onChange={(e) => setListedPrice(e.target.value)}
              ></input>
              <img src="eth.svg" className="column eth-icon"></img>
              <div className="column is-7"></div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-dark"
              onClick={() => {
                handleAddListing();
                setShowListModal(false);
              }}
            >
              List Tokens
            </button>
            <button className="button" onClick={() => setShowListModal(false)}>
              Cancel
            </button>
          </footer>
        </div>
      </div>

      <div className={"modal " + (showBuyModal ? "is-active" : "")}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Buy CATs</p>
            <button
              className="delete"
              onClick={() => setShowBuyModal(false)}
            ></button>
          </header>
          <section className="modal-card-body">
            <div>
              Buy <strong className="is-italic">CheapATokens</strong> from one of the listings.
               Please send exactly the amount of ETH it takes to buy an integer number of tokens
            </div>
            <label className="label mt-4 is-size-5">Value:</label>
            <div className="columns mt-2 ml-2">
              <input
                className="input column is-3 mt-5"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
              ></input>
              <img src="eth.svg" className="column eth-icon"></img>
              <div className="column is-7"></div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-dark"
              onClick={() => {
                handleBuyTokens();
                setShowBuyModal(false);
              }}
            >
              Buy Tokens
            </button>
            <button className="button" onClick={() => setShowBuyModal(false)}>
              Cancel
            </button>
          </footer>
        </div>
      </div>

    </>
  );
}