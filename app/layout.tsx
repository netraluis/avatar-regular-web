"use server";
import "./globals.css";

export async function generateMetadata(){

  return {
    title: 'titulo',
    description: 'des',
    openGraph: {
      title: 'titulo',
      description: 'welcome',
      images: ['/chatbotforLogo.svg'],
    },
    // icons: [data.logo],
    icons: {
      icon: [{ url: '/chatbotforLogo.svg' }], // Añade el tipo de imagen
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
