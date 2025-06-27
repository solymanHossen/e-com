import { AppProvider } from "@/components/providers/app-provider";
import { authConfig } from "@/lib/auth/auth-config";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import type React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "My ecom",
  description: "My best ecom",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);

  return (
    <html lang="en" suppressHydrationWarning>
      {/* ✅ Apply font variables directly from the imported objects */}
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <AppProvider session={session}>{children}</AppProvider>
      </body>
    </html>
  );
}
