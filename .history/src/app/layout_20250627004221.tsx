import type React from "react";
import { AppProvider } from "@/components/providers/app-provider";
import { authConfig } from "@/lib/auth/auth-config";
import { getServerSession } from "next-auth";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authConfig);

  return (
    // Fixed: Added suppressHydrationWarning
    <html lang="en" suppressHydrationWarning>
      {/* Fixed: Added the font variable classNames */}
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppProvider session={session}>{children}</AppProvider>
      </body>
    </html>
  );
}
