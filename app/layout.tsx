// "use server";
import "./globals.css";
import Script from "next/script";

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

// export const metadata = {
//   title: "Chatbotfor",
//   description: "Creamos asistentes virtuales para tu negocio",
//   openGraph: {
//     title: "Chatbotfor",
//     description: "Creamos asistentes virtuales para tu negocio",
//     images: ["/chatbotforLogo.svg"],
//   },
//   icons: {
//     icon: [
//       { url: "/favicon-16x16.png", type: "image/png", size: "16x16" },
//       { url: "/favicon-32x32.png", type: "image/png", size: "32x32" },
//     ], // Añade el tipo de imagen],
//   },
// }

export const metadata = {
  title: "Chatbotfor",
  description: "Creamos asistentes virtuales para tu negocio",
  icons: {
    icon: [
      // { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      // { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      // { url: "/favicon-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/chatbotfor-favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="mask-icon" href="/chatbotforLogo.svg" color="#5bbad5" />
      </head>
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
                  name: 'Richard',
                  email: 'richard@piedpiper.com'
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
