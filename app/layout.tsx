"use server";
import "./globals.css";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { getUserById } from "@/lib/data/user";

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
  const supabase = createClient();

  let userData: { name: string; email: string } = { name: "", email: "" };

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!error && user) {
    const userLocal = await getUserById(user.id);
    userData = { name: userLocal.name || "", email: userLocal.email || "" };
  }

  return (
    <html lang="en">
      <body>
        {children}
        {/* Script de inicialización de GetFernand */}
        <Script id="fernand-init" strategy="afterInteractive">
          {`
            (function (w) {
              if (typeof w.Fernand !== "function") {
                var f = function () {
                  f.q[arguments[0] == 'set' ? 'unshift' : 'push'](arguments);
                };
                f.q = [];
                w.Fernand = f;
              }
            })(window);
            Fernand('init', { appId: 'chatbotfor' });
            Fernand('set', {
              user: {
                  name: '${userData.name || ""}',
                  email: '${userData.email || ""}'
                }
            });

          `}
        </Script>

        {/* Script externo de GetFernand */}
        <Script
          src="https://messenger.getfernand.com/client.js"
          strategy="afterInteractive"
          async
        />
      </body>
    </html>
  );
}
