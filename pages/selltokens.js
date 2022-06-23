import { useEffect, useState } from "react";
import { useWallet, WalletContextProvider } from "../components/wallet-context";
import { ethers } from "ethers";
import abi from "../utils/contracts/FixedPriceSeller.sol/FixedPriceSeller.json";

export default function SellTokens() {
  const [numOfListings, setNumOfListings] = useState(0);
  const [listings, setListings] = useState([]);
  const [prices, setPrices] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [listedPrice, setListedPrice] = useState(0);
  const [fixedPriceSellerContract, setFixedPriceSellerContract] = useState(null);
  const fixedPriceSellerAddress = "0xA9db08709f222861c9818FD6512Af97D61655588";
  const fixedPriceSellerAbi = abi.abi;
  const { ethProvider, connectedAccount, cheapATokenContract, loaded } = useWallet();

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
        price = price.toNumber();
        return price;
      }));

      setPrices(tempPrices);
    };

    fixedPriceSellerContract && getListings();
    fixedPriceSellerContract && getAmounts();
    fixedPriceSellerContract && getPrices();

  }, [fixedPriceSellerContract, amounts]);

  const handleAddListing = async () => {
    const addTx = await fixedPriceSellerContract.setPricePerToken(cheapATokenContract.address, listedPrice);

    await addTx.wait();

    console.log(addTx);
  }

  const showMe = () => {
    console.log(numOfListings, listings, listedPrice);
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
                      <div className="control">{listing}</div>
                    </div>
                    <div className="field column is-one-quarter">
                      <label className="label is-size-5">Amount: </label>
                      <div className="control">
                        <div>{amounts[i]}</div>
                      </div>
                    </div>

                    <div className="field column is-3">
                      <label className="label is-size-5">Price:</label>
                      <div className="control">
                        {prices[i]}
                      </div>
                    </div>

                    <div className="field column is-offset-6">
                      <button
                        className="control button is-primary is-medium is-fullwidth"
                        onClick={showMe}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </fieldset>
            <button
              className="control button is-dark is-large is-fullwidth mt-5"
              onClick={() => setShowModal(true)}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className={"modal " + (showModal ? "is-active" : "")}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">List CATs</p>
            <button
              className="delete"
              onClick={() => setShowModal(false)}
            ></button>
          </header>
          <section className="modal-card-body">
            <div>
              Put your <strong className="is-italic">CheapATokens</strong> up
              for sale for a static price.
            </div>
            <label className="label mt-4 is-size-5">Price:</label>
            <div className="columns mt-2 ml-2">
              <input
                className="input column is-5 mt-4"
                value={listedPrice}
                onChange={(e) => setListedPrice(e.target.value)}
              ></input>
              <div className="label column is-size-3"> ETH </div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-dark"
              onClick={() => {
                handleAddListing();
                setShowModal(false);
              }}
            >
              List Tokens
            </button>
            <button className="button" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}
