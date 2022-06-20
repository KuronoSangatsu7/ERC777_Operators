import { useEffect, useState } from "react";

export default function AirDrop() {
  const [numOfAddresses, setNumOfAddresses] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [amounts, setAmounts] = useState([]);

  useEffect(() => {
    const generateArray = (num) => {
      return Array.from(new Array(num).map((_) => " "));
    };
    numOfAddresses && setAddresses(generateArray(numOfAddresses));
  }, [numOfAddresses]);

  const handleUserAddressChange = (position) => (e) => {
    setAddresses([
      ...addresses.slice(0, position),
      e.target.value,
      ...addresses.slice(position + 1),
    ]);
  };

  /*const handleUserAmountChange = (position) => (e) => {
    setAddresses(
      ...addresses.slice(0, position),
      e.target.value,
      ...addresses.slice(position + 1)
    );
  };
  */
  const showMeAddresses = () => {
    console.log(addresses);
  };
  return (
    <div className="columns is-centered">
      <div className="column is-three-quarters is-centered">
        <div className="box">
          <fieldset>
            <div className="field">
              <label className="label">No. of addresses</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="100"
                  value={numOfAddresses}
                  onChange={(e) => setNumOfAddresses(parseInt(e.target.value))}
                ></input>
              </div>
            </div>

            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input type="checkbox"></input> Send the same amount to all
                  addresses
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <div className="field">
              <div className="control">
                {addresses.map((address, i) => (
                  <div key={i}>
                    <label className="label">Address {i + 1}: </label>
                    <input
                      className="input"
                      type="text"
                      value={address || ""}
                      onChange={handleUserAddressChange(i)}
                    ></input>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="button is-danger"
              onClick={() => showMeAddresses()}
            >
              Send Tokens
            </button>
          </fieldset>
        </div>
      </div>
    </div>
  );
}
