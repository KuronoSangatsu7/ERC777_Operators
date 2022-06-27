import { useEffect, useState } from "react";
import { useWallet } from '../components/wallet-context';
import { ethers } from "ethers";
import abi from "../utils/contracts/BulkSender.sol/BulkSender.json";
import { useRouter } from "next/router";

export default function AirDrop() {
  const [numOfAddresses, setNumOfAddresses] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [sameAmountVal, setSingleAmountval] = useState(0);
  const [sameAmount, setSameAmount] = useState(false);
  const { ethProvider, connectedAccount, cheapATokenContract, currentChain, loaded } = useWallet();

  const router = useRouter();

  useEffect(() => {
    loaded && (currentChain != 5) && router.push("/");
  }, [currentChain, loaded]);

  useEffect(() => {
    const generateArray = (num) => {
      return Array.from(new Array(num).map((_) => " "));
    };
    numOfAddresses && setAddresses(generateArray(numOfAddresses));
    numOfAddresses && setAmounts(generateArray(numOfAddresses));
  }, [numOfAddresses]);

  const handleNumOfAddressesChange = (e) => {
    const value = Math.max(0, Math.min(100, Number(e.target.value))); 
    setNumOfAddresses(value);
    if (!value) setAddresses([]);
  };

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

  const handleSend = async () => {
    const bulkSenderAddress = "0xC3A292FB9192670262ed8f490eeFEF55216c5ae4";
    const buklSenderAbi = abi.abi;
    const prov = new ethers.providers.Web3Provider(ethProvider);
    let bulkSenderContract;
    try {
      bulkSenderContract = new ethers.Contract(bulkSenderAddress, buklSenderAbi, prov.getSigner());
    } catch (e) {
      alert("Failed to load operator contract.\n" + e)
    }

    console.log(sameAmount, cheapATokenContract.address, addresses, sameAmountVal);

    try {
      const sendTx = sameAmount ? await bulkSenderContract.send(cheapATokenContract.address, addresses, (sameAmountVal).toString(), [])
      : await bulkSenderContract.sendAmounts(cheapATokenContract.address, addresses, amounts.map(amount => (amount).toString()), []); 
      sendTx.wait();
      alert("Transaction Successful");
      console.log(sendTx);

    } catch (e) {

      alert("Transaction Failed.\n" + e);
    }
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
                  onChange={(e) => handleNumOfAddressesChange(e)}
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
                <button className="button is-fullwidth is-medium red-button has-text-white" onClick={() => handleSend()}>
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
