"use server";
import "./globals.css";

export async function generateMetadata() {
  return {
    title: "Chatbotfor",
    description: "Creamos asistentes virtuales para tu negocio",
    openGraph: {
      title: "Chatbotfor",
      description: "Creamos asistentes virtuales para tu negocio",
      images: ["/chatbotforLogo.svg"],
    },
    icons: {
      icon: [{ url: "/chatbotforSymbol.svg" }], // Añade el tipo de imagen
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
