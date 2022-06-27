import "bulma/css/bulma.min.css";
import "../styles/globals.css";
import "../styles/airdrop.css";
import "../styles/selltokens.css";
import NavBar from "../components/NavBar";
import { WalletContextProvider } from "../components/wallet-context";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <WalletContextProvider>
        <NavBar />
        <Component {...pageProps} className="all-pages" />
      </WalletContextProvider>
    </>
  );
}

export default MyApp;
