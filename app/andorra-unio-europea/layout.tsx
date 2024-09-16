"use server";
import "../globals.css";
import Header from "../../components/header";
import { GlobalProvider } from "../../components/context/globalContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GlobalProvider>
        <body>
          <Header domain="andorraue.localhost:3000" />
          {children}
        </body>
      </GlobalProvider>
    </html>
  );
}
