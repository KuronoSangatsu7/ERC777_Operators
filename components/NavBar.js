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
            <Link href="airdrop">
              <a className="navbar-item">Air Drop UI</a>
            </Link>
            <Link href="selltokens">
              <a className="navbar-item">Static Price Seller</a>
            </Link>
          </div>
          {connectedAccount ? (
            <>
              <div className="navbar-end">
                <div className="navbar-item columns is-gapless">
                  <div className="label column mr-2 beige-text">
                    Connected Account:
                  </div>
                  <div className="is-family-monospace column has-text-weight-bold">
                    {connectedAccount}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="navbar-end">
              <div className="navbar-item">
                <span className="red-text">Not Connected</span>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
