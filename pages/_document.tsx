import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link href="https://fonts.googleapis.com/css?family=Poppins" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Inter" rel="stylesheet" />
        <script
          defer
          omi-sdk
          type="text/javascript"
          src="https://cdn.omicrm.com/sdk/2.0.0/sdk.min.js"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
