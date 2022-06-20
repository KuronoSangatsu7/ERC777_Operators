import { useEffect, useState } from "react";

export default function AirDrop() {
  const [numOfAddresses, setNumOfAddresses] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [sameAmountVal, setSingleAmountval] = useState(0);
  const [sameAmount, setSameAmount] = useState(false);

  useEffect(() => {
    const generateArray = (num) => {
      return Array.from(new Array(num).map((_) => " "));
    };
    numOfAddresses && setAddresses(generateArray(numOfAddresses));
    numOfAddresses && setAmounts(generateArray(numOfAddresses));
  }, [numOfAddresses]);

  const handleUserAddressChange = (position) => (e) => {
    setAddresses([
      ...addresses.slice(0, position),
      e.target.value,
      ...addresses.slice(position + 1),
    ]);
  };

  const handleUserAmountChange = (position) => (e) => {
    setAmounts([
      ...amounts.slice(0, position),
      e.target.value,
      ...amounts.slice(position + 1),
    ]);
  };

  const showMe = () => {
    console.log(addresses, sameAmount ? sameAmountVal : amounts);
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
                  max="50"
                  value={numOfAddresses}
                  onChange={(e) => setNumOfAddresses(parseInt(e.target.value))}
                ></input>
              </div>
            </div>

            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    onChange={() => setSameAmount(!sameAmount)}
                  ></input>{" "}
                  Send the same amount to all addresses
                </label>
              </div>
            </div>
            {addresses.map((address, i) => (
              <div className="field" key={i}>
                <div>
                  <div className="is-flex-direction-row">
                    <label className="label">Address {i + 1}: </label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        value={address || ""}
                        onChange={handleUserAddressChange(i)}
                      ></input>
                    </div>
                  </div>
                  <label className="label">Amount {i + 1}: </label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={
                        sameAmount
                          ? sameAmountVal
                            ? sameAmountVal
                            : ""
                          : amounts[i] || ""
                      }
                      onChange={sameAmount? e => setSingleAmountval(parseInt(e.target.value)): handleUserAmountChange(i)}
                    ></input>
                  </div>
                </div>
              </div>
            ))}
            <div className="field is-grouped-centered">
              <div className="control">
                <button className="button is-danger" onClick={() => showMe()}>
                  Send Tokens
                </button>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}
