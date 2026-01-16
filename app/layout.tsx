import {AppProviders} from 'packages/context/AppProviders';
import './globals.css';

const name = 'Lyrist';
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';
const tagline = "Find type beats, beat writer's block";
const description =
  "The all-in-one toolkit for songwriters - discover beats, write lyrics, find rhymes, cure your writer's block, and share content without tedious app switching!";

// JSON-LD Schema for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://lyrist.app/#organization',
      name: 'Lyrist',
      url: 'https://lyrist.app',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lyrist.app/logo.png',
      },
      sameAs: [
        'https://twitter.com/lyristapp',
        'https://www.instagram.com/lyrist.app/',
        'https://www.tiktok.com/@lyrist.app',
      ],
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://lyrist.app/#app',
      name: 'Lyrist',
      description: description,
      applicationCategory: 'MusicApplication',
      operatingSystem: 'iOS, Android, Web',
      offers: [
        {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          name: 'Free',
        },
        {
          '@type': 'Offer',
          price: '2.99',
          priceCurrency: 'USD',
          name: 'Plus Weekly',
        },
        {
          '@type': 'Offer',
          price: '9.99',
          priceCurrency: 'USD',
          name: 'Plus Monthly',
        },
        {
          '@type': 'Offer',
          price: '69.99',
          priceCurrency: 'USD',
          name: 'Plus Yearly',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.5',
        ratingCount: '1000',
        bestRating: '5',
        worstRating: '1',
      },
      downloadUrl: [
        'https://apps.apple.com/app/lyrist',
        'https://play.google.com/store/apps/details?id=com.lyrist',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://lyrist.app/#website',
      url: 'https://lyrist.app',
      name: 'Lyrist',
      publisher: {
        '@id': 'https://lyrist.app/#organization',
      },
    },
  ],
};

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
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
        />
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
      <body>
        <div id="loading-screen">
          <img src="/logo-black.png" alt="Lyrist" />
          <div className="loading-spinner" />
        </div>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
