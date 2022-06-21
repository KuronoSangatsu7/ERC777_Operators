import "bulma/css/bulma.min.css";
import "../styles/globals.css";
import "./airdrop.css";
import "./selltokens.css";
import NavBar from "../components/NavBar";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NavBar />
      <Component {...pageProps} className="all-pages"/>
    </>
  );
}

export default MyApp;
