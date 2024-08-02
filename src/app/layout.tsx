import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title:
    "OffTikTok | Share TikToks with anyone, even if they don't have the app.",
  description:
    "OffTikTok lets you share TikToks with anyone, even if they don't have the app. Just paste the link and share it with your friends. Watch Tiktoks without ads, apps or geo-restrictions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/uun7ukc.css"
        ></link>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.GA_TRACKING_ID}');`,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
