import { useEffect, useState } from "react";

export default function SellTokens() {
  const [numOfListings, setNumOfListings] = useState(5);
  const [listings, setListings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [listedPrice, setListedPrice] = useState(0);

  useEffect(() => {
    const generateArray = (num) => {
      return Array.from(new Array(num).map((_) => " "));
    };
    numOfListings && setListings(generateArray(numOfListings));
  }, [numOfListings]);

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
                      <div className="control">Someone's Address</div>
                    </div>
                    <div className="field column is-one-quarter">
                      <label className="label is-size-5">Amount: </label>
                      <div className="control">
                        <div>Someone's amount of tokens</div>
                      </div>
                    </div>

                    <div className="field column is-3">
                      <label className="label is-size-5">Price:</label>
                      <div className="control">
                        Someone's price for the token
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
            <label className="label mt-4 is-size-5">
              Price:
            </label>
            <div className="columns mt-2 ml-2">
            <input className="input column is-5 mt-4" value={listedPrice} onChange={(e) => setListedPrice(e.target.value)}></input>
            <div className="label column is-size-3"> ETH </div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-dark" onClick={() => {showMe(); setShowModal(false)}}>List Tokens</button>
            <button className="button" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}
