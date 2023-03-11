import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Lyrist</title>

        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#ffffff" />

        {/* Message link preview */}
        <meta property="og:title" content="Lyrist" />
        <meta property="og:description" content="Available on iOS and Android" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lyrist.app" />
        <meta property="og:image" content="https://lyrist.app/alternate-logo-fb.png" />

        {/* Twitter card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@lyristapp" />
        <meta name="twitter:title" content="Lyrist" />
        <meta name="twitter:description" content="Available on iOS and Android" />
        <meta name="twitter:image" content="https://lyrist.app/alternate-logo-tw.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
