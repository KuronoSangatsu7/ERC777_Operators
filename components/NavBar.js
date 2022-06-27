import Link from "next/link";
import { useWallet } from "./wallet-context";

export default function NavBar() {
  const { connectedAccount, currentChain, loaded } = useWallet();
  return (
    <>
      <nav className="navbar is-fixed-top is-white has-shadow">
        <div className="navbar-brand">
          <a href="/">
            <img className="navbar-item" src="mustaš.svg"></img>
          </a>
        </div>

        <div className="navbar-menu">
          <div className="navbar-start">
            <a className="navbar-item" href="airdrop">
              Air Drop UI
            </a>
            <a className="navbar-item" href="selltokens">
              Static Price Seller
            </a>
          </div>
          {connectedAccount ? (
            <>
              <div className="navbar-end">
                <div className="navbar-item columns is-gapless">
                  <div className="label column mr-2 has-text-primary">
                    Connected Account:
                  </div>
                  <div className="is-family-monospace column has-text-weight-bold">
                    {connectedAccount}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </nav>
    </>
  );
}
