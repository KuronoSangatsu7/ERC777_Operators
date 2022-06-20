import Link from "next/link";

export default function NavBar() {
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
          
        </div>

      </nav>
    </>
  );
}
