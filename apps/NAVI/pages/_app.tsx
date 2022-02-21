// import '../styles/globals.css'
import "../styles/index.scss";
import type { AppProps } from "next/app";
import { Footer, Header } from "../components/Header";
import Head from "next/head";
import SSRProvider from "react-bootstrap/SSRProvider";
import Image from "next/image";
import cursor from "../public/cursor.png";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <SSRProvider>
        <Head>
          <title>NAVI</title>
        </Head>
        {/* <div className="wrapper"> */}
          {/* <div id="overlay"></div> */}
          <Image id="cursor" src={cursor} alt={""} />
          {/* <div id="root"></div> */}
        {/* </div> */}
        <Header />
        <Component {...pageProps} />
        <Footer></Footer>
      </SSRProvider>
    </>
  );
}

export default MyApp;
