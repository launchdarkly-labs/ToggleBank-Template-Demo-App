import Script from "next/script";
import Bank from "./bank";
import Head from "next/head";

export default function Home() {
  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}
      {/* <Script
        strategy="lazyOnload"
        async
        src="YOUR GOOGLE_ANALYTICS_SCRIPT_URL"
      ></Script>
      <Script strategy="lazyOnload">
        {`YOUR GOOGLE_ANALYTICS_TRACKING_CODE`}
      </Script> */}
      <Head>
        <link
          rel="preload"
          href={"@/public/banking/backgrounds/bank-homepage-background-right.svg"}
          as="image"
        />
        <link
          rel="preload"
          href={"@/public/banking/backgrounds/bank-homepage-background-left.svg"}
          as="image"
        />
      </Head>

      <Bank />
    </>
  );
}
