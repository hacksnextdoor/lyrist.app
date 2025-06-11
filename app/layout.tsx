const name = 'Lyrist';
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';
const tagline = "Find a beat, beat writer's block";
const description =
  "The all-in-one toolkit for songwriters - discover beats, write lyrics, find rhymes, cure your writer's block, and share content without tedious app switching!";

export const viewport = {
  themeColor: '#ffffff',
  maximumScale: 1,
};

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {default: `${name} - ${tagline}`, template: `%s | ${name}`},
  description,
  creator: 'Peyt Spencer Dewar',
  openGraph: {
    title: name,
    description,
    type: 'website',
    // url: "https://lyrist.app",
    images: ['/lyrist-2025.png'],
    siteName: name,
    video: 'https://www.youtube.com/v/NUhlzDv9m9g',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/lyrist-2025.png'],
    title: name,
    description,
    site: '@lyristapp',
    creator: '@peytspencer',
  },
};

export default function RootLayout({children}) {
  return (
    <html lang="en" style={{scrollBehavior: 'smooth'}}>
      <head>
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@100;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta
          name="apple-itunes-app"
          content={`app-id=${process.env.APPLE_APPSTORE_ID}`} //  app-argument=${deepLink}
          key="smart-banner"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
