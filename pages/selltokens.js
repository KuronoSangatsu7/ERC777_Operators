import { useEffect, useState } from "react";

export default function SellTokens() {
  const [numOfListings, setNumOfListings] = useState(5);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const generateArray = (num) => {
      return Array.from(new Array(num).map((_) => " "));
    };
    numOfListings && setListings(generateArray(numOfListings));
  }, [numOfListings]);

  const showMe = () => {
    console.log(numOfListings, listings);
  };

  return (
    <>
      <div className="columns is-centered">
        <div className="column is-three-quarters is-centered">
          <div className="box">
            <fieldset>
              {listings.map((listing, i) => (
                <div key={i} className="">
                  <div className="field columns is-multiline">
                    <div className="field column is-three-quarters">
                      <label className="label">Address: </label>
                      <div className="control">Someone's Address</div>
                    </div>
                    <div className="field column is-one-quarter">
                      <label className="label">Amount: </label>
                      <div className="control">
                        <div>Someone's amount of tokens</div>
                      </div>
                    </div>

                    <div className="field column is-3">
                      <label className="label">Price:</label>
                      <div className="control">
                        Someone's price for the token
                      </div>
                    </div>

                    <div className="field column is-offset-6">
                      <button className="control button is-dark is-medium ml-5 mt-5" onClick={showMe}>
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </fieldset>
          </div>
        </div>
      </div>
    </>
  );
}
