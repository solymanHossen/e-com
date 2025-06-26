import { AppProvider } from "@/components/providers/app-provider";
import type { Metadata } from "next";
// Corrected: Import Geist from its own package
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

// Corrected: Use the correct import name
const geistSans = GeistSans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Corrected: Use the correct import name
const geistMono = GeistMono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My ecom",
  description: "My best ecom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Fixed: Added suppressHydrationWarning
    <html lang="en" suppressHydrationWarning>
      {/* Fixed: Added the font variable classNames */}
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
