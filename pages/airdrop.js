import { useEffect, useState } from "react";
import { useWallet } from '../components/wallet-context';
import { ethers } from "ethers";
import abi from "../utils/contracts/BulkSender.sol/BulkSender.json";

export default function AirDrop() {
  const [numOfAddresses, setNumOfAddresses] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [sameAmountVal, setSingleAmountval] = useState(0);
  const [sameAmount, setSameAmount] = useState(false);
  const { ethProvider, connectedAccount, cheapATokenContract } = useWallet();

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

  const showMe = async () => {
    const bulkSenderAddress = "0xC3A292FB9192670262ed8f490eeFEF55216c5ae4";
    const buklSenderAbi = abi.abi;
    const prov = new ethers.providers.Web3Provider(ethProvider);
    const bulkSenderContract = new ethers.Contract(bulkSenderAddress, buklSenderAbi, prov.getSigner());

    console.log(sameAmount, cheapATokenContract.address, addresses, sameAmountVal);

    const sendTx = sameAmount ? await bulkSenderContract.send(cheapATokenContract.address, addresses, (sameAmountVal*10).toString(), [])
    : await bulkSenderContract.sendAmounts(cheapATokenContract.address, addresses, amounts.map(amount => (amount*10).toString()), []);

    console.log(sendTx);
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
              <div className="field columns" key={i}>
                  <div className="field column is-10">
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
                  <div className="field column">
                  <label className="label">Amount: </label>
                  <div className="control">
                    <input
                      className="input"
                      type="number"
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
            <div className="field">
              <div className="control">
                <button className="button is-danger is-fullwidth is-medium" onClick={() => showMe()}>
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
