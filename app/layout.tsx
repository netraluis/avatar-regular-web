"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
import { GlobalProvider } from "../components/context/globalContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GlobalProvider>
        <body className={inter.className}>
          <Header />
          {children}
        </body>
      </GlobalProvider>
    </html>
  );
}
