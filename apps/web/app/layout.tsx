import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quantivo AI — AI Trading Risk Management",
  description:
    "Quantivo AI helps funded traders manage trading risk, prevent rule violations, improve discipline, and pass trading challenges with AI-powered insights.",
  verification: {
    google: "zky_9pmIEXH7oQJnztysyeJ2wwO7nPE8LJtNkycs43o",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-P0K2WNMMN7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P0K2WNMMN7');
          `}
        </Script>
      </body>
    </html>
  );
}
