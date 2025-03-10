"use server";
import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";

// export const metadata = {
//   title: "Chatbotfor",
//   description: "Creamos asistentes virtuales para tu negocio",
//   icons: {
//     icon: [
//       { url: "/favicon.ico", sizes: "any" }, // ✅ Favicon clásico (Fallback universal)
//       { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" }, // ✅ Safari y navegadores antiguos
//       { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" }, // ✅ Chrome, Firefox, Edge, Safari moderno
//       { url: "/favicon-192x192.png", type: "image/png", sizes: "192x192" }, // ✅ Android y navegadores modernos
//     ],
//     apple: "/apple-touch-icon.png", // ✅ Safari en iOS/macOS
//   },
// };

export const generateMetadata = () => {
  return {
    title: "Chatbotfor",
    description: "Creamos asistentes virtuales para tu negocio",
    openGraph: {
      title: "Chatbotfor",
      description: "Creamos asistentes virtuales para tu negocio",
      images: ["/chatbotforLogo.svg"],
    },
    icons: {
      icon: [
        { url: "/favicon-16x16.png", type: "image/png", size: "16x16" },
        { url: "/favicon-32x32.png", type: "image/png", size: "32x32" },
      ], // Añade el tipo de imagen],
    },
  };
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-transparent">
        {children}
        <SpeedInsights />
        {/* Script de inicialización de GetFernand */}
      </body>
    </html>
  );
}
